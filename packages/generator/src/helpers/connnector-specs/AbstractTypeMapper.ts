import { DMMF } from '@prisma/generator-helper';
import { SupportedConnector } from 'src/types';

export abstract class AbstractTypeMapper {
  protected abstract getTypeForInstance(field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]): string;
  public getCSType(field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]): string {
    let type = this.getTypeForInstance(field, model, raw_schema_lines);
    if (field.isList) {
      type = `ICollection<${type}>`;
    }
    return type;
  }

  public abstract getTypeNameColumnAnnotation(field: DMMF.Field, model: DMMF.Model, raw_schema_lines: string[]): string | null;

  public abstract modelNeedsManualUuidGeneration(model: DMMF.Model, raw_schema_lines: string[]): boolean;
}