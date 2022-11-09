import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants, refreshConstants } from './constants'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const refresh_token = this.jwtService.sign(payload, { secret: refreshConstants.secret, expiresIn: '1d'});

    const access_token = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: '3s'});

    return { access_token, refresh_token };
  }

  async refreshTokens(username: string, refreshToken: string) {
    const user = await this.usersService.findOne(username);
    const tokens = await this.login(user);
    return tokens;
  }
}


