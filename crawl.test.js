const { normalizeURL } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
  const input = "https://geeksandblogs.fly.dev/path";
  const actual = normalizeURL(input);
  const expected = "geeksandblogs.fly.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://geeksandblogs.fly.dev/path/";
  const actual = normalizeURL(input);
  const expected = "geeksandblogs.fly.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL CAPITALS", () => {
  const input = "https://GEEKSANDBLOGS.fly.dev/path/";
  const actual = normalizeURL(input);
  const expected = "geeksandblogs.fly.dev/path";
  expect(actual).toEqual(expected);
});
