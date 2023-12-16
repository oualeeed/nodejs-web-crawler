const { log } = require("console");
const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
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

test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="https://geeksandblogs.fly.io/"> Welcome to Geeks and Blogs</a>
      </body>
    </html>
  `;

  const inputBaseURL = "http://geeksandblogs.fly.io";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://geeksandblogs.fly.io/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="/path/"> Welcome to Geeks and Blogs</a>
      </body>
    </html>
  `;

  const inputBaseURL = "https://geeksandblogs.fly.io";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://geeksandblogs.fly.io/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="/path1/"> Welcome to Geeks and Blogs</a>
        <a href="https://geeksandblogs.fly.io/"> Welcome to Geeks and Blogs</a>
      </body>
    </html>
  `;

  const inputBaseURL = "https://geeksandblogs.fly.io";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://geeksandblogs.fly.io/path1/",
    "https://geeksandblogs.fly.io/",
  ];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid", () => {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="invalid"> INVALID</a>
      </body>
    </html>
  `;

  const inputBaseURL = "https://geeksandblogs.fly.io";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
