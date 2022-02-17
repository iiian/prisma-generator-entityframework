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
    const shouldContainAnnotation =
      post_model!.search(/\[Column\(\"creator_id\"\)\]\s+public int creatorId \{ get\; set\; \}/);
    expect(shouldContainAnnotation).not.toBe(-1);
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
    expect(model!.search(/\[Table\(\"NoAtAtMapAttribute\"\)\]\s+public class NoAtAtMapAttribute/)).not.toBe(-1);
  });

  describe('given a model with a multi-field primary key', () => {
    it('should generate a multi-field primary key', async () => {
      const { dmmf: sampleDMMF, sample_prisma_schema_path } = await getTestDMMF('multi-field-primary-key');
      const [model] = sampleDMMF.datamodel.models.map(model => {
        const args: GenerateModelParams = {
          namespace: 'Foo',
          schema_file_path: sample_prisma_schema_path,
          model
        };
        return generateModel(args);
      });
      expect(model).toMatchSnapshot();
      expect(model!.search(/\[Required\]\s+\[Key, Column\(Order\=0\)\]\s+public\s+string\s+key1/)).not.toBe(-1);
      expect(model!.search(/\[Required\]\s+\[Key, Column\(Order\=1\)\]\s+public\s+string\s+key2/)).not.toBe(-1);
    });
  });
}); 