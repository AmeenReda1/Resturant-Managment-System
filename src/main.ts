import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
 
  const port = configService.get<number>('PORT') || 9000;
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(port);
}
bootstrap();
