import Dexie from 'dexie';

export const db = new Dexie('POSDatabase');

db.version(1).stores({
  products: '++id, name, category, type, vendorId, sku', 
  inventory: '++id, productId, size, color, stockQty, costPrice, retailPrice, wholesalePrice',
  sales: '++id, date, totalAmount, discount, type', // type: 'retail' or 'wholesale'
  vendors: '++id, name, phone',
  manufacturing: '++id, productId, date, quantity, totalCost'
});
