
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

export const typeOrmConfig : TypeOrmModuleOptions = {
  
  type:'postgres',
  host: process.env.HOST || '127.0.0.1',
  port:  parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ["dist/**/*.entity{.ts,.js}"],
  autoLoadEntities: true,
  synchronize: true,

}
