# PROMPT UNTUK AI ASSISTANT - FLUTTER INTEGRATION

## 📋 Copy-Paste Prompt Ini ke AI Assistant Anda

---

## PROMPT 1: Setup Awal Project Flutter

```
Saya ingin mengintegrasikan Flutter app StudentHub dengan backend API yang sudah saya buat.

Backend API Details:
- Base URL: http://localhost:3000/api
- Authentication: JWT Bearer Token
- Response format: JSON dengan format standar { success, message, data, errors }

Tolong bantu saya setup Flutter project dengan:

1. Clean Architecture structure (core, data, domain, presentation)
2. Dependencies yang dibutuhkan:
   - dio untuk HTTP client
   - flutter_secure_storage untuk token storage
   - provider/riverpod untuk state management
   - json_serializable untuk JSON parsing
   - connectivity_plus untuk check network

3. Setup base structure dengan:
   - ApiConstants untuk endpoint URLs
   - ApiClient dengan Dio dan interceptor untuk auto-inject token
   - TokenManager untuk handle JWT token
   - ApiResponse wrapper class

4. Models untuk entities:
   - User (id, name, email, avatarUrl, theme, notificationsEnabled, language, totalPoints, currentStreak, createdAt, updatedAt)
   - Note (id, userId, title, content, category, fileUrl, isHandwriting, createdAt, updatedAt)
   - Task (id, userId, title, description, category, dueDate, isDone, createdAt, updatedAt)
   - WellbeingEntry (id, userId, date, mood, energy, sleep, activities, note, createdAt, updatedAt)

Generate semua kode yang diperlukan untuk setup awal ini.
```

---

## PROMPT 2: Implementasi Authentication

```
Saya sudah setup base structure Flutter app. Sekarang tolong implementasikan fitur Authentication dengan backend API saya.

Backend Auth Endpoints:
- POST /api/auth/register
  Body: { name, email, password }
  Response: { success, message, data: { user, token } }

- POST /api/auth/login
  Body: { email, password }
  Response: { success, message, data: { user, token } }

- GET /api/auth/profile (requires token)
  Response: { success, message, data: user }

Tolong buatkan:
1. AuthRemoteDatasource dengan method register, login, getProfile
2. AuthRepository (interface dan implementation)
3. AuthProvider/AuthBloc untuk state management
4. LoginScreen dengan form email & password
5. RegisterScreen dengan form name, email & password
6. Logic untuk:
   - Save token setelah login/register
   - Auto-inject token ke semua API requests
   - Handle 401 Unauthorized (token expired)
   - Auto-navigate ke login jika belum authenticated
   - Show loading state
   - Handle dan show error messages

Generate complete code dengan error handling yang proper.
```

---

## PROMPT 3: Implementasi Notes Feature

```
Implementasikan fitur Notes dengan backend API saya.

Backend Notes Endpoints:
- POST /api/notes (requires token)
  Body: { title, content, category, fileUrl?, isHandwriting? }
  
- GET /api/notes (requires token)
  Query params: category?, search?
  
- GET /api/notes/:id (requires token)

- PUT /api/notes/:id (requires token)
  Body: { title?, content?, category?, fileUrl?, isHandwriting? }
  
- DELETE /api/notes/:id (requires token)

Categories: "study", "personal", "reminder", "project"

Tolong buatkan:
1. NotesRemoteDatasource dengan semua CRUD operations
2. NotesRepository (interface dan implementation)
3. NotesProvider/NotesBloc untuk state management
4. NotesListScreen dengan:
   - List semua notes
   - Filter by category
   - Search functionality
   - Pull to refresh
   - Empty state
   - Loading state
5. NoteDetailScreen untuk view single note
6. CreateNoteScreen dengan form
7. EditNoteScreen dengan form pre-filled
8. Delete confirmation dialog

Generate complete code dengan proper error handling dan UI yang user-friendly.
```

---

## PROMPT 4: Implementasi Tasks Feature

