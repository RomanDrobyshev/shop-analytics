import { Module } from '@nestjs/common';
import { OrderCollectionService } from 'src/common/services/OrderCollection.service';
import { ReportCollectionService } from '../common/services/ReportCollection.service';
import { ReportController } from './report.controller';
import MongoDatabase from '../common/configs/db.config';

@Module({
  controllers: [ReportController],
  providers: [
    ReportCollectionService,
    OrderCollectionService,
    MongoDatabase,
  ],
})
export class ReportModule {}
