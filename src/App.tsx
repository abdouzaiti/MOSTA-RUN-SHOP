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
import AdminDashboard from './components/AdminDashboard';
import { Product, CartItem, SortKey, Color } from './types';
import { PRODUCTS, CATEGORIES, SORT_OPTIONS } from './data';
import { motion, AnimatePresence } from 'motion/react';
import MotionIntro from './components/MotionIntro';

export default function App() {
  // Intro State
  const [showIntro, setShowIntro] = useState(true);

  // Prevent background scroll while intro is visible
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

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
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [footerClickCount, setFooterClickCount] = useState(0);

  useEffect(() => {
    if (footerClickCount > 0) {
      const timer = setTimeout(() => setFooterClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [footerClickCount]);

  const handleFooterClick = () => {
    const newCount = footerClickCount + 1;
    setFooterClickCount(newCount);
    if (newCount === 3) {
      setIsLoginModalOpen(true);
      setFooterClickCount(0);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'abdou' && loginPassword === 'uobda8002') {
      setIsAdminView(true);
      setIsLoginModalOpen(false);
      setLoginUsername('');
      setLoginPassword('');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  // Check for admin view on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminView(true);
    }
  }, []);

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

  if (isAdminView) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col antialiased selection:bg-black selection:text-white" id="app-root">
      {/* Motion Intro Splash Screen */}
      <AnimatePresence>
        {showIntro && (
          <MotionIntro onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

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
              key="product-details-container"
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
                    <p className="text-sm md:text-base text-neutral-200 font-medium max-w-md mx-auto">
                      Courons Ensemble. Plus Forts Chaque Jour.
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
                    <span className="block text-3xl font-black text-[#0D5DF1]">50+</span>
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
                  {/* Sunday Evening */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                      <span className="text-xs font-extrabold text-[#0D5DF1] tracking-wider uppercase">Dimanche Soir</span>
                      <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md">18h30</span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-neutral-900">Séance de Renforcement</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Idéal pour renforcer l'ensemble du corps, améliorer la posture et optimiser la foulée pour la course à pied.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <span>📍</span>
                      <span>Complexe Raid Ferradj</span>
                    </div>
                  </div>

                  {/* Tuesday Evening */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                      <span className="text-xs font-extrabold text-[#0D5DF1] tracking-wider uppercase">Mardi Soir</span>
                      <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md">18h30</span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-neutral-900">Travail Fractionné</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Développez votre capacité cardio-respiratoire et gagnez en vitesse de course grâce à des entraînements par intervalles rythmés.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <span>📍</span>
                      <span>Complexe Raid Ferradj</span>
                    </div>
                  </div>

                  {/* Friday Morning */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                      <span className="text-xs font-extrabold text-[#0D5DF1] tracking-wider uppercase">Vendredi Matin</span>
                      <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md">07h30</span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-neutral-900">La Sortie Longue</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Le rendez-vous incontournable pour développer l'endurance fondamentale sur de longues distances dans une ambiance conviviale.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <span>📍</span>
                      <span>Départ Sortie Longue</span>
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

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold">Admin Login</h2>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-black text-white p-2 rounded">Login</button>
              <button type="button" onClick={() => setIsLoginModalOpen(false)} className="flex-1 bg-neutral-200 p-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
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
            <span className="text-[#0D5DF1] font-bold italic">MRC</span>
            <span>© {new Date().getFullYear()} Mosta Run Club. Tous droits réservés.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
            <span className="hidden sm:inline text-neutral-200">|</span>
            <span className="hidden sm:inline cursor-pointer" onClick={handleFooterClick}>Portail de Paiement Sandbox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
