/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../types';

interface HeaderProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  cartItemsCount: number;
  onOpenCart: () => void;
  onGoHome: () => void;
}

export default function Header({
  categories,
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  cartItemsCount,
  onOpenCart,
  onGoHome,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [logoFailed, setLogoFailed] = useState(false);

  // Sync local search state with parent if search term is cleared externally
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleSearchClear = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo and Desktop Menu */}
        <div className="flex items-center gap-8">
          <button
            onClick={onGoHome}
            className="flex items-center focus:outline-none select-none"
            id="header-logo-btn"
          >
            {!logoFailed ? (
              <img
                src="/logo.png"
                alt="Mosta Run Club"
                onError={() => setLogoFailed(true)}
                className="h-10 w-auto object-contain select-none"
              />
            ) : (
              <div className="flex flex-col text-left leading-[0.8] font-sans font-black tracking-tight text-[#0D5DF1] italic uppercase scale-y-[1.15] origin-left">
                <span className="text-[14px]">Mosta</span>
                <span className="text-[14px]">Run</span>
                <span className="text-[14px]">Club</span>
              </div>
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => {
                  onSelectCategory(category.slug);
                  // Clear search when clicking category
                  onSearchChange('');
                }}
                className={`text-sm font-medium transition-colors hover:text-black ${
                  activeCategory === category.slug && !searchTerm
                    ? 'text-black font-semibold border-b-2 border-[#0D5DF1] pb-0.5'
                    : 'text-neutral-500'
                }`}
                id={`nav-cat-${category.slug}`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4 md:mx-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                // Also trigger live filtering for ultra-responsive feel
                onSearchChange(e.target.value);
              }}
              className="w-full h-10 rounded-lg bg-neutral-50/90 border border-neutral-200 px-4 pr-10 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-colors focus:border-neutral-400 focus:bg-white"
              id="header-search-input"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {localSearch ? (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="text-neutral-400 hover:text-black"
                  id="search-clear-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Search className="h-4 w-4 text-neutral-400" />
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Cart Trigger and Mobile Menu Icon */}
        <div className="flex items-center gap-4">
          {/* Cart Icon with badge */}
          <button
            onClick={onOpenCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:text-black transition-all focus:outline-none"
            id="header-cart-btn"
            aria-label="Open Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white border border-white shadow-md"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:text-black focus:outline-none"
            id="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 w-full border-b border-neutral-100 bg-white/95 backdrop-blur-lg px-4 py-4 z-30"
          >
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-2">
                Collections
              </span>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => {
                    onSelectCategory(category.slug);
                    onSearchChange('');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category.slug && !searchTerm
                      ? 'bg-neutral-100 text-black'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                  id={`mobile-nav-cat-${category.slug}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
