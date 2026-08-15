import 'reflect-metadata';

import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { configureHttpApplication } from './http-bootstrap';

async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter({
    logger: true,
    trustProxy: true,
    genReqId(request: IncomingMessage) {
      const value = request.headers['x-request-id'];
      const requestId = Array.isArray(value) ? value[0] : value;
      return requestId && /^[a-zA-Z0-9._:-]{8,120}$/.test(requestId) ? requestId : randomUUID();
    },
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  await configureHttpApplication(app);

  const config = app.get(ConfigService);
  await app.listen({
    host: config.getOrThrow<string>('API_HOST'),
    port: config.getOrThrow<number>('API_PORT'),
  });
}

void bootstrap();
