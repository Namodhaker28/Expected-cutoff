const OUTLIER_PERCENT = 0.02;
const WEIGHTS = { crowd: 0.3, historical: 0.4, structural: 0.3 };
const YEAR_WEIGHTS = [0.4, 0.3, 0.2, 0.1];
const DIFFICULTY_MODIFIER = 0.03;

function trimOutliers(scores) {
  if (scores.length < 5) return scores;
  const sorted = [...scores].sort((a, b) => a - b);
  const trimCount = Math.max(1, Math.floor(sorted.length * OUTLIER_PERCENT));
  return sorted.slice(trimCount, sorted.length - trimCount);
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function computeCrowdLayer(submissions, maxScore) {
  if (!submissions.length) {
    return { score: maxScore * 0.5, sentiment: 'unknown', avgDifficulty: 3 };
  }

  const scores = trimOutliers(submissions.map((s) => s.rawScore));
  const medianScore = median(scores);
  const avgDifficulty = mean(submissions.map((s) => s.overallDifficulty));

  const difficultyDelta = avgDifficulty - 3;
  const modifier = 1 - difficultyDelta * DIFFICULTY_MODIFIER;
  const adjustedScore = medianScore * modifier;

  let sentiment = 'moderate';
  if (avgDifficulty >= 4) sentiment = 'hard';
  else if (avgDifficulty >= 3.5) sentiment = 'moderately_hard';
  else if (avgDifficulty <= 2) sentiment = 'easy';
  else if (avgDifficulty <= 2.5) sentiment = 'moderately_easy';

  return {
    score: Math.min(Math.max(adjustedScore, 0), maxScore),
    sentiment,
    avgDifficulty,
  };
}

function computeHistoricalLayer(historyRecords) {
  if (!historyRecords.length) return { score: 0, trend: 'stable' };

  const sorted = [...historyRecords].sort((a, b) => b.year - a.year);
  const recent = sorted.slice(0, YEAR_WEIGHTS.length);

  let weightedSum = 0;
  let weightTotal = 0;
  recent.forEach((record, i) => {
    const w = YEAR_WEIGHTS[i] || 0.05;
    weightedSum += record.closingScore * w;
    weightTotal += w;
  });

  const score = weightTotal > 0 ? weightedSum / weightTotal : sorted[0].closingScore;

  let trend = 'stable';
  if (sorted.length >= 2) {
    const diff = sorted[0].closingScore - sorted[1].closingScore;
    if (diff > 1) trend = 'rising';
    else if (diff < -1) trend = 'falling';
  }

  return { score, trend };
}

function computeStructuralLayer(seatRecords, lastClosingScore) {
  if (!seatRecords.length || !lastClosingScore) {
    return { score: lastClosingScore || 0 };
  }

  const sorted = [...seatRecords].sort((a, b) => b.year - a.year);
  const current = sorted[0];
  const previous = sorted[1];

  let seatFactor = 1;
  if (previous && previous.totalSeats > 0) {
    const seatChange = (current.totalSeats - previous.totalSeats) / previous.totalSeats;
    seatFactor = 1 - seatChange * 0.5;
  }

  let densityFactor = 1;
  if (current.appearedApplicants && current.totalSeats) {
    const currentDensity = current.appearedApplicants / current.totalSeats;
    const prevDensity = previous?.appearedApplicants && previous?.totalSeats
      ? previous.appearedApplicants / previous.totalSeats
      : currentDensity;
    if (prevDensity > 0) {
      const densityChange = (currentDensity - prevDensity) / prevDensity;
      densityFactor = 1 + densityChange * 0.3;
    }
  }

  const score = lastClosingScore * seatFactor * densityFactor;
  return { score: Math.max(score, 0), seatFactor, densityFactor };
}

function getConfidence(count) {
  if (count >= 100) return 'high';
  if (count >= 20) return 'medium';
  return 'low';
}

function estimateRank(closingScore, historyRecords) {
  if (!historyRecords.length) return null;
  const sorted = [...historyRecords].sort((a, b) => b.year - a.year);
  const latest = sorted[0];
  const ratio = closingScore / latest.closingScore;
  return Math.round(latest.closingRank / ratio);
}

function predict({ submissions, historyRecords, seatRecords, maxScore }) {
  const crowd = computeCrowdLayer(submissions, maxScore);
  const historical = computeHistoricalLayer(historyRecords);
  const lastClosing = historyRecords.length
    ? [...historyRecords].sort((a, b) => b.year - a.year)[0].closingScore
    : 0;
  const structural = computeStructuralLayer(seatRecords, lastClosing);

  const crowdScore = crowd.score || historical.score;
  const historicalScore = historical.score || lastClosing;
  const structuralScore = structural.score || historicalScore;

  const expectedClosingScore =
    WEIGHTS.crowd * crowdScore +
    WEIGHTS.historical * historicalScore +
    WEIGHTS.structural * structuralScore;

  const rounded = Math.round(expectedClosingScore * 100) / 100;

  return {
    expectedClosingScore: rounded,
    expectedClosingRank: estimateRank(rounded, historyRecords),
    confidence: getConfidence(submissions.length),
    breakdown: {
      crowd: Math.round(crowdScore * 100) / 100,
      historical: Math.round(historicalScore * 100) / 100,
      structural: Math.round(structuralScore * 100) / 100,
    },
    submissionCount: submissions.length,
    difficultySentiment: crowd.sentiment,
    trend: historical.trend,
    avgDifficulty: crowd.avgDifficulty,
  };
}

module.exports = {
  predict,
  trimOutliers,
  median,
  mean,
  computeCrowdLayer,
  computeHistoricalLayer,
  computeStructuralLayer,
};
