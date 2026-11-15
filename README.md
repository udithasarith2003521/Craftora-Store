# Craftora Store ⚡

> **Craftora Store** is a production-ready digital product store built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Neon Postgres (Drizzle ORM)**, **Vercel Blob Storage**, and **Custom Single-Admin Authentication**.
>
> Designed with a futuristic deep navy/black-blue cybernetic aesthetic (`#020617` / `#030B1F`), glassmorphism cards, and electric cyan/blue neon accents.

---

## 🌟 Key Features

- **Public Store (Zero Account Required):**
  - **Dynamic Catalog:** Hero section, real-time search, category filter chips, and sorting (Newest, Most Downloaded, Alphabetical).
  - **Product Showcase:** Multi-image gallery with thumbnails, fullscreen lightbox modal with keyboard navigation, format & size metadata, and direct download links.
  - **Atomic Downloads:** High-speed `/api/download/[id]` redirect with atomic SQL download counter increment (`download_count = download_count + 1`).
  - **Zero Admin Leakage:** The public store contains zero links, buttons, or hints leading to the admin panel.
  - **Complete SEO:** Dynamic per-product Open Graph metadata, dynamic `sitemap.xml`, and `robots.txt`.

- **Hidden Admin Management Panel:**
  - **Unguessable Secret Path:** Accessible exclusively via `process.env.ADMIN_SECRET_PATH` (e.g. `/craftora-hq-7f3k9x`). Any direct visits to `/admin`, `/login`, `/dashboard`, or `/_admin` immediately yield a genuine 404.
  - **Brute-Force Lockdown:** Persistent IP-based lockout in database (5 failed login attempts triggers a 15-minute freeze).
  - **Client-Side Vercel Blob Uploads:** Large digital files (up to 500MB) and multi-image galleries (up to 10 images, max 5MB each) upload directly from browser to Vercel Blob (`upload()` from `@vercel/blob/client` + authorized token generation at `/api/admin/upload`), bypassing Vercel serverless 4.5MB request payload limits.
  - **Real Progress Bar:** Accurate 0% to 100% upload progress bar with abort/cancel and retry support.
  - **Storage Auto-Purge:** Deleting or replacing products immediately calls Vercel Blob `del()` to purge old files and images, preventing orphaned storage.
  - **Protected CRUD:** Create, edit, toggle Draft/Published, delete products with modal confirmation, and create custom category taxonomy.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language:** TypeScript (strict mode enabled)
