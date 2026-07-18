import type { Question } from '../types';
import type { QuestionRowInput } from './questionValidation';

const COLUMNS = ['id', 'round', 'text', 'choiceA', 'choiceB', 'choiceC', 'choiceD', 'correctAnswer'] as const;

export async function downloadQuestionTemplate(questions: readonly Question[], filename = 'questions-template.xlsx'): Promise<void> {
  const XLSX = await import('xlsx');

  const rows = questions.map(question => ({
    id: question.id,
    round: question.round === 'suddenDeath' ? 'Sudden Death' : question.round,
    text: '',
    choiceA: '',
    choiceB: '',
    choiceC: '',
    choiceD: '',
    correctAnswer: '',
  }));

  const questionsSheet = XLSX.utils.json_to_sheet(rows, { header: [...COLUMNS] });
  const instructionsSheet = XLSX.utils.aoa_to_sheet([
    ['How to fill in this template'],
    [''],
    ['id and round are fixed per question - do not change them.'],
    ['text: the question text, 140 characters or fewer.'],
    ['choiceA, choiceB, choiceC, choiceD: the four answer choices.'],
    ['correctAnswer: enter A, B, C, or D for the correct choice.'],
    [''],
    ['Save this file and upload it back on the Questions page when done.'],
    ['You only need to fill in the rows you want to change - blank rows are skipped.'],
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');
  XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Questions');
  XLSX.writeFile(workbook, filename);
}

export async function parseQuestionWorkbook(file: File): Promise<QuestionRowInput[]> {
  const XLSX = await import('xlsx');

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames.includes('Questions') ? 'Questions' : workbook.SheetNames[0];
  const sheet = sheetName ? workbook.Sheets[sheetName] : undefined;
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  return rows
    .map((row, index) => ({
      rowNumber: index + 2, // +1 for zero-index, +1 for the header row
      id: row.id,
      round: row.round,
      text: row.text,
      choiceA: row.choiceA,
      choiceB: row.choiceB,
      choiceC: row.choiceC,
      choiceD: row.choiceD,
      correctAnswer: row.correctAnswer,
    }))
    .filter(row => row.id !== undefined && row.id !== '');
}
