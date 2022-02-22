export function getMappedFieldLine(field_name: string, model_name: string, raw_schema_lines: string[]) {
  // required in order to differentiate fields w/ the same name on different models, which _could_ in theory be mapped to different
  // field names on the db side.
  const model_line_start = raw_schema_lines.findIndex(line => line.includes(`model ${model_name}`));

  // get the first line on the model that matches the field
  const line = raw_schema_lines.find((line, index) => new RegExp(`^\\s*${field_name}.*$`).test(line) && index > model_line_start)!;

  return line;
}
