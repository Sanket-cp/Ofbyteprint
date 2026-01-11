# Ofbyte Print - External Order API Documentation

## Overview
This API allows external admin applications to access and manage orders created within the Ofbyte Print application. The API is read-only for order creation (orders can only be created through the main Ofbyte Print app) but allows status updates for order management.

## Base URL
```
Production: https://your-domain.com/api/v1
Development: http://localhost:5000/api/v1
```

## Authentication
All API endpoints require an API key for authentication.

### Headers Required
```
X-API-Key: your-api-key-here
Content-Type: application/json
```

### Alternative Authentication
```
Authorization: Bearer your-api-key-here
```

## Rate Limiting
- **Limit**: 1000 requests per 15 minutes per API key
- **Headers**: Rate limit information is returned in response headers
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: When the rate limit resets

## API Endpoints

### 1. Get All Orders
Retrieve a paginated list of all orders.

```http
GET /api/v1/orders
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Records per page (default: 20, max: 100) |
| `status` | string | No | Filter by order status |
| `payment_status` | string | No | Filter by payment status |
| `date_from` | string | No | Filter orders from date (ISO 8601) |
| `date_to` | string | No | Filter orders to date (ISO 8601) |
| `search` | string | No | Search in order number, customer name, email, phone |

#### Valid Status Values
- **Order Status**: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`
- **Payment Status**: `pending`, `processing`, `completed`, `failed`, `refunded`

#### Example Request
```bash
curl -X GET "https://your-domain.com/api/v1/orders?page=1&limit=10&status=pending" \
  -H "X-API-Key: your-api-key-here"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": "64f7b1234567890abcdef123",
        "order_number": "ORD000001",
        "customer_name": "John Doe",
        "phone": "+91-9876543210",
        "email": "john@example.com",
        "product_type": "Business Cards, Flyers",
        "quantity": 500,
        "print_options": [
          {
            "size": "standard",
            "paper_type": "premium",
            "is_color": true,
            "is_double_side": false,
            "lamination": "matte",
            "finishing": "rounded_corners",
            "is_urgent": false
          }
        ],
        "special_instruction": "Please use high-quality paper",
        "file_url": [
          "https://storage.example.com/files/design1.pdf",
          "https://storage.example.com/files/design2.jpg"
        ],
        "payment_status": "completed",
        "order_status": "processing",
        "total_amount": 1250.00,
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T14:20:00.000Z",
        "shipping_address": {
          "street": "123 Main St",
          "city": "Mumbai",
          "state": "Maharashtra",
          "zipCode": "400001",
          "country": "India"
        },
        "tracking": {
          "carrier": "BlueDart",
          "trackingNumber": "BD123456789",
          "trackingUrl": "https://bluedart.com/track/BD123456789"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_records": 87,
      "per_page": 20,
      "has_next": true,
      "has_prev": false
    }
  },
  "meta": {
    "timestamp": "2024-01-15T15:30:00.000Z",
    "api_version": "1.0"
  }
}
```

### 2. Get Single Order
Retrieve detailed information about a specific order.

```http
GET /api/v1/orders/{order_id}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order_id` | string | Yes | MongoDB ObjectId of the order |

#### Example Request
```bash
curl -X GET "https://your-domain.com/api/v1/orders/64f7b1234567890abcdef123" \
  -H "X-API-Key: your-api-key-here"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "order": {
      "order_id": "64f7b1234567890abcdef123",
      "order_number": "ORD000001",
      "customer_name": "John Doe",
      "phone": "+91-9876543210",
      "email": "john@example.com",
      "product_type": "Business Cards",
      "quantity": 500,
      "print_options": [...],
      "special_instruction": "Please use high-quality paper",
      "file_url": [...],
      "payment_status": "completed",
      "order_status": "processing",
      "total_amount": 1250.00,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T14:20:00.000Z",
      "items": [...],
      "shipping_address": {...},
      "billing_address": {...},
      "tracking": {...},
      "timeline": [
        {
          "status": "pending",
          "message": "Order created successfully",
          "timestamp": "2024-01-15T10:30:00.000Z"
        },
        {
          "status": "confirmed",
          "message": "Payment confirmed",
          "timestamp": "2024-01-15T11:00:00.000Z"
        }
      ],
      "payment_details": {
        "method": "razorpay",
        "transaction_id": "pay_123456789",
        "paid_at": "2024-01-15T11:00:00.000Z"
      }
    }
  },
  "meta": {
    "timestamp": "2024-01-15T15:30:00.000Z",
    "api_version": "1.0"
  }
}
```

### 3. Update Order Status
Update the status of an existing order (Admin only operation).

```http
PUT /api/v1/orders/{order_id}/status
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order_id` | string | Yes | MongoDB ObjectId of the order |

