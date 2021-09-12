import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import History from './history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from 'src/message/message.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports:[TypeOrmModule.forFeature([History]), MessageModule],
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule {}
