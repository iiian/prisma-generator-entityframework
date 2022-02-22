import { getMappedFieldLine } from './getMappedFieldLine';

export function getMappedFieldNameDbParams(field_name: string, model_name: string, raw_schema_lines: string[]): string[] {
  const line = getMappedFieldLine(field_name, model_name, raw_schema_lines);

  // note! this does not support @db.VarChar(x), for example. Will need to augment it to retrieve those kinds
  return [...line.matchAll(/@db\.(?<key>\w+)/g)].map(e => e!.groups!.key).filter(Boolean);
}
