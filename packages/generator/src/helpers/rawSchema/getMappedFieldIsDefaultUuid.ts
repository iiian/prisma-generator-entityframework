import { getMappedFieldLine } from './getMappedFieldLine';

export function getMappedFieldIsDefaultUuid(field_name: string, model_name: string, raw_schema_lines: string[]): boolean {
  const line = getMappedFieldLine(field_name, model_name, raw_schema_lines);

  // note! this does not support @db.VarChar(x), for example. Will need to augment it to retrieve those kinds
  return /\@default\(uuid\(\)\)/.test(line);
}
