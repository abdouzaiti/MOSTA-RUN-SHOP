/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, SortOption } from './types';

export const CATEGORIES: Category[] = [
  { slug: 'all', name: 'All' },
  { slug: 't-shirts', name: 'T-Shirts' },
  { slug: 'polos', name: 'Polos' },
  { slug: 'caps', name: 'Caps' },
  { slug: 'collections', name: 'Collections' },
  { slug: 'about', name: 'About' },
];

export const SORT_OPTIONS: SortOption[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'trending', label: 'Trending' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'mosta-tshirt-white-blue',
    title: 'T-Shirt White - Blue',
    description: 'Le T-Shirt officiel du Mosta Run Club en coloris White & Blue. Conçu spécialement pour la performance et le style quotidien. Fabriqué dans un tissu technique ultra-léger, respirant et anti-transpiration, avec le petit logo "MOSTA RUN CLUB" imprimé sur le torse gauche et l\'imposante signature iconique imprimée en bleu de performance sur tout le dos. Coupe athlétique moderne, coutures plates anti-irritations, bande de propreté personnalisée au col et insert réfléchissant de sécurité à l\'arrière du cou.',
    price: 3500,
    currency: 'DA',
    images: [
      '/tshirtwhitebl.png'
    ],
    category: 't-shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White / Blue Logo', hex: '#ffffff' }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 182,
    tags: ['T-Shirt', 'Performance', 'White', 'Blue Edition', 'blue-edition'],
  },
  {
    id: 'mosta-casquette-black-blue',
    title: 'Casquette Black - Blue',
    description: 'La casquette de running ajustable officielle Mosta Run Club Blue Edition. Conçue avec un tissu ultra-léger et respirant pour vous garder au sec et protéger vos yeux lors des runs ensoleillés. Arbore fièrement le logo officiel du club brodé en bleu roi sur le devant. Système d\'attache ajustable à l\'arrière pour s\'adapter parfaitement à toutes les morphologies de têtes.',
    price: 2800,
    currency: 'DA',
    images: [
      '/csqblcbl.png'
    ],
    category: 'caps',
    sizes: ['One Size'],
    colors: [
      { name: 'Black / Blue Logo', hex: '#111111' }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 215,
    tags: ['Casquette', 'Cap', 'Accessory', 'Black', 'Blue Edition', 'blue-edition'],
  },
  {
    id: 'mosta-casquette-black-pink',
    title: 'Casquette Black - Pink',
    description: 'La casquette de running ajustable officielle Mosta Run Club Pink Edition. Conçue avec les mêmes spécifications techniques de légereté et de respirabilité. Arbore fièrement le logo officiel du club brodé dans un coloris rose vif éclatant sur le devant. Système d\'attache ajustable haut de gamme à l\'arrière.',
    price: 2800,
    currency: 'DA',
    images: [
      '/csqblcpk.png'
    ],
    category: 'caps',
    sizes: ['One Size'],
    colors: [
      { name: 'Black / Pink Logo', hex: '#111111' }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 198,
    tags: ['Casquette', 'Cap', 'Accessory', 'Black', 'Pink Edition', 'pink-edition'],
  },
  {
    id: 'mosta-casquette-white-blue',
    title: 'Casquette White - Blue',
    description: 'La casquette de running ajustable officielle Mosta Run Club Blue Edition en coloris blanc. Conçue avec un tissu technique ultra-léger et respirant pour un confort optimal pendant l\'effort. Arbore fièrement le logo officiel du club en bleu royal sur le devant.',
    price: 2800,
    currency: 'DA',
    images: [
      '/csqwhitebl.png'
    ],
    category: 'caps',
    sizes: ['One Size'],
    colors: [
      { name: 'White / Blue Logo', hex: '#ffffff' }
    ],
    featured: false,
    rating: 4.8,
    reviewsCount: 89,
    tags: ['Casquette', 'Cap', 'Accessory', 'White', 'Blue Edition', 'blue-edition'],
  },
  {
    id: 'mosta-casquette-white-pink',
    title: 'Casquette White - Pink',
    description: 'La casquette de running ajustable officielle Mosta Run Club Pink Edition en coloris blanc. Légère, aérée et extrêmement respirante, avec le logo officiel "MOSTA RUN CLUB" brodé en rose vif éclatant sur le devant.',
    price: 2800,
    currency: 'DA',
    images: [
      '/csqwhitepk.png'
    ],
    category: 'caps',
    sizes: ['One Size'],
    colors: [
      { name: 'White / Pink Logo', hex: '#ffffff' }
    ],
    featured: false,
    rating: 4.9,
    reviewsCount: 94,
    tags: ['Casquette', 'Cap', 'Accessory', 'White', 'Pink Edition', 'pink-edition'],
  },
  {
    id: 'mosta-tshirt-black-blue',
    title: 'T-Shirt Black - Blue',
    description: 'Le T-Shirt officiel du Mosta Run Club en coloris Black & Blue. Idéal pour l\'entraînement intensif ou pour vos runs de nuit. Confectionné dans un tissu technique de qualité supérieure avec une régulation active de la transpiration. Présente le petit logo imprimé en bleu performance sur la poitrine gauche et l\'imposante signature iconique "MOSTA RUN CLUB" dans le dos.',
    price: 3500,
    currency: 'DA',
    images: [
      '/tshirtblackbl.png'
    ],
    category: 't-shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black / Blue Logo', hex: '#111111' }
    ],
    featured: false,
    rating: 4.8,
    reviewsCount: 142,
    tags: ['T-Shirt', 'Performance', 'Black', 'Blue Edition', 'blue-edition'],
  },
  {
    id: 'mosta-tshirt-white-pink',
    title: 'T-Shirt White - Pink',
    description: 'Le T-Shirt officiel du Mosta Run Club en coloris White & Pink. Conçu spécialement pour allier performance technique et style coloré unique. Tissu respirant haut de gamme avec le petit logo imprimé en rose vif sur le torse gauche et l\'imposante signature iconique imprimée en rose sur tout le dos. Coupe athlétique moderne.',
    price: 3500,
    currency: 'DA',
    images: [
      '/tshirtwhitepk.png'
    ],
    category: 't-shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White / Pink Logo', hex: '#ffffff' }
    ],
    featured: false,
    rating: 4.9,
    reviewsCount: 135,
    tags: ['T-Shirt', 'Performance', 'White', 'Pink Edition', 'pink-edition'],
  },
  {
    id: 'mosta-tshirt-black-pink',
    title: 'T-Shirt Black - Pink',
    description: 'Le T-Shirt officiel du Mosta Run Club en coloris Black & Pink. Une magnifique alliance entre l\'élégance du noir profond et l\'éclat du logo rose vif. Tissu technique léger et confortable qui évacue l\'humidité. Petit logo sur la poitrine gauche et grand logo de club au dos.',
    price: 3500,
    currency: 'DA',
    images: [
      '/tshirtblackpk.png'
    ],
    category: 't-shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black / Pink Logo', hex: '#111111' }
    ],
    featured: false,
    rating: 4.8,
    reviewsCount: 124,
    tags: ['T-Shirt', 'Performance', 'Black', 'Pink Edition', 'pink-edition'],
  },
  {
    id: 'mosta-polo-white-blue',
    title: 'Polo White - Blue',
    description: 'Le polo premium officiel du Mosta Run Club en blanc piqué et logo bleu. Idéal pour l\'après-course, les événements officiels ou pour afficher un look décontracté élégant au quotidien. Confectionné dans une maille piquée respirante de coton de qualité supérieure ultra-doux avec écusson du club brodé en bleu roi sur la poitrine gauche. Col boutonné classique et finitions côtelées.',
    price: 4900,
    currency: 'DA',
    images: [
      '/polowhitebl.png'
    ],
    category: 'polos',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White / Blue Embroidery', hex: '#ffffff' }
    ],
    featured: false,
    rating: 4.8,
    reviewsCount: 84,
    tags: ['Polo', 'Pique', 'White', 'Blue Edition', 'blue-edition'],
  },
  {
    id: 'mosta-polo-black-blue',
    title: 'Polo Black - Blue',
    description: 'Le polo premium officiel du Mosta Run Club en noir piqué et logo bleu. Coupe moderne élégante près du corps. Confectionné dans une maille piquée haut de gamme douce et respirante. Écusson officiel brodé avec précision en bleu de performance sur le cœur. Idéal pour représenter le club avec distinction.',
    price: 4900,
    currency: 'DA',
    images: [
      '/poloblackbl.png'
    ],
    category: 'polos',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black / Blue Embroidery', hex: '#111111' }
    ],
    featured: false,
    rating: 4.8,
    reviewsCount: 92,
    tags: ['Polo', 'Pique', 'Black', 'Blue Edition', 'blue-edition'],
  },
  {
    id: 'mosta-polo-white-pink',
    title: 'Polo White - Pink',
    description: 'Le polo premium officiel du Mosta Run Club en blanc piqué et logo rose. Confectionné dans une maille piquée haut de gamme respirante pour un confort absolu. Présente l\'écusson officiel du club délicatement brodé en rose vif éclatant sur la poitrine gauche pour un style moderne incomparable.',
    price: 4900,
    currency: 'DA',
    images: [
      '/polowhitepk.png'
    ],
    category: 'polos',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White / Pink Embroidery', hex: '#ffffff' }
    ],
    featured: false,
    rating: 4.7,
    reviewsCount: 76,
    tags: ['Polo', 'Pique', 'White', 'Pink Edition', 'pink-edition'],
  },
  {
    id: 'mosta-polo-black-pink',
    title: 'Polo Black - Pink',
    description: 'Le polo premium officiel du Mosta Run Club en noir piqué et logo rose. Confectionné dans une maille piquée haut de gamme ultra-douce et respirante. Écusson officiel brodé avec précision en rose vif éclatant sur le cœur. L\'alliance ultime de l\'élégance et de l\'esprit d\'équipe.',
    price: 4900,
    currency: 'DA',
    images: [
      '/poloblackpk.png'
    ],
    category: 'polos',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black / Pink Embroidery', hex: '#111111' }
    ],
    featured: false,
    rating: 4.8,
    reviewsCount: 81,
    tags: ['Polo', 'Pique', 'Black', 'Pink Edition', 'pink-edition'],
  }
];
