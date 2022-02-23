import { DMMF } from '@prisma/generator-helper';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';
import { SupportedConnector } from 'src/types';
import { AbstractTypeMapper } from './connnector-specs/AbstractTypeMapper';
import { TypeMapperFactory } from './connnector-specs/TypeMapperFactory';
import { getRawSchemaLinesFromFile } from './getRawSchemaLinesFromFile';
import { isPrimaryKey } from './isPrimaryKey';
import { getMappedFieldName } from './rawSchema/getMappedFieldName';

export type GenerateModelParams = {
  namespace: string;
  model: DMMF.Model;
  connector: SupportedConnector;
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

Handlebars.registerHelper('getDbName', (model: DMMF.Model) => {
  return model.dbName ?? model.name;
});

Handlebars.registerHelper('getCSType', (connector: SupportedConnector, field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]) => {
  return TypeMapperFactory.create(connector).getCSType(field, model, raw_schema_lines);
});

Handlebars.registerHelper('getColumnAnnotation', (connector: SupportedConnector, field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]) => {
  const field_name = getMappedFieldName(field.name, model.name, raw_schema_lines);
  const key = isPrimaryKey(field, model) && 'Key';
  const required = field.isRequired && 'Required';
  const typeClarificationParam = TypeMapperFactory.create(connector).getTypeNameColumnAnnotation(field, model, raw_schema_lines);
  const column_parameter_list = [
    (field_name && `"${field_name}"` || ''),
    (typeClarificationParam && `TypeName="${typeClarificationParam}"`)
  ].filter(Boolean);
  const w_parens = column_parameter_list.length
    ? `(${column_parameter_list.join(', ')})`
    : ''
    ;
  const column = `Column${w_parens}`;

  return `[${[key, required, column].filter(Boolean).join(', ')}]`;
});

export function generateModel({ model, namespace, schema_file_path, connector }: GenerateModelParams): string {
  const template_text = readFileSync(join(__dirname, '..', 'templates', 'Model.cs.hbs')).toString();
  const template = Handlebars.compile(template_text);
  const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
  return template({ namespace, model, raw_schema_lines, connector });
}
