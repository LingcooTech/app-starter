import { Module } from '@nestjs/common';

import { AppConfigModule } from './infrastructure/config/app-config.module';

@Module({ imports: [AppConfigModule] })
export class WorkerModule {}
