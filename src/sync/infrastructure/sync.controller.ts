import express from 'express';

const router = express.Router();

// Define your sync-related routes here
router.post('/', (req, res) => {
  res.json({ hello: 'world' });
});

export { router as syncController };
