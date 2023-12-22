const { dollarize } = require("./utils");
const { test, expect } = require("@jest/globals");

test("dolirize removes every / and replace it with $ ", () => {
  const inputURL = "http://example.com/home";
  const expectedOutput = "http:$$example.com$home";
  const actualOutput = dollarize(inputURL);
  expect(actualOutput).toEqual(expectedOutput);
});
