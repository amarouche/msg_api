import {CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/typeOrm.config';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ TypeOrmModule.forRoot(typeOrmConfig),
    MessageModule, UserModule, AuthModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {
  }
}
