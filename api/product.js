const REST_OBJECT_URL = 'https://api.restful-api.dev/objects/ff808181a061cdc401a0662043e00e03';

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

      // Persist to REST storage
      try {
        await fetch(REST_OBJECT_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Srevia Product Stock',
            data: memoryState
          })
        });
      } catch (err) {
        console.warn('Restful-api PUT error:', err);
      }

      return res.status(200).json({ success: true, product: memoryState });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  // GET Request: Fetch persistent data
  try {
    const remoteRes = await fetch(REST_OBJECT_URL);
    if (remoteRes.ok) {
      const json = await remoteRes.json();
      if (json && json.data) {
        memoryState = {
          inStock: typeof json.data.inStock === 'boolean' ? json.data.inStock : memoryState.inStock,
          price: typeof json.data.price === 'number' ? json.data.price : memoryState.price,
          originalPrice: typeof json.data.originalPrice === 'number' ? json.data.originalPrice : memoryState.originalPrice,
          stockQuantity: typeof json.data.stockQuantity === 'number' ? json.data.stockQuantity : (json.data.inStock ? 100 : 0),
          updatedAt: json.updatedAt || new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.warn('Restful-api GET error:', err);
  }

  return res.status(200).json({ success: true, product: memoryState });
}
