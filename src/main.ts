import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaClientExceptionFilter, PrismaService } from "nestjs-prisma";

import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import {Logger} from '@nestjs/common';
import * as passport from 'passport';
import * as redis from 'redis';



import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from "src/common/configs/config.interface";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  const logger = new Logger();

  const RedisStore = connectRedis(session);

  const redisClient = redis.createClient(6379, '127.0.0.1');

  app.use(
      session({
        secret: 'demo-session-secret',
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({ client: redisClient }),
      }),
  );

  app.use(passport.initialize());
  app.use(passport.session());


  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>("nest");
  const corsConfig = configService.get<CorsConfig>("cors");
  const swaggerConfig = configService.get<SwaggerConfig>("swagger");

  if (corsConfig.enabled) {
    app.enableCors({
      allowedHeaders: ["content-type"],
      origin: "*",
      credentials: true,
    });
  }

  if (swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfig.path, app, document);
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000);



}


bootstrap();