- **Styling & Motion:** Tailwind CSS, Framer Motion, Lucide React icons, Sonner
- **Database:** Neon Serverless Postgres via `@neondatabase/serverless` & [Drizzle ORM](https://orm.drizzle.team/)
- **Storage:** [Google Drive](https://drive.google.com) (Direct Download Links) & [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (`@vercel/blob` & `@vercel/blob/client`)
- **Authentication:** Custom single-admin JWT auth using `jose` + `bcryptjs`, httpOnly + Secure + SameSite=Strict cookies

---

## 📁 Project Architecture

```
Craftora Store/
├── .env.example                       # Environment variables template
├── .gitignore
├── drizzle.config.ts                  # Drizzle ORM configuration
├── next.config.mjs                    # Security headers & remote image patterns
├── package.json
├── README.md
├── scripts/
│   ├── hash-password.mjs              # Bcrypt password hash generator CLI
│   ├── seed.ts                        # 6 realistic futuristic dummy products
│   └── migrate.ts                     # Database migration script
└── src/
    ├── app/
    │   ├── layout.tsx                 # Root layout with fonts & theme
    │   ├── page.tsx                   # Public store front
    │   ├── product/[slug]/page.tsx    # Product details & lightbox
    │   ├── category/[slug]/page.tsx   # Category filtered catalog
    │   ├── not-found.tsx              # Futuristic 404 page
    │   ├── sitemap.ts                 # Dynamic sitemap (public only)
    │   ├── robots.ts                  # Robots indexing policy
    │   ├── api/
    │   │   ├── download/[id]/route.ts # Atomic download increment & 302 redirect
    │   │   └── admin/
    │   │       ├── upload/route.ts    # Vercel Blob client-side token generator
    │   │       ├── login/route.ts     # Brute-force protected admin login
    │   │       ├── logout/route.ts    # Session destruction
    │   │       ├── categories/route.ts
    │   │       └── products/route.ts
    │   └── _admin/                    # Rewritten secret admin dashboard & editor
    ├── components/
    │   ├── store/                     # Store UI components
    │   └── admin/                     # Admin forms, image uploader, file uploader
    ├── db/
    │   ├── index.ts                   # Drizzle client with serverless Neon adapter
    │   ├── memory-db.ts               # Local in-memory fallback for zero-friction dev
    │   └── schema.ts                  # PostgreSQL tables & relations
    ├── lib/
    │   ├── auth.ts                    # JWT creation, cookie extraction & verification
    │   ├── brute-force.ts             # IP rate-limit and 15-min lockout logic
    │   ├── utils.ts                   # Formatters & slugifier
    │   └── validations.ts             # Zod input schemas
    └── middleware.ts                  # Secret path rewriter & security guard
```

---

## 🚀 Step-by-Step Setup Guide

### 1. Local Prerequisites
- Node.js 18+ or 20+
- Git

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd "Craftora Store"
npm install
```

### 3. Generate Your Admin Password Hash
Run the included password hash utility:
```bash
node scripts/hash-password.mjs "YourSuperSecretPassword"
```
Copy the generated bcrypt hash (e.g. `$2a$10$xxxxxxxx...`).

### 4. Configure Environment Variables
Create a `.env` file in the project root based on `.env.example`:
```env
# Database (Neon Serverless Postgres)
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Vercel Blob Storage Token (from Vercel Blob Store)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxx"

# Single-Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
JWT_SECRET="craftora-super-secret-jwt-key-min-32-chars-futuristic-matrix"

# Secret Admin URL Path (Never use 'admin' or 'login')
ADMIN_SECRET_PATH="craftora-hq-7f3k9x"

# Public Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 5. Push Database Schema & Seed Data
Initialize your Neon Postgres tables and seed 6 sample products:
```bash
# Push schema tables to Neon Postgres
npm run db:push

# Optional: Run seed script with 6 futuristic dummy products
npm run db:seed
```

### 6. Start the Local Development Server
```bash
npm run dev
```
- Open public store: [http://localhost:3000](http://localhost:3000)
- Access secret admin panel: [http://localhost:3000/craftora-hq-7f3k9x](http://localhost:3000/craftora-hq-7f3k9x) (or your chosen `ADMIN_SECRET_PATH`)

---

## 💾 Using Google Drive as Storage (Free & Unlimited Large Files)

Craftora Store natively supports **Google Drive** for hosting digital product files (ZIP, RAR, PDF, PSD, video, presets, software):

1. **Upload your product file to Google Drive** (e.g. `MyProduct_v1.zip`).
2. **Right-click file > Share > Share**.
3. Under **General access**, change from *Restricted* to **"Anyone with the link"** (Role: *Viewer*).
4. Click **Copy link** (e.g. `https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing`).
5. In Craftora Store Admin (**Add Product** or **Edit Product**):
   - In the **Digital Product File** section, switch to the **Google Drive Link** tab.
   - Paste your copied link into the input field.
   - Craftora automatically extracts the File ID, validates the format, and allows you to customize the display file name, size (e.g. `150 MB`), and format (`ZIP`).
6. **How it works for buyers:**
   - Buyers click the "Download Package" button.
   - Craftora increments the download counter in Neon Postgres atomically.
   - The buyer is automatically redirected to Google's high-speed direct download server (`https://drive.google.com/uc?export=download&id=...`).
   - Zero storage costs and no bandwidth limits on Vercel!

---

## ☁️ Deploying to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: complete production-ready Craftora Store"
git branch -M main
git remote add origin https://github.com/<your-username>/craftora-store.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New..." > "Project"**.
2. Select your `craftora-store` repository and click **Import**.
3. Under **Framework Preset**, Next.js will be detected automatically.

### Step 3: Add Neon Postgres Database
1. In your Vercel Project dashboard, go to the **Storage** tab.
2. Click **Connect Database** > **Neon** (or create a free serverless database at [neon.tech](https://neon.tech)).
3. Connect it to your project. Vercel will automatically expose `DATABASE_URL` (and `POSTGRES_URL`).

### Step 4: Add Vercel Blob Storage
1. In the **Storage** tab, click **Create Database** / **Create Storage** > **Blob**.
2. Name your store (e.g. `craftora-blobs`) and click **Create**.
3. Vercel will automatically add the `BLOB_READ_WRITE_TOKEN` environment variable to your project.

### Step 5: Configure Remaining Environment Variables
In **Settings > Environment Variables**, ensure the following variables are saved:
| Variable | Value | Description |
| :--- | :--- | :--- |
| `ADMIN_USERNAME` | `admin` | Your admin username |
| `ADMIN_PASSWORD_HASH` | `$2a$10$...` | Bcrypt hash from `hash-password.mjs` |
| `JWT_SECRET` | `your-32-char-random-key` | Secret key for JWT signing |
| `ADMIN_SECRET_PATH` | `craftora-hq-7f3k9x` | Your secret admin URL path |
| `NEXT_PUBLIC_SITE_URL`| `https://your-domain.vercel.app` | Production domain |

### Step 6: Deploy & Run Initial Push
Click **Deploy**. Once the build succeeds, run database push from your terminal:
```bash
DATABASE_URL="<your-production-neon-url>" npm run db:push
DATABASE_URL="<your-production-neon-url>" npm run db:seed
```

---

## 🔒 Security Best Practices

- **Strict Path Masking:** Guessable paths (`/admin`, `/login`, `/dashboard`, `/wp-admin`, `/_admin`) strictly return HTTP 404 responses.
- **Header Protection:** Includes `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **Search Engine Blocking:** All admin routes and API responses emit `X-Robots-Tag: noindex, nofollow` and `<meta name="robots" content="noindex, nofollow">`.
- **Direct Client Uploads:** Prevents memory exhaustion and function timeouts on Vercel by streaming files directly to Vercel Blob with server-side token validation.
- **Atomic Concurrency:** SQL-level atomic increments prevent race conditions during simultaneous download clicks.

---

## 📄 License
MIT © Craftora Store
