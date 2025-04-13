import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sql',
  entities: ['src/entities/*.ts'],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
  logging: false,
});
