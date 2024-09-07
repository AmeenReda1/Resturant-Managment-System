## Restaurant Management System

## Overview

This Restaurant Management System is designed to streamline restaurant operations. developed using Nest.js,MongoDB It allows users to create new customers, log in, and create orders. For admins, it provides daily reports with cached data in Redis to enhance performance. The daily reports include total revenue for the day and the top-selling products.

## Features

- **Customer**: Create new customer profiles.
-**Products**: Create product.
- **Orders**: Create and manage orders.
- **Admin Order Reports**: Access daily reports including:
  - Total revenue for the day.
  - Top-selling products.
- **Redis Caching**: Cache daily reports in Redis for efficient retrieval and improved performance.
## Prerequisites

- **Docker**: Ensure Docker is installed on your machine.
- **Docker Compose**: Ensure Docker Compose is installed on your machine.

## Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/AmeenReda1/Resturant-Managment-System.git
   cd Resturant-Managment-System
## add .env file with this data
  ```bash
    PORT=9000
    MONGO_URI=mongodb://mongodb:27017/resturant-db
    JWT_SECRET='Add-your-secret'
    JWT_EXPIRE_In=1h
  ```
1. **Docker Running**

   ```bash
    docker-compose --build
    docker-compose up
3. **Now You can Access endPonits** 

### 1. Create a New Customer

First, you need to create a new customer. You can do this by making a `POST` request to the following endpoint:

- **URL**: `http://localhost:9000/customers`
- **Method**: `POST`
- **Payload**:

  ```json
  {
    "name": "test",
    "email": "test@gmail.com",
    "password": "12345678",
    "phone": "011111111111",
    "address": "address",
    "type": "admin" || "customer"
  }
### 1. Login

Second, you need to Login with admin to create product and see the daily report:

- **URL**: `http://localhost:9000/customers/login`
- **Method**: `POST`
- **Payload**:

  ```json
  {
    "email": "test@gmail.com",
    "password": "12345678",
  }

### 3. Product

Third, you need to Create Product with admin get token from login and use it:

- **URL**: `http://localhost:9000/products`
- **Method**: `POST`
- **Bearer token**: `Admin Token`
- **Payload**:

  ```json
  {
      "name":"burger",
      "price":500
  }

### 3. Order

Third, you need to Create Order prvide customerId and productId for each product with the qunatity:

- **URL**: `http://localhost:9000/order`
- **Method**: `POST`
- **Payload**:

  ```json
  {
      "customerId":"66dc7089ac32ac63658b2bb1",
      "products":[
          {
              "productId":"66dc7093ac32ac63658b2bb6",
              "quantity":100
          },
          {
              "productId":"66dc7093ac32ac63657c2bb5",
              "quantity":2
          },

      ]

  }
### 3.1. DailyReport

you need to login as admin and use your token to access this endpoint  with the qunatity:
This data calculated for one time and when you call this api again the result retrived from Redis 

- **URL**: `http://localhost:9000/order`
- **Method**: `GET`
- **Bearer token**: `Admin Token`


### 3. Update Specific Order

Third, you need to Create Order prvide customerId and productId for each product with the qunatity:
if you updated order this order orderd today then the redis cache will remove because you need to recalculate the Daily Report

- **URL**: `http://localhost:9000/order`
- **Method**: `Patch`
- **Payload**:

  ```json
  {
      //"customerId":"66db2d56328230272495b67a",
      "products":[
          {
              "productId":"66db02a6d7eb5f5ff4907eb8",
              "quantity":20
          }

      ]

  }