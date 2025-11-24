const { GoogleGenAI } = require('@google/genai');
const SensorData = require('../models/sensorDataModel');
const DeviceControl = require('./../models/deviceControlModel');
const ControlLog = require('../models/controlLogModel');
// const SensorDataArchive = require('../models/sensorDataArchiveModel');

// Parse JSON từ AI response (xử lý markdown code blocks)
const parseAIResponse = (responseText) => {
  try {
    let cleanText = responseText.trim();

    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\s*/g, '');
    }

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Parse JSON error:', error);
    return {
      message: responseText,
      suggestions: [],
      actions: []
    };
  }
};

// Lấy dữ liệu sensor gần nhất
const getLatestSensorData = async () => {
  try {
    const latest = await SensorData.findOne().sort({ timestamp: -1 }).limit(1);
    return latest || null;
  } catch (error) {
    console.error('Error getting sensor data:', error);
    return null;
  }
};

// Lấy trạng thái thiết bị hiện tại
const getCurrentDeviceStatus = async () => {
  try {
    const status = await DeviceControl.findOne().sort({ updatedAt: -1 });
    return status || null;
  } catch (error) {
    console.error('Error getting device status:', error);
    return null;
  }
};

// Lấy lịch sử điều khiển gần đây
const getRecentControlLogs = async (limit = 10) => {
  try {
    const logs = await ControlLog.find().sort({ timestamp: -1 }).limit(limit);
    return logs;
  } catch (error) {
    console.error('Error getting control logs:', error);
    return [];
  }
};

// Lấy dữ liệu thống kê (trung bình trong 24h)
const getStatistics = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = await SensorData.aggregate([
      {
        $match: {
          timestamp: { $gte: oneDayAgo }
        }
      },
      {
        $group: {
          _id: null,
          avgTemp: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' },
          avgSoilMoisture: { $avg: '$soilMoisture' },
          avgLight: { $avg: '$light' },
          minTemp: { $min: '$temperature' },
          maxTemp: { $max: '$temperature' },
          minHumidity: { $min: '$humidity' },
          maxHumidity: { $max: '$humidity' },
          count: { $sum: 1 }
        }
      }
    ]);

    return stats[0] || null;
  } catch (error) {
    console.error('Error getting statistics:', error);
    return null;
  }
};

