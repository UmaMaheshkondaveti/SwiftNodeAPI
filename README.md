### Swift Node API's


Node.js REST API with MongoDB
A simple Node.js web server with REST APIs, utilizing MongoDB for storing user, post, and comment data.

Features
TypeScript implementation for type safety
REST API endpoints for user management
MongoDB integration for data persistence
Data loading from JSONPlaceholder API
Project Structure
![image](https://github.com/user-attachments/assets/ad6d2a04-8e6a-469c-aa08-da716a429809)

Prerequisites
Node.js (latest LTS version)
MongoDB installed and running locally on default port 27017
MongoDB Compass (optional, for database visualization)
Installation
Clone the repository
Install dependencies:
bash
npm install
MongoDB Setup
The application is configured to connect to MongoDB at mongodb://localhost:27017/ and will create a database named user_management_api.

If you're using MongoDB Compass:

Make sure MongoDB is running
Open MongoDB Compass
Connect to mongodb://localhost:27017/
The application will automatically create the necessary database and collections
No manual database or collection creation is required.

Running the Application
To start the server:

bash
npm start
This will start the server at http://localhost:3000.

API Endpoints
GET /load
Description: Fetches 10 users from JSONPlaceholder API with their posts and comments, and stores them in MongoDB.
Response: Empty response with HTTP status code 200 on success.
Example: curl -X GET http://localhost:3000/load
DELETE /users
Description: Deletes all users from the database.
Response: Success message with status code 200.
Example: curl -X DELETE http://localhost:3000/users
DELETE /users/:userId
Description: Deletes a specific user by ID.
Response: Success message if deleted, 404 error if user not found.
Example: curl -X DELETE http://localhost:3000/users/1
GET /users/:userId
Description: Retrieves a specific user with their posts and comments.
Response: User object with 200 status code, 404 if user not found.
Example: curl -X GET http://localhost:3000/users/1
PUT /users
Description: Adds a new user to the database.
Request Body: User object (including posts and comments if any).
Response: Created user with 201 status code, 400 if user already exists.
Example: curl -X PUT http://localhost:3000/users -H "Content-Type: application/json" -d @sample-user.json
Testing the API
The simplest way to test the API is to:

Start the server: npm start
Load initial data: curl -X GET http://localhost:3000/load
Get a user: curl -X GET http://localhost:3000/users/1
Add a new user: curl -X PUT http://localhost:3000/users -H "Content-Type: application/json" -d @sample-user.json
Delete a user: curl -X DELETE http://localhost:3000/users/1
You can also use tools like Postman for testing.

Verification with MongoDB Compass
After performing API operations, you can verify the results in MongoDB Compass:

Open MongoDB Compass
Connect to mongodb://localhost:27017/
Select the user_management_api database
Check the users collection
Error Handling
The API follows REST conventions for error responses:

200 OK for successful requests
201 Created for successful resource creation
400 Bad Request for invalid inputs
404 Not Found if a resource doesn't exist
500 Internal Server Error for server issues
Error responses have a consistent format:

json
{
  "error": "Error message"
}
Technology Stack
Node.js
TypeScript
MongoDB
Native HTTP module (no Express or other frameworks)
