import { DMMF } from '@prisma/generator-helper';
import { SupportedConnector } from 'src/types';
import { fieldIsGuidPrimaryKey } from '../rawSchema/fieldIsGuidPrimaryKey';
import { getDbFieldNameAnnotation } from '../rawSchema/getDbFieldNameAnnotation';
import { getMappedFieldIsDefaultUuid } from '../rawSchema/getMappedFieldIsDefaultUuid';
import { SimpleTypeMapper } from './SimpleTypeMapper';

export class PostgresTypeMapper extends SimpleTypeMapper {
  public constructor() {
    super('postgresql');
  }

  protected getTypeForInstance(field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]): string {
    const db_annotations = getDbFieldNameAnnotation(field.name, model.name, raw_schema_lines);
    switch (field.type) {
      case 'String': {
        if (db_annotations.includes('Inet')) {
          return 'IPAddress';
        }
        if (fieldIsGuidPrimaryKey('postgresql', field, model, raw_schema_lines)) {
          return 'Guid';
        }
        if (db_annotations.includes('Bit')) {
          return 'BitArray';
        }
      }
      case 'Int': {
        if (db_annotations.includes('Oid')) {
          return 'uint';
        }
        if (db_annotations.includes('SmallInt')) {
          return 'short';
        }
      }
    }
    return super.getTypeForInstance(field, model, raw_schema_lines);
  }

  public modelNeedsManualUuidGeneration(model: DMMF.Model, raw_schema_lines: string[]): boolean {
    // among all the models' id properties, did there exist any _not_ using `@db.Uuid`?
    return model.fields.map(field => field.isId &&
      getMappedFieldIsDefaultUuid(field.name, model.name, raw_schema_lines) &&
      !(getDbFieldNameAnnotation(field.name, model.name, raw_schema_lines)[0] === 'Uuid')
    )
      .some(Boolean);
  }

  public getTypeNameColumnAnnotation(field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]): string | null {
    const [id, args] = getDbFieldNameAnnotation(field.name, model.name, raw_schema_lines);
    if (!id) {
      return null;
    }
    switch (id.toLowerCase()) {
      case 'xml': return 'xml';
      case 'inet': return 'inet';
      case 'json': return 'json';
      case 'jsonb': return 'jsonb';
      case 'bit': return `bit(${args ?? '1'})`;
      default: return null;
    }
  }
}