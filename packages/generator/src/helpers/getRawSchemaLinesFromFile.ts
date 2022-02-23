import { readFileSync } from 'fs';

export function getRawSchemaLinesFromFile(schema_file_path: string) {
  return readFileSync(schema_file_path).toString().split(/[\r]?\n/).filter(Boolean);
}
