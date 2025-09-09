# Course Management API

###  Overview
A Course Management API using Node.js, Express.js, and MongoDB. This API will allow users to register/login, browse courses, and purchase them.

## Features

### 1. User Authentication
- Implement JWT-based authentication.
- Two roles: `user` and `admin`.
- Only admin can add or delete courses.

### 2. Course Management
- **Admin can:**
  - Create new course (title, description, price, instructor).
  - Delete any course.
- **Users can:**
  - Get all courses.
  - Get a single course by ID.

### 3. Purchase System
- A logged-in user can purchase a course.
- Save purchase data with `userId`, `courseId`, `amount`, `date`.
- A user can see their purchased courses.

### 4. Validation & Error Handling
- Proper input validation (e.g., email format, required fields).
- Centralized error handling middleware.

## Technical Requirements
- Use Node.js, Express.js, MongoDB (Mongoose).
- Must include a `.env` file setup guide (DB URL, JWT secret, etc.).
- Follow MVC pattern.
- Use `bcrypt` for password hashing.

## Bonus (Optional but Plus Point)
- Implement JSON Web Token (JWT) with Access Token and Refresh Token implementation.
- User Logout with removal of token.


## Installation Guide
1. **Prerequisites**: Ensure you have Node.js (v18+) and MongoDB installed (local or Atlas).
2. Clone the repository:
   ```
   git clone https://github.com/AlNomanCSE/course-management-api.git
   ```
3. Navigate to the project directory:
   ```
   cd course-management-api
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Create a `.env` file in the root directory with the following content (replace with your values):
   ```
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/course-management  # Or your MongoDB Atlas URL
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   ```
   **Note**: Do not commit the `.env` file to GitHub.
6. Start the server:
   ```
   npm run dev
   ```
   The server will run on `http://localhost:5001`.

## API Endpoints
All endpoints return JSON responses. Use `Authorization: Bearer <token>` for protected routes after logging in.

### Authentication Endpoints
- **POST /api/auth/register**
  - **Description**: Register a new user.
  - **Request Body**:
    ```json
    {
      "name": "Abdullah Al Noman",
      "email": "abdullahalnomancse@gmail.com",
      "password": "123456",
      "role": "user"  // Optional, defaults to "user" or "admin"
    }
    ```
  - **Response (201)**:
    ```json
    {
      "success": true,
      "message": "User registered",
      "data": {
        "user": {
          "id": "64fabc1234567890abcdef12",
          "name": "Abdullah Al Noman",
          "email": "abdullahalnomancse@gmail.com",
          "role": "user"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```
  - **Notes**: Validates email and required fields. Returns 400 if email exists.

- **POST /api/auth/login**
  - **Description**: Log in an existing user.
  - **Request Body**:
    ```json
    {
      "email": "abdullahalnomancse@gmail.com",
      "password": "123456"
    }
    ```
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "user": {
          "id": "64fabc1234567890abcdef12",
          "name": "Abdullah Al Noman",
          "email": "abdullahalnomancse@gmail.com",
          "role": "user"
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```
  - **Notes**: Returns 401 for invalid credentials.

- **POST /api/auth/refresh** (Bonus)
  - **Description**: Refresh an expired access token.
  - **Request Body**:
    ```json
    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **Response (200)**:
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **Notes**: Returns 401 if refresh token is invalid.

- **POST /api/auth/logout** (Bonus)
  - **Description**: Log out the user and invalidate the refresh token.
  - **Request Headers**: `Authorization: Bearer <accessToken>`
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```
  - **Notes**: Requires valid access token.

### Course Management Endpoints
- **GET /api/courses**
  - **Description**: Retrieve all courses.
  - **Request**: No body or headers.
  - **Response (200)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "64fabc1234567890abcdef12",
          "title": "Intro to Reactjs",
          "description": "Learn Advance Reactjs",
          "price": 30,
          "instructor": "Al Noman",
          "createdAt": "2025-09-08T07:29:00Z",
          "updatedAt": "2025-09-08T07:29:00Z"
        }
      ]
    }
    ```
  - **Notes**: Public endpoint.

- **GET /api/courses/:id**
  - **Description**: Retrieve a single course by ID.
  - **Request**: URL e.g., `/api/courses/64fabc1234567890abcdef12`
  - **Response (200)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "64fabc1234567890abcdef12",
        "title": "Intro to Reactjs",
        "description": "Learn Advance Reactjs",
        "price": 30,
        "instructor": "Al Noman",
        "createdAt": "2025-09-08T07:29:00Z",
        "updatedAt": "2025-09-08T07:29:00Z"
      }
    }
    ```
  - **Notes**: Returns 404 if not found.

- **POST /api/courses**
  - **Description**: Create a new course (admin only).
  - **Request Body**:
    ```json
    {
      "title": "Advanced Node.js",
      "description": "Deep dive into backend",
      "price": 50,
      "instructor": "Expert Dev"
    }
    ```
  - **Request Headers**: `Authorization: Bearer <accessToken>` (admin role)
  - **Response (201)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "64fabc1234567890abcdef13",
        "title": "Advanced Node.js",
        "description": "Deep dive into backend",
        "price": 50,
        "instructor": "Expert Dev",
        "createdAt": "2025-09-08T08:00:00Z",
        "updatedAt": "2025-09-08T08:00:00Z"
      }
    }
    ```
  - **Notes**: Admin only, validates fields.

- **DELETE /api/courses/:id**
  - **Description**: Delete a course by ID (admin only).
  - **Request**: URL e.g., `/api/courses/64fabc1234567890abcdef12`
  - **Request Headers**: `Authorization: Bearer <accessToken>` (admin role)
  - **Response (200)**:
    ```json
    {
      "success": true,
      "message": "Course deleted"
    }
    ```
  - **Notes**: Admin only, returns 404 if not found.

### Purchase System Endpoints
- **POST /api/purchases**
  - **Description**: Purchase a course (logged-in user only).
  - **Request Body**:
    ```json
    {
      "courseId": "64fabc1234567890abcdef12"
    }
    ```
  - **Request Headers**: `Authorization: Bearer <accessToken>`
  - **Response (201)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "64fabc1234567890abcdef14",
        "user": "user_id_here",
        "course": {
          "_id": "64fabc1234567890abcdef12",
          "title": "Intro to Reactjs",
          "description": "Learn Advance Reactjs",
          "price": 30,
          "instructor": "Al Noman"
        },
        "amount": 30,
        "purchaseDate": "2025-09-08T09:00:00Z",
        "createdAt": "2025-09-08T09:00:00Z",
        "updatedAt": "2025-09-08T09:00:00Z"
      }
    }
    ```
  - **Notes**: Prevents duplicate purchases.

- **GET /api/purchases**
  - **Description**: Retrieve the logged-in user's purchased courses.
  - **Request Headers**: `Authorization: Bearer <accessToken>`
  - **Response (200)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "64fabc1234567890abcdef14",
          "user": "user_id_here",
          "course": {
            "_id": "64fabc1234567890abcdef12",
            "title": "Intro to Reactjs",
            "description": "Learn Advance Reactjs",
            "price": 30,
            "instructor": "Al Noman"
          },
          "amount": 30,
          "purchaseDate": "2025-09-08T09:00:00Z",
          "createdAt": "2025-09-08T09:00:00Z",
          "updatedAt": "2025-09-08T09:00:00Z"
        }
      ]
    }
    ```
  - **Notes**: Shows only the authenticated user's purchases.

