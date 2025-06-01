# Food Ordering Application API

A robust RESTful API for a food ordering application with order management, notifications, and user authentication.

## Features

- **User Authentication**: Secure signup and login with JWT
- **Product Management**: Create, view, and manage food items
- **Order System**: Place orders, track status, and manage delivery
- **Notification System**: Real-time notifications for order status changes
- **Favorites**: Save and manage favorite food items
- **Admin Dashboard**: Manage products, orders, and send notifications

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="your_mongodb_connection_string"
   ACCESS_TOKEN="your_jwt_secret"
   PORT=5000
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## API Documentation

### Authentication

#### Register
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token

### Products

#### Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Auth**: Required
- **Response**: List of products

#### Create Product (Admin only)
- **URL**: `/api/products`
- **Method**: `POST`
- **Auth**: Required (Admin)
- **Body**: Form data with:
  - `name`: Product name
  - `description`: Product description
  - `price`: Product price
  - `ingredients`: JSON array of ingredients
  - `file`: Image file

#### Delete Product (Admin only)
- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Auth**: Required (Admin)

### Orders

#### Create Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "items": [
      {
        "productId": "string",
        "quantity": "number"
      }
    ],
    "deliveryAddress": "string",
    "paymentMethod": "CASH|CREDIT_CARD|DEBIT_CARD|PAYPAL"
  }
  ```

#### Get User Orders
- **URL**: `/api/orders/user`
- **Method**: `GET`
- **Auth**: Required
- **Query Parameters**:
  - `status`: Filter by status (optional)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

#### Get Order by ID
- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Auth**: Required

#### Update Order Status (Admin only)
- **URL**: `/api/orders/:id/status`
- **Method**: `PATCH`
- **Auth**: Required (Admin)
- **Body**:
  ```json
  {
    "status": "PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED"
  }
  ```

#### Delete Order
- **URL**: `/api/orders/:id`
- **Method**: `DELETE`
- **Auth**: Required

### Notifications

#### Get User Notifications
- **URL**: `/api/notifications`
- **Method**: `GET`
- **Auth**: Required
- **Query Parameters**:
  - `unreadOnly`: Show only unread (true/false)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

#### Mark Notification as Read
- **URL**: `/api/notifications/:id/read`
- **Method**: `PATCH`
- **Auth**: Required

#### Mark All Notifications as Read
- **URL**: `/api/notifications/read-all`
- **Method**: `PATCH`
- **Auth**: Required

#### Delete Notification
- **URL**: `/api/notifications/:id`
- **Method**: `DELETE`
- **Auth**: Required

#### Clear All Notifications
- **URL**: `/api/notifications/clear-all`
- **Method**: `DELETE`
- **Auth**: Required

### Favorites

#### Add to Favorites
- **URL**: `/api/favorites`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "productId": "string"
  }
  ```

#### Get User Favorites
- **URL**: `/api/favorites`
- **Method**: `GET`
- **Auth**: Required

#### Check Favorite Status
- **URL**: `/api/favorites/check/:productId`
- **Method**: `GET`
- **Auth**: Required

#### Remove from Favorites
- **URL**: `/api/favorites/:id`
- **Method**: `DELETE`
- **Auth**: Required

### Admin

#### Send Promotional Notification
- **URL**: `/api/admin/notifications/promotion`
- **Method**: `POST`
- **Auth**: Required (Admin)
- **Body**:
  ```json
  {
    "title": "string",
    "message": "string",
    "relatedId": "string" // Optional
  }
  ```

#### Send System Notification
- **URL**: `/api/admin/notifications/system`
- **Method**: `POST`
- **Auth**: Required (Admin)
- **Body**:
  ```json
  {
    "title": "string",
    "message": "string"
  }
  ```

#### Get Notification Statistics
- **URL**: `/api/admin/notifications/stats`
- **Method**: `GET`
- **Auth**: Required (Admin)

#### Trigger Order Status Auto-Update
- **URL**: `/api/admin/orders/auto-update`
- **Method**: `POST`
- **Auth**: Required (Admin)

## Security Features

- JWT Authentication
- Password Hashing with bcrypt
- Rate Limiting
- Input Validation
- Error Handling
- Role-Based Access Control

## Automatic Order Updates

The system automatically updates order statuses based on time elapsed:
- PENDING → PROCESSING: After order creation
- PROCESSING → SHIPPED: After processing
- SHIPPED → DELIVERED: After shipping

Users receive notifications for each status change.
