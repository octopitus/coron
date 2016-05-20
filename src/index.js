const CronTime = require('./CronTime');
const Scheduler = require('./Scheduler');

function createScheduler(cronTime, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError(`callback must be a function. ${typeof callback} was given.`);
  }

  if (typeof cronTime === 'string') {
    try {
      cronTime = CronTime.parse(cronTime);
    } catch(e) {
      throw e;
    }
  }

  return new Scheduler(cronTime, callback);
};

module.exports = createScheduler;
