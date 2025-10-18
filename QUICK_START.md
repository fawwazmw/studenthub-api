# 🚀 Quick Start Guide - After Moving Project

## Setelah Memindahkan Folder

### 1️⃣ Install Dependencies (jika belum)
```bash
npm install
```

### 2️⃣ Check Environment Variables
```bash
# File .env sudah ada dan configured
cat .env

# Pastikan DATABASE_URL benar:
# DATABASE_URL="postgresql://postgres:pgdev123@localhost:5432/studenthub_db?schema=public"
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

Server akan running di: **http://localhost:3000**

---

## 🔍 Troubleshooting

### Server tidak start?
```bash
# Check port 3000 tidak digunakan
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Database connection error?
```bash
# Check Docker containers running
docker ps | grep pg-dev

# Jika tidak running, start container
docker start pg-dev
docker start pgadmin-dev
```

### Prisma Client error?
```bash
# Regenerate Prisma Client
npm run prisma:generate
```

---

## 📝 Important Files

- `.env` - Environment variables (DATABASE_URL, JWT_SECRET)
- `prisma/schema.prisma` - Database schema
- `src/server.js` - Server entry point
- `src/app.js` - Express app configuration

---

## 🧪 Quick Test

```bash
# Health check
curl http://localhost:3000/health

# Or run test script
./test-api.sh
```

---

## 📚 Documentation

- `README.md` - Project overview
- `API_TESTING.md` - API testing guide
- `FLUTTER_INTEGRATION_GUIDE.md` - Flutter integration
- `FLUTTER_AI_PROMPTS.md` - AI prompts for Flutter development

---

## ✅ Checklist Setelah Pindah

- [ ] `npm install` completed
- [ ] `.env` file exists and configured
- [ ] Docker containers running (pg-dev, pgadmin-dev)
- [ ] `npm run dev` starts successfully
- [ ] Health check returns OK
- [ ] Ready to integrate with Flutter!

---

**Happy Coding! 🎉**
