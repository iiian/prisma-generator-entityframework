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

Handlebars.registerHelper('getOnModelCreatingMethod', (params: GenerateDbContextParams) => {
  const primary_key_entities = params.models
    .filter(model => model.primaryKey?.fields)
    .map(model => ({ model, fields: model.primaryKey!.fields }));

  if (!primary_key_entities.length) {
    return '';
  }

  return `
    protected override void OnModelCreating(ModelBuilder modelBuilder) {
      ${primary_key_entities.map(entity => `modelBuilder.Entity<${entity.model.name}>()
        .HasKey(e => new { ${entity.fields.map(field => `e.${field}`).join(', ')} });`)}
    }
`;
});

export function generateDbContext(params: GenerateDbContextParams) {
  const template_text = readFileSync(join(__dirname, '..', 'templates', 'DbContext.cs.hbs')).toString();
  const template = Handlebars.compile(template_text);
  return template(params);
}