# 🎬 BookMyShow-like Backend

A production-oriented backend API for a BookMyShow-like movie ticket booking platform built with **Node.js, Express.js, MongoDB, Redis, and Docker**.

The project provides APIs for:

* User authentication and authorization
* Admin management
* Movies
* Theatres
* Screens
* Seats
* Shows
* Seat availability and booking
* Redis-based temporary seat locking
* Payments and refunds
* Email notifications
* Semantic movie search using embeddings
* Caching
* Media uploads
* Docker-based containerization

The project follows a modular backend architecture with separate routes, controllers, models, services, middlewares, utilities, and configuration layers.

## 🚀 Features

### 👤 User Management

* User registration
* User login/logout
* Password hashing
* JWT-based authentication
* Access token and refresh token
* Protected routes
* User profile

### 🔐 Authentication & Authorization

* JWT authentication
* Access/refresh token mechanism
* Cookie-based authentication
* Role-based access control
* Admin authorization
* verifyJWT middleware
* isAdmin middleware

### 🎬 Movie Management

* Create movie
* Get all movies
* Get movie by ID
* Update movie
* Delete movie
* Movie filtering
* Movie pagination
* Movie sorting
* Semantic movie search

### 🏢 Theatre Management

* Create theatre
* Get theatres
* Update theatre
* Delete theatre
* Theatre and screen relationship

### 🖥️ Screen Management

* Create screens
* Get screens
* Update screens
* Delete screens
* Screen and seat relationship

### 💺 Seat Management

* Create seats
* Get seats
* Update seats
* Delete seats
* Seat activation/deactivation
* Show-seat availability

### 🎞️ Show Management

* Create shows
* Get shows
* Update shows
* Deactivate shows
* Movie-screen-show relationship

### 🎟️ Booking System

* Show and seat validation
* Seat availability checking
* Temporary seat locking using Redis
* Duplicate seat prevention
* PENDING booking creation
* Automatic seat lock release
* Booking confirmation after successful payment
* Payment failure handling
* MongoDB transactions for booking consistency

### ⚡ Redis

* Redis-based temporary seat locking
* Automatic lock expiration
* Seat lock ownership validation
* Lock release after successful or failed payment

### 🔎 Semantic Search

* AI-powered semantic movie search
* Search based on meaning and context rather than exact keyword matching
* Vector embeddings for movie search

### 💳 Payment System

* Payment creation
* Payment status handling
* Transaction ID handling
* Payment verification
* SUCCESS / FAILED flows
* Payment history
* Refund handling were implemented

### 🔎 Semantic Search

The project implements AI-powered semantic movie search using **text embeddings and vector similarity search**.

### How it works

```text
Search Query
    ↓
Generate Embedding
    ↓
Vector Similarity Search
    ↓
Retrieve Relevant Movies
```

### Features

* Movie text embeddings
* Vector data storage
* Vector similarity search
* Meaning-based movie search
* Combination of Traditional and Semantic Search

### ⚡ Performance & Caching

* Redis caching
* Movie/show data caching
* Cache invalidation
* MongoDB indexes
* Query optimization

### ☁️ Media Management

* Cloudinary integration
* Movie poster/image uploads
* Multer file upload handling
* Media management

### 📧 Notifications

* Booking-related notifications
* Payment-related notifications
* Cancellation-related notifications
* Email delivery using Resend

### 👨‍💼 Admin Management

The backend provides protected admin APIs for managing the movie booking infrastructure.

Admin operations include:

* Movies
* Theatres
* Screens
* Seats
* Shows

Admin routes are protected using:

* `verifyJWT` middleware
* `isAdmin` middleware
* Role-based authorization

Only users with:

```js
role: "ADMIN"
```

## 🛠️ Tech Stack

### Backend
* Node.js
* Express.js
* JavaScript (ES6+)

### Database
* MongoDB
* MongoDB Atlas
* Mongoose

### Caching & Locking
* Redis

