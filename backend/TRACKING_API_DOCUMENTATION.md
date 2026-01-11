# Customer Order Tracking API Documentation

## Overview
This API allows external customer applications to track orders placed on Ofbyte Print. Customers can track their orders using order number and phone number for security.

## Base URL
```
Production: https://your-domain.com/api/track
Development: http://localhost:5000/api/track
```

## Authentication
All tracking endpoints require a tracking API key for authentication.

### Headers Required
```
X-API-Key: your-tracking-api-key-here
Content-Type: application/json
```

### Your Tracking API Keys
**Primary Key (for your external customer app):**
```
pk_track_customer_2024_6d7093fac93f4762bcf85ddb8170de320fc2ad15aec826cd
```

**Backup Key:**
```
pk_track_public_2024_1dfd458630d6956582e72bc7f80e89ea8dbe9c5cb2ab2c9f
```

## API Endpoints

### 1. Track Order by Order Number
Track an order using order number and phone number (most secure method).

```http
GET /api/track/order?order_number={ORDER_NUMBER}&phone={PHONE}
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order_number` | string | Yes | Order number (e.g., ORD000001) |
| `phone` | string | Yes | Customer's phone number |

#### Example Request
```bash
curl -X GET "http://localhost:5000/api/track/order?order_number=ORD000001&phone=+91-9876543210" \
  -H "X-API-Key: pk_track_customer_2024_6d7093fac93f4762bcf85ddb8170de320fc2ad15aec826cd"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "tracking": {
      "order_number": "ORD000001",
      "customer_name": "John Doe",
      "order_status": "shipped",
      "total_amount": 1250.00,
      "order_date": "2024-01-15T10:30:00.000Z",
      "last_updated": "2024-01-16T14:20:00.000Z",
      "products": [
        {
          "name": "Business Cards",
          "quantity": 500
        },
        {
          "name": "Flyers",
          "quantity": 100
        }
      ],
      "tracking": {
        "carrier": "BlueDart",
        "tracking_number": "BD123456789",
        "tracking_url": "https://bluedart.com/track/BD123456789",
        "shipped_at": "2024-01-16T10:00:00.000Z",
        "delivered_at": null,
        "estimated_delivery": "2024-01-20T18:00:00.000Z"
      },
      "timeline": [
        {
          "status": "shipped",
          "message": "Order has been shipped via BlueDart",
          "timestamp": "2024-01-16T10:00:00.000Z"
        },
        {
          "status": "processing",
          "message": "Order is being prepared for shipping",
          "timestamp": "2024-01-15T16:00:00.000Z"
        },
        {
          "status": "confirmed",
          "message": "Payment confirmed and order accepted",
          "timestamp": "2024-01-15T11:00:00.000Z"
        },
        {
          "status": "pending",
          "message": "Order created successfully",
          "timestamp": "2024-01-15T10:30:00.000Z"
        }
      ]
    }
  },
  "meta": {
    "timestamp": "2024-01-16T15:30:00.000Z",
    "api_version": "1.0"
  }
}
```

### 2. Track Order by ID
Track an order using order ID (optional phone verification).

```http
GET /api/track/order/{order_id}?phone={PHONE}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order_id` | string | Yes | MongoDB ObjectId of the order |

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phone` | string | No | Customer's phone number for verification |

#### Example Request
```bash
curl -X GET "http://localhost:5000/api/track/order/64f7b1234567890abcdef123?phone=+91-9876543210" \
  -H "X-API-Key: pk_track_customer_2024_6d7093fac93f4762bcf85ddb8170de320fc2ad15aec826cd"
```

### 3. Get Status Information
Get available order statuses and their descriptions (for UI display).

```http
GET /api/track/status-info
```

#### Example Request
```bash
curl -X GET "http://localhost:5000/api/track/status-info" \
  -H "X-API-Key: pk_track_customer_2024_6d7093fac93f4762bcf85ddb8170de320fc2ad15aec826cd"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "statuses": [
      {
        "key": "pending",
        "label": "Order Received",
        "description": "Your order has been received and is being processed",
        "icon": "clock",
        "color": "orange"
      },
      {
        "key": "confirmed",
        "label": "Order Confirmed",
        "description": "Payment confirmed and order is being prepared",
        "icon": "check-circle",
        "color": "blue"
      },
      {
        "key": "processing",
        "label": "In Production",
        "description": "Your order is currently being printed and prepared",
        "icon": "cog",
        "color": "purple"
      },
      {
        "key": "shipped",
        "label": "Shipped",
        "description": "Your order has been shipped and is on the way",
        "icon": "truck",
        "color": "indigo"
      },
      {
        "key": "delivered",
        "label": "Delivered",
        "description": "Your order has been successfully delivered",
        "icon": "check-circle-2",
        "color": "green"
      }
    ],
    "estimated_delivery_days": {
      "standard": 7,
      "express": 3,
      "urgent": 1
    }
  },
  "meta": {
    "timestamp": "2024-01-16T15:30:00.000Z",
    "api_version": "1.0"
  }
}
```

### 4. Health Check
Check tracking API health and connectivity.

```http
GET /api/track/health
```

#### Example Request
```bash
curl -X GET "http://localhost:5000/api/track/health" \
  -H "X-API-Key: pk_track_customer_2024_6d7093fac93f4762bcf85ddb8170de320fc2ad15aec826cd"
