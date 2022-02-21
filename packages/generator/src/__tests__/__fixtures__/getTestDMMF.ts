import { getDMMF, getSchemaSync } from '@prisma/sdk';
import path from 'path';


export const getTestDMMF = async (id: string = 'sample') => {
  const sample_prisma_schema_path = path.join(__dirname, `./${id}.prisma`);
  const sample_prisma_schema = getSchemaSync(sample_prisma_schema_path);
  return {
    dmmf: await getDMMF({
      datamodel: sample_prisma_schema,
    }),
    sample_prisma_schema_path
  };
};
