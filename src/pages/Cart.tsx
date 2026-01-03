import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/priceCalculator';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';

const Cart = () => {
  const { items, removeItem, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleProceedToCheckout = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderCreated = (order: any) => {
    setShowCheckout(false);
    // Redirect to order confirmation or payment
    console.log('Order created:', order);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products">
              <Button variant="hero" size="lg">
                Browse Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {showCheckout ? 'Checkout' : 'Shopping Cart'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {showCheckout ? 'Complete your order' : `${items.length} item(s) in your cart`}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {showCheckout ? (
            <div className="max-w-2xl mx-auto">
              <CheckoutForm onOrderCreated={handleOrderCreated} />
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCheckout(false)}
                >
                  Back to Cart
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-xl border border-border p-4 flex gap-4"
                  >
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-foreground">
                        {item.product.name}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>Size: {item.product.sizes.find(s => s.id === item.customization.size)?.name}</p>
                        <p>Paper: {item.product.paperTypes.find(p => p.id === item.customization.paperType)?.name}</p>
                        <p>Quantity: {item.customization.quantity}</p>
                        {item.customization.isDoubleSide && <p>Double-sided</p>}
                        {item.customization.isUrgent && (
                          <p className="text-accent font-medium">Express Delivery</p>
                        )}
                        {item.designFileName && (
                          <p className="text-success">Design: {item.designFileName}</p>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <p className="font-heading text-lg font-bold text-foreground">
                        {formatPrice(item.calculatedPrice)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive/80 text-sm font-medium transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-success">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (GST 18%)</span>
                      <span>{formatPrice(totalPrice * 0.18)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border my-4 pt-4">
                    <div className="flex justify-between items-end">
                      <span className="font-medium text-foreground">Total</span>
                      <span className="font-heading text-2xl font-bold text-foreground">
                        {formatPrice(totalPrice * 1.18)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure checkout powered by Razorpay
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="login"
      />
    </Layout>
  );
};

export default Cart;
