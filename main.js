const { hitsAlgorithm } = require("./HITS");
const { crawlPage, printPage, crawlAndPrintIntoPages } = require("./crawl");
const fs = require("fs");
const { dollarize } = require("./utils");

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
crawlPage(baseURL, baseURL, [], "React").then((pages) => {
  const { hubScores, authorityScores } = hitsAlgorithm(pages, 50);

  const hubRanking = Array.from(hubScores.entries()).sort(
    (a, b) => b[1] - a[1]
  );
  const authorityRanking = Array.from(authorityScores.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  console.log("Hub Ranking:", hubRanking);
  console.log("Authority Ranking:", authorityRanking);
});
