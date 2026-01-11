# Ofbyte Print - Complete Printing Solution

A full-stack printing service platform with customer ordering, admin management, and external API integration.

## 🚀 Features

### Customer Features
- **Product Catalog** - Browse printing services (Business Cards, Banners, Flyers, etc.)
- **Custom Orders** - Upload designs, select specifications, place orders
- **Order Tracking** - Track order status with phone verification
- **User Authentication** - Secure registration and login
- **Responsive Design** - Works on desktop and mobile

### Admin Features  
- **Order Management** - View, update, and manage all orders
- **Product Management** - Add/edit printing products and pricing
- **User Management** - Manage customer accounts
- **Analytics Dashboard** - Order statistics and reports
- **External API Access** - Full REST API for external admin tools

### External Integration
- **Admin API** - Complete REST API for external admin dashboards
- **Customer Tracking API** - Public API for order tracking apps
- **Secure Authentication** - API key-based access control
- **Rate Limiting** - Production-ready API security

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Express Validator** for input validation
- **Bcrypt** for password hashing
- **Multer** for file uploads

### APIs
- **Internal REST API** (`/api/*`) - Main application
- **External Admin API** (`/api/v1/*`) - For external admin tools
- **Customer Tracking API** (`/api/track/*`) - For tracking apps

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- MongoDB
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ofbyte-print.git
cd ofbyte-print
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### 3. Frontend Setup
```bash
# In new terminal
cd ..  # Back to root
npm install
npm run dev
```

### 4. Generate API Keys
```bash
cd backend
node scripts/generateApiKey.js
# Copy generated keys to .env file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/printhub

# JWT
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRE=7d

# External APIs
API_KEYS=your-admin-api-key-1,your-admin-api-key-2
TRACKING_API_KEYS=your-tracking-api-key-1,your-tracking-api-key-2

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📚 API Documentation

### Admin API (`/api/v1/*`)
Full CRUD access for external admin dashboards.

**Authentication:** API Key in `X-API-Key` header

**Endpoints:**
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get single order  
- `PUT /api/v1/orders/:id/status` - Update order status
- `GET /api/v1/orders/stats` - Get statistics

**Example:**
```javascript
fetch('http://localhost:5000/api/v1/orders', {
  headers: {
    'X-API-Key': 'your-admin-api-key'
  }
})
```

### Customer Tracking API (`/api/track/*`)
Read-only access for customer order tracking.

**Authentication:** Tracking API Key in `X-API-Key` header

**Endpoints:**
- `GET /api/track/order?order_number=X&phone=Y` - Track by order number
- `GET /api/track/order/:id?phone=Y` - Track by order ID
- `GET /api/track/status-info` - Get status information

**Example:**
```javascript
fetch('http://localhost:5000/api/track/order?order_number=ORD000001&phone=+91-9876543210', {
  headers: {
    'X-API-Key': 'your-tracking-api-key'
  }
})
```

## 🔐 Security Features

- **API Key Authentication** - Secure external access
- **Rate Limiting** - 1000 requests per 15 minutes
- **Input Validation** - All endpoints validated
- **Phone Verification** - Required for order tracking
- **JWT Tokens** - Secure user sessions
- **Password Hashing** - Bcrypt encryption

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production` in backend .env
2. Update `MONGODB_URI` to production database
3. Generate secure API keys for production
4. Configure email service (Gmail/SendGrid)
5. Set up SSL certificates
6. Deploy backend and frontend separately

### Docker (Optional)
```bash
# Backend
cd backend
docker build -t ofbyte-print-backend .
docker run -p 5000:5000 ofbyte-print-backend

# Frontend  
cd ..
docker build -t ofbyte-print-frontend .
docker run -p 8080:8080 ofbyte-print-frontend
```

## 📱 External Integration Examples

### Admin Dashboard Integration
```javascript
const adminAPI = {
  baseURL: 'https://your-domain.com/api/v1',
  apiKey: 'your-admin-api-key',
  
  async getOrders(page = 1) {
    const response = await fetch(`${this.baseURL}/orders?page=${page}`, {
      headers: { 'X-API-Key': this.apiKey }
    });
    return response.json();
  },
  
  async updateOrderStatus(orderId, status) {
    const response = await fetch(`${this.baseURL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};
```

### Customer Tracking App
```javascript
const trackingAPI = {
  baseURL: 'https://your-domain.com/api/track',
  apiKey: 'your-tracking-api-key',
  
  async trackOrder(orderNumber, phone) {
    const response = await fetch(
      `${this.baseURL}/order?order_number=${orderNumber}&phone=${phone}`,
      { headers: { 'X-API-Key': this.apiKey } }
    );
    return response.json();
  }
};
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **General:** support@ofbyteprint.com
- **API Issues:** api-support@ofbyteprint.com  
- **Tracking:** tracking-support@ofbyteprint.com

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Bulk order management
- [ ] Inventory management

---

**Built with ❤️ for the printing industry**