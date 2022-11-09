import { Controller, Get, Post, Body, Req, Response, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RefreshTokenGuard } from './auth/refreshToken.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('index')
export class GetController {
  @Get()
  sendHtml(): string {
    const file = path.join(__dirname, '..', 'pages/autorization.html');
    const readStream = fs.readFileSync(file, 'utf-8');

    return readStream;
  }
}

@Controller('cast')
export class PostController {
  @Post()
  sendResponse(@Body() data): string {
    const file = path.join(__dirname, '..', 'pages/bd.txt');
    const readStream = fs.readFileSync(file, 'utf-8');
    const writeStream = fs.writeFileSync(file, JSON.stringify(data) + '\n', {flag: "a"});
    
    return "Data received";
  }
}

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return (
      fs.readFileSync(path.join(__dirname, '..', 'pages/profiles.txt'), 'utf-8')
      .split('\n')
      .find(item => JSON.parse(item).userId == req.user.userId)
      );
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  setProfile(@Req() req) {
    const profiles = path.join(__dirname, '..', 'pages/profiles.txt');
    const readStream = fs.readFileSync(profiles, 'utf-8');

    type Profile = {
      userId: number;
      name: string;
      phone: string;
      address: string;
      aboutMe: string;
    };

    let profArray = [];
    readStream.split('\n').forEach(item => profArray.push(JSON.parse(item)));
    let changingId = profArray.find(item => item.userId == req.user.userId).userId - 1;
    for (let key in req.body) {
      profArray[changingId][key] = req.body[key];
    }
    for (let unit in profArray) {
      profArray[unit] = JSON.stringify(profArray[unit]);
    }
    fs.writeFileSync(profiles, profArray.join('\n'), {flag: "w"});
  }
}

@Controller('refresh')
export class RefreshController {
  constructor(private authService: AuthService) {}
  
  @UseGuards(RefreshTokenGuard)
  @Get()
  refreshTokens(@Req() req: Request) {
    return this.authService.refreshTokens(req.user['username'], req.user['refreshToken']);
  }
}

@Controller('register')
export class RegController {
  @Post()
  getAccount(@Body() data): boolean {
    const file = path.join(__dirname, '..', 'pages/bd.txt');
    const profiles = path.join(__dirname, '..', 'pages/profiles.txt');
    const readStream = fs.readFileSync(file, 'utf-8');

    type Account = {
      userId: number;
      username: string;
      password: string;
    };

    type Profile = {
      userId: number;
      name: string;
      phone: string;
      address: string;
      aboutMe: string;
    };

    let bd = [];
    if (readStream) {
      readStream.split('\n').forEach(item => bd.push(JSON.parse(item)));
    } else {
      const account: Account = {
        userId: 1, 
        username: data.username, 
        password: data.password};
      fs.writeFileSync(file, JSON.stringify(account), {flag: "a"});
      const profile: Profile = {
        userId: 1, 
        name: "", 
        phone: "",
        address: "",
        aboutMe: ""};
      fs.writeFileSync(profiles, JSON.stringify(profile), {flag: "a"});
      return true;
    }

    if (bd.find(item => item.username == data.username)) {
      return false
    } else {
      const account: Account = {
        userId: bd.length + 1, 
        username: data.username, 
        password: data.password};
      fs.writeFileSync(file, '\n' + JSON.stringify(account), {flag: "a"});
      const profile: Profile = {
        userId: bd.length + 1, 
        name: "", 
        phone: "",
        address: "",
        aboutMe: ""};
      fs.writeFileSync(profiles, '\n' + JSON.stringify(profile), {flag: "a"});
      return true;
    }
  }
}
