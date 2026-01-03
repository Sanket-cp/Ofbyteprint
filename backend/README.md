# PrintHub Backend API

A comprehensive Node.js backend API for the PrintHub printing services platform.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role management
- **Product Management** - Complete CRUD operations for printing products
- **Order Processing** - Full order lifecycle management
- **File Upload** - Cloudinary integration for design file uploads
- **Payment Integration** - Stripe and Razorpay payment gateways
- **Email Notifications** - Automated email system with templates
- **Admin Dashboard** - Administrative endpoints for management
- **Security** - Rate limiting, input validation, and security headers

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **File Storage:** Cloudinary
- **Payments:** Stripe & Razorpay
- **Email:** Nodemailer
- **Validation:** Express Validator
- **Security:** Helmet, CORS, Rate Limiting

## 📦 Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd printify-hub-main/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables in `.env`:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/printhub
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Email (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your-stripe-key
   STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
   
   # Razorpay
   RAZORPAY_KEY_ID=rzp_test_your-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   ```

4. **Start MongoDB:**
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Seed Products (Optional):**
   ```bash
   node scripts/seedProducts.js
   ```

6. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/calculate-price` - Calculate product price
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/search/query` - Search products

**Admin Only:**
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/track` - Track order

**Admin Only:**
- `GET /api/orders/admin/all` - Get all orders
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/admin/stats` - Get order statistics

### File Upload
- `POST /api/upload/designs` - Upload multiple design files
- `POST /api/upload/design` - Upload single design file
- `GET /api/upload/my-files` - Get user's uploaded files
- `DELETE /api/upload/:cloudinaryId` - Delete uploaded file
- `GET /api/upload/info/:cloudinaryId` - Get file info
- `POST /api/upload/signed-url` - Generate signed upload URL

### Payments
- `GET /api/payments/methods` - Get available payment methods

**Stripe:**
- `POST /api/payments/stripe/create-intent` - Create payment intent
- `POST /api/payments/stripe/confirm` - Confirm payment
- `POST /api/payments/stripe/webhook` - Stripe webhook

**Razorpay:**
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/razorpay/verify` - Verify Razorpay payment
- `POST /api/payments/razorpay/webhook` - Razorpay webhook

**Cash on Delivery:**
- `POST /api/payments/cod/confirm` - Confirm COD order

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard stats
- `DELETE /api/users/account` - Delete user account
- `PUT /api/users/notifications` - Update notification preferences

**Admin Only:**
- `GET /api/users/admin/all` - Get all users
- `GET /api/users/admin/:id` - Get user by ID
- `PUT /api/users/admin/:id` - Update user
- `GET /api/users/admin/stats` - Get user statistics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📧 Email Templates

The system includes pre-built email templates for:
- Welcome & email verification
- Password reset
- Order confirmation
- Payment confirmation
- Order status updates
- Order cancellation
- COD confirmation

## 💳 Payment Integration

### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Add keys to your `.env` file
4. Set up webhooks for payment events

### Razorpay Setup
1. Create a Razorpay account
2. Get your API keys from the Razorpay dashboard
3. Add keys to your `.env` file
4. Set up webhooks for payment events

## 📁 File Upload

Files are uploaded to Cloudinary with the following features:
- Automatic file type detection
- Size limits (50MB default)
- User-specific folders
- Secure signed URLs
- File management endpoints

## 🛡 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Input Validation** - Request validation
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt password hashing
- **File Type Validation** - Secure file uploads

## 📊 Database Schema

### User Model
- Personal information
- Authentication data
- Preferences and settings
- Address information

### Product Model
- Product details and pricing
- Size and material options
- Bulk discount tiers
- Feature flags

### Order Model
- Order items and customization
- Customer and shipping info
- Payment and tracking data
- Status timeline

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
# ... other production configs
```

### Recommended Hosting
- **Backend:** Railway, Render, or DigitalOcean
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary
- **Email:** SendGrid or Gmail SMTP

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test specific endpoints
curl -X GET http://localhost:5000/api/health
```

## 📝 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@printhub.com or create an issue in the repository.

---

**Happy Coding! 🎉**