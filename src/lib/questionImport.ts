import type { Question } from '../types';
import type { QuestionRowInput } from './questionValidation';

const COLUMNS = ['id', 'round', 'type', 'text', 'choiceA', 'choiceB', 'choiceC', 'choiceD', 'correctAnswer', 'mediaType', 'mediaUrl', 'mediaAltText', 'mediaCaptionsUrl'] as const;

export async function downloadQuestionTemplate(questions: readonly Question[], filename = 'questions-template.xlsx'): Promise<void> {
  const XLSX = await import('xlsx');

  const rows = questions.map(question => ({
    id: question.id,
    round: question.round === 'suddenDeath' ? 'Sudden Death' : question.round,
    type: question.type === 'multi_select' ? 'Multi-select' : question.type === 'free_text' ? 'Free text' : 'Multiple choice',
    text: '',
    choiceA: '',
    choiceB: '',
    choiceC: '',
    choiceD: '',
    correctAnswer: '',
    mediaType: '',
    mediaUrl: '',
    mediaAltText: '',
    mediaCaptionsUrl: '',
  }));

  const questionsSheet = XLSX.utils.json_to_sheet(rows, { header: [...COLUMNS] });
  const instructionsSheet = XLSX.utils.aoa_to_sheet([
    ['How to fill in this template'],
    [''],
    ['id, round, and type are fixed per question - do not change them (type is shown for reference only and is ignored on upload).'],
    ['text: the question text, 140 characters or fewer.'],
    ['choiceA, choiceB, choiceC, choiceD: the four answer choices (Multiple choice and Multi-select questions only - leave blank for Free text).'],
    ['correctAnswer: for Multiple choice questions, enter a single letter A, B, C, or D.'],
    ['correctAnswer: for Multi-select questions, enter every correct letter separated by commas, e.g. A,C.'],
    ['correctAnswer: for Free text questions, enter every accepted answer separated by semicolons, e.g. Paris;City of Light.'],
    ['mediaType and mediaUrl are optional: set mediaType to image or video and mediaUrl to its hosted URL to attach a clue.'],
    ['mediaAltText is required whenever mediaType/mediaUrl are set: describe the image/video for players using a screen reader.'],
    ['mediaCaptionsUrl is optional: a hosted .vtt captions file URL for video clues, for deaf/hard-of-hearing players in the room.'],
    ['Leave mediaType, mediaUrl, mediaAltText, and mediaCaptionsUrl all blank to remove any existing media on a question you are editing.'],
    [''],
    ['Save this file and upload it back on the Questions page when done.'],
    ['You only need to fill in the rows you want to change - rows with no text/choices/answer filled in are skipped.'],
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
  if (!sheet || !sheet['!ref']) return [];

  const range = XLSX.utils.decode_range(sheet['!ref']);
  const headerRowIndex = range.s.r;
  const headers: string[] = [];
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cell = sheet[XLSX.utils.encode_cell({ r: headerRowIndex, c: col })];
    headers.push(cell ? String(cell.v).trim() : '');
  }

  const rows: QuestionRowInput[] = [];
  for (let r = headerRowIndex + 1; r <= range.e.r; r++) {
    const record: Record<string, unknown> = {};
    let hasAnyCell = false;
    for (let col = range.s.c; col <= range.e.c; col++) {
      const header = headers[col - range.s.c];
      if (!header) continue;
      const cell = sheet[XLSX.utils.encode_cell({ r, c: col })];
      if (cell !== undefined) hasAnyCell = true;
      record[header] = cell ? cell.v : undefined;
    }
    // A row with no cells at all isn't in the file (e.g. a fully cleared or deleted row) - skip
    // it without counting it as a physical row, so later rows keep their true spreadsheet row number.
    if (!hasAnyCell) continue;

    rows.push({
      // +1 converts the 0-indexed sheet row to the 1-indexed row number a host sees in Excel.
      rowNumber: r + 1,
      id: record.id,
      round: record.round,
      text: record.text,
      choiceA: record.choiceA,
      choiceB: record.choiceB,
      choiceC: record.choiceC,
      choiceD: record.choiceD,
      correctAnswer: record.correctAnswer,
      mediaType: record.mediaType,
      mediaUrl: record.mediaUrl,
      mediaAltText: record.mediaAltText,
      mediaCaptionsUrl: record.mediaCaptionsUrl,
    });
  }

  // Rows that only have id/round filled in (the untouched template default) are "not being
  // changed" and should be skipped, not treated as incomplete submissions.
  return rows.filter(hasEditableContent);
}

function hasEditableContent(row: QuestionRowInput): boolean {
  return [row.text, row.choiceA, row.choiceB, row.choiceC, row.choiceD, row.correctAnswer, row.mediaType, row.mediaUrl, row.mediaAltText, row.mediaCaptionsUrl].some(
    value => typeof value === 'string' && value.trim() !== '',
  );
}
