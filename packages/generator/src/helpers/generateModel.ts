import { DMMF } from '@prisma/generator-helper';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';

export type GenerateModelParams = {
  namespace: string;
  model: DMMF.Model;
  schema_file_path: string;
};

Handlebars.registerHelper('isForeignKey', (field: DMMF.Field, fields: DMMF.Field[], options) => {
  if (fields.some(some => some.relationFromFields?.[0] === field.name)) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('getForeignKey', (field: DMMF.Field, fields: DMMF.Field[]) => {
  return fields.find(some => some.relationFromFields?.[0] === field.name)!.name;
});

Handlebars.registerHelper('isTruthy', function (value) {
  return value !== undefined && value !== null;
});

Handlebars.registerHelper('getDbField', function (field_name: string, model_name: string, raw_schema_lines: string[]) {
  // required in order to differentiate fields w/ the same name on different models, which _could_ in theory be mapped to different
  // field names on the db side.
  const model_line_start = raw_schema_lines.findIndex(line => line.includes(`model ${model_name}`));

  // get the first line on the model that matches the field
  const line = raw_schema_lines.find((line, index) => new RegExp(`^\\s*${field_name}.*$`).test(line) && index > model_line_start)!;

  // extract the @map("field") annotation, or default to the field_name
  const db_field_name = /\@map\(\"(?<db_field_name>.*)\"\)/.exec(line)?.groups?.db_field_name ?? field_name;

  return db_field_name;
});

Handlebars.registerHelper('getDbName', (model: DMMF.Model) => {
  return model.dbName ?? model.name;
});

Handlebars.registerHelper('getCSType', (field: DMMF.Field) => {
  let type: string;
  switch (field.type) {
    case 'Int': type = 'int'; break;
    case 'BigInt': type = 'long'; break;
    case 'Boolean': type = 'bool'; break;
    case 'Decimal':
    case 'Float': type = 'float'; break;
    case 'String': type = ' string'; break;
    default: type = field.type as string; break;
  }
  if (field.isList) {
    type = `ICollection<${type}>`;
  }
  return type;
});

export function generateModel({ model, namespace, schema_file_path }: GenerateModelParams): string {
  const template_text = readFileSync(join(__dirname, '..', 'templates', 'Model.cs.hbs')).toString();
  const template = Handlebars.compile(template_text);
  const raw_schema_lines = readFileSync(schema_file_path).toString().split(/[\r]?\n/).filter(Boolean);
  return template({ namespace, model, raw_schema_lines });
}