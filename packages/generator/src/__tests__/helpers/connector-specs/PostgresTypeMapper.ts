import { DMMF } from '@prisma/generator-helper';
import { PostgresTypeMapper } from '../../../helpers/connnector-specs/PostgresTypeMapper';
import { getRawSchemaLinesFromFile } from '../../../helpers/getRawSchemaLinesFromFile';
import { getTestDMMF } from '../../__fixtures__/getTestDMMF';

describe('PostgresTypeMapper', () => {
  let dmmf: DMMF.Document;
  let schema_file_path: string;
  beforeAll(async () => {
    const test = await getTestDMMF('postgres-type-mapper-tests');
    dmmf = test.dmmf;
    schema_file_path = test.schema_file_path;
  });

  describe('getCSType', () => {
    describe('given a scalar field', () => {
      describe('of type String', () => {
        describe('if @db.Inet', () => {
          it('should return IPAddress', () => {
            const model = dmmf.datamodel.models.find(model => model.name === 'STRING__Inet_should_return_IPAddress')!;
            const field = model.fields.find(field => field.name === 'test_field')!;
            const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
            const result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('IPAddress');
          });
        });
        describe('if @db.Xml', () => {
          it('should return String', () => {
            const model = dmmf.datamodel.models.find(model => model.name === 'STRING__Xml_should_return_string')!;
            const field = model.fields.find(field => field.name === 'test_field')!;
            const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
            const result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('string');
          });
        });
        describe('if @db.Uuid', () => {
          it('should return Guid', () => {
            const model = dmmf.datamodel.models.find(model => model.name === 'STRING__Uuid_should_return_Guid')!;
            const field = model.fields.find(field => field.name === 'test_field')!;
            const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
            const result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('Guid');
          });
        });
        describe('if @db.Bit', () => {
          it('should return BitArray', () => {
            let model = dmmf.datamodel.models.find(model => model.name === 'STRING__Bit_should_return_BitArray__1')!;
            let field = model.fields.find(field => field.name === 'test_field')!;
            const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
            let result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('BitArray');

            model = dmmf.datamodel.models.find(model => model.name === 'STRING__Bit_should_return_BitArray__2')!;
            field = model.fields.find(field => field.name === 'test_field')!;
            result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('BitArray');

            model = dmmf.datamodel.models.find(model => model.name === 'STRING__Bit_should_return_BitArray__3')!;
            field = model.fields.find(field => field.name === 'test_field')!;
            result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('BitArray');

            model = dmmf.datamodel.models.find(model => model.name === 'STRING__Bit_should_return_BitArray__4')!;
            field = model.fields.find(field => field.name === 'test_field')!;
            result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('BitArray');
          });
        });
      });
      describe('of type Integer', () => {
        describe('if @db.SmallInt', () => {
          it('should return short', () => {
            const model = dmmf.datamodel.models.find(model => model.name === 'INTEGER__SmallInt_should_return_short')!;
            const field = model.fields.find(field => field.name === 'test_field')!;
            const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
            const result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('short');
          });
        });
        describe('if @db.Oid', () => {
          it('should return uint', () => {
            const model = dmmf.datamodel.models.find(model => model.name === 'INTEGER__Oid_should_return_uint')!;
            const field = model.fields.find(field => field.name === 'test_field')!;
            const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
            const result = new PostgresTypeMapper().getCSType(field, model, raw_schema_lines);
            expect(result).toBe('uint');
          });
        });
      });
    });
  });

  describe('getTypeNameColumnAnnotation', () => {
    describe('given a bit', () => {
      it('should return bit', () => {
        const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);

        let model = dmmf.datamodel.models.find(model => model.name === 'STRING__Bit_should_yield_bit')!;
        let field = model.fields.find(field => field.name === 'test_field')!;
        let result = new PostgresTypeMapper().getTypeNameColumnAnnotation(field, model, raw_schema_lines);
        expect(result).toBe('bit(1)');

        field = model.fields.find(field => field.name === 'test_field2')!;
        result = new PostgresTypeMapper().getTypeNameColumnAnnotation(field, model, raw_schema_lines);
        expect(result).toBe('bit(2)');
      });
    });
    describe('given an xml', () => {
      it('should return xml', () => {
        const model = dmmf.datamodel.models.find(model => model.name === 'STRING__Xml_should_return_string')!;
        const field = model.fields.find(field => field.name === 'test_field')!;
        const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
        const result = new PostgresTypeMapper().getTypeNameColumnAnnotation(field, model, raw_schema_lines);
        expect(result).toBe('xml');
      });
    });
    describe('given an inet', () => {
      it('should return inet', () => {
        const model = dmmf.datamodel.models.find(model => model.name === 'STRING__Inet_should_return_IPAddress')!;
        const field = model.fields.find(field => field.name === 'test_field')!;
        const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
        const result = new PostgresTypeMapper().getTypeNameColumnAnnotation(field, model, raw_schema_lines);
        expect(result).toBe('inet');
      });
    });
    describe('given a json', () => {
      it('should return json', () => {
        const model = dmmf.datamodel.models.find(model => model.name === 'JSON__Json_should_yield_json')!;
        const field = model.fields.find(field => field.name === 'test_field')!;
        const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
        const result = new PostgresTypeMapper().getTypeNameColumnAnnotation(field, model, raw_schema_lines);
        expect(result).toBe('json');
      });
    });
    describe('given a json', () => {
      it('should return json', () => {
        const model = dmmf.datamodel.models.find(model => model.name === 'JSON__Jsonb_should_yield_jsonb')!;
        const field = model.fields.find(field => field.name === 'test_field')!;
        const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
        const result = new PostgresTypeMapper().getTypeNameColumnAnnotation(field, model, raw_schema_lines);
        expect(result).toBe('jsonb');
      });
    });
  });
});