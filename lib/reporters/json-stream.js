'use strict';
/**
 * @module JSONStream
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var Runner = require('../runner');

/**
 * Expose `JSONStream`.
 */

exports = module.exports = JSONStream;

/**
 * Constructs a new `JSONStream` reporter instance.
 *
 * @public
 * @class
 * @extends Mocha.reporters.Base
 * @memberof Mocha.reporters
 * @param {Runner} runner - Instance triggers reporter actions.
 */
function JSONStream(runner) {
  Base.call(this, runner);

  var self = this;
  var total = runner.total;

  runner.once(Runner.constants.RUNNER_EVENT_START, function() {
    writeEvent(['start', {total: total}]);
  });

  runner.on(Runner.constants.RUNNER_EVENT_PASS, function(test) {
    writeEvent(['pass', clean(test)]);
  });

  runner.on(Runner.constants.RUNNER_EVENT_FAIL, function(test, err) {
    test = clean(test);
    test.err = err.message;
    test.stack = err.stack || null;
    writeEvent(['fail', test]);
  });

  runner.once(Runner.constants.RUNNER_EVENT_END, function() {
    writeEvent(['end', self.stats]);
  });
}

/**
 * Mocha event to be written to the output stream.
 * @typedef {Array} JSONStream~MochaEvent
 */

/**
 * Writes Mocha event to reporter output stream.
 *
 * @private
 * @param {JSONStream~MochaEvent} event - Mocha event to be output.
 */
function writeEvent(event) {
  process.stdout.write(JSON.stringify(event) + '\n');
}

/**
 * Returns an object literal representation of `test`
 * free of cyclic properties, etc.
 *
 * @private
 * @param {Test} test - Instance used as data source.
 * @return {Object} object containing pared-down test instance data
 */
function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry()
  };
}

JSONStream.description = 'newline delimited JSON events';
