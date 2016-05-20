const createScheduler = require('../src');

const schedule = createScheduler(500, function* () {
  const foo = yield Promise.resolve('foo');
  const bar = yield Promise.resolve('bar');

  console.log(foo + bar);

  return foo + bar;
});

schedule.start().then(() => console.log('schedule started'));

// stop after get called 4 times
setTimeout(() => schedule.stop().then(console.log('schedule stopped')), 2050);

