# 🎬 BookMyShow-like Backend

A backend API for a BookMyShow-like movie ticket booking platform built with Node.js and Express.js.

The project provides APIs for user authentication, movies, theatres, screens, seats, shows, bookings, payments, semantic movie search, caching, media uploads, and admin management.

# 🚀 Features

# 👤 User Management

* User registration
* User login/logout
* Password hashing
* JWT-based authentication
* Access token and refresh token
* Protected routes
* User profile

# 🔐 Authentication & Authorization

* JWT authentication
* Access/refresh token mechanism
* Cookie-based authentication
* Role-based access control
* Admin authorization
* verifyJWT middleware
* isAdmin middleware

# 🎬 Movie Management

* Create movie
* Get all movies
* Get movie by ID
* Update movie
* Delete movie
* Movie filtering
* Movie pagination
* Movie sorting
* Semantic movie search

# 🏢 Theatre Management

* Create theatre
* Get theatres
* Update theatre
* Delete theatre
* Theatre and screen relationship

# 🖥️ Screen Management

* Create screens
* Get screens
* Update screens
* Delete screens
* Screen and seat relationship

# 💺 Seat Management

* Create seats
* Get seats
* Update seats
* Delete seats
* Seat activation/deactivation
* Show-seat availability

# 🎞️ Show Management

* Create shows
* Get shows
* Update shows
* Deactivate shows
* Movie-screen-show relationship

# 🎟️ Booking System

* Create bookings
* Validate shows and seats
* Prevent duplicate seat booking
* Reserve seats
* Calculate booking amount
* Booking cancellation
* Release reserved seats
* MongoDB transaction-based operations were implemented

# 💳 Payment System

* Payment creation
* Payment status handling
* Transaction ID handling
* Payment verification
* SUCCESS / FAILED flows
* Payment history
* Refund handling were implemented

# 🔎 Semantic Search

* Movie embeddings
* Vector data storage
* Vector similarity search
* Semantic movie search
* Combined normal and semantic search

# ⚡ Performance & Caching

* Redis caching
* Movie/show data caching
* Cache invalidation
* MongoDB indexes
* Query optimization

# ☁️ Media Management

* Cloudinary integration
* Movie poster/image uploads
* Multer file upload handling
* Media management

# 📧 Notifications

* Booking-related notifications
* Payment-related notifications
* Cancellation-related notifications
* Email delivery using Resend

# 👨‍💼 Admin Management

Admin-only management APIs are provided for:

* Movies
* Theatres
* Screens
* Seats
* Shows

Admin access is protected using JWT authentication and role-based authorization.

# 🛠️ Tech Stack

**Technology**                      **Purpose**

Node.js                             JavaScript runtime
Express.js                          Backend framework
MongoDB Atlas                       Database
Mongoose                            MongoDB ODM
Redis                               Caching
JWT                                 Authentication
bcrypt                              Password hashing
Cloudinary                          Image/media storage
Multer                              File uploads
Gemini                              Semantic search / embeddings
Resend                              Email delivery
Docker                              Containerization
Azure                               Cloud deployment
Git                                 Version control
GitHub                              Source code hosting
Postman                             API testing


# 📁 Project Structure

BookMyShow-like-Backend/
│
├── public/
│
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   ├── gemini.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── error.middleware.js
│   │   └── multer.middleware.js
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── scripts/
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   ├── app.js
│   └── index.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

`.env` is intentionally not included in the repository structure because it contains environment-specific secrets and configuration.

# 🔑 Authentication Flow

The application uses JWT-based authentication.

User Login
    ↓
Validate Credentials
    ↓
Generate Access Token + Refresh Token
    ↓
Authentication Cookie
    ↓
Protected API Request
    ↓
verifyJWT Middleware
    ↓
User Authorization
    ↓
Controller

### Admin Authentication Flow

Admin Request
    ↓
verifyJWT
    ↓
isAdmin
    ↓
Admin Controller
    ↓
Database Operation

# 🔐 Admin Authorization

Admin APIs are protected using role-based authorization.

A user with:

role: ADMIN

can access administrative operations.

A normal user attempting to access an admin-protected API is rejected with:

`403 Forbidden`

The authorization flow is:

Request
   ↓
verifyJWT
   ↓
Authenticated User
   ↓
isAdmin
   ↓
ADMIN?
 ┌───┴───┐
Yes      No
 ↓        ↓
Allow    403
 ↓
Controller

# 🔎 Movie Search

The project supports traditional filtering/search as well as semantic movie search.

### Traditional Search

Traditional search uses database queries and filtering to find movies based on supported fields and filters.

### Semantic Search

Semantic search uses embeddings to represent movie-related text and perform similarity-based searching.

Search Query
     ↓
Generate Embedding
     ↓
Vector Similarity Search
     ↓
Relevant Movies

