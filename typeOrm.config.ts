import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { entities } from './src/modules/entities';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_URL,
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [...entities],
});
