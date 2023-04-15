import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [  
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'), // Replace with the path to your static files directory
    }),

    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.local.env',
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      synchronize: configService.get<boolean>('DB_ASYNC'),
      logging: configService.get<boolean>('DB_LOGGING'),
      entities:[User]
    }),
  }),
    UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
