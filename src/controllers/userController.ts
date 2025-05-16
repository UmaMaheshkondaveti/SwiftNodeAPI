// src/controllers/userController.ts
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { loadUsersWithPostsAndComments } from '../services/dataService';
import { saveUsers, deleteAllUsers, deleteUserById, getUserById, createUser } from '../services/userService';
import { User } from '../models/types';
import { ApiError, handleError } from '../utils/errorHandler';
import { validateUser } from '../utils/validateUser';

/**
 * Parse JSON body from request
 */
async function parseJsonBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const bodyParts: Uint8Array[] = [];
    req.on('data', (chunk) => {
      bodyParts.push(chunk);
    });
    req.on('end', () => {
      try {
        const body = Buffer.concat(bodyParts).toString();
        const data = JSON.parse(body) as T;
        resolve(data);
      } catch (error) {
        reject(new ApiError(400, 'Invalid JSON body'));
      }
    });
    req.on('error', (error) => {
      reject(new ApiError(400, `Error parsing request body: ${error.message}`));
    });
  });
}

/**
 * Send JSON response
 */
function sendJsonResponse<T>(res: ServerResponse, statusCode: number, data: T): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Load users from JSONPlaceholder API and save to database
 */
export async function loadUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const users = await loadUsersWithPostsAndComments();
    await saveUsers(users);
    
    // Return empty response with 200 status code
    res.writeHead(200);
    res.end();
  } catch (error) {
    const { statusCode, errorResponse } = handleError(error);
    sendJsonResponse(res, statusCode, errorResponse);
  }
}

/**
 * Delete all users
 */
export async function deleteUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    await deleteAllUsers();
    sendJsonResponse(res, 200, { message: 'All users deleted successfully' });
  } catch (error) {
    const { statusCode, errorResponse } = handleError(error);
    sendJsonResponse(res, statusCode, errorResponse);
  }
}

/**
 * Delete user by ID
 */
export async function deleteUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const parsedUrl = parse(req.url || '', true);
    const path = parsedUrl.pathname || '';
    const userId = parseInt(path.split('/').pop() || '', 10);
    
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID');
    }
    
    await deleteUserById(userId);
    sendJsonResponse(res, 200, { message: `User with ID ${userId} deleted successfully` });
  } catch (error) {
    const { statusCode, errorResponse } = handleError(error);
    sendJsonResponse(res, statusCode, errorResponse);
  }
}

/**
 * Get user by ID
 */
export async function getUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const parsedUrl = parse(req.url || '', true);
    const path = parsedUrl.pathname || '';
    const userId = parseInt(path.split('/').pop() || '', 10);
    
    if (isNaN(userId)) {
      throw new ApiError(400, 'Invalid user ID');
    }
    
    const user = await getUserById(userId);
    sendJsonResponse(res, 200, user);
  } catch (error) {
    const { statusCode, errorResponse } = handleError(error);
    sendJsonResponse(res, statusCode, errorResponse);
  }
}

/**
 * Create a new user
 */
export async function putUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const userData = await parseJsonBody<User>(req);
    
    // Validate user data
    validateUser(userData);
    
    const createdUser = await createUser(userData);
    sendJsonResponse(res, 201, createdUser);
  } catch (error) {
    const { statusCode, errorResponse } = handleError(error);
    sendJsonResponse(res, statusCode, errorResponse);
  }
}