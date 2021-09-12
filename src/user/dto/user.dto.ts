import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  id?: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  pseudo?:string;
  @ApiProperty()
  password?: string;
}