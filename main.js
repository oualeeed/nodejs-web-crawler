#!/usr/bin/env node

import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import promptSync from "prompt-sync";
import { hitsAlgorithm } from "./HITS.js";
import { crawlPage } from "./crawl.js";

const prompt = promptSync();
const sleep = (ms = 4000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    `
                                                                                                           
                                                                                                       
HHHHHHHHH     HHHHHHHHH  iiii            IIIIIIIIII               AAA                    OOOOOOOOO     
H:::::::H     H:::::::H i::::i           I::::::::I              A:::A                 OO:::::::::OO   
H:::::::H     H:::::::H  iiii            I::::::::I             A:::::A              OO:::::::::::::OO 
HH::::::H     H::::::HH                  II::::::II            A:::::::A            O:::::::OOO:::::::O
  H:::::H     H:::::H  iiiiiii             I::::I             A:::::::::A           O::::::O   O::::::O
  H:::::H     H:::::H  i:::::i             I::::I            A:::::A:::::A          O:::::O     O:::::O
  H::::::HHHHH::::::H   i::::i             I::::I           A:::::A A:::::A         O:::::O     O:::::O
  H:::::::::::::::::H   i::::i             I::::I          A:::::A   A:::::A        O:::::O     O:::::O
  H:::::::::::::::::H   i::::i             I::::I         A:::::A     A:::::A       O:::::O     O:::::O
  H::::::HHHHH::::::H   i::::i             I::::I        A:::::AAAAAAAAA:::::A      O:::::O     O:::::O
  H:::::H     H:::::H   i::::i             I::::I       A:::::::::::::::::::::A     O:::::O     O:::::O
  H:::::H     H:::::H   i::::i             I::::I      A:::::AAAAAAAAAAAAA:::::A    O::::::O   O::::::O
HH::::::H     H::::::HHi::::::i          II::::::II   A:::::A             A:::::A   O:::::::OOO:::::::O
H:::::::H     H:::::::Hi::::::i          I::::::::I  A:::::A               A:::::A   OO:::::::::::::OO 
H:::::::H     H:::::::Hi::::::i          I::::::::I A:::::A                 A:::::A    OO:::::::::OO   
HHHHHHHHH     HHHHHHHHHiiiiiiii          IIIIIIIIIIAAAAAAA                   AAAAAAA     OOOOOOOOO     
                                                                                                       
                                                                                                       
    `
  );

  await sleep();
  rainbowTitle.stop();

  console.log(`
    ${chalk.bgBlue("HOW TO USE THE IAO-SEARCH-ENGINE")}
    ${chalk.yellow(1)}. Type the URL of the website you want the search to ru on
    ${chalk.yellow(
      2
    )}. choose the search mode : The algorithm you want to do your search.
    ${chalk.yellow(3)}. Type your search query
    ${chalk.yellow(4)}. I give you your the top results.
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
    message: "Another query ? : ",
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
console.log(`The search engine will run on ${chalk.yellow(baseURL)}`);
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
