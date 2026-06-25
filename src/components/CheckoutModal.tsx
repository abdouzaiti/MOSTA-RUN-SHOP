/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartItem, CheckoutDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';

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
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [cardFocused, setCardFocused] = useState(false); // flips card to CVV back

  useEffect(() => {
    if (isOpen) {
      setStep('shipping');
      setIsProcessing(false);
      setForm({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'United States',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
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
    if (!form.email || !form.firstName || !form.lastName || !form.address || !form.city || !form.postalCode) {
      alert('Please fill out all required shipping details.');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cardNumber || !form.cardExpiry || !form.cardCvc) {
      alert('Please fill out your card details.');
      return;
    }

    setIsProcessing(true);
    // Simulate premium payment processing gateway
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 1500);
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : 10;
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
                  | Checkout
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
              <span className={step === 'shipping' ? 'text-black font-bold' : 'text-neutral-300'}>
                1. Shipping
              </span>
              <ChevronRight className="h-3 w-3 text-neutral-200" />
              <span className={step === 'payment' ? 'text-black font-bold' : 'text-neutral-300'}>
                2. Payment
              </span>
              <ChevronRight className="h-3 w-3 text-neutral-200" />
              <span className={step === 'success' ? 'text-green-600 font-bold' : 'text-neutral-300'}>
                3. Confirmation
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
                    <h2 className="text-xl font-bold font-display mb-6">Shipping Address</h2>
                    <form onSubmit={handleShippingSubmit} className="space-y-4" id="shipping-form">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            First Name *
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
                            Last Name *
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
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleInputChange}
                          placeholder="johndoe@example.com"
                          className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                          Street Address *
                        </label>
                        <input
                          required
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleInputChange}
                          placeholder="123 Luxury Avenue, Suite 100"
                          className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            City *
                          </label>
                          <input
                            required
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Postal Code *
                          </label>
                          <input
                            required
                            type="text"
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Country *
                          </label>
                          <select
                            name="country"
                            value={form.country}
                            onChange={handleInputChange}
                            className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Germany</option>
                            <option>France</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full flex h-12 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                          id="shipping-submit-btn"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-xl font-bold font-display mb-6">Payment Method</h2>

                    {/* Highly interactive 3D style credit card */}
                    <div className="relative mx-auto w-full max-w-sm h-48 rounded-xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-6 border border-neutral-700 shadow-xl overflow-hidden mb-8">
                      {/* Grid overlay lines on the card */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]" />

                      <AnimatePresence mode="wait">
                        {!cardFocused ? (
                          // Front of the Card
                          <motion.div
                            key="front"
                            initial={{ opacity: 0, rotateY: 90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            exit={{ opacity: 0, rotateY: -90 }}
                            className="h-full flex flex-col justify-between relative z-10"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                                {getCardType()}
                              </span>
                              <CreditCard className="h-6 w-6 text-neutral-400" />
                            </div>

                            {/* Card digits display */}
                            <div className="text-lg md:text-xl font-mono tracking-widest text-white py-2">
                              {form.cardNumber || '•••• •••• •••• ••••'}
                            </div>

                            <div className="flex justify-between items-end">
                              <div>
                                <span className="block text-[8px] font-mono uppercase text-neutral-500">
                                  Cardholder
                                </span>
                                <span className="text-xs font-medium uppercase font-sans truncate max-w-[180px] block text-white">
                                  {form.firstName || form.lastName
                                    ? `${form.firstName} ${form.lastName}`
                                    : 'Your Name'}
                                </span>
                              </div>
                              <div>
                                <span className="block text-[8px] font-mono uppercase text-neutral-500">
                                  Expires
                                </span>
                                <span className="text-xs font-mono text-white">
                                  {form.cardExpiry || 'MM/YY'}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          // Back of the Card (CVV focus)
                          <motion.div
                            key="back"
                            initial={{ opacity: 0, rotateY: -90 }}
                            animate={{ opacity: 1, rotateY: 0 }}
                            exit={{ opacity: 0, rotateY: 90 }}
                            className="h-full flex flex-col justify-between relative z-10"
                          >
                            <div className="w-full h-8 bg-neutral-950 -mx-6 mt-2" />
                            <div className="flex justify-end items-center pr-4">
                              <span className="text-[8px] font-mono uppercase text-neutral-500 mr-2">
                                Security Code
                              </span>
                              <div className="bg-white text-black font-mono text-xs px-2.5 py-1 rounded">
                                {form.cardCvc || '•••'}
                              </div>
                            </div>
                            <div className="text-[8px] font-mono text-neutral-500 text-center uppercase leading-tight">
                              This card is securely simulated inside the sandbox sandbox-gateway.
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4" id="payment-form">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                          Card Number *
                        </label>
                        <input
                          required
                          type="text"
                          name="cardNumber"
                          value={form.cardNumber}
                          onChange={handleInputChange}
                          onFocus={() => setCardFocused(false)}
                          placeholder="4000 1234 5678 9010"
                          className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            Expiration Date *
                          </label>
                          <input
                            required
                            type="text"
                            name="cardExpiry"
                            value={form.cardExpiry}
                            onChange={handleInputChange}
                            onFocus={() => setCardFocused(false)}
                            placeholder="MM/YY"
                            className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                            CVC / CVV *
                          </label>
                          <input
                            required
                            type="password"
                            name="cardCvc"
                            value={form.cardCvc}
                            onChange={handleInputChange}
                            onFocus={() => setCardFocused(true)}
                            onBlur={() => setCardFocused(false)}
                            placeholder="•••"
                            className="w-full h-11 rounded-lg bg-white border border-neutral-200 px-4 text-sm text-black outline-none focus:border-neutral-400"
                          />
                        </div>
                      </div>

                      {/* Security details indicator */}
                      <div className="flex items-center gap-2 p-3.5 rounded-lg bg-neutral-50 border border-neutral-100 text-xs text-neutral-500">
                        <ShieldCheck className="h-4 w-4 text-green-600 animate-pulse" />
                        <span>Secured by 256-bit SSL encryption. This is a sandbox order checkout.</span>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep('shipping')}
                          className="w-1/3 flex h-12 items-center justify-center rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-500 hover:text-black hover:border-neutral-300"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="flex-1 flex h-12 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                          id="payment-submit-btn"
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Authorizing Securely...</span>
                            </div>
                          ) : (
                            <span>Pay ${total.toFixed(2)} USD</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

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
                      Thank you for your purchase, <span className="text-black font-semibold">{form.firstName}</span>! Your order has been placed successfully. A digital receipt and tracking details have been dispatched to <span className="text-black font-semibold">{form.email}</span>.
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
                        <span className="font-mono">${total.toFixed(2)} USD</span>
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
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price spec metrics breakdown */}
                  <div className="space-y-1.5 text-xs font-mono text-neutral-500 border-t border-neutral-100 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-black">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes (8%)</span>
                      <span className="text-black">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-black">
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-4 flex justify-between font-sans text-sm font-semibold text-black">
                    <span>Total Amount</span>
                    <span className="text-base font-mono font-bold">${total.toFixed(2)} USD</span>
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
