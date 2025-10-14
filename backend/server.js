import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import seedRouter from './routes/seed.js';
import morgan from 'morgan';
import dotenv from 'dotenv';
import booksRouter from './routes/books.js';
import requestsRouter from './routes/requests.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ ok: true, service: 'Book Buddy API (Firebase)' }));
app.use('/api/dev', seedRouter);
app.use('/api/books', booksRouter);
app.use('/api/requests', requestsRouter);

app.use((err, req, res, next) => {
  console.error('API error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`Book Buddy API (Firebase) on http://localhost:${PORT}`));
