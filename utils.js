const fs = require("fs");

function createRegexFromWords(words) {
  const escapedWords = words.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regexString = `\\b(?:${escapedWords.join("|")})\\b`;
  return new RegExp(regexString, "gi");
}

const wordsMatch = (htmlBody, query) => {
  const regx = createRegexFromWords(query.split(" "));
  const matches = htmlBody.match(regx);
  if (!matches) {
    return 0;
  }

  return matches.length;
};

module.exports = { wordsMatch };
