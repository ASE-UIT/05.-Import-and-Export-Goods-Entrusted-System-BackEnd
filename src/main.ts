import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const redisStore = await createRedisStore(
    configService.getOrThrow('REDIS_PASSWORD'),
    configService.getOrThrow('REDIS_HOST'),
  );

  app.use(
    session({
      store: redisStore,
      resave: false,
      saveUninitialized: false,
      secret: configService.getOrThrow<string>('SESSION_SECRET'),
      name: 'exim-session',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 31,
        sameSite: configService.get('NODE_ENV') === 'production' ? 'none' : 'lax',
        secure: configService.get('NODE_ENV') === 'production' ? true : false,
        httpOnly: true,
      },
    }),
  );

  patchNestJsSwagger();

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: configService.get('FRONTEND_URL') || "http://localhost:3000",
    credentials: true,
  });

  app.enableVersioning();

  const options = new DocumentBuilder()
    .setTitle('Exim API')
    .setDescription('Exim API description')
    .setVersion('1.0')
    .addTag('exim')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document);
  app.set('trust proxy', 1);
  await app.listen(3000);
}

bootstrap();

async function createRedisStore(
  redisPassword: string,
  redisHost: string,
): Promise<RedisStore> {
  const redisClient = createClient({
    url: `redis://:${redisPassword}@${redisHost}:6379`,
  });

  await redisClient.connect();

  return new RedisStore({
    client: redisClient,
    prefix: 'exim-session:',
  });
}
