function call(delay) {
  let timeout;
  const promise = new Promise(resolve => {
    timeout = setTimeout(resolve, delay);
  });
  promise.cancel = () => clearTimeout(timeout);
  return promise;
}

function *loop(callback, cronTime) {
  while(cronTime.hasNext()) {
    yield call.call(this, cronTime.next());

    this.setState({ index: this.state.index + 1 });

    const returnedValue = yield callback.call(this);

    if (this.emitCompleteEvent) {
      this.emitCompleteEvent(returnedValue);
    }
  }
}

function createRunner(callback) {
  return (...params) => {
    return new Promise((resolve,reject) => {
      const result = callback.apply(callback, params);
      this.setState({ runner: result });

      if (!result || typeof result.next !== 'function') {
        return resolve(result);
      }

      const next = (ret) => {
        const tick = ret.value;
        this.setState({ currentTick: tick });

        if (typeof tick.then === 'function') {
          tick.then((res) => {
            const out = result.next(res);
            if (!out.done) next(out);
            else resolve(out.value);
          });
        } else {
          const out = result.next(tick);
          if (!out.done) next(out);
          else resolve(out.value);
        }
      }

      try {
        next(result.next());
      } catch (e) {
        reject(e);
      }
    });
  }
}

const initialState = {
  index: -1,
  isRunning: false,
  currentTick: null,
  runner: null
};

class Scheduler {
  constructor(cronTime, callback) {
    const callbackFunc = createRunner.call(this, callback);
    const eventSource = loop.bind(this, callbackFunc, cronTime);
    this.runEventLoop = createRunner.call(this, eventSource);
    this.state = initialState;

    this.onCompleteListeners = [];
  }

  setState(newState = {}) {
    for (let key in newState) {
      if (this.state.hasOwnProperty(key)) {
        this.state[key] = newState[key];
      }
    }
  }

  onComplete(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function.');
    }

    this.onCompleteListeners.push(callback);

    return () => {
      this.onCompleteListeners = this.onCompleteListeners.filter(
        listener => listener !== callback
      );
    }
  }

  emitCompleteEvent(returnedValue) {
    this.onCompleteListeners.forEach(listener => {
      listener(returnedValue);
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      if (this.state.isRunning) {
        return reject(new TypeError('Job already being started.'));
      }

      if (this.state.index !== -1) {
        return reject(new TypeError('Job is paused, you should call resume() instead.'));
      }

      this.setState({ isRunning: true, runner: this.runEventLoop() });
      return resolve(this.state.index + 1);
    });
  }

  // Stop the event loop. Even if it's paused or not.
  stop() {
    return new Promise((resolve, reject) => {
      if (!this.state.isRunning) {
        return reject(new TypeError('Job hasn\'t started yet.'));
      }

      const stoppedAtIndex = this.state.index;

      this.state.currentTick.cancel();
      this.state.runner.next(true);

      this.setState(initialState);

      return resolve(stoppedAtIndex);
    });
  }

  pause() {
    return new Promise((resolve, reject) => {
      if (this.state.index === -1) {
        return reject(new TypeError('Job has been stopped or hasn\'t been started yet.'));
      }

      if (!this.state.isRunning) {
        return reject(new TypeError('Job has been paused already.'));
      }

      const {index: _, ...rest} = initialState;

      this.state.currentTick.cancel();
      this.state.runner.next(true);

      this.setState(rest);

      return resolve(this.state.index);
    })
  }

  resume() {
    return new Promise((resolve, reject) => {
      if (this.state.isRunning) {
        return reject(new TypeError('Job is already running.'));
      }

      if (this.state.index === -1) {
        return reject(new TypeError('Job has been stopped or hasn\'t been started yet.'));
      }

      this.setState({ isRunning: true, runner: this.runEventLoop() });

      return resolve(this.state.index);
    });
  }
}

module.exports = Scheduler;
