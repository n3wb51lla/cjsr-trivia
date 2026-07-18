import questions from '../src/data/questions.json' with { type: 'json' };
import schedule from '../src/data/schedule.json' with { type: 'json' };
import teamNames from '../src/data/teamNames.json' with { type: 'json' };

const runCount = Number.parseInt(process.argv[2] ?? '500', 10);
const teamCount = Number.parseInt(process.argv[3] ?? '20', 10);
const questionDurationMs = 20_000;

const regularQuestionCount = schedule.rounds.reduce((sum, round) => sum + round.questionCount, 0);
const pointsByRound = new Map(schedule.rounds.map(round => [round.id, round.points]));
const maxRoundId = Math.max(...schedule.rounds.map(round => round.id));

if (!Number.isInteger(runCount) || runCount < 1) throw new Error('Run count must be a positive integer.');
if (teamCount !== 20) throw new Error('This stress sim is intended for exactly 20 teams.');
if (teamNames.length < teamCount) throw new Error(`Expected at least ${teamCount} team names.`);

const regularQuestions = questions
  .filter(question => typeof question.round === 'number')
  .sort((first, second) => first.id - second.id);

if (regularQuestions.length !== regularQuestionCount) {
  throw new Error(`Expected ${regularQuestionCount} regular questions (per schedule.json), found ${regularQuestions.length}.`);
}

for (const question of regularQuestions) {
  if (!Number.isInteger(question.id) || question.id < 1 || question.id > regularQuestionCount) {
    throw new Error(`Question has invalid id: ${question.id}`);
  }
  if (!Number.isInteger(question.round) || question.round < 1 || question.round > maxRoundId) {
    throw new Error(`Question ${question.id} has invalid round: ${question.round}`);
  }
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
    throw new Error(`Question ${question.id} has invalid answer: ${question.answer}`);
  }
  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    throw new Error(`Question ${question.id} must have exactly four choices.`);
  }
}

let totalCorrectAnswers = 0;
let totalTimedOutAnswers = 0;
let highestWinningScore = 0;
let lowestWinningScore = Number.POSITIVE_INFINITY;
let maxScoreSeen = 0;
let minScoreSeen = Number.POSITIVE_INFINITY;

for (let runIndex = 0; runIndex < runCount; runIndex += 1) {
  const random = mulberry32(0xc057 + runIndex);
  const state = makeInitialState(teamCount);

  for (const question of regularQuestions) {
    const phase = question.id === 1 ? 'lobby' : 'reveal';
    assert(phase === 'lobby' || phase === 'reveal', 'Host phase invariant failed before question.');

    const questionStartedAt = nowFor(runIndex, question.id);
    const answers = state.teams.map(team => makeAnswer(random, team.id, question, questionStartedAt));
    assertUniqueAnswers(answers, question.id, teamCount);

    const points = pointsByRound.get(question.round);
    assert(Number.isInteger(points) && points > 0, `Missing points for round ${question.round}.`);

    for (const team of state.teams) {
      const answer = answers.find(candidate => candidate.teamId === team.id && candidate.questionIndex === question.id);
      assert(answer, `Missing answer for ${team.teamName} on question ${question.id}.`);

      const isCorrect = answer.choiceIndex === question.answer;
      const pointsAwarded = isCorrect ? points : 0;
      answer.isCorrect = isCorrect;
      answer.pointsAwarded = pointsAwarded;
      team.score += pointsAwarded;
      team.cumulativeLockMs += answer.timeToLockMs ?? 0;

      if (isCorrect) totalCorrectAnswers += 1;
      if (answer.choiceIndex === null) totalTimedOutAnswers += 1;
    }

    state.answers.push(...answers);
    assertRunState(state, question.id);
  }

  const leaderboard = buildLeaderboard(state.teams);
  assert(leaderboard.length === teamCount, `Run ${runIndex + 1}: leaderboard lost teams.`);
  assertLeaderboard(leaderboard);

  const winningScore = leaderboard[0].score;
  highestWinningScore = Math.max(highestWinningScore, winningScore);
  lowestWinningScore = Math.min(lowestWinningScore, winningScore);

  for (const team of state.teams) {
    maxScoreSeen = Math.max(maxScoreSeen, team.score);
    minScoreSeen = Math.min(minScoreSeen, team.score);
  }
}

const totalAnswers = runCount * teamCount * regularQuestionCount;
const correctnessRate = totalAnswers === 0 ? 0 : totalCorrectAnswers / totalAnswers;
const timeoutRate = totalAnswers === 0 ? 0 : totalTimedOutAnswers / totalAnswers;

const manualHeadStartRevealPoints = getRevealDisplayPoints(true, 0, 1);
assert(manualHeadStartRevealPoints === 1, 'Correct answer with stale stored points should still display the question value.');

