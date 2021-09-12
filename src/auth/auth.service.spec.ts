import { CacheModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginBody } from './dto/auth.dto';
import { JwtStrategy } from './jwt.strategy';
import * as bcrypt from 'bcrypt';
import { mockAuthRepository } from './../../test/mockRepository'
require("dotenv").config();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[ PassportModule,
        CacheModule.register({
            ttl:0,
          }
        ),
        JwtModule.register({
          secret: process.env.SECRET_KEY,
        })],
      providers: [AuthService,UserService,JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockAuthRepository,
        }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be create user', async() => {
    const dto = {
      email:"test@tse.com",
      password: "stirng",
      pseudo: "test",
    }
    mockAuthRepository.save.mockReturnValue(dto)
    expect(await service.register(dto)).toEqual({
      email:"test@tse.com",
      pseudo: "test",
    });
  });

  it('should be login', async() => {
    const dto:LoginBody = {
      email: "test@test.com",
      password: "test",
    }
    mockAuthRepository.findOne.mockReturnValue({...dto, password: await bcrypt.hashSync("test", 10)})
    expect(await service.login(dto)).toEqual({
      expires_in:3600,
      access_token: expect.any(String),
      user_id: {
        email: expect.any(String)
      },
    });
  });
});
