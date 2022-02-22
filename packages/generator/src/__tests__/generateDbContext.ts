import { getTestDMMF } from './__fixtures__/getTestDMMF';
import { generateDbContext, GenerateDbContextParams } from '../helpers/generateDbContext';

describe('generateDbContext', () => {
  it('should generate the source text for a client', async () => {
    const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF();
    const args: GenerateDbContextParams = {
      clientClassName: 'Data',
      connectionString: '<CONNECTION-STRING-GOES-HERE>',
      dbHost: 'REGISTERED_DB_HOST_GOES_HERE',
      connector: 'postgresql',
      namespace: 'Namespace',
      models: sampleDMMF.datamodel.models,
      schema_file_path
    };
    expect(generateDbContext(args)).toMatchSnapshot();
  });

  describe('given a mysql db', () => {
    it('should generate the source text for a mysqlclient', async () => {
      const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF();
      const args: GenerateDbContextParams = {
        clientClassName: 'Data',
        connectionString: '<CONNECTION-STRING-GOES-HERE>',
        dbHost: 'MySql',
        connector: 'mysql',
        namespace: 'Namespace',
        models: sampleDMMF.datamodel.models,
        schema_file_path
      };
      expect(generateDbContext(args)).toMatchSnapshot();
    });
  });

  describe('given a model with a multi-field primary key', () => {
    it('should generate an OnModelCreatingMethod that configures the relevant primary key entity relation', async () => {
      const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('multi-field-primary-key');
      const args: GenerateDbContextParams = {
        clientClassName: 'foo',
        connectionString: 'bar',
        dbHost: 'Sqlite',
        connector: 'sqlite',
        namespace: 'baz',
        models: sampleDMMF.datamodel.models,
        schema_file_path
      };
      expect(generateDbContext(args)).toMatchSnapshot();
    });
  });

  describe('given a postgres db', () => {
    let args: GenerateDbContextParams;
    let db_context_text: string;
    describe('given a `String @id` key with a `@default(uuid())` annotation', () => {
      describe('_without_ the @db.Uuid annotation', () => {
        beforeEach(async () => {
          const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('postgres-text-uuid-type');
          args = {
            clientClassName: 'foo',
            connectionString: 'bar',
            dbHost: 'Npgsql',
            connector: 'postgresql',
            namespace: 'baz',
            models: sampleDMMF.datamodel.models,
            schema_file_path
          };
          db_context_text = generateDbContext(args);
        });
        it('should create a manual StringUUIDGenerator extending ValueGenerator', () => {
          expect(db_context_text).toMatchSnapshot();
          expect(db_context_text).toMatch(/public class StringUUIDGenerator\: ValueGenerator/);
        });
        it('should utilize a manual StringUUIDGenerator', () => {
          expect(db_context_text).toMatch(/modelBuilder\.Entity\<PostgresTextUuidType\>\(\)\s+\.Property\(e \=\> e.id\)\s+\.HasValueGenerator\<StringUUIDGenerator\>\(\);/);
        });
      });
      it('should configure the key as being a database-generate uuid', async () => {
        const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('postgres-db-uuid-type');
        args = {
          clientClassName: 'foo',
          connectionString: 'bar',
          dbHost: 'Npgsql',
          connector: 'postgresql',
          namespace: 'baz',
          models: sampleDMMF.datamodel.models,
          schema_file_path
        };
        expect(generateDbContext(args)).toMatch(/modelBuilder\.Entity\<PostgresDbUuidType\>\(\)\s+\.Property\(e \=\> e.id\)\s+\.ValueGeneratedOnAdd\(\);/);
      });
    });
  });

  describe('given a sqlserver db', () => {
    let args: GenerateDbContextParams;
    let db_context_text: string;
    describe('given a `String @id` key with a `@default(uuid())` annotation', () => {
      describe('_without_ the @db.UniqueIdentifier annotation', () => {
        beforeEach(async () => {
          const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('sqlserver-text-uuid-type');
          args = {
            clientClassName: 'foo',
            connectionString: 'bar',
            dbHost: 'SqlServer',
            connector: 'sqlserver',
            namespace: 'baz',
            models: sampleDMMF.datamodel.models,
            schema_file_path
          };
          db_context_text = generateDbContext(args);
        });
        it('should create a manual StringUUIDGenerator extending ValueGenerator', () => {
          expect(db_context_text).toMatchSnapshot();
          expect(db_context_text).toMatch(/public class StringUUIDGenerator\: ValueGenerator/);
        });
        it('should utilize a manual StringUUIDGenerator', () => {
          expect(generateDbContext(args)).toMatch(/modelBuilder\.Entity\<SqlServerTextUuidType\>\(\)\s+\.Property\(e \=\> e.id\)\s+\.HasValueGenerator\<StringUUIDGenerator\>\(\);/);
        });
      });
      it('should configure the key as being a database-generate uuid', async () => {
        const { dmmf: sampleDMMF, schema_file_path } = await getTestDMMF('sqlserver-db-uuid-type');
        args = {
          clientClassName: 'foo',
          connectionString: 'bar',
          dbHost: 'SqlServer',
          connector: 'sqlserver',
          namespace: 'baz',
          models: sampleDMMF.datamodel.models,
          schema_file_path
        };
        const db_context_text = generateDbContext(args);
        expect(db_context_text).toMatch(/modelBuilder\.Entity\<SqlServerDbUuidType\>\(\)\s+\.Property\(e \=\> e.id\)\s+\.ValueGeneratedOnAdd\(\);/);
        expect(db_context_text).toMatchSnapshot();
      });
    });
  });
});

