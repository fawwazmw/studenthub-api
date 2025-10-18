# Database Setup - PostgreSQL with Docker

## ✅ Setup Complete

Database StudentHub sudah berhasil di-setup dengan konfigurasi berikut:

### Database Configuration

```
Database Type : PostgreSQL 
Host          : localhost
Port          : 5432
Database Name : studenthub_db
Username      : postgres
Password      : pgdev123
```

### Connection String

```
postgresql://postgres:pgdev123@localhost:5432/studenthub_db?schema=public
```

### pgAdmin Access

- URL: http://localhost:5050
- Credentials: (sesuai dengan docker-compose setup Anda)

---

## 📊 Database Schema

### Tables Created (5 tables)

1. **users** - User accounts with authentication and settings
   - id, name, email, password (hashed)
   - avatar_url, theme, notifications_enabled, language
   - total_points, current_streak
   - created_at, updated_at

2. **notes** - Notes with categories and handwriting support
   - id, user_id, title, content, category
   - file_url, is_handwriting
   - created_at, updated_at

3. **tasks** - Task management with due dates
   - id, user_id, title, description, category
   - due_date, is_done
   - created_at, updated_at

4. **wellbeing_entries** - Daily wellbeing tracking
   - id, user_id, date
   - mood, energy, sleep, activities (array)
   - note, created_at, updated_at

5. **_prisma_migrations** - Migration history (managed by Prisma)

---

## 🔧 Database Management Commands

### View Tables

```bash
docker exec pg-dev psql -U postgres -d studenthub_db -c "\dt"
```

### View Table Structure

```bash
# Users table
docker exec pg-dev psql -U postgres -d studenthub_db -c "\d users"

# Notes table
docker exec pg-dev psql -U postgres -d studenthub_db -c "\d notes"

# Tasks table
docker exec pg-dev psql -U postgres -d studenthub_db -c "\d tasks"

# Wellbeing entries
docker exec pg-dev psql -U postgres -d studenthub_db -c "\d wellbeing_entries"
```

### Query Data

```bash
# View all users
docker exec pg-dev psql -U postgres -d studenthub_db -c "SELECT id, name, email FROM users;"

# View all notes
docker exec pg-dev psql -U postgres -d studenthub_db -c "SELECT id, title, category, user_id FROM notes;"

# View all tasks
docker exec pg-dev psql -U postgres -d studenthub_db -c "SELECT id, title, is_done, due_date FROM tasks;"

# Count records
docker exec pg-dev psql -U postgres -d studenthub_db -c "SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM notes) as notes,
  (SELECT COUNT(*) FROM tasks) as tasks,
  (SELECT COUNT(*) FROM wellbeing_entries) as wellbeing;"
```

### Backup Database

```bash
# Create backup
docker exec pg-dev pg_dump -U postgres studenthub_db > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i pg-dev psql -U postgres studenthub_db < backup_20250112.sql
```

### Access PostgreSQL Shell

```bash
docker exec -it pg-dev psql -U postgres -d studenthub_db
```

---

## 🎨 Prisma Studio (Database GUI)

Prisma Studio adalah GUI untuk melihat dan mengedit data database.

### Open Prisma Studio

```bash
npm run prisma:studio
```

Akan membuka browser di: http://localhost:5555

Features:
- View all tables
- Browse data dengan pagination
- Edit records
- Add new records
- Delete records
- Filter dan search

---

## 🔄 Prisma Migrations

### Create New Migration

Setelah mengubah `schema.prisma`:

```bash
npm run prisma:migrate
```

### View Migration History

```bash
docker exec pg-dev psql -U postgres -d studenthub_db -c "SELECT * FROM _prisma_migrations;"
```

### Reset Database (WARNING: Deletes all data!)

```bash
npx prisma migrate reset
```

### Generate Prisma Client (setelah schema changes)

```bash
npm run prisma:generate
```

---

## 🐛 Troubleshooting

### Cannot connect to database

1. Check if PostgreSQL container is running:
   ```bash
   docker ps | grep pg-dev
   ```

2. Check if port 5432 is accessible:
   ```bash
   telnet localhost 5432
   ```

3. Verify DATABASE_URL in .env file

4. Restart PostgreSQL container:
   ```bash
   docker restart pg-dev
   ```

### Migration errors

1. Check Prisma schema syntax:
   ```bash
   npx prisma format
   npx prisma validate
   ```

2. View migration logs

3. If stuck, reset and re-migrate:
   ```bash
   npx prisma migrate reset
   npm run prisma:migrate
   ```

### Connection pool exhausted

This usually happens if you don't close Prisma connections properly. The API already handles this with graceful shutdown in `server.js`.

### Database is slow

1. Check indexes in schema.prisma
2. Use `EXPLAIN ANALYZE` for query optimization
3. Monitor with pgAdmin

---

## 📈 Performance Tips

1. **Use Indexes** - Already configured in schema for:
   - user_id in all related tables
   - category in notes
   - date fields for wellbeing
   - due_date for tasks

2. **Use Prisma Select** - Only fetch needed fields:
   ```javascript
   const user = await prisma.user.findUnique({
     where: { id: 1 },
     select: { id: true, name: true, email: true }
   });
   ```

3. **Use Pagination** - For large datasets:
   ```javascript
   const notes = await prisma.note.findMany({
     take: 20,
     skip: 0,
     orderBy: { createdAt: 'desc' }
   });
   ```

4. **Connection Pooling** - Already configured in Prisma

---

## 🔒 Security Notes

1. **Never commit .env file** - Contains database credentials
2. **Use strong passwords** in production
3. **Enable SSL** for database connections in production
4. **Backup regularly** - Automate database backups
5. **Restrict access** - Use firewall rules for database port

---

## 📱 Ready for Flutter Integration

Database dan API sudah siap untuk diintegrasikan dengan Flutter app. 

Connection details untuk Flutter app (gunakan IP address jika testing di device):
- Base URL: `http://localhost:3000/api` (emulator)
- Base URL: `http://YOUR_IP:3000/api` (physical device)

Contoh mendapatkan IP:
```bash
hostname -I | awk '{print $1}'
```

---

## ✅ Summary

- ✅ PostgreSQL database running in Docker
- ✅ Database `studenthub_db` created
- ✅ 4 main tables + migration table created
- ✅ Prisma Client generated
- ✅ Migrations applied successfully
- ✅ Sample data created and tested
- ✅ API connected to database
- ✅ All endpoints working

**Status: READY FOR DEVELOPMENT** 🚀
