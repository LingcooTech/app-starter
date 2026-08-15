import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class DatabaseHealthIndicator {
  constructor(
    private readonly database: DatabaseService,
    private readonly healthIndicator: HealthIndicatorService,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicator.check(key);
    try {
      await this.database.ping();
      return indicator.up();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'PostgreSQL is unavailable';
      return indicator.down({ message });
    }
  }
}
