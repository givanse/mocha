'use strict';
/**
 * @module List
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var Runner = require('../runner');
var inherits = require('../utils').inherits;
var color = Base.color;
var cursor = Base.cursor;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @param {Runner} runner
 */
function List(runner) {
  Base.call(this, runner);

  var self = this;
  var n = 0;

  runner.on(Runner.constants.RUNNER_EVENT_START, function() {
    console.log();
  });

  runner.on('test', function(test) {
    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
  });

  runner.on(Runner.constants.RUNNER_EVENT_PENDING, function(test) {
    var fmt = color('checkmark', '  -') + color('pending', ' %s');
    console.log(fmt, test.fullTitle());
  });

  runner.on(Runner.constants.RUNNER_EVENT_PASS, function(test) {
    var fmt =
      color('checkmark', '  ' + Base.symbols.ok) +
      color('pass', ' %s: ') +
      color(test.speed, '%dms');
    cursor.CR();
    console.log(fmt, test.fullTitle(), test.duration);
  });

  runner.on(Runner.constants.RUNNER_EVENT_FAIL, function(test) {
    cursor.CR();
    console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());
  });

  runner.once(Runner.constants.RUNNER_EVENT_END, self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(List, Base);

List.description = 'like "spec" reporter but flat';