```

#### Example Response
```json
{
  "success": true,
  "message": "Tracking API is healthy",
  "data": {
    "status": "OK",
    "timestamp": "2024-01-16T15:30:00.000Z",
    "api_version": "1.0",
    "service": "Customer Order Tracking",
    "database": "Connected"
  }
}
```

## Order Status Flow

```
pending → confirmed → processing → shipped → delivered
    ↓
cancelled (can happen at any stage before shipped)
```

### Status Descriptions
- **pending**: Order received, payment processing
- **confirmed**: Payment confirmed, order accepted
- **processing**: Order being printed/prepared
- **shipped**: Order dispatched for delivery
- **delivered**: Order successfully delivered
- **cancelled**: Order cancelled

## Error Responses

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MISSING_API_KEY` | 401 | Tracking API key not provided |
| `INVALID_API_KEY` | 401 | Tracking API key is invalid |
| `ORDER_NOT_FOUND` | 404 | Order not found or phone doesn't match |
| `INVALID_ORDER_ID` | 400 | Invalid order ID format |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `SERVER_ERROR` | 500 | Internal server error |

### Error Format
```json
{
  "success": false,
  "message": "Order not found. Please check your order number and phone number.",
  "error_code": "ORDER_NOT_FOUND"
}
```

## Integration Examples

### React/JavaScript Customer Tracking App
```javascript
const TRACKING_API_KEY = 'pk_track_customer_2024_6d7093fac93f4762bcf85ddb8170de320fc2ad15aec826cd';
const BASE_URL = 'http://localhost:5000/api/track';

class OrderTracker {
  constructor() {
    this.apiKey = TRACKING_API_KEY;
    this.baseUrl = BASE_URL;
  }

  async trackOrder(orderNumber, phone) {
    try {
      const response = await fetch(
        `${this.baseUrl}/order?order_number=${orderNumber}&phone=${encodeURIComponent(phone)}`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      return data.data.tracking;
    } catch (error) {
      console.error('Tracking error:', error);
      throw error;
    }
  }

  async getStatusInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/status-info`, {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Status info error:', error);
      throw error;
    }
  }
}

// Usage Example
const tracker = new OrderTracker();

// Track order
async function handleTrackOrder() {
  const orderNumber = document.getElementById('orderNumber').value;
  const phone = document.getElementById('phone').value;

  try {
    const tracking = await tracker.trackOrder(orderNumber, phone);
    displayTrackingInfo(tracking);
  } catch (error) {
    displayError(error.message);
  }
}

function displayTrackingInfo(tracking) {
  const container = document.getElementById('trackingResult');
  
  container.innerHTML = `
    <div class="tracking-info">
      <h3>Order: ${tracking.order_number}</h3>
      <p><strong>Status:</strong> ${tracking.order_status}</p>
      <p><strong>Customer:</strong> ${tracking.customer_name}</p>
      <p><strong>Total:</strong> ₹${tracking.total_amount}</p>
      
      ${tracking.tracking.tracking_number ? `
        <div class="shipping-info">
          <p><strong>Tracking Number:</strong> ${tracking.tracking.tracking_number}</p>
          <p><strong>Carrier:</strong> ${tracking.tracking.carrier}</p>
          ${tracking.tracking.tracking_url ? `
            <a href="${tracking.tracking.tracking_url}" target="_blank">Track on Carrier Website</a>
          ` : ''}
        </div>
      ` : ''}
      
      <div class="timeline">
        <h4>Order Timeline:</h4>
        ${tracking.timeline.map(entry => `
          <div class="timeline-entry">
            <strong>${entry.status}</strong>: ${entry.message}
            <small>${new Date(entry.timestamp).toLocaleString()}</small>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
```

### Mobile App (React Native)
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

class MobileOrderTracker {
  constructor() {
    this.apiKey = 'pk_track_customer_2024_6d7093fac93f4762bcf85ddb8170de320fc2ad15aec826cd';
    this.baseUrl = 'https://your-domain.com/api/track';
  }

  async trackOrder(orderNumber, phone) {
    try {
      const response = await fetch(
        `${this.baseUrl}/order?order_number=${orderNumber}&phone=${encodeURIComponent(phone)}`,
        {
          method: 'GET',
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      // Cache the result for offline viewing
      await AsyncStorage.setItem(
        `order_${orderNumber}`, 
        JSON.stringify(data.data.tracking)
      );

      return data.data.tracking;
    } catch (error) {
      // Try to get cached data if network fails
      try {
        const cached = await AsyncStorage.getItem(`order_${orderNumber}`);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (cacheError) {
        console.error('Cache error:', cacheError);
      }
      
      throw error;
    }
  }
}
```

## Security Considerations

1. **API Key Security**: Store tracking API keys securely in your app
2. **Phone Verification**: Always require phone number for order lookup
3. **Rate Limiting**: Respect API rate limits (same as admin API)
4. **Data Privacy**: Handle customer data according to privacy regulations
5. **HTTPS Only**: Always use HTTPS in production

## Rate Limiting
- **Limit**: 1000 requests per 15 minutes per API key
- **Shared**: Rate limit is shared with admin API but separate tracking

## Support
For tracking API support: tracking-support@ofbyteprint.com