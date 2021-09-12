import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@UsePipes(ValidationPipe)
@Crud({
  model: {
    type: User
  }
})
@Controller('user')
export class UserController {
  constructor(public service :UserService){
  }
}
