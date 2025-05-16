// src/routes/userRoutes.ts
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import * as userController from '../controllers/userController';
import { handleError } from '../utils/errorHandler';

/**
 * Route handler for user-related endpoints
 */
export async function handleRoutes(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const parsedUrl = parse(req.url || '', true);
    const path = parsedUrl.pathname || '';
    const method = req.method || '';
    
    // GET /load
    if (path === '/load' && method === 'GET') {
      await userController.loadUsers(req, res);
      return;
    }
    
    // DELETE /users
    if (path === '/users' && method === 'DELETE') {
      await userController.deleteUsers(req, res);
      return;
    }
    
    // DELETE /users/:userId
    if (path.match(/^\/users\/\d+$/) && method === 'DELETE') {
      await userController.deleteUser(req, res);
      return;
    }
    
    // GET /users/:userId
    if (path.match(/^\/users\/\d+$/) && method === 'GET') {
      await userController.getUser(req, res);
      return;
    }
    
    // PUT /users
    if (path === '/users' && method === 'PUT') {
      await userController.putUser(req, res);
      return;
    }
    
    // Route not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  } catch (error) {
    const { statusCode, errorResponse } = handleError(error);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(errorResponse));
  }
}