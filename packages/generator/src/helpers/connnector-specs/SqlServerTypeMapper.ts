import { DMMF } from '@prisma/generator-helper';
import { SupportedConnector } from 'src/types';
import { getDbFieldNameAnnotation } from '../rawSchema/getDbFieldNameAnnotation';
import { getMappedFieldIsDefaultUuid } from '../rawSchema/getMappedFieldIsDefaultUuid';
import { SimpleTypeMapper } from './SimpleTypeMapper';

export class SqlServerTypeMapper extends SimpleTypeMapper {
  constructor() {
    super('sqlserver');
  }
  public modelNeedsManualUuidGeneration(model: DMMF.Model, raw_schema_lines: string[]): boolean {
    // among all the models' id properties, did there exist any _not_ using `@db.UniqueIdentifier`?
    return model.fields.map(field => field.isId &&
      getMappedFieldIsDefaultUuid(field.name, model.name, raw_schema_lines) &&
      !(getDbFieldNameAnnotation(field.name, model.name, raw_schema_lines)[0] === 'UniqueIdentifier')
    )
      .some(Boolean);
  }
}