import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config' ;

async function bootstrap() {
  const serverConfig = config.get('server') ;
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule);
  const PORT:number = process.env.PORT || serverConfig.port ;
  await app.listen(PORT);
  logger.log(`Applocation listening on port ${PORT}`)
}
bootstrap();