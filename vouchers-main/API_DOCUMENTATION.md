# VoucherTrade API Documentation

## Overview

This document provides a complete reference for all API endpoints in the VoucherTrade application. All endpoints return JSON responses.

**Base URL**: `http://localhost:3000/api` (development)

---

## Authentication

### Login
**POST** `/auth/login`

Authenticates a user with email and password credentials.

#### Request
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Response (200 OK)
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "buyer"
  }
}
```

#### Error Responses
- **400 Bad Request**: Missing email or password
- **401 Unauthorized**: Invalid email or password
- **500 Internal Server Error**: Database or server error

---

### Register
**POST** `/auth/register`

Creates a new user account with the specified email and password.

#### Request
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "role": "buyer"
}
```

#### Response (201 Created)
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "newuser@example.com",
    "role": "buyer"
  }
}
```

#### Error Responses
- **400 Bad Request**: Missing required fields or invalid email format
- **409 Conflict**: Email already registered
- **500 Internal Server Error**: Database or server error

---

## Vouchers

### Get All Vouchers
**GET** `/vouchers`

Retrieves all approved vouchers available for purchase.

#### Query Parameters
- `category` (optional): Filter by category (e.g., "Shopping", "Entertainment")
- `retailer` (optional): Filter by retailer name
- `minPrice` (optional): Minimum face value in ZAR
- `maxPrice` (optional): Maximum face value in ZAR

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "brand": "Takealot",
    "logo": "https://...",
    "category": "Shopping",
    "faceValue": 500,
    "buyerPrice": 450,
    "expiryDate": "2026-12-31T23:59:59Z",
    "status": "APPROVED",
    "verified": true,
    "seller": {
      "id": 5,
      "email": "seller@example.com"
    }
  }
]
```

#### Error Responses
- **500 Internal Server Error**: Database error

---

### Get Single Voucher
**GET** `/vouchers/[id]`

Retrieves detailed information about a specific voucher.

#### URL Parameters
- `id`: Voucher ID (number)

#### Response (200 OK)
```json
{
  "id": 1,
  "brand": "Takealot",
  "logo": "https://...",
  "category": "Shopping",
  "faceValue": 500,
  "buyerPrice": 450,
  "expiryDate": "2026-12-31T23:59:59Z",
  "status": "APPROVED",
  "verified": true,
  "description": "Takealot shopping voucher",
  "quantity": 3,
  "seller": {
    "id": 5,
    "email": "seller@example.com",
    "rating": 4.8
  }
}
```

#### Error Responses
- **404 Not Found**: Voucher not found
- **500 Internal Server Error**: Database error

---

### Get Vouchers by Retailer
**GET** `/vouchers/retailer/[name]`

Retrieves all approved vouchers from a specific retailer.

