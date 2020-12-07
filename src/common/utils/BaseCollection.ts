import { Collection, Db } from 'mongodb';

export class BaseCollection {
  collection: Collection;

  constructor(
    db: Db,
    collectionName: string,
  ) {
    this.collection = db.collection(collectionName);
  }
}
