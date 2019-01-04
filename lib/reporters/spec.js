'use strict';
/**
 * @module Spec
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var Runner = require('../runner');
var inherits = require('../utils').inherits;
var color = Base.color;

/**
 * Expose `Spec`.
 */

exports = module.exports = Spec;

/**
 * Initialize a new `Spec` test reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner
 */
function Spec(runner) {
  Base.call(this, runner);

  var self = this;
  var indents = 0;
  var n = 0;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on(Runner.constants.RUNNER_EVENT_START, function() {
    console.log();
  });

  runner.on(Runner.constants.RUNNER_EVENT_SUITE, function(suite) {
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function() {
    --indents;
    if (indents === 1) {
      console.log();
    }
  });

  runner.on(Runner.constants.RUNNER_EVENT_PENDING, function(test) {
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on(Runner.constants.RUNNER_EVENT_PASS, function(test) {
    var fmt;
    if (test.speed === 'fast') {
      fmt =
        indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s');
      console.log(fmt, test.title);
    } else {
      fmt =
        indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s') +
        color(test.speed, ' (%dms)');
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on(Runner.constants.RUNNER_EVENT_FAIL, function(test) {
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.once(Runner.constants.RUNNER_EVENT_END, self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Spec, Base);

Spec.description = 'hierarchical & verbose [default]';
