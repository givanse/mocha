'use strict';

/**
 * Provides a factory function for a {@link StatsCollector} object.
 * @private
 * @module
 */

var Runner = require('./runner');

/**
 * Test statistics collector.
 *
 * @private
 * @typedef {Object} StatsCollector
 * @property {number} suites - integer count of suites run.
 * @property {number} tests - integer count of tests run.
 * @property {number} passes - integer count of passing tests.
 * @property {number} pending - integer count of pending tests.
 * @property {number} failures - integer count of failed tests.
 * @property {Date} start - time when testing began.
 * @property {Date} end - time when testing concluded.
 * @property {number} duration - number of msecs that testing took.
 */

var Date = global.Date;

/**
 * Provides stats such as test duration, number of tests passed / failed etc., by listening for events emitted by `runner`.
 *
 * @private
 * @param {Runner} runner - Runner instance
 * @throws {TypeError} If falsy `runner`
 */
function createStatsCollector(runner) {
  /**
   * @type StatsCollector
   */
  var stats = {
    suites: 0,
    tests: 0,
    passes: 0,
    pending: 0,
    failures: 0
  };

  if (!runner) {
    throw new TypeError('Missing runner argument');
  }

  runner.stats = stats;

  runner.once(Runner.constants.RUNNER_EVENT_START, function() {
    stats.start = new Date();
  });

  runner.on(Runner.constants.RUNNER_EVENT_SUITE, function(suite) {
    suite.root || stats.suites++;
  });

  runner.on(Runner.constants.RUNNER_EVENT_PASS, function() {
    stats.passes++;
  });

  runner.on(Runner.constants.RUNNER_EVENT_FAIL, function() {
    stats.failures++;
  });

  runner.on(Runner.constants.RUNNER_EVENT_PENDING, function() {
    stats.pending++;
  });

  runner.on(Runner.constants.RUNNER_EVENT_TEST_END, function() {
    stats.tests++;
  });

  runner.once(Runner.constants.RUNNER_EVENT_END, function() {
    stats.end = new Date();
    stats.duration = stats.end - stats.start;
  });
}

module.exports = createStatsCollector;
