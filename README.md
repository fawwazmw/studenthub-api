# StudentHub API

Backend API untuk aplikasi StudentHub - Aplikasi produktivitas dan wellbeing untuk mahasiswa.

## 🚀 Tech Stack

- **Backend Framework**: Node.js + Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Joi
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
studenthub-api/
├── src/
│   ├── config/           # Konfigurasi database, JWT, storage
│   ├── middlewares/      # Auth, validation, error handling
│   ├── modules/          # Feature modules
│   │   ├── auth/        # Authentication & authorization
│   │   ├── dashboard/   # Dashboard data
│   │   ├── notes/       # Notes management
│   │   ├── wellbeing/   # Wellbeing tracking
│   │   └── profile/     # User profile
│   ├── utils/           # Helper functions
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── tests/              # Test files
├── .env.example        # Environment variables template
└── package.json
```

## 🛠️ Setup & Installation

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` ke `.env` (sudah dibuat dengan konfigurasi Docker PostgreSQL):

```bash
# .env sudah dibuat dengan konfigurasi:
# - PostgreSQL Docker (localhost:5432)
# - Database: studenthub_db
# - JWT Secret: generated
```

Jika ingin mengubah konfigurasi, edit file `.env`.

### 3. Setup Database

Database PostgreSQL sudah di-setup dan running di Docker (localhost:5432).

✅ **Status: Database sudah siap!**

- Database name: `studenthub_db`
- Tables: users, notes, tasks, wellbeing_entries
- Migrations: Applied
- Sample data: Created

Lihat `DATABASE_SETUP.md` untuk detail lengkap.

Jika ingin reset database:

```bash
# Reset database (WARNING: deletes all data)
npm run prisma:migrate reset
```

### 4. Run Development Server

```bash
npm run dev
```

API akan berjalan di `http://localhost:3000`

## 📋 Available Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server dengan hot reload
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Dashboard
- `GET /api/dashboard` - Get dashboard data (protected)

### Notes
- `POST /api/notes` - Create note (protected)
- `GET /api/notes` - Get all notes (protected)
- `GET /api/notes/:id` - Get note by ID (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)

### Wellbeing
- `POST /api/wellbeing` - Create wellbeing entry (protected)
- `GET /api/wellbeing` - Get wellbeing entries (protected)
- `GET /api/wellbeing/stats` - Get wellbeing statistics (protected)
- `GET /api/wellbeing/:date` - Get entry by date (protected)
- `PUT /api/wellbeing/:id` - Update entry (protected)

### Profile
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update profile (protected)
- `PUT /api/profile/settings` - Update settings (protected)

### Tasks
- `POST /api/tasks` - Create task (protected)
- `GET /api/tasks` - Get all tasks (protected)
- `GET /api/tasks/upcoming` - Get upcoming tasks (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `PATCH /api/tasks/:id/toggle` - Toggle task status (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

## 🔐 Authentication

API menggunakan JWT Bearer Token. Untuk mengakses endpoint yang protected:

1. Login atau register untuk mendapatkan token
2. Sertakan token di header:
   ```
   Authorization: Bearer <your-token>
   ```

## 📊 Database Schema

Database memiliki 4 model utama:

- **User** - Data pengguna
- **Note** - Catatan/notes
- **WellbeingEntry** - Entry wellbeing harian
- **Task** - Task/tugas

Lihat `prisma/schema.prisma` untuk detail lengkap.

## 🧪 Testing

```bash
npm test
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🚧 TODO / Next Steps

- [ ] Implement file upload untuk handwriting notes (AWS S3/Cloudinary)
- [ ] Add pagination untuk list endpoints
- [ ] Add sorting dan filtering options
- [ ] Implement refresh token mechanism
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add rate limiting
- [ ] Add comprehensive testing (unit & integration)
- [ ] Add API documentation dengan Swagger
- [ ] Implement logging system

## 👤 Author

Your Name

## 📄 License

ISC
