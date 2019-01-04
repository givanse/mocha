'use strict';
/**
 * @module Dot
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var inherits = require('../utils').inherits;
var Runner = require('../runner');

/**
 * Expose `Dot`.
 */

exports = module.exports = Dot;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @public
 * @param {Runner} runner
 */
function Dot(runner) {
  Base.call(this, runner);

  var self = this;
  var width = (Base.window.width * 0.75) | 0;
  var n = -1;

  runner.on(Runner.constants.RUNNER_EVENT_START, function() {
    process.stdout.write('\n');
  });

  runner.on(Runner.constants.RUNNER_EVENT_PENDING, function() {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    process.stdout.write(Base.color('pending', Base.symbols.comma));
  });

  runner.on(Runner.constants.RUNNER_EVENT_PASS, function(test) {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    if (test.speed === 'slow') {
      process.stdout.write(Base.color('bright yellow', Base.symbols.dot));
    } else {
      process.stdout.write(Base.color(test.speed, Base.symbols.dot));
    }
  });

  runner.on(Runner.constants.RUNNER_EVENT_FAIL, function() {
    if (++n % width === 0) {
      process.stdout.write('\n  ');
    }
    process.stdout.write(Base.color('fail', Base.symbols.bang));
  });

  runner.once(Runner.constants.RUNNER_EVENT_END, function() {
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Dot, Base);

Dot.description = 'dot matrix representation';
