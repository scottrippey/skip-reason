/**
 * A more verbose version of `it.skip` that requires a reason.
 *
 * Pairs well with eslint-plugin-jest/no-disabled-tests or eslint-plugin-mocha/no-skipped-tests
 * to ensure `it.skip` and `describe.skip` are only used for debugging, and don't get committed.
 *
 * @example
 *   skipReason("test fails due to issue #1111")
 *   .it("should do stuff", () => ...stuff);
 *   // Example test logs:
 *   //  - should do stuff (skipped: test fails due to issue #1111)
 */
export function skipReason(reason: string) {
  const describeSkip = (title: string, fn: () => void) => {
    describe.skip(`${title} (skipped: ${reason})`, fn);
  };
  const itSkip = (title: string, fn: AsyncFn) => {
    it.skip(`${title} (skipped: ${reason})`, fn);
  };

  // Also export the `skip/only` convenience methods:
  return {
    isActive: false,
    describe: Object.assign(describeSkip, {
      skip: describe.skip,
      only: describe.only,
    }) as Suite,
    it: Object.assign(itSkip, {
      skip: it.skip,
      only: it.only,
    }) as Test,
    // Expose all (defined) hooks as noops:
    before: (typeof before === 'undefined' ? undefined : noop) as Hook,
    beforeAll: (typeof beforeAll === 'undefined' ? undefined : noop) as Hook,
    beforeEach: (typeof beforeEach === 'undefined' ? undefined : noop) as Hook,
    after: (typeof after === 'undefined' ? undefined : noop) as Hook,
    afterAll: (typeof afterAll === 'undefined' ? undefined : noop) as Hook,
    afterEach: (typeof afterEach === 'undefined' ? undefined : noop) as Hook,
  };
}

/**
 * A more verbose version of `it.skip` that requires a reason.
 *
 * @example
 *   const onMac = skipWhen(process.platform !== 'darwin', "only testable on Mac");
 *   onMac.it("should do Mac stuff", () => ...);
 *
 *   // Example logs:
 *   //   - should do Mac stuff (skipped: only testable on Mac)
 *
 */
export function skipWhen(condition: unknown, reason: string): ReturnType<typeof skipReason> {
  if (condition) {
    return skipReason(reason);
  }

  const notSkipped = {
    isActive: true,
    describe,
    it,
    // Expose all (defined) hooks:
    before: (typeof before === 'undefined' ? undefined : before) as Hook,
    beforeAll: (typeof beforeAll === 'undefined' ? undefined : beforeAll) as Hook,
    beforeEach: (typeof beforeEach === 'undefined' ? undefined : beforeEach) as Hook,
    after: (typeof after === 'undefined' ? undefined : after) as Hook,
    afterAll: (typeof afterAll === 'undefined' ? undefined : afterAll) as Hook,
    afterEach: (typeof afterEach === 'undefined' ? undefined : afterEach) as Hook,
  };
  return notSkipped;
}

const noop: Hook = (fn: AsyncFn) => {
  /* do nothing */
};

// These definitions should be _nearly_ the same across most test frameworks (jest, mocha, cypress)
type Suite = {
  (title: string, fn: () => void): void;
  skip: (title: string, fn: () => void) => void;
  only: (title: string, fn: () => void) => void;
};
type Test = {
  (title: string, fn: AsyncFn): void;
  skip: (title: string, fn: AsyncFn) => void;
  only: (title: string, fn: AsyncFn) => void;
};
type Hook = (fn: AsyncFn) => void;
type AsyncFn = (() => (void | Promise<void>)) | ((done: () => void) => void);
declare const describe: Suite;
declare const it: Test;
declare const before: Hook;
declare const beforeAll: Hook;
declare const beforeEach: Hook;
declare const after: Hook;
declare const afterAll: Hook;
declare const afterEach: Hook;

