import { getMappedFieldLine } from './getMappedFieldLine';

export function getDbFieldNameAnnotation(field_name: string, model_name: string, raw_schema_lines: string[]): [string | null, string | null] {
  const line = getMappedFieldLine(field_name, model_name, raw_schema_lines);

  return extractDbFieldNameAnnotation(line);
}

export function extractDbFieldNameAnnotation(line: string): [string | null, string | null] {
  const db_annotation_start = line.indexOf('@db.');
  if (db_annotation_start < 0) {
    return [null, null,];
  }
  let end_index = db_annotation_start + 4;
  let paren_balance = 0;
  let paren_split_idx = -1;
  while (end_index < line.length && (paren_balance || !/\s/.test(line[end_index]))) {
    if (line[end_index] === '(') {
      paren_balance++;
      if (paren_split_idx < 0) {
        paren_split_idx = end_index;
      }
    } else if (line[end_index] === ')') {
      paren_balance--;
    }
    end_index++;
  }
  if (paren_split_idx < 0) {
    return [line.slice(db_annotation_start + 4, end_index), null];
  }

  const id = line.slice(db_annotation_start + 4, paren_split_idx);
  const args = line.slice(paren_split_idx + 1, end_index - 1);
  return [id, args];
}
