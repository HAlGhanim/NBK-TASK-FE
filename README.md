# Application Communication & API Documentation

## Overview

This application consists of an Angular 20 frontend and a .NET 8 backend API. The communication between these layers is secured using JWT authentication and follows RESTful principles.

## Project Setup

### Prerequisites
- Visual Studio 2022 or later
- .NET 8 SDK
- Node.js (v18 or later)
- SQL Server (LocalDB or Express)
- Git

### Backend Setup (.NET 8)

1. **Clone the Backend Repository**
   ```bash
   git clone <backend-repository-url>
   cd WebApplication1
   ```

2. **Configure User Secrets**
   - Right-click on the project in Visual Studio
   - Click on "Manage User Secrets"
   - This will open the `secrets.json` file
   - Insert the following configuration:
   ```json
   {
     "Jwt": {
       "Key": "2b95f93292ed56f68a4f2c9592a6fc7a13b781648f5e34e5fc4cb6f1053f2994"
     }
   }
   ```

3. **Setup Database**
   - Delete the `Migrations` folder if it exists
   - Open Package Manager Console in Visual Studio
   - Run the following commands:
   ```bash
   Add-Migration seeded-data
   Update-Database
   ```

4. **Run the Backend**
   - In Visual Studio, select **IIS Express** from the run options
   - Press F5 or click the Run button
   - The API will be available at `https://localhost:44336`
   - Swagger UI will be available at `https://localhost:44336/swagger`

### Frontend Setup (Angular 20)

1. **Clone the Frontend Repository**
   ```bash
   git clone <frontend-repository-url>
   cd NBK-TASK-FE
   ```

2. **Install Dependencies**
   ```bash
   npm i
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```
   - The application will be available at `http://localhost:4200`

### Default Login Credentials

The database is seeded with the following test data:

**User Account:**
- Username: `azmarafi`
- Password: `password123`

**Sample Customers:** 
20 customers are pre-populated (Customer numbers 1-20) with names like Alice, Bob, Charlie, etc.

## Key Communication Patterns

### 1. Authentication Flow
- User credentials are sent from the Login Component to the backend's `/api/auth/login` endpoint
- Backend validates credentials against the database using BCrypt password hashing
- On success, a JWT token is generated with 24-hour expiry
- Token is stored in browser cookies and used for subsequent requests

### 2. Request Authorization
- Every protected route is guarded by the `authenticationGuard`
- The Auth Interceptor automatically adds the JWT token as a Bearer token to all HTTP requests
- Backend validates the JWT token for every protected endpoint using the Authorization middleware

### 3. API Communication Structure
- **Base URL**: `https://localhost:44336/api/`
- All API calls are made through Angular services (AuthenticationService, CustomersService)
- Services extend BaseService which provides common HTTP methods
- Interceptors handle cross-cutting concerns (auth, caching, error handling)

### 4. Data Flow Architecture
```
Angular Component → Service → Interceptors → Backend Controller → Service → Entity Framework → Database
                                    ↓                                                             ↓
                              Bearer Token                                                   SQL Server
```

### 5. Real-time Feedback
- Toast notifications provide immediate feedback for all operations
- Modal service handles confirmations and forms
- Error interceptor catches and displays all HTTP errors

### 6. State Preservation
- The table component preserves user state through URL query parameters
- Preserved state includes:
  - Current page number (`?page=2`)
  - Page size (`?size=10`)
  - Search term (`?search=john`)
  - Sort column and direction (`?sort=name&direction=desc`)
- This allows users to bookmark, share, or refresh pages without losing their current view
- State is automatically synchronized with the URL on any table interaction

## API Endpoints Reference

### Base URL
`https://localhost:44336/api/`

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response | Protected |
|--------|----------|-------------|--------------|----------|-----------|
| POST | `/api/auth/register` | Register new user | `{ username, password }` | Success message or conflict | ❌ |
| POST | `/api/auth/login` | User login | `{ username, password }` | `{ token: "JWT..." }` | ❌ |
| GET | `/api/auth/users` | Get all users | - | User list with id, username, password | ✅ |

