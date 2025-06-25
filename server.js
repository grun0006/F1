import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'https://f1racewebsite.onrender.com',
  methods: ['GET', 'POST'],
}));

async function fetchWithRetry(url, retries = 6, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const isServerError = status >= 500 && status < 600;

      if (!isServerError || i === retries - 1) {
        throw error;
      }

      console.warn(`⚠️ Fout ${status} bij poging ${i + 1}, opnieuw proberen over ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

app.get('/api/locations/:driverNumber', async (req, res) => {
  const driverNumber = req.params.driverNumber;
  const url = `https://api.openf1.org/v1/location?session_key=latest&driver_number=${driverNumber}`;

  try {
    const data = await fetchWithRetry(url);
    res.json(data);
  } catch (error) {
    console.error('❌ Uiteindelijk mislukt:', error.message);
    res.status(500).json({ error: 'Kon data niet ophalen van OpenF1 API.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend draait op https://f1racewebsite.onrender.com:${PORT}`);
});