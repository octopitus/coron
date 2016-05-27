const createCronTime = require('./CronTime');
const Scheduler = require('./Scheduler');

function createScheduler(humanDate, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError(`callback must be a function. ${typeof callback} was given.`);
  }

  const cronTime = createCronTime(humanDate);
  return new Scheduler(cronTime, callback);
};

module.exports = createScheduler;
