# AI-Genius Auth API

Secure Node.js/Express authentication and authorization subsystem for the AI-Genius SaaS platform. The API uses JWT access tokens, httpOnly refresh-token cookies, bcrypt-hashed passwords, refresh-token whitelisting, and role-based access control.

## Features

- Login with bcrypt password verification
- Short-lived JWT access token in JSON response
- Long-lived JWT refresh token in an httpOnly, sameSite=strict cookie
- Refresh-token whitelist using a mock in-memory database
- `protect` middleware for Bearer-token authentication
- `restrictTo(...roles)` middleware for RBAC
- Centralized JSON error handling for 401, 403, 404, and server errors

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

For Linux/macOS, use:

```bash
cp .env.example .env
```

Update `.env` with strong random secrets before running in production.

## Test Users

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@aigenius.com` | `Admin@123` |
| Premium_User | `premium@aigenius.com` | `Premium@123` |
| Free_User | `free@aigenius.com` | `Free@123` |

All passwords are stored as bcrypt hashes in the mock database.

## Endpoints

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/api/health` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Valid refresh cookie |
| POST | `/api/auth/logout` | Refresh cookie optional |
| GET | `/api/ai/free-model` | Admin, Premium_User, Free_User |
| POST | `/api/ai/premium-model` | Admin, Premium_User |
| DELETE | `/api/ai/purge-cache` | Admin only |

## Workflow Demo

1. Login as any test user with `POST /api/auth/login`.
2. Copy the returned `accessToken` or let the Postman collection script save it automatically.
3. Call `GET /api/ai/free-model` with `Authorization: Bearer <accessToken>`.
4. Login as `free@aigenius.com` and call `POST /api/ai/premium-model` to verify a `403 Forbidden` response.
5. Login as `premium@aigenius.com` and call `POST /api/ai/premium-model` to verify successful access.
6. Login as `admin@aigenius.com` and call `DELETE /api/ai/purge-cache` to verify Admin-only access.
7. To demonstrate silent refresh quickly, temporarily set `JWT_ACCESS_EXPIRES_IN=10s` in `.env`, restart the server, login, wait 10 seconds, then call `POST /api/auth/refresh`. The refresh-token cookie is read automatically and a new access token is returned.

## Postman

Import `postman/AI-Genius Auth API.postman_collection.json`.

The collection uses these variables:

- `baseUrl`: defaults to `http://localhost:5000`
- `accessToken`: saved automatically after Login and Refresh requests

Postman will store and resend the `refreshToken` cookie automatically after login.

## Security Notes

- JWT payload contains only `id`, `email`, and `role`.
- Password hashes are never returned in API responses.
- Secrets and token expiration settings are loaded from environment variables.
- In development, the refresh cookie uses `secure: false` so it works on local HTTP. In production, set `NODE_ENV=production` and serve over HTTPS so the cookie is sent only on secure connections.
