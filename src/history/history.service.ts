import {Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { messageNotFoundException } from '../../config/exceptionError';
import Message from 'src/message/message.entity';
import { MessageService } from 'src/message/message.service';
import { UserDto } from 'src/user/dto/user.dto';
import { Repository } from 'typeorm';
import History from './history.entity';

@Injectable()
export class HistoryService extends TypeOrmCrudService<History>{
  constructor(@InjectRepository(History) private historyRepository: Repository<History>,
  public messageService :MessageService){
    super(historyRepository)
  }
 
  async getUserMessagesHistory(currentUser:UserDto): Promise<History[]>{
    return await this.historyRepository.find({ where: {
      user: currentUser.id,
    },relations: ['message']})
  }
  
  async getAllHistoryMessages(id:Number): Promise<History[]>{
    return await this.historyRepository.find({relations: ['user', 'message']})
  }

  async getMessageHistory(id:Number): Promise<History[]>{
    return await this.historyRepository.find({ where: {
      message: id,
    },relations: ['user']})
  }

  async editAndArchiveMessage(currentUser:UserDto,messageId:number, newMessage: string) {  ///changerd User to UserDTO
    try {
      const message:Message = await this.messageService.findOne({where:{id:messageId}, relations:['userSender']})
      if(message){
        if(message.userSender.id !== currentUser.id){
          throw new UnauthorizedException("only sender can edit this message")
        }
        let saveOldMsg = new History()
        saveOldMsg = await  this.historyRepository.save({
          archivedMessage: message.messageBody,
          user: currentUser,
          message: message
        })
        return {
          archived : saveOldMsg.archivedMessage,
          newMessage: await (await this.messageService.createOrUpdateMessage(currentUser,{...message, messageBody:newMessage})).messageBody
        }
      }
      else
        throw new NotFoundException(messageNotFoundException)
    } catch (error) {
        switch (error.status) {
          case 401:
          case 404:  
            throw new NotFoundException(error.response)
          default:
            throw new NotFoundException(error)
        }
    }
  }
}
