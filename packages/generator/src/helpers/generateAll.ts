
import { DataSource, DMMF } from '@prisma/generator-helper';
import { SupportedConnector as SupportedConnector } from 'src/types';
import { generateDbContext } from './generateDbContext';
import { generateModel } from './generateModel';

export type GenerationResult = {
  name: string;
  text: string;
};

export type GenerateAllResult = {
  client: GenerationResult;
  models: Array<GenerationResult>;
};

export type GenerateAllParams = {
  namespace: string;
  clientClassName: string;
  connectionString: string;
  dbHost: string;
  connector: SupportedConnector;
  datamodel: DMMF.Datamodel;
  schema_file_path: string;
};

export function generateAll(params: GenerateAllParams): GenerateAllResult {
  const client = {
    name: `${params.clientClassName}.cs`,
    text: generateDbContext({
      ...params,
      models: params.datamodel.models
    })
  };

  const models = params.datamodel.models.map(model => ({
    name: `${model.name}.cs`,
    text: generateModel({
      namespace: params.namespace,
      schema_file_path: params.schema_file_path,
      connector: params.connector,
      model,
    })
  }));

  return { client, models };
};