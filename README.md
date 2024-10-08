# School Management API

This project implements a set of RESTful APIs for managing school data using Node.js, Express.js, Prisma ORM, and NeonDB (PostgreSQL). The system allows users to add new schools and retrieve a list of schools sorted by proximity to a user-specified location.

## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
  - [Add School](#add-school)
  - [List Schools](#list-schools)
  - [Distance Calculation](#distance-calculation)



## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

## Prerequisites

Ensure you have the following installed on your system:

- Node.js
- npm 
- PostgreSQL (NeonDB)
- Prisma ORM

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/imSaikirann/EducaseBackend.git
   cd EducaseBackend
2. Install packages:
   ```bash
   npm install
3. Set up environment variables: 
   ```bash
   DATABASE_URL="postgresql://<username>:<password>@<hostname>/<database>?schema=public"
   OPEN_GEO_API_KEY="your-opengeo-api-key"
   PORT="4000"
4. Initialize Prisma in your project:
   ```bash
   npx prisma init
5. Run the Prisma migration 
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
  
## API Endpoints



- **Endpoint:** `/addSchool`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "name": "Example School",
    "address": "123 Example St, City, Country",
    "latitude": 12.345678,
    "longitude": 98.765432
  }


- **Endpoint:** `/list?city="areaName"`
- **Method:** `Get`



### Distance Calculation using Haversine Formula:

The `List Schools` API endpoint calculates the distance between the user's location and each school using the Haversine formula, which is commonly used to calculate the distance between two points on the Earth's surface. The following query is used to fetch the schools sorted by their proximity to the user's specified location:

```javascript
const schools = await prisma.$queryRaw`
    SELECT * FROM (
        SELECT *, 
               (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) AS distance
        FROM "Schools"
    ) AS subquery
    WHERE distance < ${maxDistance}
    ORDER BY distance;
`;
