# E-Commerce API

A RESTful API built with ExpressJS and MongoDB, providing CRUD operations. It implements CORS for security and uses JWT for user authentication and authorization.

## Tech Stack

- **Runtime:** Node.js (v16.x)
- **Framework:** ExpressJS (v4)
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT), Crypto-JS
- **Session Management:** Connect-Mongo, Cookie-Parser
- **Email Service:** SendGrid

## Local Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (running locally or a MongoDB Atlas connection string)
- npm or yarn

### Installation

1. Clone the repository and navigate to the `api` directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables (example):
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SENDGRID_API_KEY=your_sendgrid_key
   # Add any other required backend variables
   ```
4. Start the development server (uses nodemon):
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000` (or the port specified in your `.env`).

## Scripts

- `npm start`: Runs the server using `nodemon` for automatic restarts on file changes.
