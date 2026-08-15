import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { WorkerModule } from './worker.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Worker');
  let stopping = false;

  logger.log(
    `${config.getOrThrow<string>('APP_NAME')} worker started (${config.getOrThrow<string>('APP_VERSION')})`,
  );

  await new Promise<void>((resolve) => {
    const keepAlive = setInterval(() => undefined, 60_000);
    const shutdown = (signal: NodeJS.Signals) => {
      if (stopping) return;
      stopping = true;
      logger.log(`Worker received ${signal}; shutting down`);
      clearInterval(keepAlive);
      void app.close().then(resolve);
    };
    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  });
}

void bootstrap();
