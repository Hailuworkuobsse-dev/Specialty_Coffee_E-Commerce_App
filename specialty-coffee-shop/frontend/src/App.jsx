import { useState, useEffect } from 'react';
import { useProducts } from './hooks/useProducts';
import Navbar from './components/Navbar';
import SearchFilter from './components/SearchFilter';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { products, categories, isLoading, error } = useProducts(searchTerm, selectedCategory);

  // Listen for search changes from SearchFilter component
  useEffect(() => {
    const handleSearchChange = (e) => {
      setSearchTerm(e.detail.search);
    };

    window.addEventListener('search-change', handleSearchChange);
    return () => window.removeEventListener('search-change', handleSearchChange);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-espresso-800 via-espresso-700 to-espresso-900 text-cream-50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Premium Specialty Coffee
            </h1>
            <p className="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto mb-8">
              Ethically sourced, expertly roasted, and delivered fresh to your door. 
              Experience the world's finest coffee beans.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm md:text-base text-cream-300">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Shipping
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Fresh Roasted
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Ethically Sourced
              </span>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <SearchFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Product Grid */}
        <main>
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
          />
        </main>

        {/* Footer */}
        <footer className="bg-espresso-900 text-cream-200 py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-display text-2xl font-bold text-cream-50 mb-4">
                  Brew <span className="text-amber-500">&</span> Bean
                </h3>
                <p className="text-cream-300 text-sm leading-relaxed">
                  Crafting exceptional coffee experiences since 2024. 
                  Every bean tells a story of dedication, terroir, and passion.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-cream-50 mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition-colors">Our Coffees</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition-colors">Brewing Guides</a></li>
                  <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-cream-50 mb-4">Newsletter</h4>
                <p className="text-cream-300 text-sm mb-4">
                  Subscribe for exclusive offers and brewing tips.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-espresso-800 border border-espresso-700 text-cream-50 placeholder-espresso-400 focus:outline-none focus:border-amber-500"
                  />
                  <button className="btn-primary py-2 px-4">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-espresso-800 mt-8 pt-8 text-center text-sm text-cream-400">
              <p>&copy; 2024 Brew & Bean. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Cart Sidebar */}
        <CartSidebar />
      </div>
    </CartProvider>
  );
}

export default App;
