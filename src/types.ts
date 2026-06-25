/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: Color[];
  featured: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export interface CartItem {
  id: string; // Combined identifier: productId-size-colorName
  product: Product;
  selectedSize: string;
  selectedColor: Color;
  quantity: number;
}

export type SortKey = 'relevance' | 'trending' | 'price-asc' | 'price-desc';

export interface SortOption {
  key: SortKey;
  label: string;
}

export interface Category {
  slug: string;
  name: string;
}

export interface CheckoutDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}