### Middleware & Security
* JWT
* bcrypt
* HTTP-only cookies
* Express Rate Limit
* Helmet
* Multer
* CORS

### File & Media Storage
* Cloudinary

### Email Notifications
* Resend

### AI / Search
* Semantic Search
* Vector Embeddings

### DevOps & Deployment
* Docker
* Azure
* Git
* GitHub

### API Testing
* Postman


## 📁 Project Structure

```text
BookMyShow-like-Backend/
│
├── public/
│   └── temp/
│
├── src/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   ├── gemini.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   ├── booking.controller.js
│   │   ├── movie.controller.js
│   │   ├── payment.controller.js
│   │   ├── screen.controller.js
│   │   ├── seat.controller.js
│   │   ├── show.controller.js
│   │   ├── theatre.controller.js
│   │   └── user.controller.js
│   │
│   ├── middlewares/
│   │   ├── admin.middleware.js
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── multer.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── models/
│   │   ├── booking.model.js
│   │   ├── movie.model.js
│   │   ├── payment.model.js
│   │   ├── screen.model.js
│   │   ├── seat.model.js
│   │   ├── show.model.js
│   │   ├── showSeat.model.js
│   │   ├── theatre.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── admin.movie.route.js
│   │   ├── admin.screen.route.js
│   │   ├── admin.seat.route.js
│   │   ├── admin.show.route.js
│   │   ├── admin.theatre.route.js
│   │   ├── booking.route.js
│   │   ├── index.js
│   │   ├── movie.route.js
│   │   ├── payment.route.js
│   │   ├── screen.route.js
│   │   ├── seat.route.js
│   │   ├── show.route.js
│   │   ├── theatre.route.js
│   │   └── user.route.js
│   │
│   ├── scripts/
│   │   ├── createAdmin.js
│   │   └── generateMovieEmbeddings.js
│   │
│   ├── services/
│   │   ├── cache.service.js
│   │   ├── cloudinary.service.js
│   │   ├── embedding.service.js
│   │   ├── notification.service.js
│   │   └── seatLock.service.js
│   │
│   └── utils/
│       ├── apiError.js
│       ├── apiResponse.js
│       ├── asyncHandler.js
│       ├── movie.utils.js
│       └── movieText.js
│
├── app.js
├── index.js
├── testEmbedding.js
│
├── .dockerignore
├── .env.example
├── .env.docker.example
├── .gitignore
│
├── docker-compose.yml
├── Dockerfile
│
├── package.json
├── package-lock.json
└── README.md
```

### 🔑 Authentication Flow

The application uses JWT-based authentication.

```text
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
```

### Admin Authentication Flow

```text
Admin Request
    ↓
verifyJWT
    ↓
isAdmin
    ↓
Admin Controller
    ↓
Database Operation
```

### 🔐 Admin Authorization

Admin APIs are protected using role-based authorization.

A user with:

role: ADMIN

can access administrative operations.

A normal user attempting to access an admin-protected API is rejected with:

`403 Forbidden`

The authorization flow is:

```text
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
```

### 🔎 Movie Search

The project supports traditional filtering/search as well as semantic movie search.

### Traditional Search

Traditional search uses database queries and filtering to find movies based on supported fields and filters.

### Semantic Search

Semantic search uses embeddings to represent movie-related text and perform similarity-based searching.

```text
Search Query
     ↓
Generate Embedding
     ↓
Vector Similarity Search
     ↓
Relevant Movies
```

### ⚡ Redis Caching

Redis is used to improve application performance by caching frequently requested data.

```text
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
```

### 🎟️ Booking Flow

The booking system uses MongoDB transactions and Redis-based temporary seat locking to handle seat reservations safely.

```text
User Selects Show
       ↓
Select Seats
       ↓
Validate Show & Seats
       ↓
Check ShowSeat Availability
       ↓
Acquire Redis Seat Lock
       ↓
Create PENDING Booking
       ↓
Create Payment
       ↓
Payment Processing
       ↓
   ┌───────────────┐
   ↓               ↓
SUCCESS          FAILED
   ↓               ↓
Book Seats       Release Redis Locks
Permanently
   ↓
Booking CONFIRMED
   ↓
Release Redis Locks

```

