# ❤️ Sponsor This Project

If you find **chapchapapi CLI** useful and would like to support its
ongoing development, consider sponsoring the project.\
Your contribution helps keep this project maintained and growing.

[![Donate with
PayPal](https://img.shields.io/badge/Donate-PayPal-blue?logo=paypal)](https://www.paypal.com/donate/?hosted_button_id=244NK5AWBKPFN)

---

# 🪙 Chapchapapi CLI

**chapchapapi** is an open-source Node.js CLI tool that reads your
Prisma schema and instantly generates:

- ✅ CRUD boilerplate (controllers, services, routes)\
- ✅ Postman-ready REST API collections\
- ✅ Search, pagination, CSV import/export endpoints\
- ✅ MinIO-based file/document upload utilities

It automates up to **80% of repetitive API development** in Prisma +
Express projects.

---

## ✨ Features

- 🔍 Parses `schema.prisma` automatically\
- ⚙️ Generates complete CRUD endpoints\
- 📬 Builds Postman collections with folders + sample requests\
- 🧾 CSV import/export support\
- 🔐 MinIO document upload utilities\
- 🎨 Beautiful interactive CLI using `inquirer`\
- ⚡ Fast, clean, developer-friendly workflow

---

# 🚀 Installation

### **Install globally:**

```bash
npm install -g chapchapapi
```

Then initialize your backend project:

```bash
chapchapapi init
```

### **Run without installing:**

```bash
npx chapchapapi init
```

---

# 🔧 Required Environment Variables

Add the following variables to your `.env` file depending on your
project features.

---

## **Postman Integration**

These are required for auto-generating Postman collections:

```env
POSTMAN_API_KEY=""
POSTMAN_WORKSPACE=""
```

### 🔐 How to Get Your Postman API Key

1.  Login to Postman\
2.  Visit:\
    **https://www.postman.com/settings/me/api-keys**\
3.  Click **Generate API Key**\
4.  Copy and paste into your `.env`

### 🧭 How to Find Your Postman Workspace ID

1.  Open your workspace in Postman\

2.  Look at the URL:

        https://www.postman.com/<username>/workspaces/<workspace-id>

3.  Copy the `<workspace-id>` section\

4.  Paste into your `.env`

---

## **Document Handling (MinIO)**

Required if your project deals with documents, images, or file uploads.

```env
MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
```

---

# 📦 Required NPM Packages in Your Project

```bash
npm install prisma minio multer uuid dotenv csv-parser fuse.js
```

---

# 🧰 Commands

### **Initialize a new generator setup**

```bash
chapchapapi init
```

or

```bash
npx chapchapapi init
```

---

# 🗺 Roadmap

- [ ] Add JWT authentication scaffolding\
- [ ] Support for NestJS\
- [ ] Support for TypeScript\
- [ ] GraphQL endpoint generation\
- [ ] Swagger/OpenAPI auto-generation\
- [ ] CLI plugin system

---

# 🤝 Contributing

Contributions are welcome!

1.  Fork repo\
2.  Create feature branch\
3.  Submit PR

---

# 📄 License

MIT License © 2025 Arthur Codex