# ⚡ Redis Caching

Redis is used to improve application performance by caching frequently requested data.

Client Request
      ↓
Check Redis Cache
      ↓
 ┌────┴────┐
 │         │
Hit       Miss
 │         │
 ↓         ↓
Return   MongoDB
Data       ↓
         Store in Redis
            ↓
         Return Data

# 🎟️ Booking Flow

The booking system validates the requested show and seats before creating a booking.

User Selects Show
       ↓
Select Seats
       ↓
Validate Show
       ↓
Validate Seat Availability
       ↓
Calculate Amount
       ↓
Create Booking
       ↓
Payment
       ↓
Booking Status

The implementation also includes handling for duplicate/invalid seat selections and booking cancellation flows.

# 🧪 API Testing

The APIs are tested using **Postman.**

Testing includes:

* Successful requests
* Authentication failures
* Authorization failures
* Validation errors
* Invalid IDs
* Duplicate seat handling
* Booking/payment flows
* Admin authorization
* Edge cases

# 🌐 API Routes

The backend uses versioned APIs under:

/api/v1

### User APIs

/api/v1/users

### Public Movie APIs

/api/v1/movies

### Theatre APIs

/api/v1/theatres

### Screen APIs

/api/v1/screens

### Seat APIs

/api/v1/seats

### Show APIs

/api/v1/shows

### Booking APIs

/api/v1/bookings

### Payment APIs

/api/v1/payments

### Admin APIs

Current admin management routes are separated from public movie read APIs and are protected using `verifyJWT` and `isAdmin`.

Admin URL restructuring to a dedicated `/api/v1/admin/...` namespace is planned as a subsequent project task.

# ⚙️ Installation & Setup

### 1. Clone the repository

git clone `https://github.com/abpandey4/BookMyShow-like-Backend.git`

### 2. Navigate to the project

```cd BookMyShow-like-Backend```

### 3. Install dependencies

`npm install`

### 4. Configure environment variables

Create a `.env` file in the project root.

Configure the required environment variables for:

* Application/PORT configuration

* MongoDB

* JWT

* Redis

* Cloudinary

* Gemini

* CORS

* RESEND

### 5. Start the development server

npm run dev

The backend will run on the configured application port.

# 🌐 API Base URL

### Development

`http://localhost:8000`

### API Version

/api/v1

# 🐳 Docker

Docker is used to containerize the backend application.

The deployment architecture is:

Application
     ↓
Docker Image
     ↓
Docker Container
     ↓
Backend API

Docker configuration and container testing are part of the deployment stage.

# ☁️ Azure Deployment

The backend is planned for deployment using Microsoft Azure infrastructure.

Target deployment architecture:

Client
   ↓
Azure Infrastructure
   ↓
Backend Container / VM
   ↓
Node.js + Express
   ↓
MongoDB Atlas
   ↓
Redis
   ↓
Cloudinary

Azure deployment and production configuration are part of the final deployment stage.

# 🔒 Security

* The application uses several backend security practices:
* JWT authentication
* Role-based authorization
* Password hashing
* Environment variables for secrets
* Request validation
* CORS configuration
* Centralized error handling
* Protected admin routes
* Secure cookie/token handling
* HTTP security headers using Helmet
* API rate limiting

# 📈 Project Architecture

                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           ↓
                    ┌──────────────┐
                    │   Express    │
                    │     API      │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
        Middleware     Controllers     Routes
              │            │
              │            ↓
              │         Services
              │            │
              └────────────┼─────────────
                           ↓
                    ┌──────────────┐
                    │   MongoDB    │
                    └──────────────┘
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
          Redis        Cloudinary      Gemini
         Caching       Media          Semantic
                                      Search

# 🔄 Backend Request Flow

A typical protected request follows:

Client
  ↓
Express Router
  ↓
Middleware
  ↓
Authentication / Authorization
  ↓
Controller
  ↓
Service Layer
  ↓
Database / External Service
  ↓
Response

Centralized error handling is used to provide consistent error responses.

# 🔧 Environment Configuration

The application uses environment variables for configuration and sensitive credentials.

Typical configuration categories include:

PORT
MONGODB_URI
JWT configuration
REDIS configuration
CLOUDINARY configuration
GEMINI configuration
CORS configuration
RESEND configuration

The exact environment variable names should be taken from the project's `.env` configuration.

# 🎯 Future Improvements

Possible future improvements include:

* Frontend application
* Production payment gateway integration
* Advanced recommendation system
* Monitoring and logging
* CI/CD pipeline
* Kubernetes deployment
* Automated testing
* Advanced observability

# 👨‍💻 Author

Abhishek Pandey

Backend-focused developer building Node.js applications and exploring cloud technologies, distributed systems, and AI-powered applications.

# 📄 License

This project is created for learning, portfolio, and educational purposes.