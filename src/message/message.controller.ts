import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Crud, Override } from '@nestjsx/crud';
import Message from './message.entity';
import { MessageService } from './message.service';
import { AuthGuard } from '@nestjs/passport'
import { AnswerDto, MsgDto, TYPE_MSG } from './dto/message.dto';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@Crud({
  model:{
    type:Message
  },
  query:{
    join:{
      userSender:{
        eager:true,
        exclude:['password']
      },
      userReceiver:{
        eager:true,
        exclude:['password']
      }
    }
  }
})

@Controller('message')
export class MessageController {
  constructor(public service :MessageService){
  }

  @Get()
  @ApiOperation({ summary: 'Endpoint to get the list of messages' })
  async findAll(@Query() query){
    return await this.service.getMessages('',{
      messageType: query.type
    })
  }

  @Get('all')
  @ApiOperation({ summary: 'Endpoint to get the list of messages with soft deleted messages' })
  async getAllMessagesWithSoftDelete(@Query() query){
    return await this.service.getMessages('all',{
      messageType: query.type
    })
  }

  @Get('me')
  @ApiOperation({ summary: 'Endpoint to get the list of user messages' })
  async allMessagesCurrentUser(@Req() request,@Query() query){
    return await this.service.getMessages('me',{
      userId: request.user.id,
      messageType: query.type
    })
  }

  @Get('me/received')
  @ApiOperation({ summary: 'Endpoint to get the list of messages received by the logged user' })
  async receivedMessagesCurrentUser(@Req() request,@Query() query){
    return await this.service.getMessages('me/received',{
      userId: request.user.id,
      messageType: query.type
    })
  }
  @Get('me/sended')
  @ApiOperation({ summary: 'Endpoint to get the list of messages sended by the logged user' })
  async sendedMessagesCurrentUser(@Req() request,@Query() query){
    return await this.service.getMessages('me/sended',{
      userId: request.user.id,
      messageType: query.type
    })
  }
  @Get('read')
  @ApiOperation({ summary: 'Endpoint to get the list of read messages' })
  async readMessages(@Query() query){
    return await this.service.getMessages('read',{
      messageType: query.type
    })
  }

  @Get('unread')
  @ApiOperation({ summary: 'Endpoint to get the list of unread messages' })
  async unreadMessages(@Query() query){
    return await this.service.getMessages('unread',{
      messageType: query.type
    })
  }

  @Get('answersmessages/:id')
  @ApiOperation({ summary: 'Endpoint to get message answers'})
  async answerMessages(@Param('id') id:number){
    return await this.service.getAnswerMessages(id)
  }

  @Get('softDeleted')
  @ApiOperation({ summary: 'Endpoint to get the list of soft deleted messages' })
  async  getSoftDeletedMessages(@Query() query){
    return await this.service.getMessages('softDeleted',{
      messageType: query.type
    })
  }
 
  @Post()
  @ApiOperation({ summary: 'Endpoint to create message' })
  async createMessage(@Req() request, @Body() messageData:MsgDto){
    return await this.service.createOrUpdateMessage(request.user, messageData)
  }

  @Post('answer/:id')
  @ApiOperation({ summary: 'Endpoint to answer specific message' })
  async answerToMessage(@Req()request,@Param('id') id:number, @Body() messageData: AnswerDto){
    return await this.service.answerToMessage(request.user, id, messageData)
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Endpoint to message like read' })
  async markAsRead(@Param('id') id:number){
    return await this.service.markAsRead(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Endpoint to soft delete specific message' })
  async softDeleteMEssage(@Param('id') id:number){
    return await this.service.markDeleted(id)
  }
}
