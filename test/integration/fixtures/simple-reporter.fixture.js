'use strict';

var Base = require('../../../lib/reporters/base');
var Runner = require('../../../lib/runner');

module.exports = SimpleReporter;

function SimpleReporter(runner) {
  Base.call(this, runner);

  runner.on(Runner.constants.RUNNER_EVENT_SUITE, function(suite) {
    console.log("on('suite') called");
  });

  runner.on(Runner.constants.RUNNER_EVENT_FAIL, function(test, err) {
    console.log("on('fail') called");
  });

  runner.on(Runner.constants.RUNNER_EVENT_PASS, function(test) {
    console.log("on('pass') called");
  });

  runner.on(Runner.constants.RUNNER_EVENT_TEST_END, function(test, err) {
    console.log("on('test end') called");
  });

  runner.on(Runner.constants.RUNNER_EVENT_END, function() {
    console.log("on('end') called");
  });
}
