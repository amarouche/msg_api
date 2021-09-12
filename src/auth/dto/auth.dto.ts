import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { User } from "src/user/user.entity";

export class LoginReturn {
  expires_in: number;
  access_token: {};
  user_id: User;
  status?: number
}

export class LoginBody {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}

export class LogoutDto {
  message: string;
}
