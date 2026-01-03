import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/priceCalculator';
import { toast } from 'sonner';

interface CheckoutFormProps {
  onOrderCreated?: (order: any) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onOrderCreated }) => {
  const { items, totalPrice, checkout, isLoading } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    billingStreet: user?.address?.street || '',
    billingCity: user?.address?.city || '',
    billingState: user?.address?.state || '',
    billingZipCode: user?.address?.zipCode || '',
    shippingStreet: user?.address?.street || '',
    shippingCity: user?.address?.city || '',
    shippingState: user?.address?.state || '',
    shippingZipCode: user?.address?.zipCode || '',
    sameAsBilling: true,
    paymentMethod: 'razorpay',
    specialInstructions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    try {
      const customerInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialInstructions: formData.specialInstructions
      };

      const addresses = {
        billing: {
          street: formData.billingStreet,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: 'India'
        },
        shipping: formData.sameAsBilling ? {
          street: formData.billingStreet,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: 'India',
          isSameAsBilling: true
        } : {
          street: formData.shippingStreet,
          city: formData.shippingCity,
          state: formData.shippingState,
          zipCode: formData.shippingZipCode,
          country: 'India',
          isSameAsBilling: false
        }
      };

      const order = await checkout(customerInfo, addresses, formData.paymentMethod);
      onOrderCreated?.(order);
    } catch (error) {
      // Error is handled by CartContext
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="billingStreet">Street Address</Label>
            <Input
              id="billingStreet"
              name="billingStreet"
              value={formData.billingStreet}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="billingCity">City</Label>
              <Input
                id="billingCity"
                name="billingCity"
                value={formData.billingCity}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="billingState">State</Label>
              <Input
                id="billingState"
                name="billingState"
                value={formData.billingState}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="billingZipCode">ZIP Code</Label>
              <Input
                id="billingZipCode"
                name="billingZipCode"
                value={formData.billingZipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={formData.paymentMethod === 'razorpay'}
                onChange={handleChange}
              />
              <span>Razorpay (UPI, Cards, Net Banking)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleChange}
              />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Special Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Special Instructions (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="specialInstructions"
            placeholder="Any special requirements or instructions for your order..."
            value={formData.specialInstructions}
            onChange={handleChange}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST 18%)</span>
              <span>{formatPrice(totalPrice * 0.18)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(totalPrice * 1.18)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Place Order'}
      </Button>
    </form>
  );
};

export default CheckoutForm;