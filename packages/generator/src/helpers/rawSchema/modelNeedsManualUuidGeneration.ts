import { DMMF } from '@prisma/generator-helper';
import { getMappedFieldNameDbParams } from './getMappedFieldNameDbParams';
import { SupportedConnector } from '../../types';
import { getMappedFieldIsDefaultUuid } from './getMappedFieldIsDefaultUuid';


export function modelNeedsManualUuidGeneration(connector: SupportedConnector, model: DMMF.Model, raw_schema_lines: string[]) {
  if (connector === 'postgresql') {
    // among all the models' id properties, did there exist any _not_ using `@db.Uuid`?
    return model.fields.map(field => field.isId &&
      getMappedFieldIsDefaultUuid(field.name, model.name, raw_schema_lines) &&
      !(getMappedFieldNameDbParams(field.name, model.name, raw_schema_lines).includes('Uuid'))
    )
      .some(Boolean);
  }
  if (connector === 'sqlserver') {
    // among all the models' id properties, did there exist any _not_ using `@db.UniqueIdentifier`?
    return model.fields.map(field => field.isId &&
      getMappedFieldIsDefaultUuid(field.name, model.name, raw_schema_lines) &&
      !(getMappedFieldNameDbParams(field.name, model.name, raw_schema_lines).includes('UniqueIdentifier'))
    )
      .some(Boolean);
  }
  return false;
}
