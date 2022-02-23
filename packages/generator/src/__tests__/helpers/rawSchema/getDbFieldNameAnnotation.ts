import { extractDbFieldNameAnnotation } from '../../../helpers/rawSchema/getDbFieldNameAnnotation';

describe('extractDbFieldNameAnnotation', () => {
  it('should return the chunk following the @db. prefix, if it exists', () => {
    expect(extractDbFieldNameAnnotation('bit_arr String @db.Bit(2)')).toEqual(['Bit', '2']);
    expect(extractDbFieldNameAnnotation('bit_arr String @db.Bit')).toEqual(['Bit', null]);
    expect(extractDbFieldNameAnnotation('bit_arr String @db.Test("maybe a str")')).toEqual(['Test', '"maybe a str"']);
  });
  describe('otherwise', () => {
    it('should return null', () => {
      expect(extractDbFieldNameAnnotation('bit_arr String')).toEqual([null, null,]);
    });
  });
});