```
Implementasikan fitur Tasks Management dengan backend API saya.

Backend Tasks Endpoints:
- POST /api/tasks (requires token)
  Body: { title, description?, category, dueDate }
  
- GET /api/tasks (requires token)
  Query params: category?, isDone?, sortBy?
  
- GET /api/tasks/upcoming (requires token)
  Query params: limit?
  
- GET /api/tasks/:id (requires token)

- PUT /api/tasks/:id (requires token)
  Body: { title?, description?, category?, dueDate?, isDone? }
  
- PATCH /api/tasks/:id/toggle (requires token)
  
- DELETE /api/tasks/:id (requires token)

Tolong buatkan:
1. TasksRemoteDatasource dengan semua operations
2. TasksRepository (interface dan implementation)
3. TasksProvider/TasksBloc untuk state management
4. TasksListScreen dengan:
   - List all tasks
   - Filter by category dan status (done/not done)
   - Sort by due date
   - Quick toggle untuk mark as done
   - Swipe to delete
   - Pull to refresh
5. TaskDetailScreen
6. CreateTaskScreen dengan date picker
7. EditTaskScreen
8. Upcoming tasks widget untuk dashboard

Generate complete code dengan UI yang intuitif untuk task management.
```

---

## PROMPT 5: Implementasi Wellbeing Feature

```
Implementasikan fitur Wellbeing Tracking dengan backend API saya.

Backend Wellbeing Endpoints:
- POST /api/wellbeing (requires token)
  Body: { date?, mood, energy, sleep, activities, note? }
  mood: 1-5, energy: 0-5, sleep: 0-5, activities: array of strings
  
- GET /api/wellbeing (requires token)
  Query params: startDate?, endDate?
  
- GET /api/wellbeing/stats (requires token)
  Query params: days? (default 7)
  Response: { averageMood, averageEnergy, averageSleep, totalEntries, entries }
  
- GET /api/wellbeing/:date (requires token)

- PUT /api/wellbeing/:id (requires token)

Tolong buatkan:
1. WellbeingRemoteDatasource
2. WellbeingRepository
3. WellbeingProvider/Bloc
4. WellbeingEntryScreen dengan:
   - Date picker (default today)
   - Mood selector (1-5 faces/emoji)
   - Energy slider (0-5)
   - Sleep slider (0-5)
   - Activities multi-select (exercise, meditation, social, hobbies, etc)
   - Optional note field
5. WellbeingHistoryScreen dengan calendar view
6. WellbeingStatsScreen dengan:
   - Average mood/energy/sleep charts
   - Trend graphs (last 7/30 days)
   - Activity frequency
7. Dashboard widget showing today's entry and quick stats

Generate dengan UI yang engaging dan visual untuk wellbeing tracking.
```

---

## PROMPT 6: Implementasi Dashboard

```
Implementasikan Dashboard Screen yang menampilkan overview semua data.

Backend Dashboard Endpoint:
- GET /api/dashboard (requires token)
  Response: {
    user: { name, totalPoints, currentStreak },
    tasks: { total, completed, upcoming: [...] },
    recentNotes: [...],
    wellbeingTrend: [...]
  }

Tolong buatkan:
1. DashboardRemoteDatasource
2. DashboardProvider/Bloc
3. DashboardScreen dengan sections:
   - Header dengan greeting dan user stats (points, streak)
   - Quick actions buttons (New Note, New Task, Log Wellbeing)
   - Tasks summary dengan upcoming tasks list
   - Recent notes cards
   - Wellbeing trend chart (last 7 days)
   - Pull to refresh untuk reload all data
4. Navigation dari dashboard ke masing-masing feature screens

Generate dengan UI yang clean, informative, dan easy to navigate.
```

---

## PROMPT 7: Implementasi Profile & Settings

```
Implementasikan Profile dan Settings screens.

Backend Profile Endpoints:
- GET /api/profile (requires token)
  
- PUT /api/profile (requires token)
  Body: { name?, avatarUrl? }
  
- PUT /api/profile/settings (requires token)
  Body: { theme?, notificationsEnabled?, language? }

Tolong buatkan:
1. ProfileRemoteDatasource
2. ProfileProvider/Bloc
3. ProfileScreen dengan:
   - Avatar display (dengan option upload/change - untuk sekarang just URL input)
   - User info (name, email)
   - Stats display (total points, streak, total notes, total tasks)
   - Edit profile button
4. EditProfileScreen untuk update name & avatar
5. SettingsScreen dengan:
   - Theme selector (system, light, dark)
   - Notifications toggle
   - Language selector (en, id)
   - Logout button
6. Implement theme switching yang actually works
7. Confirmation dialog untuk logout

Generate dengan UI yang clean dan user-friendly.
```

