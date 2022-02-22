import { DMMF } from '@prisma/generator-helper';
import { SupportedConnector } from 'src/types';
import { getMappedFieldNameDbParams } from './getMappedFieldNameDbParams';

export function fieldIsGuidPrimaryKey(connector: SupportedConnector, field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]) {
  if (connector === 'postgresql') {
    return getMappedFieldNameDbParams(field.name, model.name, raw_schema_lines).includes('Uuid');
  }
  if (connector === 'sqlserver') {
    return getMappedFieldNameDbParams(field.name, model.name, raw_schema_lines).includes('UniqueIdentifier');
  }
  return false;
}