import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // API Routes
  app.get('/api/opensea/nfts', async (req, res) => {
    try {
      const apiKey = process.env.OPENSEA_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'OPENSEA_API_KEY is not configured.' });
      }

      const collectionSlug = 'lastlaprh'; // from the user's OpenSea link
      
      const response = await fetch(`https://api.opensea.io/api/v2/collection/${collectionSlug}/nfts?limit=50`, {
        headers: {
          'X-API-KEY': apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OpenSea API returned ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching OpenSea NFTs:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch NFTs' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
