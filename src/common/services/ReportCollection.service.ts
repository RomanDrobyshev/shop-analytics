import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { BaseCollection } from '../utils/BaseCollection';

@Injectable()
export class ReportCollectionService extends BaseCollection {
  constructor(
  @Inject('MONGO_DATABASE') db: Db,
  ) {
    super(db, 'reports');
  }
}
