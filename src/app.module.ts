import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController, PostController, GetController, RegController, RefreshController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'pages'),
      exclude: ['/api*'],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, PostController, GetController, RegController, RefreshController],
  providers: [AppService],
})
export class AppModule {}
