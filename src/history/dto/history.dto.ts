import { ApiProperty } from "@nestjs/swagger";

export class newMsgDto {
  @ApiProperty()
  message?:string;
}
