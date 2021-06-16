import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/config/secrets';

async function bootstrap() {
  console.log(`process.env.PORT`, process.env.PORT);
  console.log(`SERVER_PORT`, PORT);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || PORT);
}
bootstrap();
