import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LoginReturn, LoginBody } from './dto/auth.dto';

@ApiTags('Auth')
@UsePipes(ValidationPipe)
@Controller('auth')
export class AuthController {
  constructor(private authService : AuthService){
  }

  @Post('login')
  @ApiOperation({ summary: 'Endpoint to login' })
  async login(@Body() user: LoginBody): Promise<LoginReturn> {
    return await this.authService.login(user);
  }  

  @Post('register')
  @ApiOperation({ summary: 'Endpoint to register new user' })
  async register(@Body() user: User): Promise<User> {
    return await this.authService.register(user);
  }  

  @Get('logout')
  @ApiOperation({ summary: 'Endpoint to logout user' })
  async Logout(@Req() request) {
    const authHeader = String(request.headers['authorization'] || '');
    return await this.authService.logout(authHeader);
  }
}
