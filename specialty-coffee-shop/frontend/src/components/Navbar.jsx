import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount, toggleCart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-espresso-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-espresso-800">
              Brew <span className="text-amber-600">&</span> Bean
            </h1>
          </div>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative p-2 md:p-3 rounded-full hover:bg-cream-100 transition-colors duration-200 group"
            aria-label="Open cart"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7 text-espresso-700 group-hover:text-espresso-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-cream-50 text-xs md:text-sm font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
