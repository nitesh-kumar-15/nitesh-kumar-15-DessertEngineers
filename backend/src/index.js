import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import profileRoutes from '../routes/profile.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/profile', profileRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
