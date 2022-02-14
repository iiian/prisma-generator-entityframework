import { getDMMF, getSchemaSync } from '@prisma/sdk';
import path from 'path';

const sample_prisma_schema_path = path.join(__dirname, './sample.prisma');
const sample_prisma_schema = getSchemaSync(sample_prisma_schema_path);

export const getSampleDMMF = async () => {
  return {
    dmmf: await getDMMF({
      datamodel: sample_prisma_schema,
    }),
    sample_prisma_schema_path
  };
};
