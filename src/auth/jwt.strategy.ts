import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { LogoutDto } from './dto/auth.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService
  ) {
    super({
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<User|LogoutDto> {
    let token = null
    if(token = await this.cacheManager.get(payload.id+payload.iat)){
      const logout:any = this.jwtService.decode(token)
      if(logout.id+logout.iat == payload.id+payload.iat){
        throw new UnauthorizedException("token not valid")
      }
    }
    const user = await this.userRepository.findOne(payload.id);
    if (!user) {
      throw new InternalServerErrorException('user not found');
    }
    return user;
  }
}
