# Leads Tracking App (API + Web)

A full-stack Leads Management portal backed by a RESTful API and SQLite database with Sequelize ORM. Built for the Agreem Technologies Technical Assessment.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js (MVC Architecture)
- **ORM & Database**: Sequelize ORM with SQLite3 (Foreign key constraints, cascading deletes, indexes)
- **Frontend**: React 18, React Router v6, Vite, Lucide Icons, Vanilla CSS
- **Testing**: Jest, Supertest (12 automated unit & integration test suites)
- **Containerization**: Docker & Docker Compose (Multi-stage build)

---

## ✨ Features

1. **Leads Management (CRUD)**:
   - Create, read, update, and delete leads.
   - Lead fields: `id`, `name`, `email`, `phone`, `status` (`new`, `contacted`, `qualified`, `lost`), `createdAt`.
2. **Notes per Lead**:
   - Multiple notes per lead (`id`, `leadId`, `content`, `createdAt`).
   - Cascade deletion when a lead is removed.
3. **Web Portal UI**:
   - Multi-page routing with React Router (`/`, `/leads/new`, `/leads/:id`, `/leads/:id/edit`).
   - Search by lead name or email with debouncing.
   - Filter by status (`new`, `contacted`, `qualified`, `lost`).
   - Interactive inline status dropdown directly in table.
   - Lead detail view with notes timeline, full note reader modal, and note creation.
   - Dedicated create and edit lead pages with full form validation.
   - Pagination controls.
4. **API Robustness & Validation**:
   - Email format validation & duplicate email conflict detection.
   - Proper HTTP response codes (`200`, `201`, `400`, `404`, `500`).
   - Centralized error handler.
5. **Bonus & Production Readiness**:
   - Basic Auth support (toggleable via environment variable).
   - Pagination on `GET /api/leads` (`page` and `limit` query params).
   - Automated test suite (12 test cases).
   - Database seed script (`npm run seed`).
   - Dockerfile and Docker Compose support.

---

## 📁 Project Structure

```
├── client/                     # React Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Modals, Loader, etc.)
│   │   ├── pages/              # Multi-page views (LeadsList, CreateLead, LeadDetail, EditLead)
│   │   ├── api.js              # API client methods
│   │   ├── App.jsx             # React Router configuration
│   │   ├── index.css           # Styling
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json             # Vercel SPA routing rewrites
│   └── vite.config.js
├── src/
│   ├── config/
│   │   └── db.js               # Sequelize instance configuration
│   ├── models/
│   │   ├── Lead.js             # Lead Sequelize Model
│   │   ├── Note.js             # Note Sequelize Model
│   │   └── index.js            # Model associations (Cascade delete) & exports
│   ├── controllers/
│   │   ├── leadController.js   # Leads CRUD, search, filter & pagination
│   │   └── noteController.js   # Lead notes CRUD
│   ├── middlewares/
│   │   ├── auth.js             # Basic Auth middleware
│   │   ├── errorHandler.js     # 404 & Centralized error handler
│   │   └── validate.js         # Input validation middleware
│   ├── routes/
│   │   ├── index.js            # API router mount
│   │   └── leadRoutes.js       # Lead & Note route definitions
│   ├── scripts/
│   │   └── seed.js             # Sample data seeder
│   ├── app.js                  # Express app setup & static file serving
│   └── server.js               # Server entry point
├── tests/
│   └── leads.test.js           # Jest + Supertest integration tests
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm

### 1. Installation

Install root and frontend dependencies:

```bash
npm install
npm --prefix client install
```

### 2. Seed Database (Optional)

Populate the database with sample leads and notes:

```bash
npm run seed
```

### 3. Run Development Server

Start both the backend API and frontend concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

**Default Basic Auth Credentials (if enabled):**
- **Username**: `admin`
- **Password**: `admin123`

---

## 🧪 Running Tests

Run the automated test suite with Jest and Supertest:

```bash
npm test
```

---

## 🐳 Docker Deployment

To build and run the application using Docker:

```bash
docker compose up --build
```

Access the app at [http://localhost:5000](http://localhost:5000).

---

## 📡 API Reference & `curl` Examples

### 1. Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

---

### 2. List Leads (with Search, Filter & Pagination)

```bash
# Get all leads (page 1, limit 10)
curl -X GET "http://localhost:5000/api/leads?page=1&limit=10"

# Search by name or email
curl -X GET "http://localhost:5000/api/leads?search=Sarah"

# Filter by status
curl -X GET "http://localhost:5000/api/leads?status=qualified"
```

**Sample Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sarah Connor",
      "email": "sarah.connor@cyberdyne.io",
      "phone": "+1 555-0199",
      "status": "qualified",
      "createdAt": "2026-10-07T09:49:53.000Z"
    }
  ],
  "pagination": {
    "total": 7,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Get Single Lead by ID (includes Notes)

```bash
curl -X GET http://localhost:5000/api/leads/1
```

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sarah Connor",
    "email": "sarah.connor@cyberdyne.io",
    "phone": "+1 555-0199",
    "status": "qualified",
    "createdAt": "2026-10-07T09:49:53.000Z",
    "notes": [
      {
        "id": 2,
        "leadId": 1,
        "content": "Requested a demo for her technical team next Tuesday.",
        "createdAt": "2026-10-07T09:49:53.000Z"
      }
    ]
  }
}
```

---

### 4. Create a Lead

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1 555-0100",
    "status": "new"
  }'
```

---

### 5. Update a Lead (PATCH)

```bash
curl -X PATCH http://localhost:5000/api/leads/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "qualified",
    "phone": "+1 555-9999"
  }'
```

---

### 6. Delete a Lead

```bash
curl -X DELETE http://localhost:5000/api/leads/1
```

---

### 7. Get Notes for a Lead

```bash
curl -X GET http://localhost:5000/api/leads/1/notes
```

---

### 8. Add a Note to a Lead

```bash
curl -X POST http://localhost:5000/api/leads/1/notes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Followed up with pricing details via email."
  }'
```