#### Request Body
```json
{
  "status": "shipped",
  "message": "Order has been shipped via BlueDart",
  "tracking_number": "BD123456789",
  "tracking_url": "https://bluedart.com/track/BD123456789",
  "carrier": "BlueDart"
}
```

#### Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | Yes | New order status |
| `message` | string | No | Status update message |
| `tracking_number` | string | No | Shipping tracking number |
| `tracking_url` | string | No | Tracking URL |
| `carrier` | string | No | Shipping carrier name |

#### Example Request
```bash
curl -X PUT "https://your-domain.com/api/v1/orders/64f7b1234567890abcdef123/status" \
  -H "X-API-Key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "message": "Order shipped via BlueDart",
    "tracking_number": "BD123456789",
    "carrier": "BlueDart"
  }'
```

#### Example Response
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "order_id": "64f7b1234567890abcdef123",
      "order_number": "ORD000001",
      "customer_name": "John Doe",
      "phone": "+91-9876543210",
      "email": "john@example.com",
      "order_status": "shipped",
      "payment_status": "completed",
      "tracking": {
        "carrier": "BlueDart",
        "trackingNumber": "BD123456789",
        "shippedAt": "2024-01-15T16:00:00.000Z"
      },
      "updated_at": "2024-01-15T16:00:00.000Z"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T16:00:00.000Z",
    "api_version": "1.0"
  }
}
```

### 4. Get Order Statistics
Retrieve order statistics for dashboard analytics.

```http
GET /api/v1/orders/stats
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date_from` | string | No | Statistics from date (ISO 8601) |
| `date_to` | string | No | Statistics to date (ISO 8601) |

#### Example Request
```bash
curl -X GET "https://your-domain.com/api/v1/orders/stats?date_from=2024-01-01&date_to=2024-01-31" \
  -H "X-API-Key: your-api-key-here"
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_orders": 150,
      "total_revenue": 125000.00,
      "average_order_value": 833.33,
      "status_breakdown": {
        "pending": 10,
        "confirmed": 15,
        "processing": 25,
        "shipped": 30,
        "delivered": 65,
        "cancelled": 5
      },
      "date_range": {
        "from": "2024-01-01",
        "to": "2024-01-31"
      }
    }
  },
  "meta": {
    "timestamp": "2024-01-15T15:30:00.000Z",
    "api_version": "1.0"
  }
}
```

### 5. Health Check
Check API health and connectivity.

```http
GET /api/v1/health
```

#### Example Request
```bash
curl -X GET "https://your-domain.com/api/v1/health" \
  -H "X-API-Key: your-api-key-here"
```

#### Example Response
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "OK",
    "timestamp": "2024-01-15T15:30:00.000Z",
    "api_version": "1.0",
    "database": "Connected"
  }
}
```

## Error Responses

### Error Format
All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "errors": [] // Optional validation errors
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MISSING_API_KEY` | 401 | API key not provided |
| `INVALID_API_KEY` | 401 | API key is invalid |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `ORDER_NOT_FOUND` | 404 | Order doesn't exist |
| `INVALID_ORDER_ID` | 400 | Invalid order ID format |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `SERVER_ERROR` | 500 | Internal server error |

## Security Considerations

1. **API Keys**: Store API keys securely and rotate them regularly
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Respect rate limits to avoid being blocked
4. **Data Handling**: Handle customer data according to privacy regulations
5. **Logging**: API access is logged for security monitoring

## Integration Example

### Node.js/JavaScript
```javascript
const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://your-domain.com/api/v1',
  headers: {
    'X-API-Key': 'your-api-key-here',
    'Content-Type': 'application/json'
  }
});

// Get all orders
async function getAllOrders(page = 1, limit = 20) {
  try {
    const response = await apiClient.get(`/orders?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response.data);
    throw error;
  }
}

// Update order status
async function updateOrderStatus(orderId, status, message) {
  try {
    const response = await apiClient.put(`/orders/${orderId}/status`, {
      status,
      message
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response.data);
    throw error;
  }
}
```

### Python
```python
import requests

class OfbytePrintAPI:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {
            'X-API-Key': api_key,
            'Content-Type': 'application/json'
        }
    
    def get_orders(self, page=1, limit=20, status=None):
        params = {'page': page, 'limit': limit}
        if status:
            params['status'] = status
            
        response = requests.get(
            f"{self.base_url}/orders",
            headers=self.headers,
            params=params
        )
        return response.json()
    
    def update_order_status(self, order_id, status, message=None):
        data = {'status': status}
        if message:
            data['message'] = message
            
        response = requests.put(
            f"{self.base_url}/orders/{order_id}/status",
            headers=self.headers,
            json=data
        )
        return response.json()

# Usage
api = OfbytePrintAPI('https://your-domain.com/api/v1', 'your-api-key')
orders = api.get_orders(page=1, limit=10, status='pending')
```

## Support
For API support and questions, contact: api-support@ofbyteprint.com