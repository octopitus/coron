> Still in development

# Coron

Generator based cron-like scheduler for node and the browser. Promise, Generator & async/await supported.

## Usage

### Installation

You can install using `npm`.

```bash
npm install coron
```

### Examples

```js
import createSchedule from 'coron';

// Execute a cron job every 5 Minutes
const schedule = createSchedule('*/5 * * * *', function() {
  //
});

schedule.start();
```