### Redis Seat Locking

Selected seats are temporarily locked in Redis while the payment is pending.

Redis key format:

`seatLock:<showId>:<seatId>`

The lock automatically expires after the configured timeout if the payment is not completed.

Before confirming a successful payment, the system verifies that every selected seat is still locked by the requesting user.

### Payment & Seat Confirmation

For a successful payment:

- Payment status → `SUCCESS`
- Show seats → `BOOKED`
- Booking status → `CONFIRMED`
- Booking payment status → `PAID`
- Redis seat locks → Released

For a failed payment:

* Payment status → `FAILED`
* Booking payment status → `FAILED`
* Redis seat locks → Released

The implementation also handles duplicate/invalid seat selections, unavailable seats, expired Redis locks, booking cancellation, and MongoDB transaction rollback.

### 🧪 API Testing

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

### 🌐 API Routes

### User Routes

* `api/v1/users`
* `api/v1/movies`
* `/api/v1/theatres`  
* `/api/v1/screens`  
* `/api/v1/seats`  
* `/api/v1/shows`  
* `/api/v1/bookings`  
* `/api/v1/payments`

### Admin Routes

Admin management APIs are separated under the `/api/v1/admin/...` namespace and are protected using `verifyJWT` and `isAdmin`.

* `/api/v1/admin/movies`  
* `/api/v1/admin/theatres`  
* `/api/v1/admin/screens`  
* `/api/v1/admin/seats`  
* `/api/v1/admin/shows`


### ⚙️ Installation & Setup

#### 1. Clone the repository

git clone `https://github.com/abpandey4/BookMyShow-like-Backend.git`

#### 2. Navigate to the project

```cd BookMyShow-like-Backend```

#### 3. Install dependencies

`npm install`

#### 4. Configure environment variables

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

#### 5. Start the development server

npm run dev

The backend will run on the configured application port.

### 🌐 API Base URL

#### Development

`http://localhost:8000`

#### API Version

/api/v1

### 🐳 Docker

Docker is used to containerize the backend application.

The deployment architecture is:

```text
Application
     ↓
Docker Image
     ↓
Docker Container
     ↓
Backend API
```

Docker configuration and container testing are part of the deployment stage.

### ☁️ Azure Deployment

The backend has been deployed and tested on a Microsoft Azure Ubuntu Virtual Machine using Docker and Docker Compose.

#### Deployment Architecture

Client
↓
Azure Public IP
↓
Azure Network Security Group
↓
Azure Ubuntu VM
↓
Docker Compose
├── Node.js + Express Backend
└── Redis
↓
MongoDB Atlas


#### Azure Infrastructure

- **Azure Virtual Machine** — Ubuntu 24.04 LTS
- **Node.js** — v24
- **Docker** — Containerized backend deployment
- **Docker Compose** — Used to orchestrate the backend and Redis services
- **Redis** — Running as a Docker container
- **MongoDB Atlas** — Cloud database
- **Azure Network Security Group (NSG)** — TCP port `8000` configured for API access

#### Docker Services

The application uses two Docker Compose services:

**Backend**

```text
Container: bms-backend
Port: 8000
```

### 🔒 Security

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

### 📈 Project Architecture

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

### 🔄 Backend Request Flow

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

### 🔧 Environment Configuration

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

### 🎯 Future Improvements

Possible future improvements include:

* Frontend application
* Production payment gateway integration
* Advanced recommendation system
* Monitoring and logging
* CI/CD pipeline
* Kubernetes deployment
* Automated testing
* Advanced observability

### 👨‍💻 Author

Abhishek Pandey

Backend-focused developer building Node.js applications and exploring cloud technologies, distributed systems, and AI-powered applications.

### 📄 License

This project is created for learning, portfolio, and educational purposes.
