const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema(
  {
    hour: {
      type: Number,
      min: 0,
      max: 23,
      required: [true, 'Alarm must have hour']
    },
    min: {
      type: Number,
      min: 0,
      max: 59,
      required: [true, 'Alarm must have min']
    },
    enable: {
      type: Boolean,
      default: true
    },
    repeat: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false],
      validate: {
        validator: function (arr) {
          return arr.length === 7;
        },
        message: 'Repeat array must have exactly 7 elements'
      }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

alarmSchema.virtual('typeRepeat').get(function () {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    count += this.repeat[i];
  }

  if (count == 0) {
    return 0;
  } else if (count == 7) {
    return 2;
  }

  return 1;
});

const Alarm = mongoose.model('Alarm', alarmSchema);
module.exports = Alarm;
