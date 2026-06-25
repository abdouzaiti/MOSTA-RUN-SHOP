/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FeaturedGrid from './components/FeaturedGrid';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { Product, CartItem, SortKey, Color } from './types';
import { PRODUCTS, CATEGORIES, SORT_OPTIONS } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Github } from 'lucide-react';

export default function App() {
  // Navigation & Search State
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSort, setActiveSort] = useState<SortKey>('relevance');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [aboutBgImage, setAboutBgImage] = useState('/back1.png');

  // Cart & Checkout UI State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('acme-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  // Save cart to LocalStorage on update
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    try {
      localStorage.setItem('acme-cart', JSON.stringify(updatedCart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  };

  const handleAddToCart = (product: Product, size: string, color: Color) => {
    const combinedId = `${product.id}-${size.toLowerCase().replace(/\s+/g, '-')}-${color.name.toLowerCase().replace(/\s+/g, '-')}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === combinedId);
      let updatedCart: CartItem[];

      if (existingIndex > -1) {
        // Increase quantity
        updatedCart = prevItems.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new cart item
        const newItem: CartItem = {
          id: combinedId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: 1,
        };
        updatedCart = [...prevItems, newItem];
      }

      saveCartToStorage(updatedCart);
      return updatedCart;
    });

    // Auto-open cart drawer for elegant feedback
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      let updatedCart: CartItem[];

      if (newQuantity <= 0) {
        // Remove item if quantity falls to zero
        updatedCart = prevItems.filter((item) => item.id !== cartItemId);
      } else {
        // Update specific quantity
        updatedCart = prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        );
      }

      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== cartItemId);
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const handleOrderSuccess = () => {
    // Clear state
    setCartItems([]);
    saveCartToStorage([]);
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    setActiveCategory('all');
    setSearchTerm('');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Navigation handlers
  const handleGoHome = () => {
    setSelectedProduct(null);
    setActiveCategory('all');
    setSearchTerm('');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col antialiased selection:bg-black selection:text-white" id="app-root">
      {/* Dynamic Header Component */}
      <Header
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          setSelectedProduct(null); // Return to list view
        }}
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          if (term) setSelectedProduct(null); // Go to search results on active queries
        }}
        cartItemsCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Main Page Layout Wrapper */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {selectedProduct ? (
            // DETAILED PRODUCT SCREEN
            <motion.div
              key={`product-details-${selectedProduct.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ProductDetails
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBack={() => setSelectedProduct(null)}
                onSelectProduct={handleSelectProduct}
              />
            </motion.div>
          ) : activeCategory === 'about' && !searchTerm ? (
            // BEAUTIFUL ABOUT SCREEN
            <motion.div
              key="about-club-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-16"
              id="about-page"
            >
              {/* Cover Banner */}
              <div className="relative h-[250px] md:h-[350px] rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={aboutBgImage}
                  alt="Mosta Run Club"
                  onError={() => setAboutBgImage('/src/assets/images/mosta_banner_1782408639126.jpg')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-center p-6">
                  <div className="space-y-3">
                    <span className="text-xs font-bold tracking-widest text-white/90 bg-white/20 px-3 py-1 rounded-full uppercase backdrop-blur-sm font-sans">
                      Rejoins le Club
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none uppercase italic font-sans">
                      Mosta Run Club
                    </h1>
                    <p className="text-sm md:text-base text-neutral-200 font-medium max-w-md mx-auto">
                      Run Together. Stronger Every Day.
                    </p>
                  </div>
                </div>
              </div>

              {/* Story Section */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                    Notre Histoire, Notre Passion.
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Né d'une idée simple : rassembler les passionnés de course à pied dans une atmosphère énergique et bienveillante, le <span className="font-bold text-[#0D5DF1]">Mosta Run Club</span> est rapidement devenu une famille de coureurs.
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Que vous fassiez vos premiers pas avec des chaussures de course ou que vous prépariez votre dixième marathon, nous courons ensemble, nous nous entraidons à dépasser nos limites et nous célébrons chaque victoire – petite ou grande.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className="h-10 px-6 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-xs transition-colors shadow-sm"
                    >
                      Voir la Collection
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl border border-neutral-100 bg-neutral-50 text-center space-y-1">
                    <span className="block text-3xl font-black text-[#0D5DF1]">500+</span>
                    <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Membres Actifs</span>
                  </div>
                  <div className="p-6 rounded-2xl border border-neutral-100 bg-neutral-50 text-center space-y-1">
                    <span className="block text-3xl font-black text-[#0D5DF1]">3x</span>
                    <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Runs Par Semaine</span>
                  </div>
                  <div className="p-6 rounded-2xl border border-neutral-100 bg-neutral-50 text-center space-y-1">
                    <span className="block text-3xl font-black text-[#0D5DF1]">10k+</span>
                    <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Kilomètres Parcourus</span>
                  </div>
                  <div className="p-6 rounded-2xl border border-neutral-100 bg-neutral-50 text-center space-y-1">
                    <span className="block text-3xl font-black text-[#0D5DF1]">100%</span>
                    <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Motivation & Fun</span>
                  </div>
                </div>
              </div>

              {/* Running Schedule */}
              <div className="rounded-3xl border border-neutral-100 bg-neutral-50/50 p-8 md:p-10 space-y-8">
                <div className="text-center max-w-md mx-auto space-y-2">
                  <h3 className="text-xl md:text-2xl font-extrabold text-neutral-900 tracking-tight">
                    Nos Rendez-vous Hebdomadaires
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Pas besoin d'inscription, venez simplement avec vos chaussures de run et votre énergie positive !
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Tuesday */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                      <span className="text-xs font-extrabold text-[#0D5DF1] tracking-wider uppercase">Mardi Soir</span>
                      <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md">18h30</span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-neutral-900">Fractionné & Vitesse</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Idéal pour développer votre cardio, votre endurance et votre vitesse. Séance encadrée sur la piste d'athlétisme municipale.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <span>📍</span>
                      <span>Stade de la Ville, Piste Principale</span>
                    </div>
                  </div>

                  {/* Thursday */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                      <span className="text-xs font-extrabold text-[#0D5DF1] tracking-wider uppercase">Jeudi Soir</span>
                      <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md">19h00</span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-neutral-900">Run Urbain & Social</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Un run de 6 à 10 km à un rythme conversationnel à travers la ville. Le run parfait pour papoter et se vider la tête de la journée.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <span>📍</span>
                      <span>Départ de la boutique Mosta Club</span>
                    </div>
                  </div>

                  {/* Sunday */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                      <span className="text-xs font-extrabold text-[#0D5DF1] tracking-wider uppercase">Dimanche Matin</span>
                      <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md">09h30</span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-neutral-900">La Sortie Longue & Café</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Sortie nature de 12 à 20 km avec différentes allures. On termine toujours autour d'un bon café chaud et de viennoiseries !
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <span>📍</span>
                      <span>Parc Forestier, Entrée Sud</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeCategory === 'all' && !searchTerm ? (
            // HOMEPAGE VIEW: bento grid + full lists underneath
            <motion.div
              key="homepage-views"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Featured bento layout */}
              <FeaturedGrid products={PRODUCTS} onSelectProduct={handleSelectProduct} />

              {/* Browse rest of the collection */}
              <ProductList
                products={PRODUCTS}
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                activeSort={activeSort}
                onSelectSort={setActiveSort}
                sortOptions={SORT_OPTIONS}
                searchTerm={searchTerm}
                onClearSearch={() => setSearchTerm('')}
                onSelectProduct={handleSelectProduct}
              />
            </motion.div>
          ) : (
            // CATEGORY / SEARCH QUERY VIEW
            <motion.div
              key={`filtered-collection-${activeCategory}-${searchTerm}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductList
                products={PRODUCTS}
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                activeSort={activeSort}
                onSelectSort={setActiveSort}
                sortOptions={SORT_OPTIONS}
                searchTerm={searchTerm}
                onClearSearch={() => setSearchTerm('')}
                onSelectProduct={handleSelectProduct}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Immersive Sandbox Checkout Gateway */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-100 bg-neutral-50/60 py-10" id="site-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="text-[#0D5DF1] font-bold italic">MOSTA RUN CLUB</span>
            <span>© {new Date().getFullYear()} Mosta Run Club. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
            <a
              href="https://github.com/vercel/commerce"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-black transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Next.js Commerce Reference</span>
              <ArrowUpRight className="h-2.5 w-2.5" />
            </a>
            <span className="hidden sm:inline text-neutral-200">|</span>
            <span className="hidden sm:inline">Mocked Stripe Sandbox Gateways</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
