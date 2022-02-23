import { DMMF } from '@prisma/generator-helper';
import { SimpleTypeMapper } from '../../../helpers/connnector-specs/SimpleTypeMapper';
import { getRawSchemaLinesFromFile } from '../../../helpers/getRawSchemaLinesFromFile';
import { getTestDMMF } from '../../__fixtures__/getTestDMMF';

describe('getCSType', () => {
  let dmmf: DMMF.Document;
  let schema_file_path: string;
  beforeAll(async () => {
    const test = await getTestDMMF('simple-type-mapper-tests');
    dmmf = test.dmmf;
    schema_file_path = test.schema_file_path;
  });
  describe('given a scalar field', () => {
    describe('of type Decimal', () => {
      it('should return decimal', () => {
        const model = dmmf.datamodel.models.find(model => model.name === 'DECIMAL__should_return_decimal')!;
        const field = model.fields.find(field => field.name === 'test_field')!;
        const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
        const result = new SimpleTypeMapper('postgresql').getCSType(field, model, raw_schema_lines);
        expect(result).toBe('decimal');
      });
    });
    describe('of type Json', () => {
      it('should return string', () => {
        const model = dmmf.datamodel.models.find(model => model.name === 'JSON__should_return_string')!;
        const field = model.fields.find(field => field.name === 'test_field')!;
        const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
        const result = new SimpleTypeMapper('postgresql').getCSType(field, model, raw_schema_lines);
        expect(result).toBe('string');
      });
    });
    describe('of type Bytes', () => {
      it('should return byte[]', () => {
        const model = dmmf.datamodel.models.find(model => model.name === 'BYTES__should_return_bytearr')!;
        const field = model.fields.find(field => field.name === 'test_field')!;
        const raw_schema_lines = getRawSchemaLinesFromFile(schema_file_path);
        const result = new SimpleTypeMapper('postgresql').getCSType(field, model, raw_schema_lines);
        expect(result).toBe('byte[]');
      });
    });
  });
});
