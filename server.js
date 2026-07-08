import express from 'express';
import cors from 'cors';
import hadithRoutes from './routes/hadith.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Toheed Hadith API",
    status: "running",
    endpoints: {
      meta: "/api/meta",
      hadiths: "/api/hadiths/:lang/:module"
    }
  });
});

// Routes
app.use('/api', hadithRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running smoothly on http://localhost:${PORT}`);
});