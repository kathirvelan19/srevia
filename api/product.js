let globalProductState = {
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
        globalProductState.inStock = inStock;
        globalProductState.stockQuantity = inStock ? (stockQuantity || 100) : 0;
      }
      if (typeof price === 'number' && !isNaN(price)) {
        globalProductState.price = price;
      }
      if (typeof originalPrice === 'number' && !isNaN(originalPrice)) {
        globalProductState.originalPrice = originalPrice;
      }
      globalProductState.updatedAt = new Date().toISOString();
      return res.status(200).json({ success: true, product: globalProductState });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  return res.status(200).json({ success: true, product: globalProductState });
}
