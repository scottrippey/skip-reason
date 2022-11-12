# skip-reason

A more verbose version of `it.skip` that requires a reason.

Pairs well with `eslint-plugin-jest/no-disabled-tests` or `eslint-plugin-mocha/no-skipped-tests`
to ensure `it.skip` and `describe.skip` are only used for debugging, and don't get committed.

Example:
```js
import { skipReason } from 'skip-reason';

skipReason("test fails due to issue #1111").
it("example test", () => { 
  // This test is skipped, and the logs show the reason:
  //  - example test (skipped: test fails due to issue #1111)
});
```

# skip-when

Skip tests when a condition is true:
```js
import { skipWhen } from 'skip-reason';

const onMacOnly = skipWhen(process.platform !== 'darwin', 'this test is only needed on Mac');

onMacOnly.it('example test', () => {
  // This test only runs on Mac.  On Linux or Windows, it will log:
  //   - example test (skipped: this test is only needed on Mac)
});
```
