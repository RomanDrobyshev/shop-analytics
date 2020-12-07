import { ConfigService, ConfigModule } from '@nestjs/config';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ReportModule } from './report/report.module';
import MongoDatabase from './common/configs/db.config';
import envConfig from './common/configs/env.config';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    ReportModule,
  ],
  controllers: [],
  providers: [
    MongoDatabase,
    ConfigService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
