const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI-Genius Auth API</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            color: #172033;
            background: #f4f7fb;
          }
          main {
            width: min(720px, calc(100% - 32px));
            padding: 28px;
            border: 1px solid #d9e1ec;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 10px 30px rgba(23, 32, 51, 0.08);
          }
          h1 {
            margin: 0 0 8px;
            font-size: 28px;
          }
          p {
            margin: 0 0 20px;
            color: #526071;
            line-height: 1.5;
          }
          a {
            color: #0f6cbd;
            font-weight: 700;
          }
          code {
            display: block;
            margin-top: 10px;
            padding: 12px;
            border-radius: 6px;
            background: #eef3f8;
            color: #1f2a3d;
            overflow-wrap: anywhere;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>AI-Genius Auth API</h1>
          <p>The backend is running. Use Postman to test login, refresh tokens, and role-based access control.</p>
          <p><a href="/api/health">Open health check</a></p>
          <code>POST /api/auth/login</code>
          <code>POST /api/auth/refresh</code>
          <code>GET /api/ai/free-model</code>
          <code>POST /api/ai/premium-model</code>
          <code>DELETE /api/ai/purge-cache</code>
        </main>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI-Genius security API is running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
