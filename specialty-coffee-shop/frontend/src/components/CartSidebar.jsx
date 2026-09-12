import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../api/client';

const CartSidebar = () => {
  const { 
    cartItems, 
    cartTotal, 
    isLoading, 
    isCartOpen, 
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const [checkoutError, setCheckoutError] = useState(null);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      setCheckoutError(null);
      const response = await orderAPI.checkout(
        localStorage.getItem('coffee_session_id') || '',
        cartTotal
      );
      
      if (response.success) {
        setCheckoutSuccess(true);
        await clearCart();
        setTimeout(() => {
          setCheckoutSuccess(false);
          closeCart();
        }, 3000);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      setCheckoutError(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-50 fade-in"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-espresso-100">
          <h2 className="font-display text-xl md:text-2xl font-bold text-espresso-800">
            Your Cart
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6 text-espresso-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {checkoutSuccess ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-espresso-800 mb-2">Order Placed!</h3>
              <p className="text-espresso-600">Thank you for your purchase.</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-20 h-20 mx-auto text-espresso-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="font-display text-xl font-semibold text-espresso-800 mb-2">Your cart is empty</h3>
              <p className="text-espresso-600 mb-4">Looks like you haven't added any coffee yet.</p>
              <button onClick={closeCart} className="btn-primary">
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex gap-4 p-4 bg-cream-50 rounded-xl">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-cream-100">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-espresso-800 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-espresso-600 mb-2">
                      ${parseFloat(item.product.price).toFixed(2)} each
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-espresso-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="px-3 py-1 hover:bg-cream-100 transition-colors disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= item.product.stock}
                          className="px-3 py-1 hover:bg-cream-100 transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="font-bold text-espresso-900">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cartItems.length > 0 && !checkoutSuccess && (
          <div className="border-t border-espresso-100 p-4 md:p-6 space-y-4">
            {/* Subtotal Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-espresso-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-espresso-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-espresso-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-espresso-100">
              <span className="font-display text-lg font-bold text-espresso-900">Total</span>
              <span className="text-2xl font-bold text-espresso-900">${cartTotal.toFixed(2)}</span>
            </div>

            {checkoutError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                {checkoutError}
              </div>
            )}
            
            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isLoading || isCheckingOut}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            {/* Clear Cart */}
            <button
              onClick={clearCart}
              disabled={isLoading}
              className="w-full text-center text-espresso-600 hover:text-espresso-800 text-sm font-medium disabled:opacity-50"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
