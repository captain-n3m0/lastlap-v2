export default async function handler(req: any, res: any) {
  try {
    const apiKey = process.env.OPENSEA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENSEA_API_KEY is not configured.' });
    }

    const collectionSlug = 'lastlaprh'; 
    
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
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching OpenSea NFTs:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch NFTs' });
  }
}