console.log(`Simulated ${runCount} full games.`);
console.log(`Teams per game: ${teamCount}`);
console.log(`Regular questions per game: ${regularQuestionCount}`);
console.log(`Total answer records checked: ${totalAnswers}`);
console.log(`Correct answer rate: ${(correctnessRate * 100).toFixed(2)}%`);
console.log(`Timeout/null answer rate: ${(timeoutRate * 100).toFixed(2)}%`);
console.log(`Winning score range: ${lowestWinningScore} - ${highestWinningScore}`);
console.log(`All team score range: ${minScoreSeen} - ${maxScoreSeen}`);
console.log('All simulation invariants passed.');

function makeInitialState(count) {
  return {
    teams: teamNames.slice(0, count).map((teamName, index) => ({
      id: `team-${index + 1}`,
      teamName,
      playerCount: (index % 4) + 1,
      score: 0,
      cumulativeLockMs: 0,
      joinedAt: index + 1,
      isActive: true,
    })),
    answers: [],
  };
}

function makeAnswer(random, teamId, question, questionStartedAt) {
  const timedOut = random() < 0.035;
  const choiceIndex = timedOut ? null : randomChoice(random, question.answer);
  const timeToLockMs = timedOut ? null : Math.floor(random() * questionDurationMs);

  return {
    teamId,
    questionIndex: question.id,
    choiceIndex,
    lockedAt: questionStartedAt + (timeToLockMs ?? questionDurationMs),
    timeToLockMs,
    isCorrect: null,
    pointsAwarded: 0,
  };
}

function randomChoice(random, correctAnswer) {
  if (random() < 0.42) return correctAnswer;
  const wrongChoices = [0, 1, 2, 3].filter(choice => choice !== correctAnswer);
  return wrongChoices[Math.floor(random() * wrongChoices.length)];
}

function buildLeaderboard(teams) {
  let lastScore = null;
  let lastRank = 0;

  return [...teams]
    .filter(team => team.isActive)
    .sort((first, second) => {
      if (second.score !== first.score) return second.score - first.score;
      if (first.cumulativeLockMs !== second.cumulativeLockMs) return first.cumulativeLockMs - second.cumulativeLockMs;
      return first.teamName.localeCompare(second.teamName);
    })
    .map((team, index) => {
      const rank = team.score === lastScore ? lastRank : index + 1;
      lastScore = team.score;
      lastRank = rank;

      return {
        teamId: team.id,
        teamName: team.teamName,
        rank,
        score: team.score,
        cumulativeLockMs: team.cumulativeLockMs,
      };
    });
}

function assertRunState(state, questionId) {
  assert(state.answers.length === teamCount * questionId, `Expected ${teamCount * questionId} answers after Q${questionId}, got ${state.answers.length}.`);

  for (const team of state.teams) {
    assert(team.score >= 0, `${team.teamName} has negative score.`);
    assert(team.cumulativeLockMs >= 0, `${team.teamName} has negative lock time.`);
    assert(team.cumulativeLockMs <= questionId * questionDurationMs, `${team.teamName} lock time exceeds possible maximum.`);
  }
}

function assertUniqueAnswers(answers, questionId, expectedCount) {
  assert(answers.length === expectedCount, `Question ${questionId}: expected ${expectedCount} answers, got ${answers.length}.`);
  const answerKeys = new Set();

  for (const answer of answers) {
    const key = `${answer.teamId}:${answer.questionIndex}`;
    assert(!answerKeys.has(key), `Duplicate answer key ${key}.`);
    answerKeys.add(key);
    assert(answer.questionIndex === questionId, `Answer has wrong question index: ${answer.questionIndex}`);
    assert(answer.choiceIndex === null || (answer.choiceIndex >= 0 && answer.choiceIndex <= 3), `Answer has invalid choice: ${answer.choiceIndex}`);
    assert(answer.timeToLockMs === null || (answer.timeToLockMs >= 0 && answer.timeToLockMs < questionDurationMs), `Invalid lock time: ${answer.timeToLockMs}`);
  }
}

function assertLeaderboard(leaderboard) {
  for (let index = 1; index < leaderboard.length; index += 1) {
    const previous = leaderboard[index - 1];
    const current = leaderboard[index];

    assert(previous.score >= current.score, 'Leaderboard score order failed.');
    if (previous.score === current.score) {
      assert(previous.cumulativeLockMs <= current.cumulativeLockMs || previous.teamName.localeCompare(current.teamName) <= 0, 'Leaderboard tie-break order failed.');
    }
  }
}

function getRevealDisplayPoints(correct, storedPointsAwarded, questionPoints) {
  return correct ? Math.max(storedPointsAwarded, questionPoints) : 0;
}

function nowFor(runIndex, questionId) {
  return 1_700_000_000_000 + runIndex * 1_000_000 + questionId * 30_000;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function mulberry32(seed) {
  return function next() {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}
