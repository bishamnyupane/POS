# ShopFlow — SaaS Frontend

Modern retail POS dashboard (React + Vite + JavaScript) for the [Saas](../Saas) backend.

## Features

- **Auth** — Register shop (admin), login, logout (JWT cookies)
- **Dashboard** — Revenue, products, low-stock alerts
- **Products** — Full CRUD with search
- **Point of Sale** — Cart checkout with discount, tax, payment method
- **Sales** — Transaction history with expandable line items
- **Team** (admin) — Create cashier accounts

## Run

1. Start the backend (from `Saas/`):

```bash
npm install
node server.js
```

Ensure `.env` has `JWT_SECRET` and `MONGODB_URI`.

2. Start the frontend:

```bash
cd SaaS_Frontend
npm install
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` to `http://localhost:3000`. CORS is enabled on the backend for `http://localhost:5173`.
