import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from './common/config/secrets';

async function bootstrap() {
  console.log(`SERVER_PORT`, SERVER_PORT);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.SERVER_PORT || SERVER_PORT || 3020);
}
bootstrap();
