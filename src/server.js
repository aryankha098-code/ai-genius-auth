require('dotenv').config();

const app = require('./app');

const requiredEnv = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`AI-Genius auth API listening on port ${port}`);
});
