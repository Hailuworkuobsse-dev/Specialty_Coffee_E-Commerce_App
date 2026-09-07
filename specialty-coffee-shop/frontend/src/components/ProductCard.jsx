import { useState } from 'react';
import { useCart } from '../context/CartContext';
import useModal from '../hooks/useModal';

const ProductCard = ({ product }) => {
  const { addToCart, isLoading } = useCart();
  const { isOpen, openModal, closeModal } = useModal(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product.id, quantity);
    setQuantity(1);
  };

  const handleCardClick = () => {
    openModal(product);
  };

  return (
    <>
      <div 
        className="card cursor-pointer group"
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Quick Add Overlay */}
          <div className="absolute inset-0 bg-espresso-900/0 group-hover:bg-espresso-900/20 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock === 0}
              className="btn-primary text-sm py-2 px-4 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 md:p-5">
          <span className="badge mb-2">{product.category}</span>
          <h3 className="font-display text-lg md:text-xl font-semibold text-espresso-800 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-espresso-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl md:text-2xl font-bold text-espresso-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-sm fade-in"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Close Button */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-espresso-100">
              <h2 className="font-display text-xl md:text-2xl font-bold text-espresso-800">
                {product.name}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-cream-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6 text-espresso-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-cream-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <span className="badge">{product.category}</span>
                  
                  <p className="text-espresso-700 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Flavor Notes */}
                  <div>
                    <h4 className="font-semibold text-espresso-800 mb-2">Flavor Profile</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Premium', 'Fresh Roasted', 'Specialty Grade'].map((note) => (
                        <span key={note} className="px-3 py-1 bg-cream-100 text-espresso-700 rounded-full text-xs">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Stock */}
                  <div className="pt-4 border-t border-espresso-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-espresso-900">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `✓ ${product.stock} available` : '✗ Out of Stock'}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <label className="text-espresso-700 font-medium">Quantity:</label>
                          <div className="flex items-center border border-espresso-200 rounded-lg">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="px-4 py-2 hover:bg-cream-100 transition-colors"
                              disabled={quantity <= 1}
                            >
                              −
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                              className="px-4 py-2 hover:bg-cream-100 transition-colors"
                              disabled={quantity >= product.stock}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleAddToCart}
                          disabled={isLoading}
                          className="btn-primary w-full py-4 text-lg"
                        >
                          {isLoading ? 'Adding...' : `Add to Cart - $${(parseFloat(product.price) * quantity).toFixed(2)}`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
