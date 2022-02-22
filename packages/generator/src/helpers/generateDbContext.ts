import { DMMF } from '@prisma/generator-helper';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';
import { SupportedConnector } from '../types';
import { modelNeedsManualUuidGeneration } from './rawSchema/modelNeedsManualUuidGeneration';

export type GenerateDbContextParams = {
  clientClassName: string;
  namespace: string;
  connectionString: string;
  dbHost: string;
  connector: SupportedConnector;
  models: DMMF.Model[];
  schema_file_path: string;
};

Handlebars.registerHelper('onConfiguringBody', (params: GenerateDbContextParams) => {
  if (params.dbHost.toLowerCase() !== 'mysql') {
    return `optionsBuilder.Use${params.dbHost}(@"${params.connectionString}");`;
  }
  return `var connection_string = @"${params.connectionString}";
        optionsBuilder.Use${params.dbHost}(connection_string, ServerVersion.AutoDetect(connection_string));`;
});

Handlebars.registerHelper('dbContextNeedsUUIDGenerator', (connector: SupportedConnector, models: DMMF.Model[], raw_schema_lines: string[]): boolean => {
  return models.some(model => modelNeedsManualUuidGeneration(connector, model, raw_schema_lines));
});

Handlebars.registerHelper('getOnModelCreatingMethod', (params: GenerateDbContextParams & { raw_schema_lines: string[]; }) => {
  const primary_key_entities = params.models
    .filter(model => model.primaryKey?.fields)
    .map(model => ({ model, fields: model.primaryKey!.fields }));

  const manual_uuid_entities = params.models
    .filter(model => !!model.fields.find(f => f.isId))
    .map(model => {
      const is_manual = modelNeedsManualUuidGeneration(params.connector, model, params.raw_schema_lines);

      return { entity: model, is_manual, id_name: model.fields.find(f => f.isId)?.name };
    });

  if (!primary_key_entities.length && !manual_uuid_entities.length) {
    return '';
  }

  return `
    protected override void OnModelCreating(ModelBuilder modelBuilder) {
      ${primary_key_entities.map(entity => `modelBuilder.Entity<${entity.model.name}>()
        .HasKey(e => new { ${entity.fields.map(field => `e.${field}`).join(', ')} });`)}
      ${manual_uuid_entities.map(({ entity, id_name, is_manual }) => `modelBuilder.Entity<${entity.name}>()
        .Property(e => e.${id_name})
        .${is_manual ? 'HasValueGenerator<StringUUIDGenerator>()' : 'ValueGeneratedOnAdd()'};`).join('\n      ')}
    }
`;
});

export function generateDbContext(params: GenerateDbContextParams) {
  const template_text = readFileSync(join(__dirname, '..', 'templates', 'DbContext.cs.hbs')).toString();
  const template = Handlebars.compile(template_text);
  const raw_schema_lines = readFileSync(params.schema_file_path).toString().split(/[\r]?\n/).filter(Boolean);
  return template({ ...params, raw_schema_lines });
}

