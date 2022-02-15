import { DMMF } from '@prisma/generator-helper';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';

export type GenerateDbContextParams = {
  clientClassName: string;
  namespace: string;
  connectionString: string;
  dbHost: string;
  models: DMMF.Model[];
};

Handlebars.registerHelper('onConfiguringBody', (params: GenerateDbContextParams) => {
  if (params.dbHost.toLowerCase() !== 'mysql') {
    return `optionsBuilder.Use${params.dbHost}(@"${params.connectionString}");`;
  }
  return `var connection_string = @"${params.connectionString}";
        optionsBuilder.Use${params.dbHost}(connection_string, ServerVersion.AutoDetect(connection_string));`;
});

export function generateDbContext(params: GenerateDbContextParams) {
  const template_text = readFileSync(join(__dirname, '..', 'templates', 'DbContext.cs.hbs')).toString();
  const template = Handlebars.compile(template_text);
  return template(params);
}