// Controller xử lý chat
exports.generateContent = async (req, res) => {
  const { userQuery, userId } = req.body;

  if (!userQuery) {
    return res.status(400).json({
      error: 'Missing userQuery in request body.'
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('⚠️ GEMINI_API_KEY không được đặt trong .env');
    return res.status(500).json({
      error: 'Lỗi cấu hình Server. Vui lòng cung cấp API Key.'
    });
  }

  try {
    // Lấy dữ liệu thực tế từ hệ thống
    const [sensorData, deviceStatus, controlLogs, statistics] =
      await Promise.all([
        getLatestSensorData(),
        getCurrentDeviceStatus(),
        getRecentControlLogs(5),
        getStatistics()
      ]);

    // Tạo context cho AI
    const systemContext = `Bạn là trợ lý AI thông minh cho hệ thống Smart Plant Monitor - giám sát và chăm sóc cây trồng tự động.

DỮ LIỆU THỰC TẾ HIỆN TẠI:

1. CẢM BIẾN (${
      sensorData
        ? new Date(sensorData.timestamp).toLocaleString('vi-VN')
        : 'Không có dữ liệu'
    }):
${
  sensorData
    ? `
   - Nhiệt độ: ${sensorData.temperature}°C
   - Độ ẩm không khí: ${sensorData.humidity}%
   - Độ ẩm đất: ${sensorData.soilMoisture}%
   - Ánh sáng: ${sensorData.light} lux
`
    : '   Không có dữ liệu cảm biến'
}

2. TRẠNG THÁI THIẾT BỊ:
${
  deviceStatus
    ? `
   - Máy bơm (Pump): ${deviceStatus.pump ? 'BẬT ✓' : 'TẮT ✗'}
   - Quạt (Fan): ${deviceStatus.fan ? 'BẬT ✓' : 'TẮT ✗'}
   - Đèn (Light): ${deviceStatus.light ? 'BẬT ✓' : 'TẮT ✗'}
   - Chế độ: ${deviceStatus.mode || 'manual'} (auto/manual/schedule)
`
    : '   Không có dữ liệu thiết bị'
}

3. THỐNG KÊ 24H QUA:
${
  statistics
    ? `
   - Nhiệt độ TB: ${statistics.avgTemp?.toFixed(1)}°C (Min: ${
        statistics.minTemp
      }°C, Max: ${statistics.maxTemp}°C)
   - Độ ẩm TB: ${statistics.avgHumidity?.toFixed(1)}% (Min: ${
        statistics.minHumidity
      }%, Max: ${statistics.maxHumidity}%)
   - Độ ẩm đất TB: ${statistics.avgSoilMoisture?.toFixed(1)}%
   - Số lần đo: ${statistics.count}
`
    : '   Chưa có dữ liệu thống kê'
}

4. LỊCH SỬ ĐIỀU KHIỂN GÇN ĐÂY:
${
  controlLogs.length > 0
    ? controlLogs
        .map(
          (log) =>
            `   - ${new Date(log.timestamp).toLocaleString('vi-VN')}: ${
              log.device
            } → ${log.status ? 'BẬT' : 'TẮT'} (${log.mode})`
        )
        .join('\n')
    : '   Chưa có lịch sử điều khiển'
}

NHIỆM VỤ CỦA BẠN:
- Phân tích dữ liệu thực tế và đưa ra lời khuyên cụ thể
- Giải thích các chỉ số môi trường (tốt/xấu cho cây)
- Đề xuất hành động cụ thể (bật/tắt thiết bị nào, khi nào)
- Cảnh báo nếu có vấn đề (nhiệt độ quá cao/thấp, đất khô, v.v.)
- Trả lời câu hỏi về tình trạng cây, lịch sử, xu hướng

NGƯỠNG TIÊU CHUẨN CHO CÂY TRỒNG THÔNG THƯỜNG:
- Nhiệt độ lý tưởng: 20-28°C
- Độ ẩm không khí: 50-70%
- Độ ẩm đất: 40-60% (tùy loại cây)
- Ánh sáng: 10,000-50,000 lux (cây ưa sáng)

FORMAT TRẢ LỜI (QUAN TRỌNG):
Trả về ĐÚNG định dạng JSON sau:

{
  "message": "Câu trả lời thân thiện, dễ hiểu bằng tiếng Việt (2-4 câu)",
  "analysis": {
    "temperature": "ok/warning/critical",
    "humidity": "ok/warning/critical", 
    "soilMoisture": "ok/warning/critical",
    "light": "ok/warning/critical"
  },
  "suggestions": [
    "Gợi ý cụ thể 1",
    "Gợi ý cụ thể 2"
  ],
  "actions": [
    {"device": "pump", "action": "on", "reason": "Đất khô, cần tưới"},
    {"device": "fan", "action": "off", "reason": "Nhiệt độ ổn định"}
  ]
}

QUY TẮC:
- Luôn dựa vào DỮ LIỆU THỰC TẾ để phân tích
- Đưa ra lời khuyên CỤ THỂ, HÀNH ĐỘNG ĐƯỢC
- Giải thích ngắn gọn, dễ hiểu
- Ưu tiên an toàn cho cây
- KHÔNG trả lời về chủ đề không liên quan đến cây trồng/IoT
- Chỉ trả về JSON thuần túy, không thêm text nào khác`;

    // Gọi Gemini API với @google/genai
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemContext}\n\nCÂU HỎI: ${userQuery}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    });

    const rawResponse = result.text.trim();
    console.log('🤖 AI Raw Response:', rawResponse);

    // Parse JSON response
    const aiData = parseAIResponse(rawResponse);

    // Trả về response
    res.status(200).json({
      message: aiData.message || rawResponse,
      analysis: aiData.analysis || null,
      suggestions: aiData.suggestions || [],
      actions: aiData.actions || [],
      currentData: {
        sensor: sensorData,
        devices: deviceStatus,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ GEMINI API Error:', error);

    let errorMessage = 'Lỗi không xác định khi gọi API Gemini.';

    if (error.message?.includes('API key')) {
      errorMessage =
        'Lỗi API Key. Vui lòng kiểm tra lại cấu hình GEMINI_API_KEY.';
    } else if (
      error.message?.includes('403') ||
      error.message?.includes('Forbidden')
    ) {
      errorMessage =
        'Lỗi 403 Forbidden. API Key không hợp lệ hoặc không có quyền.';
    } else if (error.message?.includes('429')) {
      errorMessage =
        'Lỗi 429 Rate Limit. Hệ thống quá tải, vui lòng thử lại sau.';
    } else if (error.message?.includes('400')) {
      errorMessage =
        'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại định dạng câu hỏi.';
    }

    res.status(500).json({
      error:
        'Xin lỗi, đã có lỗi xảy ra khi kết nối đến AI. Vui lòng thử lại sau.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

// Controller để lấy lịch sử chat (nếu bạn muốn lưu chat history)
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // TODO: Implement chat history model nếu cần
    // const history = await ChatHistory.find({ userId }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      message: 'Chat history feature - coming soon',
      history: []
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ error: 'Không thể lấy lịch sử chat' });
  }
};
