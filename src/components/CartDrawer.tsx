/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxRate = 0.08; // 8% sales tax
  const estimatedTax = subtotal * taxRate;
  const shippingThreshold = 100;
  const shippingCost = subtotal === 0 ? 0 : subtotal >= shippingThreshold ? 0 : 10;
  const total = subtotal + estimatedTax + shippingCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlays */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            id="cart-backdrop"
          />

          {/* Sliding Cart Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-white border-l border-neutral-100 sm:max-w-md shadow-2xl"
            id="cart-drawer"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-neutral-100 px-6">
              <h2 className="text-base font-semibold text-black tracking-wide font-sans">
                Shopping Cart
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:text-black hover:border-neutral-300 transition-all focus:outline-none"
                id="close-cart-btn"
                aria-label="Close Cart"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cart Body (Scrollable items or empty state) */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 border border-neutral-200 text-neutral-500 mb-4">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-black mb-1">Your cart is empty</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
                    Looks like you haven't added anything to your cart yet. Let's find some premium items.
                  </p>
                  <button
                    onClick={onClose}
                    className="h-10 px-5 rounded-full bg-black text-white font-semibold text-xs transition-colors hover:bg-neutral-800"
                    id="cart-start-shopping-btn"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4" id="cart-items-list">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-3 rounded-xl border border-neutral-100 bg-neutral-50/60"
                      id={`cart-item-card-${item.id}`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-white flex">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-[45px] h-[45px] object-contain"
                        />
                      </div>

                      {/* Details Column */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-semibold text-black truncate font-sans">
                              {item.product.title}
                            </h4>
                            <span className="text-xs font-mono font-bold text-black whitespace-nowrap">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {/* Selected Attributes badge row */}
                          <div className="mt-1 flex flex-wrap gap-1.5 items-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-500 bg-white border border-neutral-200 rounded px-1.5 py-0.5">
                              Size: {item.selectedSize}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-500 bg-white border border-neutral-200 rounded px-1.5 py-0.5">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              {item.selectedColor.name}
                            </span>
                          </div>
                        </div>

                        {/* Quantity adjust and delete row */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-neutral-200 bg-white h-7 px-1">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="text-neutral-400 hover:text-black p-1"
                              id={`cart-qty-minus-${item.id}`}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-mono font-medium text-neutral-800 px-2 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="text-neutral-400 hover:text-black p-1"
                              id={`cart-qty-plus-${item.id}`}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-neutral-400 hover:text-red-500 p-1"
                            id={`cart-item-remove-${item.id}`}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer Specifications */}
            {cartItems.length > 0 && (
              <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-6 space-y-4">
                <div className="space-y-1.5 text-xs font-mono text-neutral-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-black">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Taxes (8%)</span>
                    <span className="text-black">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-black">
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-[10px] text-neutral-400 mt-1 leading-normal text-right">
                      Add <span className="text-neutral-800 font-bold">${(shippingThreshold - subtotal).toFixed(2)}</span> more to unlock Free Shipping!
                    </p>
                  )}
                </div>

                <div className="border-t border-neutral-100 pt-3 flex justify-between font-sans text-sm font-semibold text-black">
                  <span>Total</span>
                  <span className="text-base font-mono font-bold">${total.toFixed(2)} USD</span>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  className="mt-2 flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-black text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                  id="cart-checkout-btn"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
