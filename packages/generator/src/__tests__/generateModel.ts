import { generateModel, GenerateModelParams } from '../helpers/generateModel';
import { getSampleDMMF } from './__fixtures__/getSampleDMMF';

describe('generateModel', () => {
  it('should generate the source text for a model', async () => {
    const { dmmf: sampleDMMF, sample_prisma_schema_path } = await getSampleDMMF();
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
    const shouldContainAnnotation =
      post_model!.search(/\[Column\(\"creator_id\"\)\]\s+public int creatorId \{ get\; set\; \}/);
    expect(shouldContainAnnotation).not.toBe(-1);
  });
}); 