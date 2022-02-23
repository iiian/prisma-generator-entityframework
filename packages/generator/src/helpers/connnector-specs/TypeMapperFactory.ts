import { SupportedConnector } from 'src/types';
import { AbstractTypeMapper } from './AbstractTypeMapper';
import { PostgresTypeMapper } from './PostgresTypeMapper';
import { SimpleTypeMapper } from './SimpleTypeMapper';
import { SqlServerTypeMapper } from './SqlServerTypeMapper';

export class TypeMapperFactory {
  public static create(connector: SupportedConnector): AbstractTypeMapper {
    switch (connector) {
      case 'mysql':
      case 'sqlite':
        return new SimpleTypeMapper(connector);
      case 'sqlserver':
        return new SqlServerTypeMapper();
      case 'postgresql':
        return new PostgresTypeMapper();
    }
  }
}