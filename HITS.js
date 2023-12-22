// HITS Algorithm
function hitsAlgorithm(adjacencyMatrix, maxIterations) {
  const hubScores = new Map();
  const authorityScores = new Map();

  // Initialize scores
  adjacencyMatrix.forEach((entry) => {
    hubScores.set(entry.url, 1);
    authorityScores.set(entry.url, 1);
  });

  // Iterate and update scores
  for (let i = 0; i < maxIterations; i++) {
    adjacencyMatrix.forEach((entry) => {
      let hubScore = 0;
      let authorityScore = 0;

      entry.links.forEach((link) => {
        hubScore += authorityScores.get(link) ?? 0;
        authorityScore += hubScores.get(link) ?? 0;
      });

      hubScores.set(entry.url, hubScore);
      authorityScores.set(entry.url, authorityScore);
    });
    // // Normalize scores
    normalizeScores(hubScores);
    normalizeScores(authorityScores);
  }

  return {
    hubScores,
    authorityScores,
  };
}

// Normalize scores
function normalizeScores(scores) {
  const sum = Array.from(scores.values()).reduce(
    (acc, score) => acc + score,
    0
  );
  const factor = sum !== 0 ? 1 / sum : 0;

  scores.forEach((value, key) => {
    scores.set(key, value * factor);
  });
}

module.exports = {
  normalizeScores,
  hitsAlgorithm,
};
