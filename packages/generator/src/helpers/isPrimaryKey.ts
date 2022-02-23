import { DMMF } from '@prisma/generator-helper';

export function isPrimaryKey(field: DMMF.Field, model: DMMF.Model) {
  if (field.isId) {
    return true;
  }
  if (!model.primaryKey?.fields) {
    return false;
  }
  const index = model.primaryKey!.fields.findIndex(each_primary_key => each_primary_key === field.name);
  return index >= 0;
}
