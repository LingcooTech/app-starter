import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

function corsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export async function configureHttpApplication(app: NestFastifyApplication): Promise<void> {
  const config = app.get(ConfigService);
  const workspaceRoot = resolve(__dirname, '../..');
  const adminRoot = resolve(workspaceRoot, 'admin/dist');
  const webRoot = resolve(workspaceRoot, 'web/dist');

  app.enableShutdownHooks();
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health/live', method: RequestMethod.GET },
      { path: 'health/ready', method: RequestMethod.GET },
    ],
  });
  app.enableCors({
    origin: corsOrigins(config.getOrThrow<string>('CORS_ORIGIN')),
    credentials: true,
  });
  await app.register(helmet, {
    contentSecurityPolicy: config.get<boolean>('API_DOCS_ENABLED') ? false : undefined,
  });
  if (existsSync(adminRoot)) {
    await app.register(fastifyStatic, {
      root: adminRoot,
      prefix: '/admin/',
    });
  }
  if (existsSync(webRoot)) {
    await app.register(fastifyStatic, {
      root: webRoot,
      prefix: '/',
      decorateReply: !existsSync(adminRoot),
    });
  }

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', (request, reply, done) => {
      reply.header('x-request-id', request.id || randomUUID());
      done();
    });

  if (config.get<boolean>('API_DOCS_ENABLED')) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(config.getOrThrow<string>('APP_NAME'))
        .setDescription('Application API')
        .setVersion(config.getOrThrow<string>('APP_VERSION'))
        .build(),
    );
    SwaggerModule.setup('api/docs', app, document);
  }
}
