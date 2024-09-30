import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  // const port =
  //   configService.getOrThrow<string>('NODE_ENV').toUpperCase() === 'PRODUCTION'
  //     ? 443
  //     : 3001;
  await app.listen(3001);
}
bootstrap();
