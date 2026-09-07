// Cart Context for Global State Management

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/client';

const CartContext = createContext(null);

// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('coffee_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('coffee_session_id', sessionId);
  }
  return sessionId;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const sessionId = getSessionId();

  // Fetch cart on mount
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartAPI.get(sessionId);
      
      if (response.success) {
        setCartItems(response.data || []);
        setCartTotal(response.total || 0);
        setCartCount(response.itemCount || 0);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartAPI.add(productId, quantity, sessionId);
      
      if (response.success) {
        await fetchCart();
        setIsCartOpen(true);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      console.error('Failed to add to cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (quantity < 1) {
        await removeFromCart(itemId);
        return true;
      }
      
      const response = await cartAPI.update(itemId, quantity);
      
      if (response.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      console.error('Failed to update quantity:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartAPI.remove(itemId);
      
      if (response.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      console.error('Failed to remove from cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartAPI.clear(sessionId);
      
      if (response.success) {
        setCartItems([]);
        setCartTotal(0);
        setCartCount(0);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      console.error('Failed to clear cart:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle cart sidebar
  const toggleCart = () => setIsCartOpen(prev => !prev);
  const closeCart = () => setIsCartOpen(false);
  const openCart = () => setIsCartOpen(true);

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    isLoading,
    error,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
