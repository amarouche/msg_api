import { CACHE_MANAGER, ConflictException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginReturn, LoginBody, LogoutDto } from './dto/auth.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor( @InjectRepository(User) private userRepository: Repository<User>,
  @Inject(CACHE_MANAGER) private cacheManager: Cache,
  private jwtSTra: JwtStrategy,
  private jwtService: JwtService,){
  }

  async login(user:LoginBody):Promise<LoginReturn>{
    const userData = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    })
    if(!userData || !(await bcrypt.compare(user.password, userData.password))){
      throw new UnauthorizedException('Invalide username or password');
    }
    delete userData.password;
    let payload = {id: userData.id, email: userData.email};
    const accessToken = this.jwtService.sign(payload);
    return {
      expires_in: 3600,
      access_token: accessToken,
      user_id: userData,
    };
  }

  async register(user :UserDto): Promise<User>{
    user.password = await bcrypt.hashSync(user.password, 10)
    let registerUser = new User()
    try {
      registerUser = await this.userRepository.save(user)
      delete registerUser.password;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return registerUser
  }

  async logout(authHeader:string): Promise<LogoutDto>{
    if (authHeader.startsWith('Bearer')) {
      const token = authHeader.substring(7, authHeader.length);
      const user:any = this.jwtService.decode(token)
       if(await this.cacheManager.get("token") ){
         let tokenList = [token].concat(await this.cacheManager.get("token"))
         await this.cacheManager.set("token",tokenList)
       }else{
         await this.cacheManager.set(user.id+user.iat,token) 
       }
       this.jwtSTra.validate(this.jwtService.decode(token))
     }
    return {
      message: "logged out !"
    }
  }
}
