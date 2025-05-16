// src/index.ts
import { createServer } from 'http';
import { connectToDatabase, closeConnection } from './config/db';
import { handleRoutes } from './routes/userRoutes';

const PORT = 3000;

// Create HTTP server
const server = createServer(async (req, res) => {
  try {
    await handleRoutes(req, res);
  } catch (error) {
    console.error('Unhandled server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Available endpoints:');
      console.log('  GET    /load                - Load users from JSONPlaceholder');
      console.log('  GET    /users/:userId       - Get user by ID with posts and comments');
      console.log('  PUT    /users               - Create a new user');
      console.log('  DELETE /users               - Delete all users');
      console.log('  DELETE /users/:userId       - Delete a specific user');
    });
    
    // Handle server shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      server.close();
      await closeConnection();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Initialize the server
startServer();