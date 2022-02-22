import { getMappedFieldLine } from './getMappedFieldLine';

export function getMappedFieldName(field_name: string, model_name: string, raw_schema_lines: string[]) {
  const line = getMappedFieldLine(field_name, model_name, raw_schema_lines);

  // extract the @map("field") annotation, or default to the field_name
  const db_field_name = /\@map\(\"(?<db_field_name>.*)\"\)/.exec(line)?.groups?.db_field_name ?? null;

  return db_field_name;
}
