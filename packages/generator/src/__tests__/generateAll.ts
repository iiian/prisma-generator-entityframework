import { generateAll } from '../helpers/generateAll';
import { getTestDMMF } from './__fixtures__/getTestDMMF';

describe('generateAll', () => {
  it('should invoke generateModel for each model', async () => {
    const { dmmf: sampleDMMF, sample_prisma_schema_path } = await getTestDMMF();

    expect(generateAll({
      clientClassName: 'ExampleClient',
      namespace: 'ProcessingFramework',
      dbHost: 'Npgsql',
      schema_file_path: sample_prisma_schema_path,
      connectionString: 'Host=my_postgres_host.com;Database=initial_db;Username=user;Password=password;',
      datamodel: sampleDMMF.datamodel,
    })).toMatchSnapshot();
  });
});
