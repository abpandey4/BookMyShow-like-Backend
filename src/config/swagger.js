import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition:{
        openapi: "3.0.0",

        info: {
            title: "BookMyShow Backend API",
            version: "1.0.0",
            description: "REST API documentation for the BookMyShow-like backend application."
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "Local Development Server"
            },
            {
                url: "https://bookmyshow-like-backend.onrender.com",
                description: "Production Server"
            }
        ],

        tags: [
            {
                name: "Health",
                description: "API health check"
            },
            {
                name: "Authentication",
                description: "User authentication and account APIs"
            },
            {
                name: "Movies",
                description: "Movies APIs"
            },
            {
                name: "Theatres",
                description: "Theatre APIs"
            },
            {
                name: "Screens",
                description: "Screen APIS"
            },
            {
                name: "Seats",
                description: "Seat APIs"
            },
            {
                name: "Shows",
                description: "Show APIs"
            },
            {
                name: "Bookings",
                description: "Booking APIs"
            },
            {
                name: "Payments",
                description: "Payments APIs"
            },
            {
                name: "Admin-Movies",
                description: "Admin movie managemnets APIs"
            },
            {
                name: "Admin-Theatres",
                description: "Admin thestre management APIs"
            },
            {
                name: "Admin-Screens",
                description: "Admin Screen management APIs"
            },
            {
                name: "Admin-Seats",
                description: "Admin seat management APIs"
            },
            {
                name: "Admin-Shows",
                description: "Admin show management APIs"
            }
        ],
        components:{
            securitySchemes:{
                bearerAuth:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        paths:{
                       
            // health paths

            "/":{
                get:{
                    tags: ["Health"],
                    summary: "Check Backend status",
                    responses:{
                        200:{
                            description: "Backend is running"
                        }
                    }
                }
            },

            "/api/v1/health":{
                get:{
                    tags:["Health"],
                    summary: "Check API health",
                    responses: {
                        200:{
                            description: "API is healthy"
                        }
                    }
                }
            },

            // Authentication

            "/api/v1/users/register":{
                post: {
                    tags:["Authentication"],
                    summary: "Register a new user",
                    responses: {
                        201:{
                            description: "User registered successfully"
                        },
                        400:{
                            description: "Inavalid request"
                        }
                    }

                }
            },

            "/api/v1/users/login":{
                post:{
                    tags:["Authentication"],
                    summary: "Login Users",
                    responses: {
                        200:{
                            description: "Login Successful"
                        },
                        401:{
                            description: "Inavlid Credentials"
                        }
                    }
                }
            },

            "/api/v1/users/profile":{
                get:{
                    tags:["Authentication"],
                    summary: "Get current user profile",
                    security: [{bearerAuth: []}],
                    responses: {
                        200:{
                            description: "Current User returned"
                        },
                        401:{
                            description: "Unauthorized"
                        }
                    }
                }
            },

            "/api/v1/users/logout":{
                post:{
                    tags:["Authentication"],
                    summary: "Logout Current user",
                    security: [{bearerAuth: []}],
                    responses:{
                        200:{
                            description: "Logout Successfull"
                        }
                    }
                }
            },

            "/api/v1/users/refresh-token":{
                post:{
                    tags:["Authentication"],
                    summary: "Generate a new access token",
                    responses: {
                        200:{
                            description: "Access token refreshed"
                        }
                    }
                }
            },

            // movies-public path

            "/api/v1/movies":{
                get: {
                    tags:["Movies"],
                    summary: "Get all Movies",
                    responses:{
                        200:{
                            description: "List of movies"
                        }
                    }
                }
            },

            "/api/v1/movies/filter":{
                get:{
                    tags:["Movies"],
                    summary: "Filter Movies",
                    parameters:[
                        {
                            name: "genre",
                            in: "query",
                            required: false,
                            schema:{ type: "string"},
                            description: "Filter movies by genre" 
                        },
                        {
                            name: 'language',
                            in: "query",
                            required: false,
                            schema: {type: "string"},
                            description: "Filter movies by language"
                        },
                        {
                            name: "rating",
                            in: "query",
                            required: false,
                            schema: {type: "number"},
                            description: "Movie rating"
                        }
                        
                    ],
                    responses:{
                        200:{
                            description: "Filtered Movies"
                        },
                        404:{
                            description: "No movies found"
                        }
                    }
                }
            },

            "/api/v1/movies/search":{
                get:{
                    tags: ["Movies"],
                    summary: "Semantic Search Movies",
                    description: "Search movies using semantic search based on context of the search query.",
                    parameters:[
                        {
                            name: "query",
                            in: "query",
                            required: true,
                            description: "Search query for semantic movie search",
                            schema:{
                                type: "string",
                                example: "action movie"
                            }
                        }
                    ],
                    responses:{
                        200:{
                            description: "Semantically Relevant movies"
                        },
                        400:{
                            description: "Search query is required"
                        }
                    }
                }
            },

            "/api/v1/movies/{movieId}":{
                get:{
                    tags:["Movies"],
                    summary: "Get movies by ID",
                    parameters: [
                        {
                            name: "movieId",
                            in: "path",
                            schema:{
                                type: "string"
                            }
                        }
                    ],
                    responses:{
                        200:{
                            description: "Movie returned "
                        },
                        404:{
                            description: "Movie not found"
                        }
                    }
                }
            },

            // theatre- public paths

            "/api/v1/theatres":{
                get:{
                    tags:["Theatres"],
                    summary: "Get all theatres",
                    responses:{
                        200:{
                            description: "List of Theatres"
                        }
                    }
                }
            },

            "/api/v1/theatres/{theatreId}":{
                get:{
                    tags:["Theatres"],
                    summary: "Get theatre by ID",
                    parameters:[
                        {
                            name: "theatreId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Theatre reutrned"
                        },
                        404:{
                            description: "Theatre not found"
                        }
                    }
                }
            },

            // screens-public path

            "api/v1/screens":{
                get:{
                    tags:["Screens"],
                    summary: "Get all Screens",
                    responses:{
                        200:{
                            description: "List of Screens returned"
                        }
                    }
                }
            },

            "/api/v1/screens/{screenId}":{
                get:{
                   tags:["Screens"],
                   summary: "get screens by ID",
                   parameters: [
                    {
                        name: "screenId",
                        in: "path",
                        required: true, 
                        schema: { type: "string"}
                    }
                   ],
                   responses:{
                    200:{
                        description: "Screen reutrned"
                    },
                    404:{
                        description: "Screen not found"
                    }
                   }
                }
            },

            // seats-public path

            "/api/v1/seats":{
                get:{
                    tags:["Seats"],
                    summary: "Get all seats",
                    responses:{
                        200:{
                            description: "List of seats"
                        }
                    }
                }   
            },

            "/api/v1/seats/{seatId}":{
                get:{
                    tags:["Seats"],
                    summary: "Get seat by ID",
                    parameters:[
                        {
                            name: "seatId",
                            in: "path",
                            required: true,
                            schema: { type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Seat returned"
                        },
                        404:{
                            description: "Seat not found"
                        }
                    }
                }    
            },

            // shows- public path

            "/api/v1/shows":{
                get:{
                    tags:["Shows"],
                    summary: "Get all Shows",
                    responses: {
                        200:{
                            description: "Lit of shows returned"
                        }
                    }
                }
            },
            "/api/v1/shows/{showId}":{
                get:{
                    tags:["Shows"],
                    summary: "Get show by ID",
                    parameters:[
                        {
                            name: "showId",
                            in: "path",
                            required: true,
                            schema: { type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Show returned"
                        },
                        404:{
                            description: "Show not found"
                        }
                    }
                }
            },
            "/api/v1/shows/{showId}/seats":{
                get:{
                    tags:["Shows"],
                    summary: "Get availability seats for a show",
                    parameters:[
                        {
                            name: "showId",
                            in: "path",
                            required: true,
                            schema:{ type: "string"}
                        }
                    ],
                    responses: {
                        200:{
                            description: "Available seats returned"
                        }
                    }
                }
            },

            "/api/v1/shows/{showId}/details":{
                get:{
                    tags:["Shows"],
                    summary: "Get show details",
                    parameters:[
                        {
                            name: "showId",
                            in: "path",
                            required: true,
                            schema: { type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Show details returned"
                        }
                    }
                }
            },

            // bookings

            "/api/v1/bookings":{
                post:{
                    tags:["Bookings"],
                    summary: "Create a booking",
                    security:[{ bearerAuth: []}],
                    responses:{
                        201:{
                            description: "Booking created successfully"
                        },
                        401:{
                            description: " Unauthorized "
                        }
                    }
                }
            },

            "/api/v1/bookings/my-booking":{
                get:{
                    tags:["Bookings"],
                    summary: "Get current user's bookings",
                    security: [{ bearerAuth: []}],
                    responses: {
                        200:{
                            description: "User Bookings returned"
                        },
                        401:{
                            description: "Unauthorized"
                        }
                    }
                }
            },
            "/api/v1/bookings/{bookingId}":{
                get:{
                    tags:["Bookings"],
                    summary: "Get booking by ID",
                    security:[{ bearerAuth: []}],
                    parameters:[
                        {
                            name: "bookingId",
                            in: "path",
                            required: true,
                            schema: { type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Booking returned"
                        },
                        404:{
                            description: "Booking not found"
                        }
                    }
                }
            },
            "/api/v1/bookings/{bookingId}/cancel":{
                patch:{
                    tags:["Bookings"],
                    summary: "Cancel Booking",
                    security: [{bearerAuth: []}],
                    parameters: [
                        {
                            name: "bookingId",
                            in: "path",
                            required: true,
                            schema: { type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Booking Cancelled successfully"
                        }
                    }
                }
            },

            // payments

            "/api/v1/payments/create-payment":{
                post:{
                    tags:["Payments"],
                    summary: "Create payment",
                    security: [{ bearerAuth: []}],
                    responses:{
                        201:{
                            description: "Payment Created"
                        },
                        401:{
                            description: "Unauthorized"
                        }
                    }
                }
            },
            "/api/v1/payments":{
                get:{
                    tags:["Payments"],
                    summary: "Get current user's payments",
                    security: [{ bearerAuth: []}],
                    responses:{
                        200:{
                            description: "Payments returned"
                        }
                    }
                }
            },
            "/api/v1/payments/{paymentId}":{
                get:{
                    tags:["Payments"],
                    summary: "Get payment by ID",
                    security:[{ bearerAuth: []}],
                    parameters:[
                        {
                            name: "paymentId",
                            in: "path",
                            required: true,
                            schema:{ type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Payment returned"
                        }
                    }
                }
            },
            "/api/v1/payments/update-payment-status/{paymentId}": {
                patch: {
                    tags: ["Payments"],
                    summary: "Update payment status",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "paymentId",
                            in: "path",
                            required: true,

                            schema: {
                                type: "string"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description: "Payment status updated"
                        }
                    }
                }
            },
            "/api/v1/payments/refund/{paymentId}": {
                patch: {
                    tags: ["Payments"],
                    summary: "Request payment refund",

                    security: [
                        {
                            bearerAuth: []
                        }
                    ],

                    parameters: [
                        {
                            name: "paymentId",
                            in: "path",
                            required: true,

                            schema: {
                                type: "string"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description: "Refund requested"
                        }
                    }
                }
            },
            "/api/v1/payments/process-refund/{paymentId}": {
                patch: {
                    tags: ["Payments"],
                    summary: "Process payment refund",

                    parameters: [
                        {
                            name: "paymentId",
                            in: "path",
                            required: true,

                            schema: {
                                type: "string"
                            }
                        }
                    ],

                    responses: {
                        200: {
                            description: "Refund processed"
                        }
                    }
                }
            },

            // admin-movies path

            "/api/v1/admin/movies":{
                post:{
                    tags:["Admin-Movies"],
                    summary: "Create movie",
                    security: [{bearerAuth: []}],
                    requestBody:{
                        required: true,
                        content:{
                            "multipart/form-data":{
                                schema:{
                                    type: "object",

                                    properties:{
                                        poster:{
                                            type: "string",
                                            format: "binary"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses:{
                        201:{
                            description: "Movie created successfully"
                        },
                        401:{
                            description: "Unauthorized"
                        },
                        403:{
                            description: "Admin access required"
                        }
                    }
                }
            },

            "/api/v1/admin/movies/{movieId}":{
                patch:{
                    tags:["Admin-Movies"],
                    summary: "Update Movie",
                    security: [{bearerAuth: []}],
                    parameters: [
                        {
                            name: "movieId",
                            in: "path",
                            required: true,
                            schema: { type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Movie updated successfully"
                        },
                        401:{
                            description: "Unauthorized"
                        },
                        403:{
                            description: "Admin access required"
                        }
                    }
                },
                delete:{
                    tags:["Admin-Movies"],
                    summary: "Delete movie",
                    security: [{bearerAuth: []}],
                    parameters:[
                        {
                            name: "movieId",
                            in:"path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Movie deleted successfully"
                        }
                    }
                }
            },

            // admin-theatre path

            "/api/v1/admin/theatres": {
                post: {
                    tags: ["Admin-Theatres"],
                    summary: "Create theatre",
                    security: [{bearerAuth: []}],
                    responses: {
                        201: {
                            description: "Theatre created successfully"
                        },
                        403: {
                            description: "Admin access required"
                        }
                    }
                }
            },

            "/api/v1/admin/theatres/{theatreId}": {
                patch: {
                    tags: ["Admin-Theatres"],
                    summary: "Update theatre",
                    security: [{bearerAuth: []}],
                    parameters: [
                        {
                            name: "theatreId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses: {
                        200: {
                            description: "Theatre updated successfully"
                        }
                    }
                },
                delete: {
                    tags: ["Admin-Theatres"],
                    summary: "Delete theatre",
                    security: [{bearerAuth: []}],
                    parameters: [
                        {
                            name: "theatreId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses: {
                        200: {
                            description: "Theatre deleted successfully"
                        }
                    }
                }
            },

            // admin- screen path

            "/api/v1/admin/screens": {
                post: {
                    tags: ["Admin-Screens"],
                    summary: "Create screen",
                    security: [{bearerAuth: []}],
                    responses: {
                        201: {
                            description: "Screen created successfully"
                        }
                    }
                }
            },

            "/api/v1/admin/screens/{screenId}": {
                patch: {
                    tags: ["Admin-Screens"],
                    summary: "Update screen",
                    security: [{bearerAuth: []}],
                    parameters: [
                        {
                            name: "screenId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses: {
                        200: {
                            description: "Screen updated successfully"
                        }
                    }
                },

                delete: {
                    tags: ["Admin-Screens"],
                    summary: "Delete screen",
                    security: [{bearerAuth: []}],
                    parameters: [
                        {
                            name: "screenId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses: {
                        200: {
                            description: "Screen deleted successfully"
                        }
                    }
                }
            },

            // admin-seats path

            "/api/v1/admin/seats": {
                post: {
                    tags: ["Admin-Seats"],
                    summary: "Create seat",
                    security: [{bearerAuth: []}],
                    responses: {
                        201: {
                            description: "Seat created successfully"
                        }
                    }
                }
            },

            "/api/v1/admin/seats/{seatId}": {
                patch: {
                    tags: ["Admin-Seats"],
                    summary: "Update seat",
                    security: [{bearerAuth: []}],
                    parameters: [
                        {
                            name: "seatId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses: {
                        200: {
                            description: "Seat updated successfully"
                        }
                    }
                },

                delete: {
                    tags: ["Admin-Seats"],
                    summary: "Delete seat",
                    security: [{bearerAuth: []}],
                    parameters: [
                        {
                            name: "seatId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses: {
                        200: {
                            description: "Seat deleted successfully"
                        }
                    }
                }
            },

            // admin-shows

            "/api/v1/admin/shows": {
                post: {
                    tags: ["Admin-Shows"],
                    summary: "Create show",
                    security: [{bearerAuth: []}],
                    responses: {
                        201: {
                            description: "Show created successfully"
                        }
                    }
                }
            },

            "/api/v1/admin/shows/{showId}": {
                patch: {
                    tags: ["Admin-Shows"],
                    summary: "Update show",
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    parameters: [
                        {
                            name: "showId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses: {
                        200: {
                            description: "Show updated successfully"
                        }
                    }
                },
                delete:{
                    tags:["Admin-Shows"],
                    summary: "Delete show",
                    security: [{ bearerAuth: []}],
                    parameters:[
                        {
                            name: "showId",
                            in: "path",
                            required: true,
                            schema: {type: "string"}
                        }
                    ],
                    responses:{
                        200:{
                            description: "Show deleted successfully"
                        }
                    }
                }
            }
        }
    },
    apis: []

};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;