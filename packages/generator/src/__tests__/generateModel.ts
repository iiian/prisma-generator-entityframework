import { generateModel, GenerateModelParams } from '../helpers/generateModel';
import { getTestDMMF } from './__fixtures__/getTestDMMF';

describe('generateModel', () => {
  it('should generate the source text for a model', async () => {
    const { dmmf: sampleDMMF, schema_file_path: sample_prisma_schema_path } = await getTestDMMF();
    const models = sampleDMMF.datamodel.models.map(model => {
      const args: GenerateModelParams = {
        namespace: 'ProcessingFramework',
        schema_file_path: sample_prisma_schema_path,
        connector: 'postgresql',
        model
      };
      return generateModel(args);
    });
    expect(models).toMatchSnapshot();
    const post_model = models.find(model => model.includes("public class Post"));
  });

  it('should generate Table names based on the @@map attribute or simply based on the model', async () => {
    const { dmmf: sampleDMMF, schema_file_path: sample_prisma_schema_path } = await getTestDMMF('no-map-attribute');
    const [model] = sampleDMMF.datamodel.models.map(model => {
      const args: GenerateModelParams = {
        namespace: 'Foo',
        schema_file_path: sample_prisma_schema_path,
        connector: 'postgresql',
        model
      };
      return generateModel(args);
    });
    expect(model).toMatchSnapshot();
  });


  describe('given a string type for a primary key', () => {
    describe('given a postgres connector', () => {
      describe('given an @id @db.Uuid primary key', () => {
        it('should generate a model with `Guid` for the primary key', async () => {
          const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('postgres-db-uuid-type');
          const [model] = sampleDMMF.datamodel.models.map(model => {
            const args: GenerateModelParams = {
              namespace: 'Foo',
              schema_file_path,
              connector: 'postgresql',
              model
            };
            return generateModel(args);
          });
          expect(model).toMatchSnapshot();
          expect(model).toMatch(/public Guid id \{ get\; set\; \}/);
        });
      });
    });
    describe('given a sqlserver connector', () => {
      describe('given an @id @db.UniqueIdentifier primary key', () => {
        it('should generate a model with `Guid` for the primary key', async () => {
          const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('sqlserver-db-uuid-type');
          const [model] = sampleDMMF.datamodel.models.map(model => {
            const args: GenerateModelParams = {
              namespace: 'Foo',
              schema_file_path,
              connector: 'sqlserver',
              model
            };
            return generateModel(args);
          });
          expect(model).toMatchSnapshot();
          expect(model).toMatch(/public Guid id \{ get\; set\; \}/);
        });
      });
    });
    describe('otherwise', () => {
      it('should have a string primary key', async () => {
        const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('sqlite-uuid-primary-key');
        const [model] = sampleDMMF.datamodel.models.map(model => {
          const args: GenerateModelParams = {
            namespace: 'Foo',
            schema_file_path,
            connector: 'sqlite',
            model
          };
          return generateModel(args);
        });
        expect(model).toMatchSnapshot();
        expect(model).toMatch(/public string id \{ get\; set\; \}/);
      });
      it('should have a string primary key', async () => {
        const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('sqlserver-text-uuid-type');
        const [model] = sampleDMMF.datamodel.models.map(model => {
          const args: GenerateModelParams = {
            namespace: 'Foo',
            schema_file_path,
            connector: 'sqlite',
            model
          };
          return generateModel(args);
        });
        expect(model).toMatchSnapshot();
        expect(model).toMatch(/public string id \{ get\; set\; \}/);
      });
      it('should have a string primary key', async () => {
        const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('postgres-text-uuid-type');
        const [model] = sampleDMMF.datamodel.models.map(model => {
          const args: GenerateModelParams = {
            namespace: 'Foo',
            schema_file_path,
            connector: 'sqlite',
            model
          };
          return generateModel(args);
        });
        expect(model).toMatchSnapshot();
        expect(model).toMatch(/public string id \{ get\; set\; \}/);
      });
    });
  });
}); 