#### URL Parameters
- `name`: Retailer name (string, URL-encoded)

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "brand": "Takealot",
    // ... voucher object
  },
  {
    "id": 2,
    "brand": "Takealot",
    // ... voucher object
  }
]
```

#### Error Responses
- **404 Not Found**: Retailer not found
- **500 Internal Server Error**: Database error

---

### Upload Voucher (Seller)
**POST** `/vouchers/upload`

Allows sellers to upload new vouchers to the platform.

#### Request
```json
{
  "brand": "Takealot",
  "category": "Shopping",
  "faceValue": 500,
  "expiryDate": "2026-12-31T23:59:59Z",
  "logo": "https://...",
  "quantity": 1,
  "description": "Takealot shopping voucher"
}
```

#### Response (201 Created)
```json
{
  "message": "Voucher uploaded successfully",
  "voucher": {
    "id": 10,
    "brand": "Takealot",
    "category": "Shopping",
    "faceValue": 500,
    "status": "PENDING",
    "verified": false,
    "createdAt": "2026-02-10T10:30:00Z"
  }
}
```

#### Error Responses
- **400 Bad Request**: Invalid data or missing required fields
- **401 Unauthorized**: User not authenticated or not a seller
- **413 Payload Too Large**: Upload exceeds size limit
- **500 Internal Server Error**: Database or upload error

#### Notes
- Voucher status starts as "PENDING" until admin verification
- Minimum face value: R500
- Logo can be URL or base64 encoded image

---

## Orders

### Create Order
**POST** `/orders`

Creates a new order for one or more vouchers.

#### Request
```json
{
  "items": [
    {
      "voucherId": 1,
      "quantity": 2
    },
    {
      "voucherId": 3,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "Johannesburg",
    "province": "Gauteng",
    "postalCode": "2000",
    "country": "South Africa"
  }
}
```

#### Response (201 Created)
```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "totalAmount": 1350,
    "quantity": 3,
    "status": "PENDING",
    "items": [
      {
        "voucherId": 1,
        "quantity": 2,
        "price": 450
      }
    ],
    "createdAt": "2026-02-10T10:30:00Z",
    "paymentUrl": "https://payshap.io/..."
  }
}
```

#### Error Responses
- **400 Bad Request**: Invalid order data
- **401 Unauthorized**: User not authenticated
- **404 Not Found**: Voucher not found
- **409 Conflict**: Insufficient voucher stock
- **500 Internal Server Error**: Database or payment gateway error

#### Notes
- Prices are calculated as 90% of face value (buyer discount)
- Order status transitions: PENDING → PROCESSING → COMPLETE/FAILED
- Payment redirect URL is provided for checkout

---

### Get User Orders
**GET** `/orders?userId=[id]`

Retrieves all orders for a specific user.

#### Query Parameters
- `userId`: User ID (required)
- `status` (optional): Filter by status (PENDING, PROCESSING, COMPLETE, FAILED)
- `limit` (optional): Number of orders to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)

#### Response (200 OK)
```json
{
  "orders": [
    {
      "id": 1,
      "totalAmount": 1350,
      "status": "COMPLETE",
      "items": [
        {
          "voucherId": 1,
          "brand": "Takealot",
          "quantity": 2,
          "price": 450
        }
      ],
      "createdAt": "2026-02-10T10:30:00Z",
      "completedAt": "2026-02-10T11:00:00Z"
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **404 Not Found**: User not found
- **500 Internal Server Error**: Database error

---

## User

### Get User Profile
**GET** `/user/profile`

Retrieves the current authenticated user's profile information.

#### Response (200 OK)
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "buyer",
  "createdAt": "2025-01-15T08:00:00Z",
  "stats": {
    "totalOrders": 5,
    "totalSpent": 2000,
    "favoriteCategory": "Shopping"
  }
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **404 Not Found**: User not found
- **500 Internal Server Error**: Database error

---

### Get User Vouchers
**GET** `/user/vouchers`

Retrieves all vouchers associated with the current user (seller's vouchers or buyer's purchases).

#### Query Parameters
- `status` (optional): Filter by status (PENDING, APPROVED, REJECTED, PURCHASED)
- `limit` (optional): Number of vouchers to return (default: 20)

#### Response (200 OK)
```json
{
  "vouchers": [
    {
      "id": 1,
      "brand": "Takealot",
      "faceValue": 500,
      "status": "APPROVED",
      "createdAt": "2026-01-15T08:00:00Z"
    }
  ],
  "total": 10
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **500 Internal Server Error**: Database error

---

### Get Sales Statistics
**GET** `/user/sales`

Retrieves sales statistics for a seller account.

#### Response (200 OK)
```json
{
  "totalVouchers": 15,
  "totalSold": 8,
  "totalRevenue": 2800,
  "avgPricePerVoucher": 350,
  "monthlyStats": [
    {
      "month": "January 2026",
      "sold": 3,
      "revenue": 1050
    },
    {
      "month": "February 2026",
      "sold": 5,
      "revenue": 1750
    }
  ]
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not a seller
- **500 Internal Server Error**: Database error

---

### Get Payout Information
**GET** `/user/payouts`

Retrieves payout history and pending payouts for a seller.

#### Query Parameters
- `status` (optional): Filter by status (PENDING, PROCESSED, FAILED)
- `limit` (optional): Number of payouts to return (default: 20)

#### Response (200 OK)
```json
{
  "pending": {
    "amount": 500,
    "vouchersSold": 2
  },
  "payouts": [
    {
      "id": 1,
      "amount": 700,
      "status": "PROCESSED",
      "processedDate": "2026-01-31T00:00:00Z",
      "method": "bank_transfer"
    }
  ],
  "totalEarnings": 2800,
  "nextPayoutDate": "2026-03-01T00:00:00Z"
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not a seller
- **500 Internal Server Error**: Database error

---

### Get Dashboard Statistics
**GET** `/user/stats`

Retrieves dashboard statistics for a user (different data based on role).

#### Response - Buyer (200 OK)
```json
{
  "role": "buyer",
  "cartItems": 3,
  "savedAmount": 150,
  "totalPurchases": 8,
  "favoriteRetailer": "Takealot",
  "recentPurchases": 5
}
```

#### Response - Seller (200 OK)
```json
{
  "role": "seller",
  "activeListings": 5,
  "pendingApproval": 2,
  "rejectedVouchers": 1,
  "totalSales": 8,
  "totalEarnings": 2800,
  "pendingPayouts": 500,
  "conversionRate": 0.53
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **500 Internal Server Error**: Database error

---

## Admin

### Get Pending Vouchers
**GET** `/admin/vouchers`

Retrieves all vouchers pending admin verification.

#### Query Parameters
- `limit` (optional): Number of vouchers to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)

#### Response (200 OK)
```json
{
  "vouchers": [
    {
      "id": 10,
      "brand": "Takealot",
      "faceValue": 500,
      "category": "Shopping",
      "status": "PENDING",
      "createdAt": "2026-02-09T14:30:00Z",
      "seller": {
        "id": 5,
        "email": "seller@example.com"
      }
    }
  ],
  "total": 15,
  "limit": 20,
  "offset": 0
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not an admin
- **500 Internal Server Error**: Database error

---

### Approve Voucher
**POST** `/admin/vouchers/[id]/approve`

Approves a pending voucher for listing.

#### URL Parameters
- `id`: Voucher ID

#### Response (200 OK)
```json
{
  "message": "Voucher approved successfully",
  "voucher": {
    "id": 10,
    "brand": "Takealot",
    "status": "APPROVED",
    "verificationDate": "2026-02-10T10:00:00Z"
  }
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not an admin
- **404 Not Found**: Voucher not found
- **409 Conflict**: Voucher is not in PENDING status
- **500 Internal Server Error**: Database error

---

### Reject Voucher
**POST** `/admin/vouchers/[id]/reject`

Rejects a pending voucher.

#### URL Parameters
- `id`: Voucher ID

#### Request (Optional)
```json
{
  "reason": "Invalid expiry date"
}
```

#### Response (200 OK)
```json
{
  "message": "Voucher rejected successfully",
  "voucher": {
    "id": 10,
    "brand": "Takealot",
    "status": "REJECTED",
    "reason": "Invalid expiry date",
    "rejectionDate": "2026-02-10T10:00:00Z"
  }
}
```

#### Error Responses
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User is not an admin
- **404 Not Found**: Voucher not found
- **409 Conflict**: Voucher is not in PENDING status
- **500 Internal Server Error**: Database error

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional validation error details"
  }
}
```

### Common Error Codes
- `INVALID_REQUEST`: Request validation failed
- `UNAUTHORIZED`: Authentication required or failed
- `FORBIDDEN`: User lacks permission
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Request conflicts with existing data
- `INTERNAL_ERROR`: Server error occurred

---

## Rate Limiting

To prevent abuse, each IP address is limited to:
- 100 requests per minute for public endpoints
- 50 requests per minute for authenticated endpoints
- 10 requests per minute for admin endpoints

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 92
X-RateLimit-Reset: 1644484800
```

---

## Pagination

List endpoints support pagination with query parameters:

```http
GET /api/vouchers?limit=20&offset=40
```

Response format:
```json
{
  "items": [...],
  "total": 100,
  "limit": 20,
  "offset": 40,
  "hasMore": true
}
```

---

## Timestamps

All timestamps are in ISO 8601 format with UTC timezone:
```
2026-02-10T10:30:00Z
```

---

## Currency

All amounts are in South African Rand (ZAR) as integers representing cents:
- R500 = 50000 (in API)
- Display: R500.00

---

## Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get all vouchers
curl http://localhost:3000/api/vouchers

# Get specific voucher
curl http://localhost:3000/api/vouchers/1

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"items":[{"voucherId":1,"quantity":1}]}'
```

### Using Postman

Import the OpenAPI specification:
```
http://localhost:3000/api/openapi.json
```

---

## Changelog

### Version 1.0.0 - February 10, 2026
- Initial API release
- Authentication endpoints
- Voucher management
- Order processing
- User management
- Admin functionality

---

*For questions or issues, please open an issue on the GitHub repository.*
