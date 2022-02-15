import { getConnectionString } from '../helpers/getConnectionString';

describe('getConnectionString', () => {
  describe('given a sqlite3 database connector', () => {
    it('should transform the connection string', () => {
      const connection_string = getConnectionString({
        activeProvider: 'sqlite',
        config: {},
        name: '',
        provider: 'sqlite',
        url: {
          fromEnvVar: null,
          value: 'file:./test.db'
        }
      });
      expect(connection_string).toMatchSnapshot();
    });
  });
  describe('given a postgresql database connector', () => {
    it('should transform the connection string', () => {
      const connection_string = getConnectionString({
        activeProvider: 'postgresql',
        config: {},
        name: '',
        provider: 'postgresql',
        url: {
          fromEnvVar: null,
          value: 'postgresql://user:password@host:5432/initial_db'
        }
      });
      expect(connection_string).toMatchSnapshot();
    });
  });
  describe('given a mysql database connector', () => {
    it('should transform the connection string', () => {
      const connection_string = getConnectionString({
        activeProvider: 'mysql',
        config: {},
        name: '',
        provider: 'mysql',
        url: {
          fromEnvVar: null,
          value: 'mysql://user:password@host:5432/initial_db'
        }
      });
      expect(connection_string).toMatchSnapshot();
    });
  });
  describe('given a sqlserver database connector', () => {
    it('should transform the connection string', () => {
      const connection_string = getConnectionString({
        activeProvider: 'sqlserver',
        config: {},
        name: '',
        provider: 'sqlserver',
        url: {
          fromEnvVar: null,
          value: 'sqlserver://host:5432;Database=initial_db;user=user;PASSWORD=password;encrypt=true'
        }
      });
      expect(connection_string).toMatchSnapshot();
    });
  });
  describe('given a sqlserver database connector, with integrated security', () => {
    it('should transform the connection string', () => {
      const connection_string = getConnectionString({
        activeProvider: 'sqlserver',
        config: {},
        name: '',
        provider: 'sqlserver',
        url: {
          fromEnvVar: null,
          value: 'sqlserver://localhost;Initial Catalog=master;Integrated Security=true'
        }
      });
      expect(connection_string).toMatchSnapshot();
    });
  });
});
