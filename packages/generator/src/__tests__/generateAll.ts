import { generateAll } from '../helpers/generateAll';
import { getSampleDMMF } from './__fixtures__/getSampleDMMF';

describe('generateAll', () => {
  it('should invoke generateModel for each model', async () => {
    const sampleDMMF = await getSampleDMMF();

    expect(generateAll({
      clientClassName: 'ExampleClient',
      namespace: 'ProcessingFramework',
      dbHost: 'Npgsql',
      connectionString: 'Host=my_postgres_host.com;Database=initial_db;Username=user;Password=password;',
      datamodel: sampleDMMF.datamodel,
    })).toMatchSnapshot();
  });
});
