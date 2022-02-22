import { getDMMF, getSchemaSync } from '@prisma/sdk';
import path from 'path';


export const getTestDMMF = async (id: string = 'sample') => {
  const schema_file_path = path.join(__dirname, `./${id}.prisma`);
  const sample_prisma_schema = getSchemaSync(schema_file_path);
  return {
    dmmf: await getDMMF({
      datamodel: sample_prisma_schema,
    }),
    schema_file_path
  };
};
