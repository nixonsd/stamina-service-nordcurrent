import express from 'express';
import { logger } from './shared/logger';

const app = express();

app.get('/', (req, res) => {
  res.send('Stamina Service is running!');
});

app.post('/stamina', (req, res) => {
  // Placeholder logic for stamina management
  res.json({ message: 'Stamina updated successfully!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});
