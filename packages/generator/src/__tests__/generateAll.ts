import { generateAll } from '../helpers/generateAll';
import { getTestDMMF } from './__fixtures__/getTestDMMF';

describe('generateAll', () => {
  it('should invoke generateModel for each model', async () => {
    const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF();

    expect(generateAll({
      clientClassName: 'ExampleClient',
      namespace: 'ProcessingFramework',
      dbHost: 'Npgsql',
      connector: 'postgresql',
      schema_file_path,
      connectionString: 'Host=my_postgres_host.com;Database=initial_db;Username=user;Password=password;',
      datamodel: sampleDMMF.datamodel,
    })).toMatchSnapshot();
  });
});
