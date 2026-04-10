import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { calculateDripSystem } from './controllers/dripCalculator.js';
import { calculateSprinklerSystem } from './controllers/sprinklerCalculator.js';
import { generatePDF } from './controllers/pdfGenerator.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.post('/api/calculate/drip', (req, res) => {
  try {
    const results = calculateDripSystem(req.body);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/calculate/sprinkler', (req, res) => {
  try {
    const results = calculateSprinklerSystem(req.body);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/generate-pdf', (req, res) => {
  try {
    generatePDF(req.body, res);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
