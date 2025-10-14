// backend/routes/seed.js
import { Router } from 'express';
import { db } from '../firebase.js';

const router = Router();
const books = () => db.collection('books');


const DEMO = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "Tiny changes, remarkable results. Paperback, lightly used.",
    condition: "Like New",
    tags: ["self-help", "productivity"],
    imageUrl: "https://covers.openlibrary.org/b/isbn/0735211299-L.jpg",
    status: "available",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship.",
    condition: "Good",
    tags: ["programming", "best-practices"],
    imageUrl: "https://covers.openlibrary.org/b/isbn/0132350882-L.jpg",
    status: "available",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    description: "Classic tips and practices for modern devs.",
    condition: "Good",
    tags: ["programming", "career"],
    imageUrl: "https://covers.openlibrary.org/b/isbn/0135957052-L.jpg",
    status: "available",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about family and self-invention.",
    condition: "Like New",
    tags: ["memoir", "bestseller"],
    imageUrl: "https://covers.openlibrary.org/b/isbn/0399590501-L.jpg",
    status: "available",
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "Sci-fi survival with a lovable science nerd.",
    condition: "New",
    tags: ["sci-fi", "bestseller"],
    imageUrl: "https://covers.openlibrary.org/b/isbn/0593135202-L.jpg",
    status: "available",
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    description: "Design that just makes sense.",
    condition: "Fair",
    tags: ["design", "ux"],
    imageUrl: "https://covers.openlibrary.org/b/isbn/0465050654-L.jpg",
    status: "available",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    description: "Rules for focused success in a distracted world.",
    condition: "Good",
    tags: ["focus", "careers"],
    imageUrl: "https://covers.openlibrary.org/b/isbn/1455586692-L.jpg",
    status: "available",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A fable about following your dream.",
    condition: "Good",
    tags: ["fiction", "inspirational"],
    imageUrl: "https://covers.openlibrary.org/b/isbn/0061122416-L.jpg",
    status: "available",
  },
];

router.post('/seed', async (req, res, next) => {
  try {
    // Optional safety: only allow if explicitly enabled
    if (process.env.ALLOW_DEV_SEED === 'false') {
      return res.status(403).json({ error: 'Seeding disabled' });
    }

    // If collection already has items, skip
    const existing = await books().limit(1).get();
    if (!existing.empty) {
      return res.json({ ok: true, seeded: false, reason: 'Books already exist' });
    }

    const batch = db.batch();
    const now = Date.now();
    DEMO.forEach((b) => {
      const ref = books().doc();
      batch.set(ref, {
        ...b,
        ownerId: 'demo-user',
        createdAt: now,
      });
    });
    await batch.commit();
    res.json({ ok: true, seeded: true, count: DEMO.length });
  } catch (e) { next(e); }
});

export default router;
