# StudentHub API - Testing Guide

Panduan testing API menggunakan cURL, Postman, atau HTTP client lainnya.

## Base URL
```
http://localhost:3000/api
```

## Health Check
```bash
curl http://localhost:3000/health
```

---

## 1. Authentication

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatarUrl": null,
      "theme": "system",
      "notificationsEnabled": true,
      "language": "en",
      "totalPoints": 0,
      "currentStreak": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 2. Dashboard

### Get Dashboard Data
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "user": {
      "name": "John Doe",
      "totalPoints": 150,
      "currentStreak": 5
    },
    "tasks": {
      "total": 10,
      "completed": 7,
      "upcoming": [...]
    },
    "recentNotes": [...],
    "wellbeingTrend": [...]
  }
}
```

---

## 3. Notes

### Create Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Catatan Kuliah",
    "content": "Materi tentang algoritma sorting",
    "category": "study",
    "isHandwriting": false
  }'
```

### Get All Notes
```bash
# Get all notes
curl http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by category
curl "http://localhost:3000/api/notes?category=study" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search notes
curl "http://localhost:3000/api/notes?search=algoritma" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Note by ID
```bash
curl http://localhost:3000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Note
```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Catatan Kuliah (Updated)",
    "content": "Materi tentang algoritma sorting dan searching"
  }'
```

### Delete Note
```bash
curl -X DELETE http://localhost:3000/api/notes/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4. Wellbeing

### Create Wellbeing Entry
```bash
curl -X POST http://localhost:3000/api/wellbeing \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mood": 4,
    "energy": 3,
    "sleep": 4,
    "activities": ["exercise", "meditation", "social"],
    "note": "Hari yang produktif!"
  }'
```

### Get All Entries
```bash
# Get all entries
curl http://localhost:3000/api/wellbeing \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by date range
curl "http://localhost:3000/api/wellbeing?startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Entry by Date
```bash
curl http://localhost:3000/api/wellbeing/2025-01-15 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Statistics
```bash
# Last 7 days (default)
curl http://localhost:3000/api/wellbeing/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# Last 30 days
curl "http://localhost:3000/api/wellbeing/stats?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Wellbeing stats retrieved successfully",
  "data": {
    "averageMood": "4.20",
    "averageEnergy": "3.50",
    "averageSleep": "4.00",
    "totalEntries": 7,
    "entries": [...]
  }
}
```

### Update Entry
```bash
curl -X PUT http://localhost:3000/api/wellbeing/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mood": 5,
    "note": "Hari yang sangat baik!"
  }'
```

---

## 5. Tasks

### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mengerjakan Tugas Algoritma",
    "description": "Chapter 5-7",
    "category": "assignment",
    "dueDate": "2025-01-20T23:59:59Z"
  }'
```

### Get All Tasks
```bash
# Get all tasks
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by category
curl "http://localhost:3000/api/tasks?category=assignment" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by status
curl "http://localhost:3000/api/tasks?isDone=false" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sort by title
curl "http://localhost:3000/api/tasks?sortBy=title" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Upcoming Tasks
```bash
# Get 5 upcoming tasks (default)
curl http://localhost:3000/api/tasks/upcoming \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get 10 upcoming tasks
curl "http://localhost:3000/api/tasks/upcoming?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Task by ID
```bash
curl http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Task
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mengerjakan Tugas Algoritma (Updated)",
    "isDone": true
  }'
```

### Toggle Task Status
```bash
curl -X PATCH http://localhost:3000/api/tasks/1/toggle \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. Profile

### Get Profile
```bash
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "avatarUrl": "https://example.com/avatar.jpg"
  }'
```

### Update Settings
```bash
curl -X PUT http://localhost:3000/api/profile/settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "notificationsEnabled": false,
    "language": "id"
  }'
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access token is required",
  "errors": null
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Note not found",
  "errors": null
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": null
}
```

---

## Postman Collection

Anda bisa import collection berikut ke Postman untuk testing yang lebih mudah:

1. Buat Environment baru di Postman dengan variables:
   - `baseUrl`: `http://localhost:3000/api`
   - `token`: (akan di-set otomatis setelah login)

2. Tambahkan script di Tab "Tests" untuk endpoint login/register:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

3. Gunakan `{{token}}` di Authorization header untuk endpoint yang protected.

---

## Tips Testing

1. **Register dulu** untuk mendapatkan user dan token
2. **Simpan token** untuk digunakan di request berikutnya
3. **Test endpoint berurutan**: Register → Login → Create → Read → Update → Delete
4. **Gunakan date format ISO 8601** untuk field date: `2025-01-20T23:59:59Z`
5. **Perhatikan required fields** di setiap request body
