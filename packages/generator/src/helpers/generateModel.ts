import { DMMF } from '@prisma/generator-helper';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';

export type GenerateModelParams = {
  namespace: string;
  model: DMMF.Model;
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

Handlebars.registerHelper('getCSType', (field: DMMF.Field) => {
  switch (field.type) {
    case 'Int': return 'int';
    case 'BigInt': return 'long';
    case 'Boolean': return 'bool';
    case 'Decimal':
    case 'Float': return 'float';
    case 'String': return ' string';
  }
  return field.type;
});

export function generateModel({ model, namespace }: GenerateModelParams): string {
  const template_text = readFileSync(join(__dirname, '..', 'templates', 'Model.cs.hbs')).toString();
  const template = Handlebars.compile(template_text);
  return template({ namespace, model });
}