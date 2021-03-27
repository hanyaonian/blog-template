import * as mongoose from 'mongoose';
import config from '../config';

export async function connectToDB(): Promise<void> {
  try {
    const url = `mongodb://${config.mongoDB.host}:${config.mongoDB.port}/${config.mongoDB.database}`;
    await mongoose.connect(url);
    console.log('mongo connect success');
  } catch (err) {
    console.log('mongo connect failed');
    throw err;
  }
}
