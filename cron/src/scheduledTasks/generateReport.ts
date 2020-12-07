import * as dayjs from 'dayjs';
import { MongoClient } from 'mongodb';
import * as utc from 'dayjs/plugin/utc';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { Report } from '../../../types/report';
import { getEnv } from '../../../utils/getEnv';
import { generateReport } from '../../../utils/report';
import { getLastReport } from '../../../utils/getLastReport';

dayjs.extend(utc);

dotenv.config({
  path: join(process.cwd(), `.${process.env.NODE_ENV}.env`),
});

interface CustomEnv {
  readonly NODE_ENV?: string;
  readonly MONGO_USER?: string;
  readonly MONGO_PASSWORD?: string;
  readonly MONGO_HOST?: string;
  readonly MONGO_PORT?: string;
  readonly MONGO_DB_NAME?: string;
}

const requiredEnvVariables: string[] = [
  'NODE_ENV',
  'MONGO_USER',
  'MONGO_PASSWORD',
  'MONGO_PORT',
  'MONGO_HOST',
  'MONGO_DB_NAME',
];

const {
  MONGO_PORT: dbPort,
  MONGO_HOST: dbHost,
} = getEnv<CustomEnv>(process.env, requiredEnvVariables);

const uri = `mongodb://${dbHost}:${dbPort}?useUnifiedTopology=true`;

const client = new MongoClient(uri);

async function main(): Promise<void> {
  try {
    await client.connect();
    const db = client.db('shop');
    const collection = db.collection('orders');
    const reportsCollection = db.collection('reports');

    const report: Report.Structure = await getLastReport(reportsCollection);

    if (report) {
      console.info('🤖 Report already exists!');
    } else {
      await generateReport(collection, reportsCollection);

      console.info('🤖 Report has been generated!');
    }
  } finally {
    await client.close();
  }
}

main().catch(console.dir);
