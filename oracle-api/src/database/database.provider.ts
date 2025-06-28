import { Inject, Provider } from '@nestjs/common';
import { getConnection } from 'oracledb';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      try {
        const connection = await getConnection({
          user: process.env.ORACLE_USER,
          password: process.env.ORACLE_PWD,
          connectString: process.env.ORACLE_CONNECTION_STRING,
        });
        return connection;
      } catch (error) {
        throw error;
      }
    },
  },
];

export const InjectConnection = () => Inject('DATABASE_CONNECTION');