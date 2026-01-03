import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product, ProductCustomization } from '@/types/product';
import { toast } from 'sonner';
import ApiService from '@/services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, customization: ProductCustomization, price: number, designFileName?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  checkout: (customerInfo: any, addresses: any, paymentMethod: string) => Promise<any>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addItem = useCallback((
    product: Product,
    customization: ProductCustomization,
    price: number,
    designFileName?: string
  ) => {
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      customization,
      calculatedPrice: price,
      designFileName
    };
    
    setItems(prev => [...prev, newItem]);
    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast.info('Item removed from cart');
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newCustomization = { ...item.customization, quantity };
        return { ...item, customization: newCustomization };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info('Cart cleared');
  }, []);

  const checkout = useCallback(async (customerInfo: any, addresses: any, paymentMethod: string) => {
    if (!user) {
      toast.error('Please login to place an order');
      throw new Error('User not authenticated');
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      throw new Error('Cart is empty');
    }

    setIsLoading(true);
    try {
      // Convert cart items to order format
      const orderItems = items.map(item => ({
        product: item.product.id || item.product._id, // Use product ID
        customization: item.customization,
        designFiles: item.designFileName ? [{ 
          filename: item.designFileName,
          originalName: item.designFileName,
          url: '', // This would be set from actual file upload
          size: 0
        }] : []
      }));

      // Validate required fields
      if (!customerInfo.name || !customerInfo.email) {
        toast.error('Please provide customer information');
        throw new Error('Missing customer information');
      }

      if (!addresses.billing || !addresses.shipping) {
        toast.error('Please provide billing and shipping addresses');
        throw new Error('Missing address information');
      }

      // Create order via API
      const orderData = {
        items: orderItems,
        customerInfo: {
          name: customerInfo.name || user.name,
          email: customerInfo.email || user.email,
          phone: customerInfo.phone || user.phone || ''
        },
        billingAddress: addresses.billing,
        shippingAddress: addresses.shipping,
        payment: {
          method: paymentMethod
        },
        specialInstructions: customerInfo.specialInstructions || ''
      };

      const response = await ApiService.createOrder(orderData);

      if (response.success) {
        const order = response.data.order;
        clearCart();
        toast.success('Order created successfully!', {
          description: `Order #${order.orderNumber} has been placed.`
        });
        return order;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to create order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [items, user, clearCart]);

  const totalItems = items.reduce((sum, item) => sum + item.customization.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.calculatedPrice, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      checkout,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
