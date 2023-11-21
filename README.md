# animal Adoption Backend API

This repository contains the backend API for a animal adoption platform. The API provides features for users to login, create new users, update their data, create animals for adoption, update their animal's data, update animal status, search for animals based on multiple parameters and import animals from third-party APIs.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Running with Docker Compose](#Running-with-Docker-Compose)
- [API Routes](#api-routes)
  - [User Login](#user-login)
  - [Create User](#create-user)
  - [Create Animal](#Create-Animal)
  - [Index Animals into Database](#index-animals-into-database)
  - [Update Animal Status](#update-animal-status)
  - [Get Animal Term](#get-animal-term)
  - [Get Animal Category](#get-animal-category)
  - [Get Animal Status](#get-animal-status)
  - [Get Animal Creation Date](#get-animal-creationDate)
- [Dependencies](#dependencies)
- [License](#license)

## Getting Started

### Prerequisites

Ensure that your machine is equipped with the necessary software by installing the following:

- [Node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/iuridantas/Backend-Adocao-Animais.git
```

2. Navigate to the project directory:

```bash
cd Backend-Adocao-Animais
```

3. Install dependencies:

```bash
yarn
```

4. Fulfill the .env variables

### Running with Docker Compose

To run the application using Docker Compose, make sure you have Docker and Docker Compose installed. If you don't, you can install them by following the instructions at [Docker](https://docs.docker.com/get-docker/)

1. Build the images and start the containers:

```bash
docker-compose up --build
```

This command will build Docker images and start containers based on the docker-compose.yml file.

### Prisma Database Operations

To perform Prisma-related database operations, follow these steps:

1. Run Prisma migrations:

```bash
npx prisma migrate dev
```

This command applies any pending migrations.

2. Push changes to the database:

```bash
npx prisma db push
```

Use this command to apply the changes to the database.

3. Generate Prisma Client:

```bash
npx prisma generate
```

Run this command to generate the Prisma Client, which is used to interact with your database.

### Running the Application

Run the following command to start the application:

```bash
yarn start:dev
```

The API will be accessible at [http://localhost:3000](http://localhost:3000).

## API Routes

### User Login

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** User login
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - `200`: Successful login
  - `400`: Bad request
  - `500`: Internal server error

### Create User

- **Endpoint:** `/user/create`
- **Method:** `POST`
- **Description:** Create user
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "cpf": "string",
    "password": "string"
  }
  ```
- **Responses:**

  - `200`: Successful creation
  - `400`: Bad request
  - `500`: Internal server error

### Create Animal

- **Endpoint:** `/animal/create`
- **Method:** `POST`
- **Description:** Create animal
- **Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "image": "string",
  "userId": "string",
  "category": "string",
  "status": "available"
}
```

- **Responses:**
  - `200`: Successful creation
  - `400`: Bad request
  - `500`: Internal server error

### Index animals into Database

- **Endpoint:** `/animal/allIncludingExternalData`
- **Method:** `GET`
- **Description:** All animals into the database
- **Security:** Bearer Token
- **Responses:**
  - `200`: Successful request
  - `401`: Unauthorized
  - `500`: Internal server error

### Update animal Status

- **Endpoint:** `/animal/updateStatus/{id}`
- **Method:** `PATCH`
- **Description:** Update animal status
- **Security:** Bearer Token
- **Parameters:**
  - `animalId` (string)
- **Responses:**
  - `200`: Successful update
  - `400`: Bad request
  - `401`: Unauthorized
  - `500`: Internal server error

### Get Animal Term

- **Endpoint:** `/animal/byTerm`
- **Method:** `GET`
- **Description:** Get pets by term(name or description)
- **Parameters:**
  - `term` (string)
- **Responses:**

  - `200`: Successful request
  - `400`: Bad request
  - `500`: Internal server error

### Get Animal Category

- **Endpoint:** `/animal/byCategory`
- **Method:** `GET`
- **Description:** Get pets by category(cat or dog)
- **Parameters:**
  - `category` (string)
- **Responses:**
  - `200`: Successful request
  - `400`: Bad request
  - `500`: Internal server error

### Get Animal Status

- **Endpoint:** `/animal/byStatus`
- **Method:** `GET`
- **Description:** Get pets by status(available or adopted)
- **Parameters:**
  - `status` (string)
- **Responses:**
  - `200`: Successful request
  - `400`: Bad request
  - `500`: Internal server error

### Get Animal Creation Date

- **Endpoint:** `/animal/byCreationDate`
- **Method:** `GET`
- **Description:** Get pets by creation date(yyyy/MM/dd or dd/MM/yyyy)
- **Parameters:**
  - `creation date` (string)
- **Responses:**
  - `200`: Successful request
  - `400`: Bad request
  - `500`: Internal server error

## Dependencies

- [axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and node.js
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Library to help you hash passwords
- [class-transformer](https://www.npmjs.com/package/class-transformer) - Proper decorator-based transformation / serialization / deserialization of plain javascript objects to class constructors
- [class-validator](https://www.npmjs.com/package/class-validator) - Validation library for class-based application structures
- [date-fns](https://www.npmjs.com/package/date-fns) - Modern JavaScript date utility library
- [passport](https://www.npmjs.com/package/passport) - Simple, unobtrusive authentication for Node.js
- [passport-jwt](https://www.npmjs.com/package/passport-jwt) - Passport authentication strategy using JSON Web Tokens
- [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) - Polyfill for the `Reflect` API
- [rxjs](https://www.npmjs.com/package/rxjs) - Reactive Extensions for JavaScript
- [@nestjs/common](https://www.npmjs.com/package/@nestjs/common) - Nest framework (common module)
- [@nestjs/config](https://www.npmjs.com/package/@nestjs/config) - Configuration module for Nest framework
- [@nestjs/core](https://www.npmjs.com/package/@nestjs/core) - Nest framework (core module)
- [@nestjs/jwt](https://www.npmjs.com/package/@nestjs/jwt) - JWT utilities module for Nest framework
- [@nestjs/passport](https://www.npmjs.com/package/@nestjs/passport) - Passport module for Nest framework
- [@nestjs/platform-express](https://www.npmjs.com/package/@nestjs/platform-express) - Nest framework (Express adapter)
- [@nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger) - Swagger module for Nest framework
- [@prisma/client](https://www.npmjs.com/package/@prisma/client) - Prisma client for querying databases

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.