import { useState } from 'react';
import { useCart } from '../context/CartContext';
import useModal from '../hooks/useModal';

const SearchFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { openCart } = useCart();
  const { isOpen: isMobileFiltersOpen, toggleModal: toggleMobileFilters } = useModal(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Dispatch custom event for parent to handle
    window.dispatchEvent(new CustomEvent('search-change', { detail: { search: value } }));
  };

  return (
    <div className="bg-white border-b border-espresso-100 py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="relative mb-4 md:mb-6">
          <input
            type="text"
            placeholder="Search our coffee collection..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input-field pl-12 pr-4 py-3 md:py-4 text-base md:text-lg"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category Filters - Desktop */}
        <div className="hidden md:flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-espresso-600">Filter:</span>
          
          <button
            onClick={() => onCategoryChange('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === ''
                ? 'bg-espresso-700 text-cream-50'
                : 'bg-cream-100 text-espresso-700 hover:bg-cream-200'
            }`}
          >
            All Coffees
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-espresso-700 text-cream-50'
                  : 'bg-cream-100 text-espresso-700 hover:bg-cream-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileFilters}
            className="btn-outline w-full py-3 text-sm"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter by Category
            </span>
          </button>
          
          {/* Mobile Filters Dropdown */}
          {isMobileFiltersOpen && (
            <div className="mt-4 space-y-2 animate-fade-in">
              <button
                onClick={() => {
                  onCategoryChange('');
                  toggleMobileFilters();
                }}
                className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all ${
                  selectedCategory === ''
                    ? 'bg-espresso-700 text-cream-50'
                    : 'bg-cream-100 text-espresso-700'
                }`}
              >
                All Coffees
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    toggleMobileFilters();
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-espresso-700 text-cream-50'
                      : 'bg-cream-100 text-espresso-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
