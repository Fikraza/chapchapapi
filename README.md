# Chapchapapi CLI

> An open-source Node.js CLI tool that reads your Prisma schema and automatically generates CRUD APIs and supporting utilities for Express-based projects.

[![npm version](https://img.shields.io/npm/v/chapchapapi.svg)](https://www.npmjs.com/package/chapchapapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)

Chapchapapi removes repetitive backend work by generating controllers, services, routes, search, pagination, CSV import/export, file uploads, and Postman collections from your existing Prisma setup.

**Automate up to 80% of repetitive API development in Prisma + Express projects.**

---

## ✨ Features

- 🔍 **Automatic Schema Parsing** - Reads `schema.prisma` automatically
- 🚀 **Complete CRUD Generation** - Controllers, services, and routes out of the box
- 📮 **Postman Collections** - Pre-built collections with folders and sample requests
- 📊 **CSV Import/Export** - Built-in CSV handling for all models
- 📁 **File Upload Support** - MinIO-based document and file upload utilities
- 🎯 **Interactive CLI** - User-friendly interface using Inquirer
- ⚡ **Fast & Clean** - Developer-friendly workflow with smart folder structures

---

## 📦 What Chapchapapi Generates

From your Prisma schema, Chapchapapi automatically creates:

- ✅ CRUD controllers, services, and routes
- ✅ Search and pagination logic
- ✅ CSV import and export endpoints
- ✅ File and document upload utilities (MinIO-based)
- ✅ Postman collections with folders and example requests

---

## 👥 Who This Tool Is For

This tool is designed for developers already familiar with:

- Node.js and Express
- Prisma ORM
- Relational databases (PostgreSQL, MySQL, etc.)
- REST APIs
- Environment variables and `.env` files

**Note:** Chapchapapi assumes you already have a working Prisma project.

---

## 📋 Prerequisites

Before running Chapchapapi, ensure you have:

- ✅ A Node.js backend project
- ✅ Prisma installed and configured
- ✅ A valid `schema.prisma` file
- ✅ Your database schema synced with Prisma

---

## 🛠️ Setting Up Prisma

If Prisma is not already set up in your project:

```bash
npm install prisma --save-dev
npx prisma init
```

### Example `schema.prisma`:

```prisma
model candidate {
  id        String   @id @default(uuid())
  firstName String
  lastName  String
  createdAt DateTime @default(now())
}
```

### Sync Prisma with your database:

```bash
# If creating a new migration
npx prisma migrate dev

# If database already exists
npx prisma db pull
```

---

## 📥 Installation

### Global Installation (Recommended)

Install Chapchapapi globally to use the `chapchapapi` command:

```bash
npm install -g chapchapapi
```

Then run:

```bash
chapchapapi init
```

### One-Time Usage (Without Global Install)

If you prefer not to install globally, use `npx`:

```bash
npx chapchapapi init
```

> **Note:** To use the `chapchapapi` command directly (without `npx`), you **must** install it globally using `npm install -g chapchapapi`.

---

## 🚀 Getting Started

Run the command from the root of your project:

```bash
chapchapapi init
```

### Step 1: Base Folder Name

You'll be prompted to enter a base folder name:

```
Enter base folder name
(APP)
```

Press **Enter** to use `APP` or type a custom name. This folder will contain all generated API logic.

### Step 2: Folder Structure Type

Choose your preferred folder structure:

```
Choose folder structure type:
1. Smart (recommended)
2. General
```

#### Smart Structure (Recommended)
- Groups models by domain
- Scales well for large Prisma schemas
- Prevents cluttered flat structures

### Step 3: ⚠️ Safety Confirmation Code

**CRITICAL STEP:** After selecting your folder structure, you'll see this safety warning:

```
⚠️  WARNING: This operation will overwrite existing scheme files!
If any of the files already exist, their contents WILL BE LOST.
If you prefer, you can create the scheme files manually instead.

To proceed, type the following 6-digit code exactly as shown:
>>> 789689
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### What Happens Based on Your Choice:

**✅ If you enter the code (`789689`):**
- **Complete folder structure** is generated with all features
- All controllers, routes, middleware, and business logic are created
- Full API structure ready for production use

```bash
cd APP
ls
# Output: Controller  Middleware  Routes
```

**❌ If you skip or ignore the code:**
- **Only basic structure** is created
- Only the `Controller` folder is generated
- No routes, middleware, or complete logic files
- You'll need to manually create additional components

```bash
cd APP
ls
# Output: Controller
```

**💡 Recommendation:** Always enter the confirmation code (`789689`) to get the full functionality and save hours of manual setup.

---

## 📂 Generated Folder Structure

After successful generation (when you entered the confirmation code), navigate to your base folder:

```bash
cd APP
```

### Complete Structure

```
APP/
├── Controller/
│   └── Scheme/
│       └── Models/
│           ├── candidate/
│           ├── county/
│           ├── tribe/
│           ├── service/
│           └── training_center/
├── Middleware/
└── Routes/
```

### Inside a Model Folder

Example: `Controller/Scheme/Models/candidate/candidate/`

```
candidate/
├── csv/                  # CSV import/export configuration
├── search/               # Search configuration (Fuse.js)
├── permission/           # Role-based access control
├── field.json           # Field definitions for CRUD operations
└── include.json         # Prisma relations configuration
```

#### `field.json`
Defines allowed fields for create, update, filtering, and listing operations.

#### `include.json`
Controls Prisma include relations for eager loading related data.

**Example:**
```json
{
  "tribe": true,
  "county": true
}
```

#### `search/`
Contains configuration for searchable fields using **Fuse.js** for fast and flexible searching.

#### `csv/`
CSV import/export endpoints with templates and test data for all CRUD operations.

#### `permission/`
Reserved for role-based access control and authorization logic.

---

## 📮 Postman Integration

Chapchapapi automatically creates Postman collections for each model:

- ✅ Folder structure in Postman
- ✅ CRUD requests (Create, Read, Update, Delete)
- ✅ CSV import/export requests
- ✅ Search and pagination requests
- ✅ Pre-filled sample test data

### 🚀 Generating Postman Collections

After setting up your Postman API key and workspace ID in `.env`, generate test routes for all your models by making a **GET request** to:

```
GET /scheme/postman
```

This endpoint will:
- Read all your Prisma models
- Generate a complete Postman collection
- Create organized folders for each model
- Add pre-configured requests with sample data
- Automatically import to your Postman workspace

**Example using cURL:**
```bash
curl http://localhost:3000/scheme/postman
```

**Example using your browser:**
```
http://localhost:3000/scheme/postman
```

---

## 📦 Required Dependencies

Install the required dependencies in your project:

```bash
npm install prisma minio multer uuid dotenv csv-parser fuse.js
```

### Dependency Explanation

| Package | Purpose |
|---------|---------|
| `prisma` | Database access via Prisma Client |
| `minio` | File and document storage |
| `multer` | Handles file uploads |
| `uuid` | Generates unique identifiers |
| `dotenv` | Loads environment variables |
| `csv-parser` | CSV import and export |
| `fuse.js` | Fast fuzzy search |

---

## ⚙️ Environment Variables

Create a `.env` file in your project root:

### Postman Integration

```env
POSTMAN_API_KEY=""
POSTMAN_WORKSPACE=""
```

#### 🔐 How to Get Your Postman API Key

1. Login to Postman
2. Visit: **https://www.postman.com/settings/me/api-keys**
3. Click **Generate API Key**
4. Copy and paste into your `.env`

#### 🧭 How to Find Your Postman Workspace ID

1. Open your workspace in Postman
2. Look at the URL:
   ```
   https://www.postman.com/<username>/workspaces/<workspace-id>
   ```
3. Copy the `<workspace-id>` section
4. Paste into your `.env`

### MinIO Configuration

```env
MINIO_ROOT_USER=""
MINIO_ROOT_PASSWORD=""
```

---

## 🔧 Configuration

Configuration files are created in the project root:

```
chapchapapi/
├── config.json
└── structure.json
```

### `structure.json`

Maps Prisma models to generated folder paths.

**Example:**
```json
{
  "candidate": "candidate/candidate",
  "candidate_affidavit": "candidate/candidate_affidavit",
  "tribe": "tribe",
  "training_center": "training_center"
}
```

---

## ➕ Adding New Prisma Models

After adding a new Prisma model:

1. Run `npx prisma db pull`
2. Update `structure.json` manually

**Example:**

```prisma
model school {
  id   String @id @default(uuid())
  name String
}
```

Add to `structure.json`:

```json
{
  "school": "school"
}
```

---

## 💻 CLI Commands

Initialize generation:

```bash
chapchapapi init
```

or (without global install):

```bash
npx chapchapapi init
```

---

## 🗺️ Roadmap

- [ ] JWT authentication scaffolding
- [ ] TypeScript support
- [ ] NestJS support
- [ ] GraphQL endpoint generation
- [ ] Swagger/OpenAPI generation
- [ ] Plugin system

---

## 💖 Sponsor This Project

If you find Chapchapapi useful and would like to support its continued development, consider sponsoring the project.

Your contribution helps keep the project maintained and growing.

[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue.svg)](https://www.paypal.com/donate/?hosted_button_id=244NK5AWBKPFN)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License © 2025 Arthur Codex

---

## 🏷️ Keywords

`prisma` · `cli` · `code-generator` · `crud` · `express` · `nodejs` · `api` · `rest-api` · `backend` · `automation` · `prisma-generator` · `express-api` · `crud-generator` · `postman` · `csv` · `file-upload` · `minio` · `search` · `pagination` · `scaffolding`

---

## 👨‍💻 Author

**Arthur Codex** - Original Developer

**Documentation by:** [Neemat Rashid](https://github.com/Neematrasheed05)

---

<div align="center">
  
**Made with ❤️ by Arthur Codex**

**README Documentation by [Neemat Rashid](https://github.com/Neematrasheed05)**

[⭐ Star this repo](https://github.com/Fikraza/chapchapapi) if you find it helpful!

</div>