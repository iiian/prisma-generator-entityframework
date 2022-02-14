import { DataSource, generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { generateAll } from './helpers/generateAll';
import { writeFileSafely } from './utils/writeFileSafely';

const { version } = require('../package.json');

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    const namespace = options.generator?.config?.namespace;
    if (!namespace) {
      logger.error('Expected argument `namespace` not specified');
      throw new Error('Expected argument `namespace` not specified');
    }
    const clientClassName = options.generator?.config?.clientClassName;
    if (!clientClassName) {
      logger.error('Expected argument `clientClassName` not specified');
      throw new Error('Expected argument `clientClassName` not specified');
    }

    logger.info(`Running generator`);
    const artifacts = generateAll({
      clientClassName,
      namespace,
      connectionString: getConnectionString(options.datasources?.[0]),
      dbHost: getDbHost(options.datasources?.[0]),
      schema_file_path: options.schemaPath,
      datamodel: options.dmmf.datamodel
    });
    logger.info(`Compiled.`);

    // write client file
    const writeLocation = path.join(
      options.generator.output?.value!,
      `${artifacts.client.name}`,
    );

    writeFileSafely(writeLocation, artifacts.client.text);
    logger.info(`Created ${writeLocation}`);

    // write model files
    for (const { name, text } of artifacts.models) {
      const writeLocation = path.join(
        options.generator.output?.value!,
        `${name}`,
      );

      writeFileSafely(writeLocation, text);
      logger.info(`Created ${writeLocation}`);
    }
  },
});
export function getConnectionString(datasource: DataSource): string {
  if (!datasource) {
    throw new Error('No datasource specified. I need a datasource in order to construct the DbContext. The DbContext will need to setup the connection in the `OnConfiguring` life cycle hook.');
  }
  const conn_str_fmt: RegExp = /\w+:\/\/((?<user>.*)\:(?<password>.*)@)?(?<host>.*)\:(?<port>\d{4,5})(\/(?<initial_db>.*))?/;
  const raw_conn_str = (datasource.url.fromEnvVar) ? process.env[datasource.url.fromEnvVar]! : datasource.url.value;
  const matches = conn_str_fmt.exec(raw_conn_str);
  logger.info(matches);
  if (!matches) {
    throw new Error(`Connection string could not be parsed: ${raw_conn_str}`);
  }
  return `Host=${matches!.groups!.host!};Database=${matches!.groups!.initial_db!};Username=${matches!.groups!.user!};Password=${matches!.groups!.password!}`;
}

export function getDbHost(datasource: DataSource): string {
  if (!datasource) {
    throw new Error('No datasource specified. I need a datasource in order to construct the DbContext. The DbContext will need to setup the connection in the `OnConfiguring` life cycle hook.');
  }

  switch (datasource.provider) {
    case 'sqlserver':
      return 'SqlServer';
    case 'mysql':
      return 'MySql';
    case 'postgres' as any:
    case 'postgresql':
      return 'Npgsql'; // the official microsoft entity framework documentation lists Npgsql as the preferred db provider for postgres
    case 'sqlite':
      return 'Sqlite';
    case 'mongodb':
      throw new Error('Mongodb is not supported by EntityFramework.');
    default:
      throw new Error(`${datasource.provider} is not supported by prisma-generate-entityframework.`);
  }
}

