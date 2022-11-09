import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService { 
  private readonly users = []; 

  async findOne(username: string): Promise<User | undefined> {
    const file = path.join(__dirname, '..', '..', 'pages/bd.txt');
    const readStream = fs.readFileSync(file, 'utf-8');
    fs.readFileSync(file, 'utf-8').split('\n').forEach(item => this.users.push(JSON.parse(item)));
    return this.users.find(user => user.username === username);
  }
}
