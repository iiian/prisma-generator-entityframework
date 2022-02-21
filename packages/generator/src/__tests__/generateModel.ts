import { generateModel, GenerateModelParams } from '../helpers/generateModel';
import { getTestDMMF } from './__fixtures__/getTestDMMF';

describe('generateModel', () => {
  it('should generate the source text for a model', async () => {
    const { dmmf: sampleDMMF, sample_prisma_schema_path } = await getTestDMMF();
    const models = sampleDMMF.datamodel.models.map(model => {
      const args: GenerateModelParams = {
        namespace: 'ProcessingFramework',
        schema_file_path: sample_prisma_schema_path,
        model
      };
      return generateModel(args);
    });
    expect(models).toMatchSnapshot();
    const post_model = models.find(model => model.includes("public class Post"));
  });

  it('should generate Table names based on the @@map attribute or simply based on the model', async () => {
    const { dmmf: sampleDMMF, sample_prisma_schema_path } = await getTestDMMF('no-map-attribute');
    const [model] = sampleDMMF.datamodel.models.map(model => {
      const args: GenerateModelParams = {
        namespace: 'Foo',
        schema_file_path: sample_prisma_schema_path,
        model
      };
      return generateModel(args);
    });
    expect(model).toMatchSnapshot();
  });
}); 