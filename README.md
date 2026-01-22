# SpendSmart 💸

A full-stack expense tracking application with user and admin roles,
built to manage personal finances with analytics and system-level insights.

## 🚀 Features

### User
- Secure authentication (JWT)
- Add, edit, delete expenses
- Pagination, filtering, and sorting
- Expense analytics (category & monthly trends)
- Export expenses to CSV

### Admin
- Admin-only dashboard
- System-wide analytics
- User management (delete users + cascade expense cleanup)

## 🧱 Tech Stack

**Frontend**
- React + TypeScript + Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Recharts

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Role-based access control
- Zod validation
- bcrypt password hashing

## 🧠 Key Engineering Decisions

- JWT-based auth with `/auth/me` hydration
- Role-based route protection (USER / ADMIN)
- Backend-driven pagination & filtering
- Defensive UI rendering for partial data
- Async-safe UI (disabled actions, confirmations, toasts)

## 📊 Screenshots
(Add later if you want)

## ⏭️ Future Improvements
- PDF export
- Automated testing
- Deployment
