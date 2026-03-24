import assert from "node:assert/strict";
import test from "node:test";

const describeStack = [];

function withPrefix(name) {
  return [...describeStack, name].join(" > ");
}

export function describe(name, fn) {
  describeStack.push(name);

  try {
    fn();
  } finally {
    describeStack.pop();
  }
}

export function it(name, fn) {
  return test(withPrefix(name), fn);
}

export function expect(actual) {
  return {
    toBe(expected) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected);
    },
    toContain(expected) {
      assert.ok(actual.includes(expected));
    },
    toMatch(expected) {
      assert.match(actual, expected);
    },
  };
}