### Customer Endpoints (All Protected ✅)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/customers` | Get all customers | - | `CustomerDTO[]` |
| GET | `/api/customers/{number}` | Get customer by number | - | `CustomerDTO` |
| POST | `/api/customers` | Create new customer | `{ name, dateOfBirth, gender }` | `CustomerDTO` with assigned number |
| PUT | `/api/customers/{number}` | Update customer | `{ name?, dateOfBirth?, gender? }` | Updated `CustomerDTO` |
| DELETE | `/api/customers/{number}` | Delete customer | - | `{ message: "Customer deleted" }` |

## Data Transfer Objects

### AuthenticationDTO
```typescript
{
  username: string;
  password: string;
}
```

### CustomerDTO
```typescript
{
  number: number;      // Auto-generated primary key
  name: string;
  dateOfBirth: string; // Format: "YYYY-MM-DD"
  gender: string;      // "M" or "F"
}
```

### CreateCustomerDTO
```typescript
{
  name: string;
  dateOfBirth: string;
  gender: string;
}
```

### UpdateCustomerDTO (All fields optional)
```typescript
{
  name?: string;
  dateOfBirth?: string;
  gender?: string;
}
```

## Security & Authentication

### JWT Token Configuration
- **Issuer**: "NBK-TASK-BE"
- **Audience**: "NBK-TASK-FE"
- **Expiry**: 24 hours from generation
- **Claims**: User ID and Username
- **Algorithm**: HMAC SHA256
- **Storage**: HTTP-only cookies

### Request Headers for Protected Endpoints
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### CORS Configuration
- **Allowed Origin**: `http://localhost:4200`
- **Allowed Methods**: All HTTP methods
- **Allowed Headers**: All headers
- **Credentials**: Allowed

## Error Handling

### HTTP Status Codes

| Status | Description | Example Scenario |
|--------|-------------|------------------|
| 200 | Success | Successful GET, PUT operations |
| 201 | Created | Successful POST with resource creation |
| 401 | Unauthorized | Invalid or missing JWT token |
| 404 | Not Found | Customer with specified number doesn't exist |
| 409 | Conflict | Username already exists during registration |

### Error Interceptor Behavior
- Catches all HTTP errors
- Logs errors to console
- Displays user-friendly messages via Toast Service
- 401 errors trigger redirect to login page

## Caching Strategy

### Cache Interceptor Rules
- **Cached Operations**: GET requests only
- **Cache Duration**: 1 minute (60,000ms)
- **Cache Invalidation**: Automatic on any mutating operation (POST, PUT, DELETE, PATCH)
- **Cache Key**: Full URL with parameters
- **Storage**: In-memory JavaScript Map

### Example Cache Flow
```
1. GET /api/customers → Check cache → Not found → Make request → Store in cache → Return data
2. GET /api/customers → Check cache → Found & valid → Return cached data
3. POST /api/customers → Clear all customer-related cache entries → Make request
4. GET /api/customers → Check cache → Not found → Make fresh request
```

## Frontend Services Architecture

### Service Hierarchy
```
BaseService (HTTP methods)
    ├── AuthenticationService
    │   ├── login()
    │   └── register()
    └── CustomersService
        ├── getCustomers()
        ├── getCustomerByNumber()
        ├── AddCustomer()
        ├── updateCustomer()
        └── deleteCustomer()
```

### Component Services
- **ModalService**: Manages modal dialogs for forms and confirmations
- **ToastService**: Displays success/error notifications
- **CookieService**: Handles JWT token storage and retrieval

### Table Component Features
- **Pagination**: Navigate through large datasets with configurable page sizes (5, 10, 20 rows)
- **Sorting**: Click column headers to sort ascending/descending
- **Search**: Real-time filtering across all columns
- **Export**: Download current view as CSV
- **State Preservation**: All table interactions (page, sort, search, page size) are synced with URL query parameters

## Development URLs

- **Frontend**: http://localhost:4200
- **Backend API**: https://localhost:44336
- **Swagger UI**: https://localhost:44336/swagger

## Database Schema

### Users Table
- Id (int, PK)
- Username (string, max 255, unique)
- Password (string, max 100, hashed)

### Customers Table
- Number (int, PK, auto-increment)
- Name (string, max 255, required)
- DateOfBirth (DateOnly, required)
- Gender (string, length 1, required)
