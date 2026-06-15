# CyberFolio — Professional Cybersecurity Portfolio & CMS Platform

A full-stack cybersecurity portfolio platform with a dark futuristic theme, smooth animations, particle effects, and a complete CMS-like admin dashboard. Update all content without touching code.

---

## ✨ Features

### Public Website
- **10 public pages**: Home, About, Services, Portfolio, Certifications, Skills, Blog, Contact, Testimonials, Resume, FAQ
- Particle background with mouse interaction
- Custom cursor effects
- Loading screen animation
- Smooth scroll-triggered animations (Framer Motion)
- Glassmorphism cards and panels
- Sticky animated navbar
- Responsive across desktop, tablet, mobile

### Admin Dashboard
- Secure JWT authentication with refresh token rotation
- CRUD for: Projects, Blog Posts, Certifications, Skills, Services, Testimonials, FAQs
- Contact message management with status tracking
- Media library with drag & drop upload, image optimization
- Profile settings with social links, SEO, and analytics config
- Site-wide settings panel
- Analytics overview with visitor stats

### Technical
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, SWR
- **Backend**: Node.js + Express, JWT Auth, Rate Limiting, Helmet, Multer, Sharp
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcrypt, XSS protection, MongoDB sanitization, CORS, HPP, audit logs
- **DevOps**: Docker + Docker Compose, Nginx reverse proxy, SSL-ready

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/cyberfolio.git
cd cyberfolio
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cyberfolio
JWT_SECRET=your-32-char-min-secret-key-here-change-this
JWT_REFRESH_SECRET=another-32-char-min-secret-key-change-this
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
API_URL=http://localhost:5000
ALLOWED_ORIGINS=http://localhost:3000
```

Optional email notifications:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Seed Database

```bash
cd backend
npm run seed
```

This creates:
- Admin user (credentials shown in terminal)
- Sample projects, blog posts, certifications, skills, services, testimonials, FAQs
- Default profile

### 5. Start Development Servers

From the root directory:

```bash
npm run dev
```

Or start separately:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Access:
- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
- **API**: http://localhost:5000/api/health

---

## 🐳 Docker Deployment

### Development with Docker

```bash
# Copy and configure env
cp backend/.env.example backend/.env
# Edit backend/.env with your values

docker-compose up --build
```

### Production Deployment

1. Configure all env variables in `docker-compose.yml` or a `.env` at project root
2. Add SSL certificates to `nginx/ssl/`
3. Update `nginx/nginx.conf` with your domain
4. Run:

```bash
docker-compose --profile production up --build -d
```

---

## 📁 Project Structure

```
cyberfolio/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express app entry point
│   │   ├── models/
│   │   │   └── index.js       # All MongoDB models
│   │   ├── routes/
│   │   │   ├── auth.js        # JWT auth routes
│   │   │   ├── projects.js    # Projects CRUD
│   │   │   ├── blog.js        # Blog CRUD
│   │   │   ├── certifications.js
│   │   │   ├── skills.js
│   │   │   ├── services.js
│   │   │   ├── testimonials.js
│   │   │   ├── contact.js
│   │   │   ├── settings.js
│   │   │   ├── profile.js
│   │   │   ├── faq.js
│   │   │   ├── analytics.js
│   │   │   └── media.js
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT middleware + audit logging
│   │   └── utils/
│   │       ├── logger.js      # Winston logger
│   │       └── seed.js        # Database seeder
│   ├── uploads/               # Uploaded media files
│   ├── logs/                  # Application logs
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── portfolio/
│   │   │   │   └── [slug]/    # Project detail
│   │   │   ├── certifications/
│   │   │   ├── skills/
│   │   │   ├── blog/
│   │   │   │   └── [slug]/    # Blog post detail
│   │   │   ├── contact/
│   │   │   ├── testimonials/
│   │   │   ├── resume/
│   │   │   ├── faq/
│   │   │   └── admin/         # Protected admin dashboard
│   │   │       ├── login/
│   │   │       ├── dashboard/
│   │   │       ├── projects/
│   │   │       ├── blog/
│   │   │       ├── certifications/
│   │   │       ├── skills/
│   │   │       ├── services/
│   │   │       ├── testimonials/
│   │   │       ├── contacts/
│   │   │       ├── faq/
│   │   │       ├── profile/
│   │   │       ├── media/
│   │   │       └── settings/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── animations/
│   │   │   │   ├── ParticleBackground.tsx
│   │   │   │   └── LoadingScreen.tsx
│   │   │   └── admin/
│   │   │       └── AdminTable.tsx  # Reusable CRUD table + modal
│   │   ├── lib/
│   │   │   └── api.ts         # All API functions
│   │   ├── store/
│   │   │   └── authStore.ts   # Zustand auth store
│   │   └── styles/
│   │       └── globals.css    # Global styles + cyber theme
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
│
├── nginx/
│   └── nginx.conf             # Production Nginx config
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🔐 API Reference

