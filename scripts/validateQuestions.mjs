import questions from '../src/data/questions.json' with { type: 'json' };
import scoring from '../src/data/scoring.json' with { type: 'json' };
import schedule from '../src/data/schedule.json' with { type: 'json' };
import teamNames from '../src/data/teamNames.json' with { type: 'json' };
import overflowTeamNames from '../src/data/teamNamesOverflow.json' with { type: 'json' };

const errors = [];
const ids = new Set();
const indexes = new Set();

if (teamNames.length !== 20) {
  errors.push(`Expected 20 team names, found ${teamNames.length}.`);
}

for (const name of teamNames) {
  if (typeof name !== 'string' || name.trim().length === 0) errors.push('Team names must be non-empty strings.');
}

for (const name of overflowTeamNames) {
  if (typeof name !== 'string' || name.trim().length === 0) errors.push('Overflow team names must be non-empty strings.');
}

const allNames = [...teamNames, ...overflowTeamNames];
const seenNames = new Set();
for (const name of allNames) {
  const key = String(name).trim().toLowerCase();
  if (seenNames.has(key)) errors.push(`Duplicate team name across teamNames.json and teamNamesOverflow.json: ${name}`);
  seenNames.add(key);
}

for (const question of questions) {
  if (ids.has(question.id)) errors.push(`Duplicate question id: ${question.id}`);
  ids.add(question.id);

  if (!Number.isInteger(question.id)) errors.push(`Question id must be an integer: ${question.id}`);
  if (indexes.has(question.id)) errors.push(`Duplicate question index: ${question.id}`);
  indexes.add(question.id);

  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    errors.push(`Question ${question.id} must have exactly four choices.`);
  }

  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
    errors.push(`Question ${question.id} answer must be between 0 and 3.`);
  }

  if (typeof question.text !== 'string' || question.text.length > 140) {
    errors.push(`Question ${question.id} text must be a string under 140 characters.`);
  }
}

for (let index = 1; index <= schedule.regularQuestionCount; index++) {
  const question = questions.find(q => q.id === index);
  if (!question) {
    errors.push(`Missing question ${index}.`);
    continue;
  }
  const expectedRound = Math.ceil(index / schedule.questionsPerRound);
  if (question.round !== expectedRound) {
    errors.push(`Question ${index} expected round ${expectedRound}, found ${question.round}.`);
  }
}

const suddenDeath = questions.find(q => q.id === schedule.suddenDeathQuestionId);
if (!suddenDeath) {
  errors.push(`Missing sudden death question ${schedule.suddenDeathQuestionId}.`);
} else if (suddenDeath.round !== 'suddenDeath') {
  errors.push(`Question ${schedule.suddenDeathQuestionId} must be marked suddenDeath.`);
}

if (scoring['6'] !== 5) errors.push('Round six must award five points.');

if (errors.length > 0) {
  console.error('Question data validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${questions.length} questions, ${teamNames.length} team names, and ${overflowTeamNames.length} overflow team names.`);
