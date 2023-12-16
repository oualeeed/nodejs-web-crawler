const { crawlPage } = require("./crawl");

(function () {
  if (process.argv.length < 3) {
    console.log("No Website provided");
    process.exit(1);
  }

  if (process.argv.length > 3) {
    console.log("Too many arguments");
    process.exit(1);
  }

  const baseURL = process.argv[2];
  console.log(`starting crawl ${baseURL}`);
  crawlPage(baseURL);
})();
