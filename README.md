# Bhoomi Rental – Land Rental Platform

Full-stack land rental application: browse land, book, pay with Razorpay, sign agreements, and use an AI chatbot.

## Project structure

- **server/** – Node.js + Express API (MongoDB, JWT, Cloudinary, Razorpay, OpenAI)
- **client/** – React (Vite) frontend

## Quick start

### 1. Environment and API keys

Copy `server/.env.example` to `server/.env` and fill in the values. See **Where to get API keys** below.

### 2. Backend

```bash
cd server
npm install
npm run dev
```

Runs at **http://localhost:5000**.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Runs at **http://localhost:3000**. The app proxies `/api` to the backend.

---

## Where to get API keys

### MongoDB (MONGO_URI)

- **Option A:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
  1. Create an account and a cluster.
  2. Database Access → Add user (username + password).
  3. Network Access → Add IP (or `0.0.0.0/0` for dev).
  4. Clusters → Connect → “Connect your application” → copy URI.
  5. Replace `<password>` in the URI with your user password.
- **Option B:** Local MongoDB – use `mongodb://localhost:27017/bhoomirental`.

### JWT (JWT_SECRET, JWT_EXPIRE)

- `JWT_SECRET`: Any long random string (e.g. 32+ characters). You can generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `JWT_EXPIRE`: e.g. `7d`, `24h`.

### Cloudinary (CLOUDINARY_*)

- Sign up: [cloudinary.com](https://cloudinary.com).
- Dashboard → Product credentials (or Account details).
- Copy **Cloud name**, **API Key**, **API Secret** into `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

### Razorpay (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)

- Sign up: [razorpay.com](https://razorpay.com).
- Settings → API Keys → Generate key (use **Test** for development).
- Copy **Key ID** and **Key Secret** into `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.

### OpenAI (OPENAI_API_KEY)

- Sign up: [platform.openai.com](https://platform.openai.com).
- API Keys → Create new secret key.
- Copy the key into `OPENAI_API_KEY` (used for the chatbot).

### Frontend URL (FRONTEND_URL)

- For local dev: `http://localhost:3000`.
- For production: your frontend URL (e.g. `https://your-app.vercel.app`).

---

## API overview

| Path | Description |
|------|-------------|
| `POST /api/auth/register` | Register |
| `POST /api/auth/login` | Login |
| `GET /api/auth/me` | Current user (protected) |
| `GET /api/lands` | List lands (query: category, city, minPrice, maxPrice, available) |
| `GET /api/lands/:id` | Land by ID |
| `POST /api/lands` | Create land (owner/admin) |
| `GET /api/lands/my-lands` | My listings (owner/admin) |
| `POST /api/bookings` | Create booking |
| `GET /api/bookings/my` | My bookings |
| `GET /api/bookings/:id` | Booking by ID |
| `PUT /api/bookings/:id/status` | Update status (owner/admin) |
| `POST /api/agreements` | Create agreement for booking |
| `GET /api/agreements/booking/:bookingId` | Agreement by booking |
| `PUT /api/agreements/:id/sign` | Sign agreement |
| `POST /api/payments/create-order` | Create Razorpay order |
| `POST /api/payments/verify` | Verify payment |
| `POST /api/chatbot/chat` | Chat message (optional auth) |

---

## Scripts

- **Server:** `npm run dev` (nodemon), `npm start`
- **Client:** `npm run dev`, `npm run build`, `npm run preview`
