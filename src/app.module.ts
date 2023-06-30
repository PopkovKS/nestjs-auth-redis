import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { loggingMiddleware } from './common/middleware/logging.middleware';
import config from 'src/common/configs/config';
// import { REDIS, RedisModule } from "./redis";
// import * as session from 'express-session';
//
// import { session as passportSession, initialize as passportInitialize } from 'passport';
// import { RedisClient } from 'redis';
// import RedisStore from "connect-redis";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware()], // configure your prisma middleware
      },
    }),
    UsersModule,
    AuthModule,
    // RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule  {
  // constructor(@Inject(REDIS) private readonly redis: RedisClient) {}
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //       .apply(
  //           session({
  //             store: new (RedisStore(session))({ client: this.redis, logErrors: true }),
  //             saveUninitialized: false,
  //             secret: 'sup3rs3cr3t',
  //             resave: false,
  //             cookie: {
  //               sameSite: true,
  //               httpOnly: false,
  //               maxAge: 60000,
  //             },
  //           }),
  //           passportInitialize(),
  //           passportSession(),
  //       )
  //       .forRoutes('*');
  // }
}