All admin endpoints require `Authorization: Bearer <token>` header.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/change-password` | Change password |

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get portfolio profile |
| GET | `/api/projects` | List published projects |
| GET | `/api/projects/:slug` | Get project + increment views |
| GET | `/api/blog` | List published posts |
| GET | `/api/blog/:slug` | Get post + increment views |
| GET | `/api/certifications` | List certifications |
| GET | `/api/skills` | List skills (grouped) |
| GET | `/api/services` | List services |
| GET | `/api/testimonials` | List approved testimonials |
| GET | `/api/faq` | List FAQs |
| POST | `/api/contact` | Submit contact form |

### Admin Endpoints (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/profile` | Update profile |
| GET | `/api/projects/admin/all` | All projects (any status) |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/blog/admin/all` | All posts |
| POST | `/api/blog` | Create post |
| PUT | `/api/blog/:id` | Update post |
| DELETE | `/api/blog/:id` | Delete post |
| POST | `/api/certifications` | Add certification |
| PUT | `/api/certifications/:id` | Update certification |
| DELETE | `/api/certifications/:id` | Delete certification |
| POST | `/api/skills` | Add skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| GET | `/api/contact` | List contact submissions |
| PATCH | `/api/contact/:id/status` | Update contact status |
| DELETE | `/api/contact/:id` | Delete contact |
| POST | `/api/media/upload` | Upload file |
| DELETE | `/api/media/:id` | Delete file |
| GET | `/api/analytics/summary` | Dashboard analytics |
| GET/PUT | `/api/settings` | Get/update settings |

---

## 🎨 Customization

### Change Color Theme
Edit `frontend/tailwind.config.js` under `colors.cyber`:
```js
cyber: {
  green: '#00ff88',   // Primary accent
  blue: '#00d4ff',    // Secondary accent
  purple: '#a855f7',  // Tertiary accent
  dark: '#050a0f',    // Background
}
```

And update CSS variables in `frontend/src/styles/globals.css`:
```css
:root {
  --cyber-green: #00ff88;
  --cyber-blue: #00d4ff;
}
```

### Add New Pages
1. Create `frontend/src/app/yourpage/page.tsx`
2. Add to navbar in `frontend/src/components/layout/Navbar.tsx`
3. Add backend route in `backend/src/routes/` if needed

### Customize Content
All content is managed through the admin dashboard at `/admin`. No code changes needed.

---

## 🔒 Security Notes

- Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to random 32+ character strings in production
- Change default admin password immediately after first login
- Enable HTTPS in production (Nginx config provided)
- MongoDB URI should use authentication in production
- Review CORS `ALLOWED_ORIGINS` to match your domain only

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Animations | Framer Motion, Canvas API |
| State | Zustand, SWR |
| Forms | React Hook Form, Zod |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| File Upload | Multer, Sharp |
| Security | Helmet, express-rate-limit, xss-clean, mongo-sanitize |
| Email | Nodemailer |
| Logging | Winston |
| DevOps | Docker, Docker Compose, Nginx |

---

## 📄 License

MIT License — free to use for personal and commercial projects.
