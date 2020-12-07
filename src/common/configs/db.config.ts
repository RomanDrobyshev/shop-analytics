import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

export default {
  provide: 'MONGO_DATABASE',
  useFactory: async (configService: ConfigService): Promise<Db> => {
    let uri;
    let client: MongoClient;
    try {
      uri = `mongodb://${configService.get('database.host')}:${configService.get('database.port')}?useUnifiedTopology=true`;
      client = new MongoClient(uri);
      await client.connect();
      const database = client.db(configService.get('database.name'));
      console.info('🤖 Mongo client successfully connected!');
      return database;
    } catch (error) {
      await client?.close();
      return null;
    }
  },
  inject: [ConfigService],
};
