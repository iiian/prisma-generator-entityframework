import { SupportedConnector } from 'src/types';

/**
 * @param connector the serial identifier used by Prisma to associate a schema with a provider
 * @returns an entityframework mapped name to be used with a `Use<Provider>(conn_str)` statement in the DbContext subclass.
 */
export function getDbHost(connector: SupportedConnector): string {
  if (!connector) {
    throw new Error('No datasource specified. I need a datasource in order to construct the DbContext. The DbContext will need to setup the connection in the `OnConfiguring` life cycle hook.');
  }

  switch (connector) {
    case 'sqlserver':
      return 'SqlServer';
    case 'mysql':
      return 'MySql';
    case 'postgresql':
      return 'Npgsql'; // the official microsoft entity framework documentation lists Npgsql as the preferred db provider for postgres
    case 'sqlite':
      return 'Sqlite';
  }
}
