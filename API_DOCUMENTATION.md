# Smart Queue Backend API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Most endpoints require JWT authentication. After login, you'll receive a token that should be included in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 📋 Table of Contents
1. [User Endpoints](#user-endpoints)
2. [Service Endpoints](#service-endpoints)
3. [Staff Endpoints](#staff-endpoints)
4. [Appointment Endpoints](#appointment-endpoints)
5. [Audit Log Endpoints](#audit-log-endpoints)

---

## User Endpoints

### 1. Register User
**POST** `/users/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-24T10:30:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: Required, minimum 1 character
- `email`: Required, must be valid email format
- `password`: Required, minimum 6 characters

---

### 2. Login User
**POST** `/users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `email`: Required, must be valid email format
- `password`: Required

---

## Service Endpoints

### 3. Create Service
**POST** `/services`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Haircut",
  "duration": 30,
  "staffType": "Barber"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Haircut",
    "duration": 30,
    "staffType": "Barber",
    "createdAt": "2024-01-24T10:35:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: Required, minimum 1 character
- `duration`: Required, must be at least 1 minute
- `staffType`: Required, minimum 1 character

---

### 4. Get All Services
**GET** `/services`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Haircut",
      "duration": 30,
      "staffType": "Barber"
    },
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "name": "Hair Coloring",
      "duration": 60,
      "staffType": "Stylist"
    }
  ]
}
```

---

## Staff Endpoints

### 5. Create Staff
**POST** `/staff`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Alice Smith",
  "serviceType": "Barber",
  "dailyCapacity": 10,
  "availabilityStatus": "Available"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Staff created successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "name": "Alice Smith",
    "serviceType": "Barber",
    "dailyCapacity": 10,
    "availabilityStatus": "Available",
    "createdAt": "2024-01-24T10:40:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: Required, minimum 1 character
- `serviceType`: Required, minimum 1 character
- `dailyCapacity`: Optional, number
- `availabilityStatus`: Optional, must be "Available" or "On Leave"

---

### 6. Get All Staff
**GET** `/staff`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Staff retrieved successfully",
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
      "name": "Alice Smith",
      "serviceType": "Barber",
      "dailyCapacity": 10,
      "availabilityStatus": "Available"
    }
  ]
}
```

---

### 7. Update Staff Status
**PUT** `/staff/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Staff ID

**Request Body:**
```json
{
  "status": "On Leave"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Staff status updated successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "name": "Alice Smith",
    "serviceType": "Barber",
    "availabilityStatus": "On Leave"
  }
}
```

**Validation Rules:**
- `status`: Required, must be "Available" or "On Leave"

---

## Appointment Endpoints

### 8. Create Appointment
**POST** `/appointments`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "customerName": "Jane Doe",
  "serviceId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "staffId": "65f1a2b3c4d5e6f7g8h9i0j4",
  "appointmentDate": "2024-01-25T14:00:00.000Z"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "customerName": "Jane Doe",
    "serviceId": "65f1a2b3c4d5e6f7g8h9i0j2",
    "staffId": "65f1a2b3c4d5e6f7g8h9i0j4",
    "appointmentDate": "2024-01-25T14:00:00.000Z",
    "status": "Scheduled",
    "createdAt": "2024-01-24T10:45:00.000Z"
  }
}
```

**Validation Rules:**
- `customerName`: Required, minimum 1 character
- `serviceId`: Required, minimum 1 character
- `staffId`: Optional
- `appointmentDate`: Required, must be valid date format

---

### 9. Get All Appointments
**GET** `/appointments`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
- `status`: Filter by status (Scheduled, Completed, Cancelled, No-Show, Waiting)
- `staffId`: Filter by staff ID
- `date`: Filter by date

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
      "customerName": "Jane Doe",
      "serviceId": {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Haircut",
        "duration": 30
      },
      "staffId": {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j4",
        "name": "Alice Smith"
      },
      "appointmentDate": "2024-01-25T14:00:00.000Z",
      "status": "Scheduled"
    }
  ]
}
```

---

### 10. Update Appointment Status
**PUT** `/appointments/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Appointment ID

**Request Body:**
```json
{
  "status": "Completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment status updated successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "customerName": "Jane Doe",
    "status": "Completed"
  }
}
```

**Validation Rules:**
- `status`: Required, must be one of: "Scheduled", "Completed", "Cancelled", "No-Show", "Waiting"

---

### 11. Assign from Queue
**POST** `/appointments/assign-queue`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "staffId": "65f1a2b3c4d5e6f7g8h9i0j4"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment assigned from queue successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "customerName": "Jane Doe",
    "staffId": "65f1a2b3c4d5e6f7g8h9i0j4",
    "status": "Scheduled"
  }
}
```

**Validation Rules:**
- `staffId`: Required, minimum 1 character

**Required Role:** Admin or Staff

---

## Audit Log Endpoints

### 12. Get Audit Logs
**GET** `/audit-logs`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j6",
      "action": "CREATE_APPOINTMENT",
      "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
      "details": "Appointment created for Jane Doe",
      "timestamp": "2024-01-24T10:45:00.000Z"
    }
  ]
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## User Roles
- **user**: Regular customer
- **staff**: Staff member
- **admin**: Administrator

## Status Values

### Appointment Status
- `Scheduled`: Appointment is scheduled
- `Waiting`: Customer is waiting in queue
- `Completed`: Service completed
- `Cancelled`: Appointment cancelled
- `No-Show`: Customer didn't show up

### Staff Availability Status
- `Available`: Staff is available
- `On Leave`: Staff is on leave
