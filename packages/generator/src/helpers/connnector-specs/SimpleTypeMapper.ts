import { DMMF } from '@prisma/generator-helper';
import { SupportedConnector } from 'src/types';
import { fieldIsGuidPrimaryKey } from '../rawSchema/fieldIsGuidPrimaryKey';
import { getDbFieldNameAnnotation } from '../rawSchema/getDbFieldNameAnnotation';
import { AbstractTypeMapper } from './AbstractTypeMapper';

export class SimpleTypeMapper extends AbstractTypeMapper {
  constructor(public readonly connector: SupportedConnector) { super(); }

  protected getTypeForInstance(field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]): string {
    let type: string;
    switch (field.type) {
      case 'Int': type = 'int'; break;
      case 'BigInt': type = 'long'; break;
      case 'Boolean': type = 'bool'; break;
      case 'Decimal': type = 'decimal'; break;
      case 'Float': type = 'float'; break;
      case 'String': {
        if (field.isId && fieldIsGuidPrimaryKey(this.connector, field, model, raw_schema_lines)) {
          type = 'Guid';
        } else {
          type = 'string';
        }
        break;
      };
      case 'Json': type = 'string'; break;
      case 'Bytes': type = 'byte[]'; break;
      default: type = field.type as string; break;
    }
    return type;
  }

  public getTypeNameColumnAnnotation(field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]): string | null {
    return null;
  }

  public modelNeedsManualUuidGeneration(model: DMMF.Model, raw_schema_lines: string[]): boolean {
    return false;
  }
}