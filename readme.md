> Still in development

# Coron

Mordern flow control cron-like scheduler. Designed for humans. Promise, generator & async/await supported. Works nicely both for Node and the browser.

## Features

- Based in co-routines, generators and promises.
- Write human readable expression.
- Flexible, minimal API.

## Usage

### Installation

You can install using `npm`.

```bash
npm install coron
```

### Examples

```js
import createSchedule from 'hm.js';

// Execute a job every monday morning
const scheduler = createSchedule('every monday morning', function* () {
  const a = yield Promise.resolve(1);
  const b = yield Promise.resolve(2);
  const c = yield Promise.resolve(3);

  console.log(a + b + c); // 6
});

scheduler.start();
```
