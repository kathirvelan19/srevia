const BACKEND_URL = 'https://sreviia-backend.onrender.com/api/products';

let memoryState = {
  inStock: true,
  price: 80,
  originalPrice: 120,
  stockQuantity: 100,
  updatedAt: new Date().toISOString()
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST' || req.method === 'PATCH') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { inStock, price, originalPrice, stockQuantity } = body;
      
      if (typeof inStock === 'boolean') {
        memoryState.inStock = inStock;
        memoryState.stockQuantity = inStock ? (stockQuantity || 100) : 0;
      }
      if (typeof price === 'number' && !isNaN(price)) {
        memoryState.price = price;
      }
      if (typeof originalPrice === 'number' && !isNaN(originalPrice)) {
        memoryState.originalPrice = originalPrice;
      }
      memoryState.updatedAt = new Date().toISOString();

      // Sync to Render Backend MongoDB
      try {
        await fetch(`${BACKEND_URL}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inStock: memoryState.inStock,
            price: memoryState.price,
            originalPrice: memoryState.originalPrice
          })
        });
      } catch (err) {
        console.warn('Backend sync notice:', err);
      }

      return res.status(200).json({ success: true, product: memoryState });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  // GET Request: Fetch from Render Backend
  try {
    const backendRes = await fetch(BACKEND_URL);
    if (backendRes.ok) {
      const products = await backendRes.json();
      if (Array.isArray(products) && products.length > 0) {
        const isAvail = p.inStock !== false && p.active !== false && (p.stockQuantity === undefined || p.stockQuantity > 0);
        memoryState.inStock = isAvail;
        memoryState.stockQuantity = isAvail ? (p.stockQuantity !== undefined ? p.stockQuantity : 100) : 0;
        memoryState.price = typeof p.price === 'number' ? p.price : memoryState.price;
      }
    }
  } catch (err) {
    console.warn('Backend fetch notice:', err);
  }

  return res.status(200).json({ success: true, product: memoryState });
}
