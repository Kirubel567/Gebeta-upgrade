# Gebeta API Documentation

> **Version:** 1.0  
> **Base URL:** `http://localhost:3000/api` (Development)  
> **Production URL:** `https://api.gebeta.com/api`  
> **Last Updated:** January 19, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Businesses API](#businesses-api)
6. [Reviews API](#reviews-api)
7. [Deliveries API](#deliveries-api)
8. [Menu Items API](#menu-items-api)
9. [Users API](#users-api)
10. [Applications API](#applications-api)
11. [Data Models](#data-models)

---

## Overview

The Gebeta API is a RESTful service designed to power a campus-based food discovery platform for Addis Ababa University. It provides endpoints for managing businesses, reviews, deliveries, menu items, user accounts, and business applications.

### Key Features

- **Campus-Specific:** Tailored for AAU campus locations (4K, 5K, 6K dormitories)
- **Multi-Category:** Supports on-campus, off-campus, and delivery services
- **Ethiopian Context:** Prices in ETB, local food items, and location data
- **Review System:** User-generated ratings and reviews
- **Real-Time Data:** Up-to-date business hours, menu items, and availability

### Technology Stack

- **Runtime:** Node.js (Native HTTP Module)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Currency:** Ethiopian Birr (ETB)

---

## Authentication

### JWT Bearer Token

Protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Authentication Levels

| Level | Description | Endpoints |
|-------|-------------|-----------|
| **Public** | No authentication required | GET businesses, reviews, deliveries |
| **User** | Registered user token | POST reviews, GET profile |
| **Admin** | Admin role required | POST/PUT/DELETE businesses, approve applications |
| **Owner** | Resource owner or admin | PUT/DELETE own reviews |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "pages": 16
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "rating",
        "message": "Rating must be between 1 and 5"
      }
    ]
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., user already reviewed) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## Businesses API

### 1. List All Businesses

**Endpoint:** `GET /api/businesses`

**Description:** Retrieve a paginated list of all businesses with optional filtering and sorting.

**Authentication:** None

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page (max 50) |
| `category` | string | - | Filter by category: `on-campus`, `off-campus`, `delivery` |
| `sort` | string | `rating` | Sort by: `rating`, `newest`, `name` |
| `search` | string | - | Fuzzy search by business name |
| `featured` | boolean | - | Filter featured businesses only |

**Example Request:**

```http
GET /api/businesses?page=1&limit=10&category=on-campus&sort=rating
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "b1",
      "name": "Student Center Cafeteria",
      "slug": "student-center-cafeteria",
      "category": "on-campus",
      "description": "The central hub for student dining. Offers traditional and modern meals.",
      "isFeatured": true,
      "rating": {
        "average": 4.2,
        "count": 156
      },
      "location": {
        "address": "6k Campus, Main Hall",
        "coordinates": {
          "lat": 9.03,
          "lng": 38.75
        }
      },
      "image": [
        {
          "url": "https://images.unsplash.com/photo-1567529684892-09290a1b2d05",
          "isPrimary": true
        }
      ],
      "hours": {
        "openTime": "07:00 AM",
        "closeTime": "08:00 PM"
      },
      "createdAt": "2026-01-10T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "pages": 16
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 2. Get Business by ID

**Endpoint:** `GET /api/businesses/:id`

**Description:** Retrieve detailed information about a specific business, including menu items and recent reviews.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Business ID (e.g., `b1`) |

**Example Request:**

```http
GET /api/businesses/b1
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "b1",
    "name": "Student Center Cafeteria",
    "slug": "student-center-cafeteria",
    "category": "on-campus",
    "description": "The central hub for student dining. Offers traditional and modern meals.",
    "isFeatured": true,
    "rating": {
      "average": 4.2,
      "count": 156
    },
    "location": {
      "address": "6k Campus, Main Hall",
      "coordinates": {
        "lat": 9.03,
        "lng": 38.75
      }
    },
    "image": [
      {
        "url": "https://images.unsplash.com/photo-1567529684892-09290a1b2d05",
        "isPrimary": true
      }
    ],
    "hours": {
      "openTime": "07:00 AM",
      "closeTime": "08:00 PM"
    },
    "menu": [
      {
        "id": "m1",
        "itemName": "Special Beyaynetu",
        "price": 85,
        "isPopular": true,
        "rating": 4.8
      },
      {
        "id": "m2",
        "itemName": "Chicken Pasta",
        "price": 120,
        "isPopular": false,
        "rating": 3.5
      }
    ],
    "recentReviews": [
      {
        "id": "r1",
        "user": {
          "name": "Abebe Kebede",
          "avatar": "https://i.pravatar.cc/150?img=1"
        },
        "rating": 5,
        "body": "Best place for traditional food on campus!",
        "createdAt": "2026-01-15T10:30:00Z"
      }
    ],
    "createdAt": "2026-01-10T08:00:00Z"
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 3. Get Featured Businesses

**Endpoint:** `GET /api/businesses/featured`

**Description:** Retrieve a list of featured/top-rated businesses for the homepage.

**Authentication:** None

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 6 | Number of featured businesses to return |

**Example Request:**

```http
GET /api/businesses/featured?limit=6
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "b1",
      "name": "Student Center Cafeteria",
      "slug": "student-center-cafeteria",
      "category": "on-campus",
      "description": "The central hub for student dining. Offers traditional and modern meals.",
      "isFeatured": true,
      "rating": {
        "average": 4.2,
        "count": 156
      },
      "location": {
        "address": "6k Campus, Main Hall"
      },
      "image": [
        {
          "url": "https://images.unsplash.com/photo-1567529684892-09290a1b2d05",
          "isPrimary": true
        }
      ]
    }
  ],
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 4. Get Businesses by Category

**Endpoint:** `GET /api/businesses/category/:category`

**Description:** Filter businesses by category (on-campus, off-campus, delivery).

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Category: `on-campus`, `off-campus`, or `delivery` |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |

**Example Request:**

```http
GET /api/businesses/category/on-campus?page=1&limit=10
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "b1",
      "name": "Student Center Cafeteria",
      "slug": "student-center-cafeteria",
      "category": "on-campus",
      "rating": {
        "average": 4.2,
        "count": 156
      },
      "location": {
        "address": "6k Campus, Main Hall"
      },
      "image": [
        {
          "url": "https://images.unsplash.com/photo-1567529684892-09290a1b2d05",
          "isPrimary": true
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 5. Create Business

**Endpoint:** `POST /api/businesses`

**Description:** Create a new business listing (Admin only).

**Authentication:** Required (Admin)

**Request Body:**

```json
{
  "name": "New Campus Cafe",
  "slug": "new-campus-cafe",
  "category": "on-campus",
  "description": "A cozy cafe serving coffee and pastries",
  "location": {
    "address": "5k Campus, Building 3",
    "coordinates": {
      "lat": 9.02,
      "lng": 38.76
    }
  },
  "hours": {
    "openTime": "08:00 AM",
    "closeTime": "06:00 PM"
  },
  "image": [
    {
      "url": "https://example.com/image.jpg",
      "isPrimary": true
    }
  ]
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "b123",
    "name": "New Campus Cafe",
    "slug": "new-campus-cafe",
    "category": "on-campus",
    "description": "A cozy cafe serving coffee and pastries",
    "rating": {
      "average": 0,
      "count": 0
    },
    "createdAt": "2026-01-19T08:00:00Z"
  },
  "message": "Business created successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 6. Update Business

**Endpoint:** `PUT /api/businesses/:id`

**Description:** Update an existing business (Admin only).

**Authentication:** Required (Admin)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Business ID |

**Request Body:**

```json
{
  "description": "Updated description",
  "hours": {
    "openTime": "07:00 AM",
    "closeTime": "09:00 PM"
  },
  "isFeatured": true
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "b1",
    "name": "Student Center Cafeteria",
    "description": "Updated description",
    "hours": {
      "openTime": "07:00 AM",
      "closeTime": "09:00 PM"
    },
    "isFeatured": true,
    "updatedAt": "2026-01-19T08:00:00Z"
  },
  "message": "Business updated successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 7. Delete Business

**Endpoint:** `DELETE /api/businesses/:id`

**Description:** Delete a business (Admin only).

**Authentication:** Required (Admin)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Business ID |

**Example Response:**

```json
{
  "success": true,
  "message": "Business deleted successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

## Reviews API

### 1. List All Reviews

**Endpoint:** `GET /api/reviews`

**Description:** Retrieve a paginated list of all reviews.

**Authentication:** None

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |
| `sort` | string | `newest` | Sort by: `newest`, `oldest`, `highest`, `lowest` |

**Example Request:**

```http
GET /api/reviews?page=1&limit=10&sort=newest
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "r1",
      "business": {
        "id": "b1",
        "name": "Student Center Cafeteria",
        "slug": "student-center-cafeteria"
      },
      "user": {
        "id": "u1",
        "name": "Abebe Kebede",
        "avatar": "https://i.pravatar.cc/150?img=1"
      },
      "rating": 5,
      "body": "Best place for traditional food on campus!",
      "helpfulCount": 12,
      "isApproved": true,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 342,
    "pages": 35
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 2. Get Reviews for Business

**Endpoint:** `GET /api/reviews/business/:businessId`

**Description:** Retrieve all reviews for a specific business.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `businessId` | string | Business ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |
| `sort` | string | `newest` | Sort by: `newest`, `highest`, `lowest` |

**Example Request:**

```http
GET /api/reviews/business/b1?page=1&limit=5&sort=highest
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "r1",
      "user": {
        "id": "u1",
        "name": "Abebe Kebede",
        "avatar": "https://i.pravatar.cc/150?img=1"
      },
      "rating": 5,
      "body": "Best place for traditional food on campus!",
      "helpfulCount": 12,
      "createdAt": "2026-01-15T10:30:00Z"
    },
    {
      "id": "r2",
      "user": {
        "id": "u2",
        "name": "Tigist Alemu",
        "avatar": "https://i.pravatar.cc/150?img=2"
      },
      "rating": 4,
      "body": "Great food, but sometimes crowded during lunch hours.",
      "helpfulCount": 8,
      "createdAt": "2026-01-14T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 156,
    "pages": 32
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 3. Get Recent Reviews

**Endpoint:** `GET /api/reviews/recent`

**Description:** Get the most recent reviews across all businesses.

**Authentication:** None

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 10 | Number of recent reviews |

**Example Request:**

```http
GET /api/reviews/recent?limit=5
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "r1",
      "business": {
        "id": "b1",
        "name": "Student Center Cafeteria",
        "slug": "student-center-cafeteria"
      },
      "user": {
        "id": "u1",
        "name": "Abebe Kebede",
        "avatar": "https://i.pravatar.cc/150?img=1"
      },
      "rating": 5,
      "body": "Best place for traditional food on campus!",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 4. Create Review

**Endpoint:** `POST /api/reviews`

**Description:** Submit a new review for a business (User must be authenticated).

**Authentication:** Required (User)

**Request Body:**

```json
{
  "businessId": "b1",
  "rating": 5,
  "body": "Amazing food and great service! Highly recommend the Special Beyaynetu."
}
```

**Validation Rules:**

- `businessId`: Required, must be a valid business ID
- `rating`: Required, integer between 1-5
- `body`: Required, string with max 500 characters
- User can only submit one review per business

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "r123",
    "business": {
      "id": "b1",
      "name": "Student Center Cafeteria"
    },
    "user": {
      "id": "u1",
      "name": "Abebe Kebede"
    },
    "rating": 5,
    "body": "Amazing food and great service! Highly recommend the Special Beyaynetu.",
    "helpfulCount": 0,
    "isApproved": true,
    "createdAt": "2026-01-19T08:00:00Z"
  },
  "message": "Review submitted successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

**Error Response (Duplicate Review):**

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_REVIEW",
    "message": "You have already reviewed this business"
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 5. Update Review

**Endpoint:** `PUT /api/reviews/:id`

**Description:** Update your own review.

**Authentication:** Required (Owner)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Review ID |

**Request Body:**

```json
{
  "rating": 4,
  "body": "Updated review text after second visit."
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "r123",
    "rating": 4,
    "body": "Updated review text after second visit.",
    "isEdited": true,
    "updatedAt": "2026-01-19T08:00:00Z"
  },
  "message": "Review updated successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 6. Delete Review

**Endpoint:** `DELETE /api/reviews/:id`

**Description:** Delete your own review (or any review if admin).

**Authentication:** Required (Owner/Admin)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Review ID |

**Example Response:**

```json
{
  "success": true,
  "message": "Review deleted successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

## Deliveries API

### 1. List Delivery Services

**Endpoint:** `GET /api/deliveries`

**Description:** Retrieve a list of delivery services with optional filtering.

**Authentication:** None

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |
| `sort` | string | `top-rated` | Sort by: `fast`, `low-fee`, `top-rated` |
| `location` | string | - | Filter by serviced area: `4k`, `5k`, `6k` |
| `available` | boolean | - | Filter by availability |

**Example Request:**

```http
GET /api/deliveries?sort=fast&location=6k
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "d1",
      "name": "Campus Express Delivery",
      "description": "Fast and reliable delivery service for AAU students",
      "servicedAreas": ["5k", "6k", "4k"],
      "deliverySpeed": "fast",
      "averageDeliveryTime": 25,
      "deliveryFee": {
        "min": 15,
        "max": 30
      },
      "hours": {
        "openTime": "08:00 AM",
        "closeTime": "10:00 PM",
        "orderCutoff": "09:30 PM"
      },
      "contact": {
        "phone": "+251911234567",
        "telegram": "@campusexpress"
      },
      "logo": "https://example.com/logo.png",
      "rating": {
        "average": 4.5,
        "count": 89
      },
      "isActive": true,
      "createdAt": "2026-01-05T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "pages": 2
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 2. Get Top Delivery Services

**Endpoint:** `GET /api/deliveries/top`

**Description:** Get the top 5 highest-rated delivery services.

**Authentication:** None

**Example Request:**

```http
GET /api/deliveries/top
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "d1",
      "name": "Campus Express Delivery",
      "deliverySpeed": "fast",
      "averageDeliveryTime": 25,
      "deliveryFee": {
        "min": 15,
        "max": 30
      },
      "rating": {
        "average": 4.5,
        "count": 89
      },
      "servicedAreas": ["5k", "6k", "4k"]
    }
  ],
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 3. Get Delivery by ID

**Endpoint:** `GET /api/deliveries/:id`

**Description:** Retrieve detailed information about a specific delivery service.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Delivery service ID |

**Example Request:**

```http
GET /api/deliveries/d1
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "d1",
    "name": "Campus Express Delivery",
    "description": "Fast and reliable delivery service for AAU students",
    "servicedAreas": ["5k", "6k", "4k"],
    "deliverySpeed": "fast",
    "averageDeliveryTime": 25,
    "deliveryFee": {
      "min": 15,
      "max": 30
    },
    "hours": {
      "openTime": "08:00 AM",
      "closeTime": "10:00 PM",
      "orderCutoff": "09:30 PM"
    },
    "contact": {
      "phone": "+251911234567",
      "telegram": "@campusexpress"
    },
    "logo": "https://example.com/logo.png",
    "rating": {
      "average": 4.5,
      "count": 89
    },
    "isActive": true,
    "createdAt": "2026-01-05T08:00:00Z"
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 4. Create Delivery Service

**Endpoint:** `POST /api/deliveries`

**Description:** Add a new delivery service (Admin only).

**Authentication:** Required (Admin)

**Request Body:**

```json
{
  "name": "New Delivery Service",
  "description": "Description of the service",
  "servicedAreas": ["5k", "6k"],
  "deliverySpeed": "standard",
  "averageDeliveryTime": 35,
  "deliveryFee": {
    "min": 20,
    "max": 40
  },
  "hours": {
    "openTime": "09:00 AM",
    "closeTime": "09:00 PM"
  },
  "contact": {
    "phone": "+251912345678",
    "telegram": "@newdelivery"
  }
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "d123",
    "name": "New Delivery Service",
    "deliverySpeed": "standard",
    "rating": {
      "average": 0,
      "count": 0
    },
    "isActive": true,
    "createdAt": "2026-01-19T08:00:00Z"
  },
  "message": "Delivery service created successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

## Menu Items API

### 1. Get Menu for Business

**Endpoint:** `GET /api/menu/:businessId`

**Description:** Retrieve all menu items for a specific business.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `businessId` | string | Business ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `category` | string | - | Filter by category: `breakfast`, `main`, `drinks` |
| `available` | boolean | - | Filter by availability |

**Example Request:**

```http
GET /api/menu/b1?available=true
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "m1",
      "business": {
        "id": "b1",
        "name": "Student Center Cafeteria"
      },
      "itemName": "Special Beyaynetu",
      "description": "A traditional Ethiopian platter with assorted vegetables and injera",
      "price": 85,
      "currency": "ETB",
      "category": "main",
      "image": "https://example.com/beyaynetu.jpg",
      "rating": 4.8,
      "isPopular": true,
      "isAvailable": true,
      "createdAt": "2026-01-10T08:00:00Z"
    },
    {
      "id": "m2",
      "business": {
        "id": "b1",
        "name": "Student Center Cafeteria"
      },
      "itemName": "Chicken Pasta",
      "description": "Creamy pasta with grilled chicken",
      "price": 120,
      "currency": "ETB",
      "category": "main",
      "image": "https://example.com/pasta.jpg",
      "rating": 3.5,
      "isPopular": false,
      "isAvailable": true,
      "createdAt": "2026-01-10T08:00:00Z"
    }
  ],
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 2. Get Top-Rated Menu Items

**Endpoint:** `GET /api/menu/:businessId/top`

**Description:** Get the top-rated menu items for a business.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `businessId` | string | Business ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 5 | Number of top items to return |

**Example Request:**

```http
GET /api/menu/b1/top?limit=3
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "m1",
      "itemName": "Special Beyaynetu",
      "price": 85,
      "rating": 4.8,
      "isPopular": true
    }
  ],
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 3. Create Menu Item

**Endpoint:** `POST /api/menu`

**Description:** Add a new menu item to a business (Admin only).

**Authentication:** Required (Admin)

**Request Body:**

```json
{
  "businessId": "b1",
  "itemName": "Tibs with Rice",
  "description": "Spicy beef tibs served with rice",
  "price": 95,
  "category": "main",
  "image": "https://example.com/tibs.jpg",
  "isPopular": false,
  "isAvailable": true
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "m123",
    "businessId": "b1",
    "itemName": "Tibs with Rice",
    "price": 95,
    "currency": "ETB",
    "rating": 0,
    "isAvailable": true,
    "createdAt": "2026-01-19T08:00:00Z"
  },
  "message": "Menu item created successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 4. Update Menu Item

**Endpoint:** `PUT /api/menu/:id`

**Description:** Update a menu item (Admin only).

**Authentication:** Required (Admin)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Menu item ID |

**Request Body:**

```json
{
  "price": 100,
  "isAvailable": false
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "m1",
    "itemName": "Special Beyaynetu",
    "price": 100,
    "isAvailable": false,
    "updatedAt": "2026-01-19T08:00:00Z"
  },
  "message": "Menu item updated successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 5. Delete Menu Item

**Endpoint:** `DELETE /api/menu/:id`

**Description:** Delete a menu item (Admin only).

**Authentication:** Required (Admin)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Menu item ID |

**Example Response:**

```json
{
  "success": true,
  "message": "Menu item deleted successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

## Users API

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account.

**Authentication:** None

**Request Body:**

```json
{
  "email": "student@aau.edu.et",
  "password": "SecurePass123!",
  "name": "Abebe Kebede",
  "university": "AAU",
  "dormitory": "6k",
  "yearOfStudy": "2nd Year"
}
```

**Validation Rules:**

- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters
- `name`: Required, minimum 2 characters
- `dormitory`: Optional, one of: `4k`, `5k`, `6k`

**Example Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u123",
      "email": "student@aau.edu.et",
      "name": "Abebe Kebede",
      "university": "AAU",
      "dormitory": "6k",
      "role": "user",
      "isVerified": false,
      "createdAt": "2026-01-19T08:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate a user and receive a JWT token.

**Authentication:** None

**Request Body:**

```json
{
  "email": "student@aau.edu.et",
  "password": "SecurePass123!"
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u1",
      "email": "student@aau.edu.et",
      "name": "Abebe Kebede",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

**Error Response (Invalid Credentials):**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 3. Logout User

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout the current user (invalidate token).

**Authentication:** Required (User)

**Example Response:**

```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 4. Get Current User Profile

**Endpoint:** `GET /api/users/me`

**Description:** Retrieve the authenticated user's profile.

**Authentication:** Required (User)

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "u1",
    "email": "student@aau.edu.et",
    "name": "Abebe Kebede",
    "avatar": "https://i.pravatar.cc/150?img=1",
    "university": "AAU",
    "dormitory": "6k",
    "yearOfStudy": "2nd Year",
    "role": "user",
    "isVerified": true,
    "reviewCount": 12,
    "createdAt": "2025-09-01T08:00:00Z",
    "lastLogin": "2026-01-19T07:30:00Z"
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 5. Update User Profile

**Endpoint:** `PUT /api/users/me`

**Description:** Update the authenticated user's profile.

**Authentication:** Required (User)

**Request Body:**

```json
{
  "name": "Abebe K. Mengistu",
  "dormitory": "5k",
  "yearOfStudy": "3rd Year",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "u1",
    "name": "Abebe K. Mengistu",
    "dormitory": "5k",
    "yearOfStudy": "3rd Year",
    "avatar": "https://example.com/new-avatar.jpg",
    "updatedAt": "2026-01-19T08:00:00Z"
  },
  "message": "Profile updated successfully",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 6. Get User's Reviews

**Endpoint:** `GET /api/users/:id/reviews`

**Description:** Get all reviews submitted by a specific user.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |

**Example Request:**

```http
GET /api/users/u1/reviews?page=1&limit=5
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "r1",
      "business": {
        "id": "b1",
        "name": "Student Center Cafeteria",
        "slug": "student-center-cafeteria"
      },
      "rating": 5,
      "body": "Best place for traditional food on campus!",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "pages": 3
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

## Applications API

### 1. Submit Business Application

**Endpoint:** `POST /api/applications`

**Description:** Submit a new business listing application (public form).

**Authentication:** None

**Request Body:**

```json
{
  "businessName": "Yeshi's Coffee House",
  "location": "Near 5k Campus Gate",
  "description": "Traditional Ethiopian coffee and snacks",
  "applicantEmail": "yeshi@example.com",
  "applicantPhone": "+251911234567"
}
```

**Validation Rules:**

- `businessName`: Required, minimum 3 characters
- `location`: Required
- `description`: Optional, max 500 characters
- `applicantEmail`: Optional, valid email format
- `applicantPhone`: Optional

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "a123",
    "businessName": "Yeshi's Coffee House",
    "location": "Near 5k Campus Gate",
    "status": "pending",
    "createdAt": "2026-01-19T08:00:00Z"
  },
  "message": "Application submitted successfully. We'll review it soon!",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 2. List All Applications

**Endpoint:** `GET /api/applications`

**Description:** Retrieve all business applications (Admin only).

**Authentication:** Required (Admin)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page |
| `status` | string | - | Filter by status: `pending`, `approved`, `rejected` |

**Example Request:**

```http
GET /api/applications?status=pending&page=1&limit=10
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "a1",
      "businessName": "Yeshi's Coffee House",
      "location": "Near 5k Campus Gate",
      "description": "Traditional Ethiopian coffee and snacks",
      "applicantEmail": "yeshi@example.com",
      "applicantPhone": "+251911234567",
      "status": "pending",
      "createdAt": "2026-01-18T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 23,
    "pages": 3
  },
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 3. Approve Application

**Endpoint:** `PUT /api/applications/:id/approve`

**Description:** Approve a business application and create the business (Admin only).

**Authentication:** Required (Admin)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Application ID |

**Request Body:**

```json
{
  "reviewNotes": "Approved. Business created successfully.",
  "businessData": {
    "slug": "yeshis-coffee-house",
    "category": "off-campus",
    "hours": {
      "openTime": "07:00 AM",
      "closeTime": "07:00 PM"
    }
  }
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "application": {
      "id": "a1",
      "status": "approved",
      "reviewedAt": "2026-01-19T08:00:00Z",
      "businessId": "b456"
    },
    "business": {
      "id": "b456",
      "name": "Yeshi's Coffee House",
      "slug": "yeshis-coffee-house",
      "category": "off-campus",
      "createdAt": "2026-01-19T08:00:00Z"
    }
  },
  "message": "Application approved and business created",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

### 4. Reject Application

**Endpoint:** `PUT /api/applications/:id/reject`

**Description:** Reject a business application (Admin only).

**Authentication:** Required (Admin)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Application ID |

**Request Body:**

```json
{
  "reviewNotes": "Insufficient information provided. Please resubmit with more details."
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "a1",
    "status": "rejected",
    "reviewNotes": "Insufficient information provided. Please resubmit with more details.",
    "reviewedAt": "2026-01-19T08:00:00Z"
  },
  "message": "Application rejected",
  "timestamp": "2026-01-19T08:00:00Z"
}
```

---

## Data Models

### Business Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const BusinessSchema = new Schema({
  // Basic Info
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true
  },
  description: { 
    type: String, 
    maxLength: 1000 
  },
  
  // Categorization
  category: {
    type: String,
    enum: ['on-campus', 'off-campus', 'delivery'],
    required: true
  },
  tags: [{ type: String }], // e.g., 'fast-food', 'cafe', 'ethiopian'
  
  // Location
  location: {
    address: { type: String },
    dormitories: [{ type: String }], // ['5K', '6K', '4K']
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Media
  image: [{
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Business Hours
  hours: {
    openTime: { type: String }, // "07:00 AM"
    closeTime: { type: String }, // "08:00 PM"
    closedDays: [{ type: String }] // ['Sunday']
  },
  
  // Contact
  contact: {
    phone: String,
    telegram: String,
    instagram: String
  },
  
  // Features (for filtering)
  features: {
    hasDelivery: { type: Boolean, default: false },
    isGroupFriendly: { type: Boolean, default: false },
    priceRange: { 
      type: String, 
      enum: ['$', '$$', '$$$'],
      default: '$$'
    }
  },
  
  // Ratings (denormalized for performance)
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Ownership
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
BusinessSchema.index({ category: 1, 'rating.average': -1 });
BusinessSchema.index({ name: 'text', description: 'text' });
BusinessSchema.index({ slug: 1 });
BusinessSchema.index({ isFeatured: 1, 'rating.average': -1 });

// Virtual for menu items
BusinessSchema.virtual('menu', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'business'
});

module.exports = mongoose.model('Business', BusinessSchema);
```

---

### Review Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  // References
  business: { 
    type: Schema.Types.ObjectId, 
    ref: 'Business',
    required: true,
    index: true
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  
  // Content
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  body: { 
    type: String, 
    required: true,
    maxLength: 500
  },
  
  // Optional media
  images: [{ 
    url: String,
    caption: String 
  }],
  
  // Engagement
  helpfulCount: { type: Number, default: 0 },
  
  // Moderation
  isApproved: { type: Boolean, default: true },
  isEdited: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Compound index for unique constraint (one review per user per business)
ReviewSchema.index({ business: 1, user: 1 }, { unique: true });
ReviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
```

---

### Delivery Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeliverySchema = new Schema({
  // Basic Info
  name: { type: String, required: true },
  description: { type: String },
  
  // Service Area
  servicedAreas: [{
    type: String // '5K', '6K', '4K', etc.
  }],
  
  // Service Features
  deliverySpeed: {
    type: String,
    enum: ['fast', 'standard', 'slow'],
    default: 'standard'
  },
  averageDeliveryTime: { type: Number }, // in minutes
  deliveryFee: {
    min: { type: Number },
    max: { type: Number }
  },
  
  // Operating Hours
  hours: {
    openTime: String,
    closeTime: String,
    orderCutoff: String // "18:00" - Order until this time
  },
  
  // Contact
  contact: {
    phone: String,
    telegram: String
  },
  
  // Media
  logo: { type: String },
  
  // Ratings
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  // Status
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
DeliverySchema.index({ 'rating.average': -1 });
DeliverySchema.index({ deliverySpeed: 1 });
DeliverySchema.index({ 'deliveryFee.min': 1 });

module.exports = mongoose.model('Delivery', DeliverySchema);
```

---

### MenuItem Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
  // Reference
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  
  // Item Details
  itemName: { type: String, required: true },
  description: { type: String },
  price: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'ETB' 
  },
  
  // Categorization
  category: { type: String }, // 'breakfast', 'main', 'drinks'
  
  // Media
  image: { type: String },
  
  // Ratings (item-level)
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  // Availability
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
MenuItemSchema.index({ business: 1, category: 1 });
MenuItemSchema.index({ business: 1, isPopular: -1 });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
```

---

### User Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  // Identity
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String, 
    default: null 
  },
  
  // University Info
  university: { 
    type: String, 
    default: 'AAU' 
  },
  dormitory: { type: String },  // 4K, 5K, 6K
  yearOfStudy: { type: String }, // Freshman, 2nd Year, etc.
  
  // Roles & Status
  role: { 
    type: String, 
    enum: ['user', 'admin', 'business_owner'],
    default: 'user'
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  lastLogin: { type: Date }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for review count
UserSchema.virtual('reviewCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
  count: true
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ university: 1, dormitory: 1 });

// Hide password hash in JSON responses
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

module.exports = mongoose.model('User', UserSchema);
```

---

### Application Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ApplicationSchema = new Schema({
  // Applicant Info
  businessName: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  
  // Contact
  applicantEmail: { type: String },
  applicantPhone: { type: String },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Admin Review
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewNotes: { type: String },
  reviewedAt: { type: Date },
  
  // If approved, link to created business
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' }
}, {
  timestamps: true
});

