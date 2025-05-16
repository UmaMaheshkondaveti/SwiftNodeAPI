// src/config/db.ts
import { MongoClient, Db } from 'mongodb';

// MongoDB connection configuration
// These can be moved to environment variables in a production setup
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'user_management_api';

let db: Db;
let client: MongoClient;

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<void> {
  try {
    // Connect to the MongoDB server
    client = new MongoClient(mongoUrl);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database instance
    db = client.db(dbName);
    console.log(`Using database: ${dbName}`);
    
    // Ensure collections exist
    await createCollections();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Create necessary collections if they don't exist
 */
async function createCollections(): Promise<void> {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
  }
  
  if (!collectionNames.includes('posts')) {
    await db.createCollection('posts');
  }
  
  if (!collectionNames.includes('comments')) {
    await db.createCollection('comments');
  }
}

/**
 * Get MongoDB database instance
 */
export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

/**
 * Close MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}