import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';

const HeaderSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const searchTimeoutRef = useRef(null);

  const handleSearch = () => {
    if (searchInput.trim()) {
      // Navigate to products page with search parameter
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}&page=1`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Optional: Auto-search with debounce (uncomment if you want live search)
    /*
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/products?search=${encodeURIComponent(value.trim())}&page=1`);
      }
    }, 1000); // 1 second debounce for auto-search
    */
  };

  return (
    <div className="flex-1 max-w-xl hidden lg:flex">
      <input
        type="text"
        placeholder="Search products..."
        value={searchInput}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="px-3 py-2 w-full outline-none text-gray-700 border border-gray-200 rounded-l "
      />
      <button
        onClick={handleSearch}
        className="primaryBgColor p-3 rounded-r hover:opacity-90 transition-opacity"
      >
        <CiSearch className="text-white w-5 h-5" />
      </button>
    </div>
  );
};

export default HeaderSearch;