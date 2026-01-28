# 📚 Future Viz API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. Send OTP
Send an OTP to the user's phone number via SMS.

**Endpoint:** `POST /auth/send-otp`

**Request Body:**
```json
{
  "phoneNumber": "+919876543210"
}
```

**Response (Success):**
```json
{
  "message": "OTP sent successfully"
}
```

**Response (Error):**
```json
{
  "message": "Phone number is required"
}
```

**Status Codes:**
- `200` - OTP sent successfully
- `400` - Invalid request
- `500` - Server error

---

### 2. Verify OTP & Login
Verify the OTP and return a JWT token.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "phoneNumber": "+919876543210",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId123",
    "phoneNumber": "+919876543210",
    "name": "John Doe",
    "careerGoal": "Pilot"
  }
}
```

**Response (Error):**
```json
{
  "message": "Invalid or expired OTP"
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid/expired OTP
- `404` - User not found
- `500` - Server error

---

### 3. Get User Profile
Retrieve the authenticated user's profile.

**Endpoint:** `GET /auth/profile`

**Headers:** 
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "_id": "userId123",
  "phoneNumber": "+919876543210",
  "name": "John Doe",
  "age": 14,
  "careerGoal": "Pilot",
  "isVerified": true,
  "createdAt": "2024-01-19T10:00:00Z",
  "updatedAt": "2024-01-19T10:00:00Z"
}
```

**Status Codes:**
- `200` - Profile retrieved
- `401` - Unauthorized
- `500` - Server error

---

### 4. Update User Profile
Update the authenticated user's profile information.

**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 14,
  "careerGoal": "Pilot"
}
```

**Response (Success):**
```json
{
  "_id": "userId123",
  "phoneNumber": "+919876543210",
  "name": "John Doe",
  "age": 14,
  "careerGoal": "Pilot",
  "isVerified": true,
  "updatedAt": "2024-01-19T11:00:00Z"
}
```

**Status Codes:**
- `200` - Profile updated
- `401` - Unauthorized
- `500` - Server error

---

## 🤖 Chatbot Endpoints

### 1. Get Chatbot Greeting
Get the initial greeting and career options.

**Endpoint:** `GET /chatbot/greeting`

**Response (Success):**
```json
{
  "message": "Hello! I'm your career guide. What do you want to become in the future?",
  "options": [
    "Pilot",
    "Doctor",
    "Teacher",
    "Engineer",
    "Artist",
    "Astronaut",
    "Chef",
    "Scientist",
    "Dancer",
    "Musician",
    "Architect",
    "Athlete"
  ]
}
```

**Status Codes:**
- `200` - Greeting retrieved
- `500` - Server error

---

### 2. Process Chatbot Input
Send user input to the chatbot and get a response.

**Endpoint:** `POST /chatbot/chat`

**Request Body:**
```json
{
  "userInput": "I want to be a Pilot"
}
```

**Response (Success - Career Matched):**
```json
{
  "message": "Great! So you want to become a Pilot. That's awesome! 🎉\n\nNow let's take a photo of you and I'll transform it to show you as a Pilot!",
  "selectedCareer": "Pilot",
  "isConfirmed": true
}
```

**Response (Success - No Match):**
```json
{
  "message": "I'm not sure which career you mean. Here are some options I can help with: Pilot, Doctor, Teacher...",
  "selectedCareer": null,
  "isConfirmed": false
}
```

**Status Codes:**
- `200` - Input processed
- `400` - Invalid input
- `500` - Server error

---

## 🎨 Transformation Endpoints

### 1. Upload & Transform Photo
Upload a photo and request AI transformation.

**Endpoint:** `POST /transformations/transform`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `image` (file) - Photo to transform
- `career` (string) - Career to transform into

**Response (Success):**
```json
{
  "message": "Image transformation started",
  "transformationId": "trans_123abc",
  "status": "processing"
}
```

**Response (Error):**
```json
{
  "message": "Image and career are required"
}
```

**Status Codes:**
- `200` - Transformation started
- `400` - Invalid request
- `401` - Unauthorized
- `500` - Server error

---

### 2. Get Transformation Status
Get the status and result of a transformation.

**Endpoint:** `GET /transformations/:transformationId`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `transformationId` (string) - ID of the transformation

**Response (Success - Processing):**
```json
{
  "_id": "trans_123abc",
  "userId": "userId123",
  "career": "Pilot",
  "originalImageUrl": "/uploads/image-123.jpg",
  "transformedImageUrl": null,
  "status": "processing",
  "createdAt": "2024-01-19T10:00:00Z"
}
```

**Response (Success - Completed):**
```json
{
  "_id": "trans_123abc",
  "userId": "userId123",
  "career": "Pilot",
  "originalImageUrl": "/uploads/image-123.jpg",
  "transformedImageUrl": "/uploads/transformed-123.jpg",
  "status": "completed",
  "createdAt": "2024-01-19T10:00:00Z"
}
```

**Response (Error):**
```json
{
  "message": "Transformation not found"
}
```

**Status Codes:**
- `200` - Status retrieved
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

---

### 3. Get All User Transformations
Retrieve all transformations for the authenticated user.

**Endpoint:** `GET /transformations`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
[
  {
    "_id": "trans_123abc",
    "userId": "userId123",
    "career": "Pilot",
    "originalImageUrl": "/uploads/image-123.jpg",
    "transformedImageUrl": "/uploads/transformed-123.jpg",
    "status": "completed",
    "createdAt": "2024-01-19T10:00:00Z"
  },
  {
    "_id": "trans_456def",
    "userId": "userId123",
    "career": "Doctor",
    "originalImageUrl": "/uploads/image-456.jpg",
    "transformedImageUrl": null,
    "status": "processing",
    "createdAt": "2024-01-19T11:00:00Z"
  }
]
```

**Response (Empty):**
```json
[]
```

**Status Codes:**
- `200` - Transformations retrieved
- `401` - Unauthorized
- `500` - Server error

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

### Common Error Messages
- `No token provided` - Missing Authorization header
- `Invalid token` - Token is invalid or expired
- `User not found` - Phone number not registered
- `Invalid or expired OTP` - OTP verification failed
- `Phone number and OTP are required` - Missing required fields
- `Image and career are required` - Missing upload data
- `Transformation not found` - Invalid transformation ID

---

## Rate Limiting (Recommended Implementation)

To prevent abuse, implement rate limiting:

```
- OTP requests: 5 per 15 minutes per phone number
- Transformation requests: 10 per hour per user
- Chat requests: 100 per hour per user
```

---

## Testing with cURL

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210", "otp": "123456"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

### Get Chatbot Greeting
```bash
curl -X GET http://localhost:5000/api/chatbot/greeting
```

### Process Chat Input
```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"userInput": "I want to be a Pilot"}'
```

### Upload Photo
```bash
curl -X POST http://localhost:5000/api/transformations/transform \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/photo.jpg" \
  -F "career=Pilot"
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `500` | Server Error |

---

## Response Time Expectations

| Endpoint | Typical Response |
|----------|-----------------|
| OTP Send | 2-5 seconds |
| OTP Verify | 1-2 seconds |
| Chatbot | < 1 second |
| Photo Upload | 2-10 seconds |
| Transformation | 30-60 seconds |
| Gallery Load | 1-3 seconds |

---

## Version History

**v1.0.0** (Jan 19, 2024)
- Initial API release
- Basic authentication
- Chatbot functionality
- Photo transformation endpoints
- Gallery management

---

## Support

For API support or issues:
1. Check the error message carefully
2. Verify all required parameters
3. Check request format
4. Review authentication token
5. Check backend logs for detailed errors
