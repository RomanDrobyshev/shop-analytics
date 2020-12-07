import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Collection } from 'mongodb';
import { Report } from '../types/report';

dayjs.extend(utc);

export function getLastReport(collection: Collection): Promise<Report.Structure> {
  return collection.findOne({ _id: dayjs.utc().format('YYYY-MM-DD') });
}
