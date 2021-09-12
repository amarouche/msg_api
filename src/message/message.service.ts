import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { userNotFoundException } from '../../config/exceptionError';
import { UserDto } from 'src/user/dto/user.dto';
import { In, IsNull, Not, Repository } from 'typeorm';
import { AnswerDto, MsgDto, QueryParams } from './dto/message.dto';
import Message from './message.entity';

@Injectable()
export class MessageService extends TypeOrmCrudService<Message>{
  constructor(@InjectRepository(Message) private messageRepository: Repository<Message>){
    super(messageRepository)
  }

  async getMessages(typeRoute:string = null,query:QueryParams = null): Promise<Message[]>{
      return await this.messageRepository.find(this.buildQueryGetMessages(typeRoute, query))
  }

  async getAnswerMessages(id:number): Promise<Message[]>{
    try{
       const message:Message = await this.messageRepository.findOneOrFail(id)
       return await this.messageRepository.find({
         where: {
           id: In(message.answerMessages)
          },
          relations: ['userSender','userReceiver']
        })
    }
    catch (error) {
      throw new NotFoundException(error)
    }
  }

  async createOrUpdateMessage(currentUser:UserDto, messageBody:MsgDto) {
    let bodyMessage = {... messageBody, userSender: messageBody.userSender ?? currentUser}
    try {
      this.messageRepository.create(bodyMessage);
      return await this.messageRepository.save(bodyMessage)
    } catch (error) {
      if(error.code === "23503"){
        throw new NotFoundException(userNotFoundException)
      }
      throw new NotAcceptableException(error)
    }
  }

  async answerToMessage(currentUser:UserDto, messageAnsweredId:number, messageData: AnswerDto): Promise<Message> {
    try {
      const messageAnswered:Message = await this.messageRepository.findOneOrFail(
        messageAnsweredId,
        {
          relations: ['userReceiver','userSender']
        }
      )
      let newMessage = new Message()
      let bodyMessage = {... messageData, userSender: currentUser, userReceiver:messageAnswered.userSender}
      
      newMessage = await this.messageRepository.save(bodyMessage)
      messageAnswered.answerMessages != null 
        ? messageAnswered.answerMessages.push(newMessage.id)
        : messageAnswered.answerMessages = [newMessage.id]

      await this.messageRepository.update({
        id: messageAnsweredId,
      }, {
        answerMessages: messageAnswered.answerMessages,
      })
      return newMessage
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  async markAsRead(id:number): Promise<Message> {
    try {
      const msgData:Message = await this.messageRepository.findOne(id)
      await this.messageRepository.update({
        id: id,
      }, {
        read: true,
      })
      return await this.messageRepository.findOneOrFail(id)
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  async markDeleted(id:number) {
    try {
      await this.messageRepository.softDelete(id)
    return {
      id:id,
      message : 'message was soft deleted'
    };
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  buildQueryGetMessages(typeRoute:string, params:QueryParams = null){
    let query = {}
    switch (typeRoute) {
      case 'me':
        query = {
          where: {
            userSender:params.userId,
          },
          withDeleted: true,
          relations: ['userReceiver']
        }
        break;
      case 'read':
          query = {
            where: {
              read:true
            },
            withDeleted: true,
            relations: ['userSender','userReceiver']
          }
        break;
      case 'unread':
        query = {
          where: {
            read:false
          },
          withDeleted: true,
          relations: ['userSender','userReceiver']
        }
        break;
      case 'me/received':
        query = {
          where: {
            userReceiver:params.userId
          },
          withDeleted: true,
          relations: ['userSender']
        }
        break;
      case 'me/sended':
        query = {
          where: {
            userSender:params.userId
          },
          withDeleted: true,
          relations: ['userReceiver']
        }
        break;
      case 'softDeleted':
        query = {
          where: {deleted_date: Not(IsNull())}, 
          withDeleted: true,
          relations: ['userSender','userReceiver']
        }
        break;
      case 'all':
        query = {
          withDeleted: true,
          relations: ['userSender','userReceiver']
        }
        break;
      default:
        query = {
          relations: ['userSender','userReceiver']
        }
        break;
    }
    params && params.messageType && (['email','sms'].indexOf(params.messageType) != -1) 
      ? query = {...query , where: {type:params.messageType}}
      : query
    return query
  }
}