---

## PROMPT 8: Error Handling & Loading States

```
Improve error handling dan loading states di seluruh app.

Tolong implementasikan:
1. Global error handler untuk API errors
2. Network connectivity checker
3. Retry mechanism untuk failed requests
4. Loading states untuk semua screens:
   - Shimmer loading untuk lists
   - Skeleton screens
   - Progress indicators
5. Error states dengan:
   - Friendly error messages
   - Retry buttons
   - Empty states dengan illustrations
6. Success feedback:
   - SnackBars untuk operations (create, update, delete)
   - Success animations
7. Offline mode indicator

Generate utilities dan widgets yang bisa digunakan di semua screens.
```

---

## PROMPT 9: Refactoring & Optimization

```
Tolong refactor dan optimize code yang sudah dibuat:

1. Extract reusable widgets:
   - Custom buttons
   - Custom text fields
   - Card components
   - List tiles
   - Empty states
   - Error states
   
2. Add pagination untuk list screens yang panjang

3. Implement caching strategy:
   - Cache dashboard data
   - Cache lists dengan refresh mechanism
   
4. Optimize build methods:
   - Use const constructors
   - Avoid unnecessary rebuilds
   
5. Add input validation:
   - Form validators untuk semua forms
   - Client-side validation sebelum API call
   
6. Improve UX:
   - Loading indicators
   - Smooth transitions
   - Haptic feedback
   - Keyboard handling

Generate refactored code dengan best practices.
```

---

## PROMPT 10: Testing Setup

```
Setup testing untuk Flutter app.

Tolong buatkan:
1. Unit tests untuk:
   - Models (JSON serialization/deserialization)
   - Repositories
   - Providers/Blocs
   - Utilities (TokenManager, ApiClient)
   
2. Widget tests untuk:
   - Login/Register forms
   - List screens
   - Dashboard widgets
   
3. Integration tests untuk:
   - Complete auth flow
   - CRUD operations
   
4. Mock data dan mock API responses

5. Test utilities:
   - Mock ApiClient
   - Test helpers
   - Fixture generators

Generate test files dengan proper setup dan examples.
```

---

## 📝 TEMPLATE UNTUK CUSTOM PROMPT

Jika ingin request fitur spesifik:

```
Saya ingin menambahkan fitur [NAMA_FITUR] di Flutter app StudentHub saya.

Backend API endpoint:
- Method: [GET/POST/PUT/DELETE]
- URL: /api/[endpoint]
- Headers: Authorization: Bearer [token]
- Request Body: { [fields] }
- Response: { success, message, data: [structure] }

Requirements:
1. [requirement 1]
2. [requirement 2]
3. [requirement 3]

Tolong generate:
1. Datasource dengan method untuk call API
2. Repository (interface dan implementation)
3. Provider/Bloc untuk state management
4. UI Screens dengan proper error handling dan loading states
5. Navigation integration

Generate complete code dengan best practices Flutter dan clean architecture.
```

---

## 💡 TIPS SAAT BERINTERAKSI DENGAN AI

1. **Be Specific**: Jelaskan dengan detail apa yang Anda inginkan
2. **Show Examples**: Berikan contoh API response dan expected UI
3. **Mention Constraints**: Sebutkan limitations atau requirements khusus
4. **Ask for Explanation**: Minta AI explain code yang complex
5. **Iterate**: Jangan ragu untuk refine dan improve code yang di-generate
6. **Test Immediately**: Test setiap generated code langsung
7. **Ask for Best Practices**: Minta AI suggest best practices dan optimizations

---

## 🔗 REFERENCE FILES

Saat interact dengan AI, mention these files untuk context:

- `FLUTTER_INTEGRATION_GUIDE.md` - Complete integration guide
- `API_TESTING.md` - API documentation dengan examples
- `prisma/schema.prisma` - Database schema
- `DATABASE_SETUP.md` - Database documentation

---

**Semoga sukses dengan development Flutter app Anda! 🚀**
