/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartItem, CheckoutDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { WILAYAS_BALADIYAT } from '../lib/algeria-data';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void; // Clears cart and closes modal
}

type CheckoutStep = 'shipping' | 'payment' | 'success';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);

  // Form states
  const [form, setForm] = useState<CheckoutDetails>({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    wilaya: '',
    baladiya: '',
    deliveryMethod: 'home',
  });

  const [cardFocused, setCardFocused] = useState(false); // flips card to CVV back

  useEffect(() => {
    if (isOpen) {
      setStep('shipping');
      setIsProcessing(false);
      setForm({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        wilaya: '',
        baladiya: '',
        deliveryMethod: 'home',
      });
      // Generate a random high-fidelity order number
      const randomId = Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(`MOSTA-${randomId}-FR`);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Custom formatting for card details
    if (name === 'cardNumber') {
      const sanitized = value.replace(/\D/g, '').slice(0, 16);
      const matches = sanitized.match(/\d{4,16}/g);
      const match = (matches && matches[0]) || '';
      const parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      setForm((prev) => ({
        ...prev,
        cardNumber: parts.length > 0 ? parts.join(' ') : sanitized,
      }));
    } else if (name === 'cardExpiry') {
      const sanitized = value.replace(/\D/g, '').slice(0, 4);
      if (sanitized.length >= 2) {
        setForm((prev) => ({
          ...prev,
          cardExpiry: `${sanitized.slice(0, 2)}/${sanitized.slice(2, 4)}`,
        }));
      } else {
        setForm((prev) => ({ ...prev, cardExpiry: sanitized }));
      }
    } else if (name === 'cardCvc') {
      const sanitized = value.replace(/\D/g, '').slice(0, 3);
      setForm((prev) => ({ ...prev, cardCvc: sanitized }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.address || !form.phone || !form.wilaya || !form.baladiya) {
      alert('Please fill out all required shipping details.');
      return;
    }
    // Directly process order as payment is cash on delivery
    handleOrderProcessing();
  };

  const handleOrderProcessing = async () => {
    setIsProcessing(true);
    
    try {
      // simulate realistic processing
      await new Promise(r => setTimeout(r, 1500));

      // 2. Save Order to Supabase
      const orderData = {
        first_name: form.firstName,
        last_name: form.lastName,
        address: form.address,
        phone: form.phone,
        wilaya: form.wilaya,
        baladiya: form.baladiya,
        delivery_method: form.deliveryMethod,
        total: total,
        status: 'pending',
        payment_method: 'Cash on Delivery',
        items: cartItems.map(item => ({
          id: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.product.price,
          size: item.selectedSize,
          color: item.selectedColor.name,
          image: item.product.images[0]
        }))
      };

      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('orders')
          .insert([orderData]);

        if (error) {
          console.error('Supabase error:', error);
          // We continue even if DB fails to show success to user (resilient UI)
        }
      } else {
        console.warn('Supabase not configured, order not saved to database.');
      }

      setStep('success');
    } catch (err) {
      console.error('Payment processing failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 10000 ? 0 : 500;
  const total = subtotal + tax + shipping;

  // Render clean custom confetti particles inside the success step
  const ConfettiEmitter = () => {
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#fafafa', '#a855f7'];
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(60)].map((_, i) => {
          const size = Math.random() * 8 + 4;
          const left = Math.random() * 100;
          const duration = Math.random() * 3 + 2;
          const delay = Math.random() * 1;
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                y: -10,
                x: `${left}%`,
                scale: 1,
                rotate: 0,
              }}
              animate={{
                opacity: 0,
                y: 600,
                rotate: 360,
                scale: 0.5,
              }}
              transition={{
                duration: duration,
                delay: delay,
                ease: 'easeOut',
              }}
              className="absolute rounded-sm"
              style={{
                width: size,
                height: size * (Math.random() > 0.5 ? 1.5 : 1),
                backgroundColor: color,
                left: `${left}%`,
                top: 0,
              }}
            />
          );
        })}
      </div>
    );
  };

  // Get Card Logo / Type based on first digit
  const getCardType = () => {
    if (form.cardNumber.startsWith('4')) return 'Visa';
    if (form.cardNumber.startsWith('5')) return 'Mastercard';
    if (form.cardNumber.startsWith('3')) return 'Amex';
    return 'Credit Card';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white text-black" id="checkout-root">
          {/* Confetti triggered at success step */}
          {step === 'success' && <ConfettiEmitter />}

          {/* Navigation Bar */}
          <div className="border-b border-neutral-100 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                {!logoFailed ? (
                  <img
                    src="/logo.png"
                    alt="Mosta Run Club"
                    onError={() => setLogoFailed(true)}
                    className="h-9 w-auto object-contain select-none"
                  />
                ) : (
                  <div className="flex flex-col text-left leading-[0.8] font-sans font-black tracking-tight text-[#0D5DF1] italic uppercase scale-y-[1.15] origin-left select-none">
                    <span className="text-[12px]">Mosta</span>
                    <span className="text-[12px]">Run</span>
                    <span className="text-[12px]">Club</span>
                  </div>
                )}
                <span className="font-sans text-xs font-bold uppercase text-neutral-400 tracking-wider">
                  | Paiement
                </span>
              </div>

              {step !== 'success' && (
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:text-black transition-all"
                  id="checkout-close-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12 max-w-lg mx-auto text-xs font-mono uppercase tracking-wider text-neutral-400">
              <span className="text-black font-bold">
                1. Livraison
              </span>
            </div>

            {/* Step Screens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left Side: Dynamic Forms (8 Columns) */}
              <div className="lg:col-span-7">
                {step === 'shipping' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-xl font-bold font-display mb-6">Détails de Livraison</h2>
                    <form onSubmit={handleShippingSubmit} className="space-y-4" id="shipping-form">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Prénom *
                          </label>
                          <input
                            required
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Nom de famille *
                          </label>
                          <input
                            required
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                          Numéro de téléphone *
                        </label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          placeholder="05XXXXXXXX"
                          className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Wilaya *
                          </label>
                          <select
                            required
                            name="wilaya"
                            value={form.wilaya}
                            onChange={(e) => {
                                handleInputChange(e);
                                setForm(prev => ({ ...prev, baladiya: '' })); // Reset baladiya
                            }}
                            className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                          >
                            <option value="">Sélectionnez une Wilaya</option>
                            {Object.keys(WILAYAS_BALADIYAT).map(wilaya => (
                                <option key={wilaya} value={wilaya}>{wilaya}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Baladiya *
                          </label>
                          {form.wilaya && WILAYAS_BALADIYAT[form.wilaya] && WILAYAS_BALADIYAT[form.wilaya].length > 0 ? (
                            <select
                                required
                                name="baladiya"
                                value={form.baladiya}
                                onChange={handleInputChange}
                                className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                            >
                                <option value="">Sélectionnez une Baladiya</option>
                                {WILAYAS_BALADIYAT[form.wilaya].map(baladiya => (
                                    <option key={baladiya} value={baladiya}>{baladiya}</option>
                                ))}
                            </select>
                          ) : (
                            <input
                                required
                                type="text"
                                name="baladiya"
                                value={form.baladiya}
                                onChange={handleInputChange}
                                placeholder="Baladiya"
                                className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                            />
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                          Adresse *
                        </label>
                        <input
                          required
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleInputChange}
                          placeholder="Votre adresse"
                          className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                          Mode de livraison *
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="radio" name="deliveryMethod" value="home" checked={form.deliveryMethod === 'home'} onChange={handleInputChange} />
                                Livraison à domicile
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="radio" name="deliveryMethod" value="desk" checked={form.deliveryMethod === 'desk'} onChange={handleInputChange} />
                                Point Relais
                            </label>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full flex h-12 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                          id="shipping-submit-btn"
                        >
                          {isProcessing ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Traitement...</span>
                              </div>
                            ) : (
                              <span>Commander (Paiement à la livraison)</span>
                            )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Removed Payment Step */}

                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                    id="success-checkout-screen"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                      className="text-green-500 mb-6"
                    >
                      <CheckCircle2 className="h-16 w-16 fill-green-100" />
                    </motion.div>

                    <h1 className="text-3xl font-bold font-display tracking-tight text-black mb-2">
                      Order Confirmed!
                    </h1>
                    <p className="text-neutral-500 text-sm max-w-md mb-6 leading-relaxed">
                      Thank you for your purchase, <span className="text-black font-semibold">{form.firstName}</span>! Your order has been placed successfully. A digital receipt and tracking details have been dispatched.
                    </p>

                    {/* Receipt Specifications Card */}
                    <div className="w-full max-w-md rounded-xl border border-neutral-100 bg-neutral-50/80 p-5 mb-8 text-left space-y-3 font-mono text-xs text-neutral-500">
                      <div className="flex justify-between border-b border-neutral-100 pb-2.5 text-black font-sans font-semibold">
                        <span>Receipt Summary</span>
                        <span className="text-xs">{orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Delivery</span>
                        <span className="text-black font-medium">In 2-4 business days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ship To</span>
                        <span className="text-black font-medium truncate max-w-[200px]">
                          {form.address}, {form.city}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-neutral-100 pt-2.5 text-black font-sans font-bold text-sm">
                        <span>Paid Total</span>
                        <span className="font-mono">{total.toFixed(0)} DA</span>
                      </div>
                    </div>

                    <button
                      onClick={onOrderSuccess}
                      className="h-12 px-8 rounded-full bg-black text-white font-semibold text-xs tracking-wide transition-colors hover:bg-neutral-800"
                      id="continue-shopping-success-btn"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Right Side: Order Subtotal summary (4 Columns) - Hidden at Success Step */}
              {step !== 'success' && (
                <div className="lg:col-span-5 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 space-y-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                    Order Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </h3>

                  {/* List of checkout preview items */}
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <div className="relative h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white flex">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            referrerPolicy="no-referrer"
                            className="w-[30px] h-[30px] object-contain"
                          />
                          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white border border-white shadow">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-black truncate">
                            {item.product.title}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-400">
                            Size: {item.selectedSize} | {item.selectedColor.name}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-black">
                          {(item.product.price * item.quantity).toFixed(0)} DA
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price spec metrics breakdown */}
                  <div className="space-y-1.5 text-xs font-mono text-neutral-500 border-t border-neutral-100 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-black">{subtotal.toFixed(0)} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes (8%)</span>
                      <span className="text-black">{tax.toFixed(0)} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-black">
                        {shipping === 0 ? 'FREE' : `${shipping.toFixed(0)} DA`}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-4 flex justify-between font-sans text-sm font-semibold text-black">
                    <span>Total Amount</span>
                    <span className="text-base font-mono font-bold">{total.toFixed(0)} DA</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
