import { createReadStream, existsSync } from 'fs';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { join } from 'path';
import { Order } from 'types/order';
import { getEnv } from '../utils/getEnv';

const processCwd = process.cwd();

dotenv.config({
  path: join(processCwd, `.${process.env.NODE_ENV}.env`),
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
  // MONGO_USER: dbUser,
  // MONGO_PASSWORD: dbPassword,
  MONGO_PORT: dbPort,
  MONGO_HOST: dbHost,
} = getEnv<CustomEnv>(process.env, requiredEnvVariables);

const uri = `mongodb://${dbHost}:${dbPort}?useUnifiedTopology=true`;
// const uri = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}?useUnifiedTopology=true`;
const client = new MongoClient(uri);
// let session = null;

async function main() {
  try {
    await client.connect();
    const database = client.db('shop');
    const collection = database.collection('orders');
    // session = client.startSession();

    const parsedData: Order.Product[] = await new Promise((res, rej) => {
      const pathToFile = join(processCwd, 'example.jsonl');
      const dataStream = createReadStream(pathToFile, 'utf-8');

      if (!existsSync(pathToFile)) {
        rej(new Error(`File example.jsonl not found in the ${pathToFile}`));
      }

      let roughData = '';

      dataStream.on('data', (chunk: string) => {
        roughData += chunk;
      });

      dataStream.on('end', () => {
        const dataAsJsonObjects: string = roughData.slice(0, -1).split('\n').join(',');
        res(JSON.parse(`[${dataAsJsonObjects}]`));
      });
    });

    const chunkSize = 10000;

    // const transactionOptions = {
    //   readPreference: 'primary',
    //   readConcern: { level: 'local' },
    //   writeConcern: { w: 'majority' }
    // };
    // const transactionResults = await session.withTransaction(async () => {

    for (let i = 0; i < parsedData.length / chunkSize; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await collection.insertMany(parsedData.slice(i * chunkSize, i * chunkSize + chunkSize));
      console.info(`Chunk ${i + 1} ready!`);
    }

    // }, transactionOptions);
  } finally {
    await client.close();
    // await session.endSession();
  }
}

main().catch(console.dir);
