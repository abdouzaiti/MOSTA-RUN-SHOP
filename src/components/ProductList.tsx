/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Category, SortOption, SortKey } from '../types';
import { motion } from 'motion/react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import LogoOverlay from './LogoOverlay';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  activeSort: SortKey;
  onSelectSort: (key: SortKey) => void;
  sortOptions: SortOption[];
  searchTerm: string;
  onClearSearch: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductList({
  products,
  categories,
  activeCategory,
  onSelectCategory,
  activeSort,
  onSelectSort,
  sortOptions,
  searchTerm,
  onClearSearch,
  onSelectProduct,
}: ProductListProps) {
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter products by category and search term
  const filteredProducts = products.filter((product) => {
    let matchesCategory = false;
    if (activeCategory === 'all' || activeCategory === 'collections') {
      matchesCategory = true;
    } else if (activeCategory === 'blue-edition') {
      matchesCategory = product.tags.includes('blue-edition');
    } else if (activeCategory === 'pink-edition') {
      matchesCategory = product.tags.includes('pink-edition');
    } else {
      matchesCategory = product.category === activeCategory;
    }

    const matchesSearch =
      !searchTerm ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (activeSort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'trending':
        return b.reviewsCount - a.reviewsCount; // Mock trending by high review count
      case 'relevance':
      default:
        // Featured first, then alphabetical/rating
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return b.rating - a.rating;
    }
  });

  const getCategoryName = (slug: string) => {
    if (slug === 'blue-edition') return 'Blue Edition';
    if (slug === 'pink-edition') return 'Pink Edition';
    return categories.find((c) => c.slug === slug)?.name || 'Products';
  };

  const sidebarCategories = [
    { slug: 'all', name: 'All' },
    { slug: 'blue-edition', name: 'Blue Edition' },
    { slug: 'pink-edition', name: 'Pink Edition' },
    { slug: 't-shirts', name: 'T-Shirts' },
    { slug: 'polos', name: 'Polos' },
    { slug: 'caps', name: 'Caps' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="product-list-container">
      {/* Title / Search Result Summary */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          {searchTerm ? (
            <h2 className="text-xl font-medium text-black tracking-tight font-sans">
              Search results for <span className="text-neutral-500">"{searchTerm}"</span>
            </h2>
          ) : (
            <h2 className="text-xl font-medium text-black tracking-tight font-sans">
              {getCategoryName(activeCategory)} {activeCategory === 'all' ? 'Products' : ''}
            </h2>
          )}
          <p className="mt-1 text-xs text-neutral-400 font-mono">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex sm:hidden gap-2">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-600 hover:text-black"
            id="mobile-filter-toggle-btn"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Collections
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side: Navigation & Filtering Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-8 lg:col-span-1">
          {/* Collections Selector */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 font-mono">
              Collections
            </h3>
            <ul className="space-y-2">
              {sidebarCategories.map((category) => (
                <li key={category.slug}>
                  <button
                    onClick={() => onSelectCategory(category.slug)}
                    className={`text-left text-sm font-medium transition-colors hover:text-black ${
                      activeCategory === category.slug && !searchTerm
                        ? 'text-black font-semibold border-l-2 border-[#0D5DF1] pl-3 -ml-[2px]'
                        : 'text-neutral-500 hover:text-black pl-3'
                    }`}
                    id={`sidebar-cat-${category.slug}`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort Selector */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4 font-mono">
              Sort by
            </h3>
            <ul className="space-y-2">
              {sortOptions.map((option) => (
                <li key={option.key}>
                  <button
                    onClick={() => onSelectSort(option.key)}
                    className={`text-left text-sm font-medium transition-colors hover:text-black ${
                      activeSort === option.key
                        ? 'text-black font-semibold border-l-2 border-black pl-3 -ml-[2px]'
                        : 'text-neutral-500 hover:text-black pl-3'
                    }`}
                    id={`sidebar-sort-${option.key}`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Mobile Filters Dropdown Grid */}
        {showFiltersMobile && (
          <div className="lg:hidden col-span-1 grid grid-cols-2 gap-4 p-4 rounded-xl border border-neutral-100 bg-neutral-50 mb-4 animate-in fade-in duration-200">
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
                Collections
              </h4>
              <div className="flex flex-col gap-1.5 items-start">
                {sidebarCategories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => {
                      onSelectCategory(category.slug);
                      setShowFiltersMobile(false);
                    }}
                    className={`text-sm text-left ${
                      activeCategory === category.slug && !searchTerm
                        ? 'text-black font-semibold underline underline-offset-4'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
                Sort by
              </h4>
              <div className="flex flex-col gap-1.5 items-start">
                {sortOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      onSelectSort(option.key);
                      setShowFiltersMobile(false);
                    }}
                    className={`text-sm text-left ${
                      activeSort === option.key
                        ? 'text-black font-medium underline underline-offset-4'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Product Grid */}
        <main className="lg:col-span-4">
          {sortedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50"
              id="empty-results-container"
            >
              <p className="text-neutral-600 font-medium text-base mb-2">No products found</p>
              <p className="text-neutral-400 text-xs mb-6 max-w-sm">
                We couldn't find anything matching your filters or search term. Try resetting them.
              </p>
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onSelectSort('relevance');
                  onClearSearch();
                }}
                className="h-10 px-5 rounded-full bg-black text-white font-semibold text-xs transition-colors hover:bg-neutral-800"
                id="reset-filters-btn"
              >
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6" id="products-grid">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="flex flex-col cursor-pointer group"
                  id={`product-card-${product.id}`}
                >
                   {/* Visual Card Image container */}
                  <div className="relative h-[220px] md:h-[280px] w-full overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-50 flex items-center justify-center transition-all group-hover:border-neutral-200 p-6 md:p-10">
                    {/* Subtle layout grid mask */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

                    {/* Nouveau Badge (Only for T-Shirt White - Blue) */}
                    {product.id === 'mosta-tshirt-white-blue' && (
                      <span className="absolute top-4 left-4 z-10 bg-black text-[10px] font-extrabold tracking-wider text-white px-3 py-1.5 rounded-full uppercase">
                        Nouveau
                      </span>
                    )}

                    {/* Centered Product Image */}
                    <div className="relative w-full h-full flex items-center justify-center z-10">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <LogoOverlay
                        productCategory={product.category}
                        viewType="front"
                        isBlackProduct={product.id.includes('black')}
                        isPinkEdition={product.tags.includes('pink-edition')}
                        isThumbnail={true}
                        skipOverlay={
                          product.images[0]?.startsWith('/tshirt') ||
                          product.images[0]?.startsWith('/csq') ||
                          product.images[0]?.startsWith('/polo')
                        }
                      />
                    </div>
                  </div>

                  {/* Title and Price Info underneath the card */}
                  <div className="mt-3.5 space-y-0.5 text-left pl-1">
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#0D5DF1] transition-colors font-sans">
                      {product.title}
                    </h4>
                    <p className="text-xs font-bold text-neutral-500 font-mono">
                      ${product.price.toFixed(2)} USD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
