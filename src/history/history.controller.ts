import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { newMsgDto } from './dto/history.dto';
import History from './history.entity';
import { HistoryService } from './history.service';

@ApiTags('Messages history')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@Crud({
  model:{
    type: History
  },
  query:{
    join:{
      user:{
        eager:true,
      },
      message:{
        eager:true,
      }
    }
  }
})

@Controller('history')
export class HistoryController {
  constructor(public service :HistoryService){
  }

  @Get('me')
  @ApiOperation({ summary: 'Endpoint to get current user\'s message history' })
  async userMessagesHistory(@Req() request){
    return await this.service.getUserMessagesHistory(request.user)
  }
  @Get('messages')
  @ApiOperation({ summary: 'Endpoint to get all messages history' })
  async allMessagesHistory(@Req() request){
    return await this.service.getAllHistoryMessages(request.user)
  }
  @Get('messages/:id')
  @ApiOperation({ summary: 'Endpoint to get history of specific message' })
  async messageHistory(@Param('id') id:number){
    return await this.service.getMessageHistory(id)
  }

  @Post(':id')
  @ApiOperation({ summary: 'Endpoint to edit specific message and archive last one' })
  async editAndArchiveMessage(@Req() request,@Param('id') id:number, @Body() messageBody: newMsgDto){
    return await this.service.editAndArchiveMessage(request.user, id, messageBody.message)
  }
}
