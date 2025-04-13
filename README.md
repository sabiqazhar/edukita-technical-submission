# 📘 Edukita Student Assignment API

This is a TypeScript-based REST API for managing student assignments, built with Express.js and TypeORM.  
It supports role-based access (student/teacher), assignment submissions, grading, and personalized learning tips using Gemini AI.

---

## 🚀 Features

- Submit assignments (student)
- Grade assignments (teacher)
- Retrieve assignments and grades
- Generate personalized learning tips (via Gemini)
- Email notifications to teachers (optional via Airflow)

---

## 📦 Tech Stack

- TypeScript
- Express.js
- SQLite + TypeORM
- Node.js (v18+)
- Gemini AI (via `google.generativeai`)
- Airflow
- Python (for Airflow DAG Operators)
- Docker (for production builds)

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/edukita-api.git
cd edukita-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update your API keys and DB config as needed.

---

## 🧪 Development Mode

### Run with ts-node-dev

```bash
npm run dev
```

API runs at: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Support

### Build Production Image

```bash
docker build -t edukita-api .
```

### Run the Container

```bash
docker run -p 3000:3000 --env-file .env edukita-api
```

---

## 📂 Scripts

```bash
npm run dev              # Start dev server (ts-node-dev)
npm run build            # Compile TS to JS
npm run start            # Run compiled server from /dist
npm run seed             # Populate DB with demo students & teachers
npm run migration:run    # Apply DB migrations
```

---

## 🔐 Roles & Authorization

| Role     | Capabilities                            |
|----------|-----------------------------------------|
| Student  | Submit assignments, view own grades     |
| Teacher  | View all assignments, assign grades     |

🔐 Authorization via `x-user-id` header (temporary for dev).

---

## 🧠 AI Tips Feature (Gemini)

This API integrates with **Gemini Pro** to generate personalized writing improvement tips.  
Make sure to provide your `GEMINI_API_KEY` in `.env`.

---

## 📝 Example Request

### Submit Assignment (Student)

```http
POST /assignments
Headers: x-user-id: <student_id>
Body:
{
  "subject": "English",
  "title": "My Essay",
  "content": "Today I goed to the park..."
}
```

---

## 📫 Contact / Maintainer

Made with ❤️ by sabiq  
📧 sabiqandazhar@gmail.com
```

---
