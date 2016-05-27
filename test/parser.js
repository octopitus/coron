import test from 'ava';
import createCronTime from '../src/CronTime';

/**
 * Time helper function
 */
function timeString(date) {
  var t = date.toTimeString().split(' ')[0];
  t = ('0' == t[0]) ? t.slice(1) : t;
  return t;
}

/**
 * Date helper function
 */
function dateString(date) {
  var d = date.toString();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = '' + date.getFullYear();
  return [month, day, year.slice(2)].join('/');
}

test.beforeEach(t => {
  t.context = new Date('May 27, 2016 14:00:00');
});

test('each minute', t => {
  const cronTime = createCronTime('each minute', t.context);
  t.truthy(cronTime.timespan === 60000);

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(timeString(t.context) === '14:01:00');

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(timeString(t.context) === '14:02:00');
});

test('once every 2 hours', t => {
  const cronTime = createCronTime('once every 2 hours', t.context);
  t.truthy(cronTime.timespan === 7200000);

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(timeString(t.context) === '16:00:00');

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(timeString(t.context) === '18:00:00');
});

test('every days at 8am', t => {
  const cronTime = createCronTime('every days at 8am', t.context);

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(dateString(t.context) === '5/28/16');
  t.truthy(timeString(t.context) === '8:00:00');

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(dateString(t.context) === '5/29/16');
  t.truthy(timeString(t.context) === '8:00:00');
});

test('every monday at 8am', t => {
  const cronTime = createCronTime('every monday at 8am', t.context);

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(dateString(t.context) === '5/30/16');
  t.truthy(timeString(t.context) === '8:00:00');

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(dateString(t.context) === '6/6/16');
  t.truthy(timeString(t.context) === '8:00:00');
});

test('2 days later at 8am', t => {
  const cronTime = createCronTime('2 days later at 8am', t.context);

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(dateString(t.context) === '5/29/16');
  t.truthy(timeString(t.context) === '8:00:00');

  t.context.setMilliseconds(t.context.getMilliseconds() + cronTime.next());
  t.truthy(dateString(t.context) === '5/31/16');
  t.truthy(timeString(t.context) === '8:00:00');
});

// test(t => {
//   t.truthy(createCronTime('once every month'));
// });
// test(t => {
//   t.truthy(createCronTime('once every 2 weeks'));
// });
// test(t => {
//   t.truthy(createCronTime('every monday morning at 6a.m'));
// });
// test(t => {
//   t.truthy(createCronTime('this sunday morning'));
// });
// test(t => {
//   t.truthy(createCronTime('in next sunday morning at 8a.m'));
// });
// test(t => {
//   t.truthy(createCronTime('next monday at 8'));
// });
// test(t => {
//   t.truthy(createCronTime('next 2 weeks monday at 8a.m'));
// });
// test(t => {
//   t.truthy(createCronTime('next 2 weeks'));
// });
// test(t => {
//   t.truthy(createCronTime('this sunday morning'));
// });
// test(t => {
//   t.truthy(createCronTime('next week sunday morning'));
// });
// test(t => {
//   t.truthy(createCronTime('every morning'));
// });
// test(t => {
//   t.truthy(createCronTime('midnight at 1a.m'));
// });
// test(t => {
//   t.truthy(createCronTime('2 weeks from now'));
// });
// test(t => {
//   t.truthy(createCronTime('3 hours later'));
// });
