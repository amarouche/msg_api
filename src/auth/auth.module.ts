import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  PassportModule,
  CacheModule.register({
      ttl:0,
    }
  ),
  JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions:  { expiresIn: 60 * 60},
  })],
  controllers: [AuthController],
  providers: [UserService,AuthService, JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}
