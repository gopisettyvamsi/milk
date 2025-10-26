// lib/mongodb.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Skipping MongoDB connection during build');
  } else {
    throw new Error('Please add your Mongodb URI to .env.local');
  }
}

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
  // Return a mock client during build
  client = {} as MongoClient;
  clientPromise = Promise.resolve(client);
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;