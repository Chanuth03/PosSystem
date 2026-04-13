# Project Instructions: Clothing Business POS & Inventory System

## 1. Project Overview
A lightweight, offline-first Point of Sale (POS) and Inventory Management system tailored for a clothing business that handles Retail, Wholesale, and In-house Manufacturing.

## 2. Business Requirements

### A. Inventory Management
* **Dual Sourcing:** Track items bought from vendors and items manufactured in-house.
* **Product Variants:** Support for Sizes (S, M, L, XL, etc.) and Colors.
* **Stock Tracking:** Real-time stock levels for retail and wholesale.
* **Costing:** * For Vendors: Purchase price + shipping/other costs.
    * For Manufactured: Raw material cost + labor cost.

### B. Sales Management
* **Dual Pricing:** Different pricing logic for Retail and Wholesale customers.
* **Billing:** Generate digital receipts.
* **Discounts:** Ability to apply percentage or fixed-amount discounts.
* **Returns:** Handle customer returns and stock updates.

### C. Vendor & Customer Management
* **Vendor Directory:** Track contact details and payment history for suppliers.
* **Customer Database:** Store wholesale customer details for recurring orders.

### D. Reporting & Analytics
* **Daily Sales:** Total revenue and profit.
* **Margin Analysis:** Calculate profit margins using:
    $$Profit = (Selling Price - Cost Price) \times Quantity$$
* **Low Stock Alerts:** Notification when items fall below a certain threshold.

---

## 3. Technical Requirements

### A. Tech Stack
* **Frontend:** React.js (Functional Components, Hooks).
* **Styling:** Tailwind CSS (Responsive design for Desktop/Tablet).
* **Database:** Dexie.js (IndexedDB wrapper for local storage and offline capability).
* **Icons:** Lucide-react or Heroicons.

### B. Database Schema (Dexie.js)
```javascript
db.version(1).stores({
  products: '++id, name, category, type, vendorId, sku', 
  inventory: '++id, productId, size, color, stockQty, costPrice, retailPrice, wholesalePrice',
  sales: '++id, date, totalAmount, discount, type', // type: 'retail' or 'wholesale'
  vendors: '++id, name, phone',
  manufacturing: '++id, productId, date, quantity, totalCost'
});