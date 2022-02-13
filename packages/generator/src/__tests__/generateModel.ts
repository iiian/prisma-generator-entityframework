import { generateModel } from '../helpers/generateModel';
import { getSampleDMMF } from './__fixtures__/getSampleDMMF';

describe('generateModel', () => {
  it('should generate the source text for a model', async () => {
    const sampleDMMF = await getSampleDMMF();
    const models = sampleDMMF.datamodel.models.map(model => {
      const args = {
        clientClassName: 'Data',
        namespace: 'ProcessingFramework',
        model
      };
      return generateModel(args);
    });
    expect(models).toMatchSnapshot();
  });
});