import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import path from 'path';
import { ERR_CANNOT_SUPPORT_MONGODB, GENERATOR_NAME } from './constants';
import { getConnectionString } from './helpers/getConnectionString';
import { generateAll } from './helpers/generateAll';
import { writeFileSafely } from './utils/writeFileSafely';
import assert from 'assert';
import { getDbHost } from './helpers/getDbHost';

const { version } = require('../package.json');

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}@${version}:Registered`);
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

    const connector = options.datasources?.[0].provider;
    assert(connector !== 'mongodb', ERR_CANNOT_SUPPORT_MONGODB);
    const artifacts = generateAll({
      clientClassName,
      namespace,
      connectionString: getConnectionString(options.datasources?.[0]),
      connector,
      dbHost: getDbHost(connector),
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

