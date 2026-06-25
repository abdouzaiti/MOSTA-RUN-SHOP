/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Color } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Heart, Check, Loader2, X, ChevronRight, Maximize2 } from 'lucide-react';
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Keyboard navigation for the full-screen lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, product.images.length]);

  // Zoom state for Adidas-style interactive hover zoom
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center',
    transform: 'scale(1)',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)',
    });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)',
    });
  };

  // Zoom state for full-screen lightbox
  const [isLightboxZooming, setIsLightboxZooming] = useState(false);
  const [lightboxZoomStyle, setLightboxZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: 'center',
    transform: 'scale(1)',
  });

  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightboxZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.5)',
    });
  };

  const handleLightboxMouseEnter = () => {
    setIsLightboxZooming(true);
  };

  const handleLightboxMouseLeave = () => {
    setIsLightboxZooming(false);
    setLightboxZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)',
    });
  };

  // Reset lightbox zoom whenever selected image changes or lightbox is toggled
  useEffect(() => {
    setIsLightboxZooming(false);
    setLightboxZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)',
    });
  }, [selectedImageIndex, isLightboxOpen]);

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

  // Preload all product images (current and counterpart) to make transitions instantaneous
  useEffect(() => {
    const imagesToPreload = [...product.images];
    if (counterpart) {
      imagesToPreload.push(...counterpart.images);
    }
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [product, counterpart]);

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
        {/* Left Column: Image Viewer (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div 
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsLightboxOpen(true)}
            className="relative aspect-square w-full rounded-2xl border border-neutral-100 bg-neutral-50 flex items-center justify-center overflow-hidden p-1 cursor-zoom-in group/image-card hover:border-neutral-250 transition-colors"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
 
            <div 
              className="relative w-full h-full flex items-center justify-center z-10 transition-transform duration-75 ease-out"
              style={isZooming ? zoomStyle : { transform: 'scale(1)', transformOrigin: 'center' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${product.id}-${selectedImageIndex}-${viewType}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
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

            {/* Zoom hint */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300 bg-black/85 text-white text-[9px] uppercase font-black tracking-widest px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-md ${isZooming ? 'opacity-0' : 'opacity-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              Cliquez pour zoomer plein écran
            </div>



            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/50 text-neutral-500 backdrop-blur-sm hover:text-black hover:border-neutral-300 transition-all z-20"
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
                  className={`relative aspect-square h-20 w-20 overflow-hidden rounded-lg border bg-neutral-50 flex items-center justify-center transition-all ${
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
                    className="w-full h-full object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Purchase Options (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col">
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

      {/* FULL SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white p-4 sm:p-6 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Header / Top controls */}
            <div className="w-full flex justify-between items-center max-w-7xl">
              <div className="flex flex-col text-left leading-[0.8] font-sans font-black tracking-tight text-[#0D5DF1] italic uppercase scale-y-[1.15] origin-left select-none">
                <span className="text-[12px]">MRC</span>
                <span className="text-[12px]">SHOP</span>
              </div>
              <div className="text-xs font-mono font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                {selectedImageIndex + 1} / {product.images.length}
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-black hover:bg-neutral-200 hover:scale-105 transition-all shadow-sm"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Interactive Viewer */}
            <div className="relative flex-1 w-full flex items-center justify-center max-w-[95%] sm:max-w-7xl py-4">
              {/* Left Arrow Button */}
              {product.images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
                  }}
                  className="absolute left-2 sm:left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 border border-neutral-200 shadow-sm text-neutral-800 hover:bg-neutral-100 transition-all backdrop-blur-sm"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Central Image and Overlay */}
              <div 
                className="relative max-h-[88vh] aspect-square w-full max-w-5xl bg-white rounded-2xl flex items-center justify-center p-1 border border-neutral-100 overflow-hidden cursor-zoom-in"
                onClick={(e) => e.stopPropagation()}
                onMouseMove={handleLightboxMouseMove}
                onMouseEnter={handleLightboxMouseEnter}
                onMouseLeave={handleLightboxMouseLeave}
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />
                
                <div 
                  className="relative w-full h-full flex items-center justify-center z-10 transition-transform duration-75 ease-out"
                  style={isLightboxZooming ? lightboxZoomStyle : { transform: 'scale(1)', transformOrigin: 'center' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${product.id}-lightbox-${selectedImageIndex}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      src={product.images[selectedImageIndex]}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain z-10 pointer-events-none"
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
              </div>

              {/* Right Arrow Button */}
              {product.images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
                  }}
                  className="absolute right-2 sm:right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 border border-neutral-200 shadow-sm text-neutral-800 hover:bg-neutral-100 transition-all backdrop-blur-sm"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Bottom: thumbnails + helpful controls info */}
            <div className="w-full max-w-3xl flex flex-col items-center gap-4">
              {product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2" onClick={(e) => e.stopPropagation()}>
                  {product.images.map((img, i) => (
                    <button
                      key={`lightbox-thumb-${i}`}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`relative aspect-square h-20 w-20 overflow-hidden rounded-lg border flex items-center justify-center transition-all ${
                        i === selectedImageIndex
                          ? 'border-neutral-900 scale-105 ring-1 ring-neutral-900/50 bg-neutral-100'
                          : 'border-neutral-200 opacity-60 hover:opacity-100 bg-white'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Keyboard shortcuts tips */}
              <div className="hidden sm:flex items-center gap-4 text-[10px] text-neutral-400 font-mono">
                <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-neutral-100 rounded border border-neutral-200 text-neutral-600 font-bold">ESC</span> Quitter</span>
                <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-neutral-100 rounded border border-neutral-200 text-neutral-600 font-bold">←</span> / <span className="px-1.5 py-0.5 bg-neutral-100 rounded border border-neutral-200 text-neutral-600 font-bold">→</span> Naviguer</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
