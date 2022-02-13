import { DMMF } from '@prisma/generator-helper';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import { join } from 'path';

export type GenerateDbContextParams = {
  clientClassName: string;
  namespace: string;
  connectionString: string;
  dbHost: string;
  models: DMMF.Model[];
};

export function generateDbContext(params: GenerateDbContextParams) {
  const template_text = readFileSync(join(__dirname, '..', 'templates', 'DbContext.cs.hbs')).toString();
  const template = compile(template_text);
  return template(params);
}