// Index
ApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);
```

---

## Rate Limiting

All API endpoints are rate-limited to prevent abuse:

| Endpoint Type | Rate Limit |
|---------------|------------|
| Public GET requests | 100 requests/minute |
| Authenticated requests | 200 requests/minute |
| POST/PUT/DELETE | 50 requests/minute |
| Auth endpoints (login/register) | 10 requests/minute |

**Rate Limit Headers:**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642579200
```

---

## Pagination

All list endpoints support pagination with the following query parameters:

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | - | Current page number |
| `limit` | integer | 10 | 50 | Items per page |

**Pagination Response:**

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "pages": 16,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Filtering and Sorting

### Common Filter Parameters

| Parameter | Applies To | Values |
|-----------|------------|--------|
| `category` | Businesses | `on-campus`, `off-campus`, `delivery` |
| `sort` | Businesses, Reviews | `rating`, `newest`, `name`, `highest`, `lowest` |
| `search` | Businesses | Fuzzy search string |
| `featured` | Businesses | `true`, `false` |
| `available` | Menu Items, Deliveries | `true`, `false` |
| `location` | Deliveries | `4k`, `5k`, `6k` |

---

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for frontend integration:

**Allowed Origins:**
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`
- Production domain (to be configured)

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- Content-Type, Authorization

---

## Changelog

### Version 1.0 (January 19, 2026)

- Initial API documentation
- Core CRUD endpoints for businesses, reviews, deliveries, menu items
- User authentication and profile management
- Business application workflow
- Rate limiting and pagination
- Ethiopian context (ETB currency, AAU locations)

---

## Support

For API support, please contact:

- **Email:** api-support@gebeta.com
- **Documentation:** https://docs.gebeta.com
- **GitHub Issues:** https://github.com/gebeta/api/issues

---

**Note:** This API is designed specifically for the Addis Ababa University campus community. All location references (4K, 5K, 6K dormitories), food items (Beyaynetu, Tibs), and pricing (ETB) reflect the local context.
