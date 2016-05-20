'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cronParser = require('cron-parser');

var CronTime = function () {
  function CronTime(pattern) {
    (0, _classCallCheck3.default)(this, CronTime);
  }

  (0, _createClass3.default)(CronTime, [{
    key: 'nextDate',
    value: function nextDate() {}
  }, {
    key: 'currentDate',
    value: function currentDate() {}
  }]);
  return CronTime;
}();

function parse(pattern) {}

function create(options) {}

module.exports['create'] = create;
module.exports['parse'] = parse;
'use strict';

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [loop].map(_regenerator2.default.mark);

function call(delay) {
  var timeout = void 0;
  var promise = new Promise(function (resolve) {
    timeout = setTimeout(resolve, delay);
  });
  promise.cancel = function () {
    return clearTimeout(timeout);
  };
  return promise;
}

function loop(callback, delay) {
  var returnedValue;
  return _regenerator2.default.wrap(function loop$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!true) {
            _context.next = 10;
            break;
          }

          _context.next = 3;
          return call.call(this, delay);

        case 3:

          this.setState({ index: this.state.index + 1 });

          _context.next = 6;
          return callback.call(this);

        case 6:
          returnedValue = _context.sent;


          if (this.emitCompleteEvent) {
            this.emitCompleteEvent(returnedValue);
          }
          _context.next = 0;
          break;

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function createRunner(callback) {
  var _this = this;

  return function () {
    for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      var result = callback.apply(callback, params);
      _this.setState({ runner: result });

      if (!result || typeof result.next !== 'function') {
        return resolve(result);
      }

      var next = function next(ret) {
        var tick = ret.value;
        _this.setState({ currentTick: tick });

        if (typeof tick.then === 'function') {
          tick.then(function (res) {
            var out = result.next(res);
            if (!out.done) next(out);else resolve(out.value);
          });
        } else {
          var out = result.next(tick);
          if (!out.done) next(out);else resolve(out.value);
        }
      };

      try {
        next(result.next());
      } catch (e) {
        reject(e);
      }
    });
  };
}

var initialState = {
  index: -1,
  isRunning: false,
  currentTick: null,
  runner: null
};

var Scheduler = function () {
  function Scheduler(delay, callback) {
    (0, _classCallCheck3.default)(this, Scheduler);

    var callbackFunc = createRunner.call(this, callback);
    var eventSource = loop.bind(this, callbackFunc, delay);
    this.runEventLoop = createRunner.call(this, eventSource);
    this.state = initialState;

    this.onCompleteListeners = [];
  }

  (0, _createClass3.default)(Scheduler, [{
    key: 'setState',
    value: function setState() {
      var newState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      for (var key in newState) {
        if (this.state.hasOwnProperty(key)) {
          this.state[key] = newState[key];
        }
      }
    }
  }, {
    key: 'onComplete',
    value: function onComplete(callback) {
      var _this2 = this;

      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function.');
      }

      this.onCompleteListeners.push(callback);

      return function () {
        _this2.onCompleteListeners = _this2.onCompleteListeners.filter(function (listener) {
          return listener !== callback;
        });
      };
    }
  }, {
    key: 'emitCompleteEvent',
    value: function emitCompleteEvent(returnedValue) {
      this.onCompleteListeners.forEach(function (listener) {
        listener(returnedValue);
      });
    }
  }, {
    key: 'start',
    value: function start() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (_this3.state.isRunning) {
          return reject(new TypeError('Job already being started.'));
        }

        if (_this3.state.index !== -1) {
          return reject(new TypeError('Job is paused, you should call resume() instead.'));
        }

        _this3.setState({ isRunning: true, runner: _this3.runEventLoop() });
        return resolve(_this3.state.index + 1);
      });
    }

    // Stop the event loop. Even if it's paused or not.

  }, {
    key: 'stop',
    value: function stop() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (!_this4.state.isRunning) {
          return reject(new TypeError('Job hasn\'t started yet.'));
        }

        var stoppedAtIndex = _this4.state.index;

        _this4.state.currentTick.cancel();
        _this4.state.runner.next(true);

        _this4.setState(initialState);

        return resolve(stoppedAtIndex);
      });
    }
  }, {
    key: 'pause',
    value: function pause() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        if (_this5.state.index === -1) {
          return reject(new TypeError('Job has been stopped or hasn\'t been started yet.'));
        }

        if (!_this5.state.isRunning) {
          return reject(new TypeError('Job has been paused already.'));
        }

        var _ = initialState.index;
        var rest = (0, _objectWithoutProperties3.default)(initialState, ['index']);


        _this5.state.currentTick.cancel();
        _this5.state.runner.next(true);

        _this5.setState(rest);

        return resolve(_this5.state.index);
      });
    }
  }, {
    key: 'resume',
    value: function resume() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        if (_this6.state.isRunning) {
          return reject(new TypeError('Job is already running.'));
        }

        if (_this6.state.index === -1) {
          return reject(new TypeError('Job has been stopped or hasn\'t been started yet.'));
        }

        _this6.setState({ isRunning: true, runner: _this6.runEventLoop() });

        return resolve(_this6.state.index);
      });
    }
  }]);
  return Scheduler;
}();

module.exports = Scheduler;
'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CronTime = require('./CronTime');
var Scheduler = require('./Scheduler');

function createScheduler(cronTime, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function. ' + (typeof callback === 'undefined' ? 'undefined' : (0, _typeof3.default)(callback)) + ' was given.');
  }

  if (typeof cronTime === 'string') {
    try {
      cronTime = CronTime.parse(cronTime);
    } catch (e) {
      throw e;
    }
  }

  return new Scheduler(cronTime, callback);
};

module.exports = createScheduler;
