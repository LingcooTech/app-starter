import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService, HealthIndicatorService } from '@nestjs/terminus';

import { DatabaseHealthIndicator } from './database.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthIndicator: HealthIndicatorService,
    private readonly database: DatabaseHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([
      async () =>
        this.healthIndicator.check('api').up({
          name: this.config.getOrThrow<string>('APP_NAME'),
          version: this.config.getOrThrow<string>('APP_VERSION'),
        }),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([() => this.database.isHealthy('database')]);
  }
}
