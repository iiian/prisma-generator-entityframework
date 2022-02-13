import { getSampleDMMF } from './__fixtures__/getSampleDMMF';
import { generateDbContext, GenerateDbContextParams } from '../helpers/generateDbContext';

describe('generateDbContext', () => {
  it('should generate the source text for a client', async () => {
    const sampleDMMF = await getSampleDMMF();
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