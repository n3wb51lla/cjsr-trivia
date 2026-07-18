import questions from '../src/data/questions.json' with { type: 'json' };
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

  const questionType = question.type ?? 'multiple_choice';
  if (questionType !== 'multiple_choice' && questionType !== 'multi_select' && questionType !== 'free_text') {
    errors.push(`Question ${question.id} type must be "multiple_choice", "multi_select", or "free_text".`);
  } else if (questionType === 'free_text') {
    if (!Array.isArray(question.acceptedAnswers) || question.acceptedAnswers.length < 1) {
      errors.push(`Question ${question.id} acceptedAnswers must be a non-empty array of strings.`);
    } else if (question.acceptedAnswers.some(answer => typeof answer !== 'string' || answer.trim().length === 0)) {
      errors.push(`Question ${question.id} acceptedAnswers must each be a non-empty string.`);
    }
  } else {
    if (!Array.isArray(question.choices) || question.choices.length !== 4) {
      errors.push(`Question ${question.id} must have exactly four choices.`);
    }
    if (questionType === 'multi_select') {
      if (!Array.isArray(question.answers) || question.answers.length < 1 || question.answers.length > 4) {
        errors.push(`Question ${question.id} answers must be an array of 1-4 choice indexes.`);
      } else if (question.answers.some(answer => !Number.isInteger(answer) || answer < 0 || answer > 3)) {
        errors.push(`Question ${question.id} answers must each be between 0 and 3.`);
      }
    } else if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
      errors.push(`Question ${question.id} answer must be between 0 and 3.`);
    }
  }

  if (typeof question.text !== 'string' || question.text.length > 140) {
    errors.push(`Question ${question.id} text must be a string under 140 characters.`);
  }

  if (question.media !== undefined && question.media !== null) {
    const { type, url } = question.media;
    if (type !== 'image' && type !== 'video') {
      errors.push(`Question ${question.id} media type must be "image" or "video".`);
    }
    if (typeof url !== 'string' || url.length === 0) {
      errors.push(`Question ${question.id} media url must be a non-empty string.`);
    }
  }
}

let cursor = 1;
for (const round of schedule.rounds) {
  for (let offset = 0; offset < round.questionCount; offset += 1) {
    const index = cursor + offset;
    const question = questions.find(q => q.id === index);
    if (!question) {
      errors.push(`Missing question ${index}.`);
      continue;
    }
    if (question.round !== round.id) {
      errors.push(`Question ${index} expected round ${round.id}, found ${question.round}.`);
    }
  }
  cursor += round.questionCount;
}
const regularQuestionCount = cursor - 1;

if (schedule.suddenDeath.enabled) {
  const suddenDeathId = regularQuestionCount + 1;
  const suddenDeath = questions.find(q => q.id === suddenDeathId);
  if (!suddenDeath) {
    errors.push(`Missing sudden death question ${suddenDeathId}.`);
  } else if (suddenDeath.round !== 'suddenDeath') {
    errors.push(`Question ${suddenDeathId} must be marked suddenDeath.`);
  }
}

if (errors.length > 0) {
  console.error('Question data validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${questions.length} questions across ${schedule.rounds.length} rounds, ${teamNames.length} team names, and ${overflowTeamNames.length} overflow team names.`);
