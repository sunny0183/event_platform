import mongoose from 'mongoose';
import { CosmosClient } from "@azure/cosmos";


const MONGODB_URI = process.env.MONGODB_URI;
const COSMOS_URI = process.env.COSMOS_URI || "NoId ";
//const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT || "";
//const COSMOS_KEY = process.env.COSMOS_KEY|| "";

let cached = (global as any).mongoose || { conn: null, promise: null };
let cachedCosmos = (global as any).cosmosClient || { conn: null, promise: null, database:null };

/*export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  
  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');
  
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'evently',
    bufferCommands: false,
  })
 
  cached.conn = await cached.promise;
  
  return cached.conn;
}*/
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  
  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');
  
  cached.promise = cached.promise || mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
    auth: {
      username: process.env.COSMOSDB_USER,
      password: process.env.COSMOSDB_PASSWORD
    },
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
  retryWrites: false
  })
 
  cached.conn = await cached.promise;
  
  return cached.conn;
}

export const connectToDatabaseCosmosDB = async (databaseId:string) => {
  if (cachedCosmos.conn) return cached.conn;

  if(!COSMOS_URI) throw new Error('COSMOS URI is missing');

  cachedCosmos.promise = cachedCosmos.promise || new CosmosClient(COSMOS_URI);

  cachedCosmos.conn = await cachedCosmos.promise;

  cachedCosmos.database = await cachedCosmos.conn.databases.createIfNotExists({ id: databaseId });

  return cachedCosmos.database;
}