import { getTestDMMF } from './__fixtures__/getTestDMMF';
import { generateDbContext, GenerateDbContextParams } from '../helpers/generateDbContext';

describe('generateDbContext', () => {
  it('should generate the source text for a client', async () => {
    const { dmmf: sampleDMMF } = await getTestDMMF();
    const args: GenerateDbContextParams = {
      clientClassName: 'Data',
      connectionString: '<CONNECTION-STRING-GOES-HERE>',
      dbHost: 'REGISTERED_DB_HOST_GOES_HERE',
      namespace: 'ProcessingFramework',
      models: sampleDMMF.datamodel.models
    };
    expect(generateDbContext(args)).toMatchSnapshot();
  });
});

