Mocha allows you to define and use custom reporters install via `npm`.

For example, if `mocha-foo-reporter` was published to the npm registry, you could install it via `npm install mocha-foo-reporter -D`, then use it via `mocha --reporter mocha-foo-reporter`.

## Example Custom Reporter

If you're looking to get started quickly, here's an example of a custom reporter.

```js
// my-reporter.js

const Mocha = require('mocha');
const {
  RUNNER_EVENT_END,
  RUNNER_EVENT_FAIL,
  RUNNER_EVENT_PASS,
  RUNNER_EVENT_SUITE,
  RUNNER_EVENT_SUITE_END
} = Mocha.Runner.constants;
const Base = Mocha.reporters.Base;

// this reporter outputs test results, indenting two spaces per suite
class MyReporter extends Base {
  constructor(runner) {
    super(runner);

    this._indents = 0;

    runner
      .once(RUNNER_EVENT_START, () => {
        console.log('start');
      })
      .on(RUNNER_EVENT_SUITE, () => {
        this.increaseIndent();
      })
      .on(RUNNER_EVENT_SUITE_END, () => {
        this.decreaseIndent();
      })
      .on(RUNNER_EVENT_PASS, test => {
        // Test#fullTitle() returns the suite name(s)
        // prepended to the test title
        console.log(`${this.indent()}pass: ${test.fullTitle()}`);
      })
      .on(RUNNER_EVENT_FAIL, (test, err) => {
        console.log(
          `${this.indent()}fail: ${test.fullTitle()} - error: ${err.message}`
        );
      })
      .once(RUNNER_EVENT_END, () => {
        // Base reporter has a `stats` property
        console.log(
          `end: ${this.stats.passes}/${this.stats.passes +
            this.stats.failures} ok`
        );
      });
  }

  indent() {
    return Array(this._indents)
      .fill('  ')
      .join('');
  }

  increaseIndent() {
    this._indents++;
  }

  decreaseIndent() {
    this._indents--;
  }
}

module.exports = MyReporter;
```

To use this reporter, execute `mocha --reporter /path/to/my-reporter.js`.

For further examples, the built-in reporter implementations are the [best place to look](<(https://github.com/mochajs/mocha/tree/master/lib/reporters)>). The [integration tests](https://github.com/mochajs/mocha/tree/master/test/reporters) may also be helpful.

## Events

A reporter should listen for events emitted from the `runner` (an instance of [Runner]).

The event names are exported from the `constants` property of `Mocha.Runner`:

| Constant                 | Event Name  | Event Arguments | Description                                                                                 |
| ------------------------ | ----------- | --------------- | ------------------------------------------------------------------------------------------- |
| `RUNNER_EVENT_END`       | `end`       | _(n/a)_         | All [Suite]s, [Test]s and [Hook]s have completed execution                                  |
| `RUNNER_EVENT_FAIL`      | `fail`      | `Test`, `Error` | A [Test] has failed or thrown an exception                                                  |
| `RUNNER_EVENT_HOOK`      | `hook`      | `Hook`          | A [Hook] is about to execute                                                                |
| `RUNNER_EVENT_HOOK_END`  | `hook end`  | `Hook`          | A [Hook] has completed execution                                                            |
| `RUNNER_EVENT_PASS`      | `pass`      | `Test`          | A [Test] has passed                                                                         |
| `RUNNER_EVENT_PENDING`   | `pending`   | `Test`          | A [Test] was skipped                                                                        |
| `RUNNER_EVENT_RETRY`     | `retry`     | `Test`, `Error` | A [Test] failed, but is about to be retried; never emitted unless `retry` option is nonzero |
| `RUNNER_EVENT_START`     | `start`     | _(n/a)_         | Execution will begin                                                                        |
| `RUNNER_EVENT_SUITE`     | `suite`     | `Suite`         | The [Hook]s and [Test]s within a [Suite] are about to be executed                           |
| `RUNNER_EVENT_SUITE_END` | `suite end` | `Suite`         | The [Hook]s and [Test]s within a [Suite] (and any children [Suite]s) completed execution    |
| `RUNNER_EVENT_TEST`      | `test`      | `Test`          | A [Test] is about to be executed                                                            |
| `RUNNER_EVENT_TEST_END`  | `test end`  | `Test`          | A [Test] has completed execution                                                            |
| `RUNNER_EVENT_WAITING`   | `waiting`   | _(n/a)_         | Waiting for `global.run()` to be called; only emitted when `delay` option is `true`         |

**Please use these constants** instead of the event names in your own reporter! This will ensure compatibility with future versions of Mocha.

> It's important to understand that all suite callbacks will be run _before_ the [Runner] emits `RUNNER_EVENT_START`. Hooks and tests, however, won't run until _after_ the [Runner] emits `RUNNER_EVENT_START`.

## Custom Reporter for Browser

As of Mocha v6.0.0, custom reporters are _only_ "officially" supported in Node.js. [Mochify](https://npm.im/mochify) might help you. YMMV!

[runner]: /api/mocha.runner
[test]: /api/mocha.test
[hook]: /api/mocha.hook
[suite]: /api/mocha.suite
