import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserDto } from "src/user/dto/user.dto";
export enum TYPE_MSG {
  MSG = 'sms',
  EMAIL = 'email',
}

export class MsgDto {
  @IsString()
  @IsString()
  objet:string;
  @IsIn(['email','sms']) 
  @IsNotEmpty()
  type: TYPE_MSG;
  @IsString()
  @IsNotEmpty()
  messageBody: string;
  userSender?: UserDto;
  @IsNumber()
  @IsNotEmpty()
  userReceiver?: UserDto;
}
export class AnswerDto {
  @ApiProperty()
  @IsString()
  objet?:string;
  @ApiProperty()
  @IsIn(['email','sms']) 
  @IsNotEmpty()
  type: TYPE_MSG;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  messageBody: string;
}

export class QueryParams {
  userId?:number;
  messageType?: string;
}