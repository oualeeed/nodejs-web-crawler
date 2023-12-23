import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import promptSync from "prompt-sync";
import { hitsAlgorithm } from "./HITS.js";
import { crawlPage } from "./crawl.js";
// if (process.argv.length < 3) {
//   console.log("No Website provided");
//   process.exit(1);
// }

// if (process.argv.length > 3) {
//   console.log("Too many arguments");
//   process.exit(1);
// }

const prompt = promptSync();
const sleep = (ms = 4000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(`
  m    m               mmmmm    mm    mmmm    m
  #    #   "             #      ##   m"  "m   #
  #mmmm#   #             #     #  #  #    #   #
  #    #   #             #     #mm#  #    #
  #    #   #           mm#mm  #    #  #mm#    0
  
  Welcome to your favorite search engine !`);

  await sleep();
  rainbowTitle.stop();

  console.log(`
    ${chalk.bgBlue("HOW TO USE THE IAO-SEARCH-ENGINE")}
    Type the URL of the website you want the search to ru on
    Type your search query
    I'll give the to hubs and authorities and ${chalk.bgRed("kill")} myself.
  `);
}

const promptURL = async () => {
  const url = await inquirer.prompt({
    name: "baseURL",
    type: "input",
    message: "URL of the website you want to search on : ",
    default() {
      return "www.example.com";
    },
  });

  baseURL = url.baseURL;
};

const promptQuery = async () => {
  const answer = await inquirer.prompt({
    name: "query",
    type: "input",
    message: "What are you searching for ? ",
    default: () => "How to be a data scientist in 2024",
  });

  query = answer.query;
};

const promptTheSearchMode = async () => {
  const answer = await inquirer.prompt({
    name: "searchMode",
    type: "list",
    message: "Choose the search mode : ",
    choices: [
      "Basic Word matches",
      "The HITS Algorithm",
      "The PageRank Algorithm",
    ],
    default: () => "The HITS Algorithm",
  });

  searchMode = answer.searchMode;
};

const search = async () => {
  if (pages) {
    pages = [];
  }
  pages = await crawlPage(baseURL, baseURL, [], query);

  const { hubScores, authorityScores } = hitsAlgorithm(pages, 50);

  const hubRanking = Array.from(hubScores.entries()).sort(
    (a, b) => b[1] - a[1]
  );
  const authorityRanking = Array.from(authorityScores.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  return { hubRanking, authorityRanking };
};

const promptOtherQuery = async () => {
  const answer = await inquirer.prompt({
    name: "continue",
    type: "list",
    message: "Choose the search mode : ",
    choices: ["Another Search Query", "Kill the program"],
  });

  otherQuery = answer.continue === "Another Search Query";
};

const showTopFiveAuthorities = (authorityRanking, hubRanking) => {
  if (authorityRanking.length === 0) {
    console.log("No results for this query 😶");
    return;
  }

  console.log();
  console.log();
  console.log(chalk.bgBlue("Top Five Authorities : "));
  for (let i = 0; i <= 5 && i < authorityRanking.length; i++) {
    console.log(
      i + 1,
      `${chalk.yellow(authorityRanking[i][0])} with authority score of ${
        i <= 1
          ? chalk.bgGreen(authorityRanking[i][1])
          : i <= 3
          ? chalk.bgYellow(authorityRanking[i][1])
          : chalk.bgRed(authorityRanking[i][1])
      }`
    );
  }

  console.log();
  console.log();
  console.log(chalk.bgBlue("Top Five Hubs : "));
  for (let i = 0; i <= 5 && i < hubRanking.length; i++) {
    console.log(
      i + 1,
      `${chalk.yellow(hubRanking[i][0])} with authority score of ${
        i <= 1
          ? chalk.bgGreen(hubRanking[i][1])
          : i <= 3
          ? chalk.bgYellow(hubRanking[i][1])
          : chalk.bgRed(hubRanking[i][1])
      }`
    );
  }
};

let baseURL;
let searchMode;
let query;
let otherQuery = false;
let pages;

await welcome();
await promptURL();
await promptTheSearchMode();
console.log("These are your choices ");
console.log("The search engine will run on ", chalk.yellow(baseURL));
console.log(`The IAO-Search engine uses the ${chalk.yellow(searchMode)}`);

while (true) {
  await promptQuery();
  const { authorityRanking, hubRanking } = await search();
  showTopFiveAuthorities(authorityRanking, hubRanking);
  await promptOtherQuery();
  if (!otherQuery) {
    break;
  }
}

// crawlPage(baseURL, baseURL, [], query).then((pages) => {
//   const { hubScores, authorityScores } = hitsAlgorithm(pages, 50);

//   const hubRanking = Array.from(hubScores.entries()).sort(
//     (a, b) => b[1] - a[1]
//   );
//   const authorityRanking = Array.from(authorityScores.entries()).sort(
//     (a, b) => b[1] - a[1]
//   );

//   console.log("Hub Ranking:", hubRanking);
//   console.log("Authority Ranking:", authorityRanking);
//   console.log("Top 5 authorities are : ");
//   for (let i = 1; i <= 5; i++) {
//     console.log(
//       i,
//       authorityRanking[i][0],
//       "with authority score of",
//       authorityRanking[i][1]
//     );
//   }
// });
