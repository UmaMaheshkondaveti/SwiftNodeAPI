// src/services/userService.ts
import { Collection } from 'mongodb';
import { getDb } from '../config/db';
import { User } from '../models/types';
import { ApiError } from '../utils/errorHandler';

/**
 * Get users collection
 */
function getUsersCollection(): Collection<User> {
  return getDb().collection<User>('users');
}

/**
 * Save users to database
 */
export async function saveUsers(users: User[]): Promise<void> {
  try {
    const usersCollection = getUsersCollection();
    
    // For each user, use upsert to avoid duplicates
    for (const user of users) {
      await usersCollection.updateOne(
        { id: user.id },
        { $set: user },
        { upsert: true }
      );
    }
  } catch (error) {
    throw new ApiError(500, `Failed to save users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete all users
 */
export async function deleteAllUsers(): Promise<void> {
  try {
    const usersCollection = getUsersCollection();
    await usersCollection.deleteMany({});
  } catch (error) {
    throw new ApiError(500, `Failed to delete users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete user by ID
 */
export async function deleteUserById(userId: number): Promise<void> {
  try {
    const usersCollection = getUsersCollection();
    const result = await usersCollection.deleteOne({ id: userId });
    
    if (result.deletedCount === 0) {
      throw new ApiError(404, `User with ID ${userId} not found`);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get user by ID with posts and comments
 */
export async function getUserById(userId: number): Promise<User> {
  try {
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ id: userId });
    
    if (!user) {
      throw new ApiError(404, `User with ID ${userId} not found`);
    }
    
    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create new user
 */
export async function createUser(user: User): Promise<User> {
  try {
    const usersCollection = getUsersCollection();
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ id: user.id });
    if (existingUser) {
      throw new ApiError(400, `User with ID ${user.id} already exists`);
    }
    
    await usersCollection.insertOne(user);
    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}