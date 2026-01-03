# PrintHub - Professional Printing Services Platform

A modern, full-stack web application for printing services built with React, TypeScript, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
npm run dev  # Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
npm install
npm run dev  # Runs on http://localhost:8080
```

### 3. Demo Users
```bash
cd backend
node scripts/seedUsers.js
```

**Demo Credentials:**
- User: `demo@printhub.com` / `demo123`
- Admin: `admin@printhub.com` / `admin123`

## 🎯 Features

### ✅ Complete & Working
- **User Authentication** - Login/Register with JWT
- **Product Management** - Browse, customize, price calculation
- **Shopping Cart** - Add/remove items, checkout
- **Order Management** - Create orders, view history, order details
- **Order Tracking** - Public tracking by order number
- **Bulk Orders** - Enquiry form with file upload
- **Profile Management** - Edit profile, view orders
- **Contact Forms** - Working with validation
- **Mobile Responsive** - All devices supported
- **SEO Optimized** - Meta tags, sitemap, structured data

### 🛠 Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, JWT
- **UI Components:** Radix UI, Lucide Icons
- **State Management:** React Context
- **File Upload:** Cloudinary integration ready
- **Payments:** Stripe & Razorpay integration ready

## 🌐 Deployment

### Quick Deploy (Free Tier)
1. **Run deployment script:**
   ```bash
   deploy.bat  # Windows
   ```

2. **Deploy Frontend to Vercel:**
   - Connect GitHub repo
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

3. **Deploy Backend to Railway:**
   - Connect GitHub repo
   - Select `backend` folder
   - Add environment variables

4. **Set Environment Variables:**
   ```env
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```

**Detailed deployment guide:** See `DEPLOYMENT.md`

## 📊 Project Status

**Development Status: 100% Complete** ✅

All core features implemented and tested:
- Authentication system working
- Product catalog with customization
- Shopping cart and checkout flow
- Order management and tracking
- Bulk order enquiries
- Contact and support forms
- Admin functionality ready
- Mobile responsive design
- SEO optimization complete

## 🧪 Testing

1. **Start both servers**
2. **Visit:** `http://localhost:8080`
3. **Login:** `demo@printhub.com` / `demo123`
4. **Test flow:** Browse → Customize → Add to Cart → Checkout → Track Order

## 📞 Support

- **Documentation:** See `DEPLOYMENT.md` for hosting
- **Features:** See `COMPLETE_FEATURE_STATUS.md` for detailed status
- **Issues:** Check console logs and network tab

---

**Ready for production deployment!** 🚀
