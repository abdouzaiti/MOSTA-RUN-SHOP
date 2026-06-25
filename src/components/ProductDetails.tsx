/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Color } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Heart, Check, Loader2 } from 'lucide-react';
import LogoOverlay from './LogoOverlay';
import { PRODUCTS } from '../data';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: Color) => void;
  onBack: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductDetails({ product, onAddToCart, onBack, onSelectProduct }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewType, setViewType] = useState<'front' | 'back'>('front');

  // Find counterpart product (e.g. White vs Black version with same logo)
  const isBlack = product.id.includes('black');
  const isPink = product.tags.includes('pink-edition');
  
  const counterpart = PRODUCTS.find((p) => {
    if (p.id === product.id) return false;
    if (p.category !== product.category) return false;
    
    // Check if both are pink-edition or both are blue-edition
    const isOtherPink = p.tags.includes('pink-edition');
    if (isPink !== isOtherPink) return false;
    
    // Check if the other has the opposite fabric color
    const isOtherBlack = p.id.includes('black');
    return isBlack !== isOtherBlack;
  });

  // Auto-select first color/size or logical defaults
  useEffect(() => {
    setSelectedImageIndex(0);
    setViewType('front');
    if (product.sizes.length > 0) {
      // If "One Size" is available, auto-select it. Otherwise leave it or choose S/M
      if (product.sizes.includes('One Size')) {
        setSelectedSize('One Size');
      } else if (product.sizes.includes('M')) {
        setSelectedSize('M'); // Standard default
      } else {
        setSelectedSize(product.sizes[0]);
      }
    }
    if (product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    setAddedSuccessfully(false);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first');
      return;
    }
    if (!selectedColor) {
      alert('Please select a color first');
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product, selectedSize, selectedColor);
      setIsAdding(false);
      setAddedSuccessfully(true);
      setTimeout(() => setAddedSuccessfully(false), 2000);
    }, 800); // Snappy 800ms simulation
    // Typo warning: 800ms, not 80000ms. I will write 800ms.
  };

  const currentPrice = product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="product-detail-view">
      {/* Breadcrumbs & Back Button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
          id="back-to-products-btn"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to collections
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Column: Image Viewer (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-square w-full rounded-2xl border border-neutral-100 bg-neutral-50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

            <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] flex items-center justify-center z-10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedImageIndex}-${viewType}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[selectedImageIndex]}
                  alt={`${product.title} view`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
              <LogoOverlay
                productCategory={product.category}
                viewType={viewType}
                isBlackProduct={product.id.includes('black')}
                isPinkEdition={product.tags.includes('pink-edition')}
                isThumbnail={false}
                skipOverlay={
                  product.images[selectedImageIndex]?.startsWith('/tshirt') ||
                  product.images[selectedImageIndex]?.startsWith('/csq') ||
                  product.images[selectedImageIndex]?.startsWith('/polo')
                }
              />
            </div>

            {/* Front / Back Switcher for T-Shirts */}
            {product.category === 't-shirts' && (
              <div className="absolute bottom-6 left-6 z-20 flex gap-1 rounded-full border border-neutral-200/50 bg-white/70 p-1 backdrop-blur-sm shadow-sm" id="view-type-switcher">
                <button
                  onClick={() => setViewType('front')}
                  className={`h-7 px-4 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                    viewType === 'front'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                  id="view-type-front-btn"
                >
                  Face
                </button>
                <button
                  onClick={() => setViewType('back')}
                  className={`h-7 px-4 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                    viewType === 'back'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                  id="view-type-back-btn"
                >
                  Dos
                </button>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/50 text-neutral-500 backdrop-blur-sm hover:text-black hover:border-neutral-300 transition-all"
              id="favorite-toggle-btn"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 justify-center md:justify-start overflow-x-auto pb-2" id="image-thumbnails-container">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square h-16 w-16 overflow-hidden rounded-lg border bg-neutral-50 flex items-center justify-center transition-all ${
                    index === selectedImageIndex
                      ? 'border-black scale-102 ring-1 ring-black/50'
                      : 'border-neutral-100 opacity-60 hover:opacity-100'
                  }`}
                  id={`image-thumb-${index}`}
                >
                  <img
                    src={image}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-[45px] h-[45px] object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Purchase Options (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Header Specs */}
          <div className="border-b border-neutral-100 pb-6 mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-black font-display">
              {product.title}
            </h1>

            {/* Price badge floating style in header */}
            <div className="mt-4 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 py-1.5 px-4 text-sm font-semibold text-black">
                <span className="font-mono">${currentPrice.toFixed(2)} {product.currency}</span>
              </div>
              <div className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full py-1 px-3">
                Free shipping eligible
              </div>
            </div>

            {/* Ratings Summary */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-neutral-500">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-neutral-200 font-mono text-xs">•</span>
              <span className="text-xs font-mono text-neutral-400 underline decoration-neutral-100 underline-offset-2">
                {product.reviewsCount} verified reviews
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
              Overview
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed font-sans font-light">
              {product.description}
            </p>
          </div>

          {/* Interactive Customization */}
          <div className="space-y-6 border-t border-neutral-100 pt-6 mb-8">
            {/* Color Swatch Selector */}
            {product.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
                    Color / Fabric
                  </span>
                  <span className="text-xs font-mono text-neutral-500 font-medium">
                    {selectedColor?.name || 'Select Color'}
                  </span>
                </div>
                
                {counterpart ? (
                  <div className="flex gap-3" id="fabric-color-switcher">
                    {/* Current Product Button */}
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-black bg-neutral-50 text-black text-xs font-semibold transition-all shadow-sm cursor-default"
                      id="fabric-color-current"
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-neutral-200 shadow-inner inline-block"
                        style={{ backgroundColor: isBlack ? '#111111' : '#ffffff' }}
                      />
                      <span>{isBlack ? 'Black Fabric' : 'White Fabric'}</span>
                    </button>

                    {/* Counterpart Product Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectProduct) {
                          onSelectProduct(counterpart);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:border-neutral-400 text-neutral-600 hover:text-black text-xs font-medium transition-all"
                      id="fabric-color-counterpart"
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-neutral-200 shadow-inner inline-block"
                        style={{ backgroundColor: isBlack ? '#ffffff' : '#111111' }}
                      />
                      <span>{isBlack ? 'White Fabric' : 'Black Fabric'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2.5" id="color-swatches-container">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor?.name === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`group relative h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'ring-2 ring-black ring-offset-2 ring-offset-white scale-105'
                              : 'hover:scale-102 border border-neutral-200'
                          }`}
                          id={`color-swatch-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && (
                            <Check
                              className={`h-4 w-4 ${
                                color.hex === '#fdfdfd' || color.hex === '#e5e5e5' || color.hex === '#f5f5f0'
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
                    Size
                  </span>
                  <span className="text-xs font-mono text-neutral-500 font-medium">
                    {selectedSize ? `Selected: ${selectedSize}` : 'Select Size'}
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2" id="sizes-grid-container">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-10 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white font-bold shadow-md'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-neutral-400 hover:text-black'
                        }`}
                        id={`size-btn-${size.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Large Action Buttons */}
          <div className="mt-auto space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !selectedSize || !selectedColor}
              className={`flex w-full items-center justify-center h-12 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                addedSuccessfully
                  ? 'bg-green-600 text-white font-bold cursor-default'
                  : 'bg-black text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
              id="add-to-cart-action-btn"
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding to Cart...</span>
                </div>
              ) : addedSuccessfully ? (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Added to Cart!</span>
                </div>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
