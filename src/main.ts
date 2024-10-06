import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import * as session from 'express-session';
import RedisStore from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 31,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableVersioning();
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
