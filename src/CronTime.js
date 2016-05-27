const fromHuman = require('date.js');
const tokens = require('./tokens.js');

const SINGLE_QUANTIFIERS = '^\\b(every|each)\\s';

class CronDate {
  constructor(currentDate, date, nextDate, repeatable) {
    this.excuteTimes = repeatable ? Number.POSITIVE_INFINITY : 1;
    this.timesLoop = [Number(currentDate), Number(date), Number(nextDate)];
    this.timespan = nextDate - date;
  }

  hasNext() {
    return this.excuteTimes >= 1;
  }

  next() {
    const [prev, cur, next] = this.timesLoop;

    this.timesLoop = [cur, cur + this.timespan, next + this.timespan];
    this.excuteTimes = this.excuteTimes - 1;

    return cur - prev;
  }
}

function* words(str) {
  yield* str.split(' ').entries();
}

function serialize(humanDate) {

}

function createCronTime(humanDate, offset) {
  // Strips word 'in' or 'once' at the beginning
  humanDate = humanDate.replace(/^\b(in|once)\s/, '');

  let repeatable = false;

  if (new RegExp(SINGLE_QUANTIFIERS).test(humanDate)) {
    repeatable = true;
    humanDate = humanDate.replace(new RegExp(SINGLE_QUANTIFIERS), '');

    if (/^(\d+)?\s/.test(humanDate)) {
      console.log(humanDate);
      humanDate = '1 ' + humanDate;
    }

    humanDate = humanDate + ' later';
  }

  const currentDate = offset || Date.now();
  const date = fromHuman(humanDate, currentDate);
  const nextDate = fromHuman(humanDate, date);

  console.log(nextDate.valueOf() !== date.valueOf());

  return new CronDate(currentDate, date, nextDate, repeatable);
}

module.exports = createCronTime;
