import { DMMF } from '@prisma/generator-helper';
import { SupportedConnector } from 'src/types';
import { getDbFieldNameAnnotation } from './getDbFieldNameAnnotation';

export function fieldIsGuidPrimaryKey(connector: SupportedConnector, field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]) {
  if (connector === 'postgresql') {
    return getDbFieldNameAnnotation(field.name, model.name, raw_schema_lines)[0] === 'Uuid';
  }
  if (connector === 'sqlserver') {
    return getDbFieldNameAnnotation(field.name, model.name, raw_schema_lines)[0] === 'UniqueIdentifier';
  }
  return false;
}