/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { motion } from 'motion/react';
import LogoOverlay from './LogoOverlay';

interface FeaturedGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function FeaturedGrid({ products, onSelectProduct }: FeaturedGridProps) {
  const [bgImage, setBgImage] = React.useState('/back1.png');
  // Grab the 3 featured products from our list
  const featured = products.filter((p) => p.featured).slice(0, 3);

  if (featured.length < 3) return null;

  const [largeItem, rightTopItem, rightBottomItem] = featured;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="featured-section">
      <div className="grid gap-6 md:grid-cols-6 md:grid-rows-2 h-auto md:h-[500px] lg:h-[600px]">
        {/* Large Left Item (Interactive Hero Banner with text overlay) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={() => onSelectProduct(largeItem)}
          className="relative group md:col-span-4 md:row-span-2 h-[450px] md:h-full overflow-hidden rounded-3xl border border-neutral-150 bg-neutral-100 cursor-pointer shadow-sm transition-all hover:border-neutral-300"
          id={`featured-card-${largeItem.id}`}
        >
          {/* Main scenic background image of runners */}
          <img
            src={bgImage}
            alt="Mosta Run Club"
            onError={() => setBgImage('/src/assets/images/mosta_banner_1782408639126.jpg')}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          {/* Elegant dark overlay to ensure readability of the white text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent md:from-black/75 md:via-black/30 md:to-transparent" />

          {/* Banner Overlaid Content */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-between p-8 md:p-12 z-10 max-w-lg">
            <div className="space-y-3 mt-auto md:mt-0">
              <span className="inline-block text-xs font-bold tracking-widest text-[#0D5DF1] bg-blue-50/90 px-3 py-1 rounded-md font-sans uppercase">
                Mosta Run Club
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold font-sans text-white tracking-tight leading-none">
                Run Together.<br />Stronger Every Day.
              </h1>
              <p className="text-sm text-neutral-200 font-medium leading-relaxed max-w-sm">
                Des vêtements pensés pour la performance, le confort et le style. Rejoins le club.
              </p>
              <div className="pt-2">
                <button
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0D5DF1] hover:bg-blue-600 px-6 text-xs font-semibold text-white transition-colors shadow-lg shadow-blue-500/20"
                  id="discover-collection-btn"
                >
                  Découvrir la collection
                </button>
              </div>
            </div>
          </div>

          {/* Floating White-and-Black Price Tag Pill at bottom left */}
          <div className="absolute bottom-6 left-6 md:left-12 z-20 flex items-center rounded-full border border-neutral-200/50 bg-white p-1 text-xs font-semibold text-black shadow-lg backdrop-blur-sm">
            <span className="px-3.5 py-1 font-sans text-xs tracking-tight text-neutral-800 font-bold">
              T-Shirt Performance
            </span>
            <span className="rounded-full bg-black px-3.5 py-1.5 text-[11px] font-bold text-white font-mono">
              ${largeItem.price.toFixed(2)} USD
            </span>
          </div>
        </motion.div>

        {/* Top Right Item (Casquette) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={() => onSelectProduct(rightTopItem)}
          className="relative group md:col-span-2 md:row-span-1 h-[250px] md:h-full overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-50 flex items-center justify-center cursor-pointer transition-all hover:border-neutral-200 shadow-sm p-6 md:p-8"
          id={`featured-card-${rightTopItem.id}`}
        >
          {/* Light grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 z-0" />

          {/* Centered Product Image with Logo */}
          <div className="relative w-full h-full flex items-center justify-center z-10">
            <img
              src={rightTopItem.images[0]}
              alt={rightTopItem.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <LogoOverlay
              productCategory={rightTopItem.category}
              viewType="front"
              isBlackProduct={rightTopItem.id.includes('black')}
              isPinkEdition={rightTopItem.tags.includes('pink-edition')}
              isThumbnail={true}
              skipOverlay={
                rightTopItem.images[0]?.startsWith('/tshirt') ||
                rightTopItem.images[0]?.startsWith('/csq') ||
                rightTopItem.images[0]?.startsWith('/polo')
              }
            />
          </div>

          <div className="absolute bottom-4 left-4 z-20 flex items-center rounded-full border border-neutral-200/50 bg-white p-1 text-xs font-semibold text-black shadow-md">
            <span className="px-3 py-1 font-sans text-xs tracking-tight text-neutral-800 font-bold">
              {rightTopItem.title}
            </span>
            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white font-mono">
              ${rightTopItem.price.toFixed(2)} USD
            </span>
          </div>
        </motion.div>

        {/* Bottom Right Item (Pink Logo Tee/Cap) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={() => onSelectProduct(rightBottomItem)}
          className="relative group md:col-span-2 md:row-span-1 h-[250px] md:h-full overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-50 flex items-center justify-center cursor-pointer transition-all hover:border-neutral-200 shadow-sm p-6 md:p-8"
          id={`featured-card-${rightBottomItem.id}`}
        >
          {/* Light grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 z-0" />

          {/* Centered Product Image with Logo */}
          <div className="relative w-full h-full flex items-center justify-center z-10">
            <img
              src={rightBottomItem.images[0]}
              alt={rightBottomItem.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <LogoOverlay
              productCategory={rightBottomItem.category}
              viewType="front"
              isBlackProduct={rightBottomItem.id.includes('black')}
              isPinkEdition={rightBottomItem.tags.includes('pink-edition')}
              isThumbnail={true}
              skipOverlay={
                rightBottomItem.images[0]?.startsWith('/tshirt') ||
                rightBottomItem.images[0]?.startsWith('/csq') ||
                rightBottomItem.images[0]?.startsWith('/polo')
              }
            />
          </div>

          <div className="absolute bottom-4 left-4 z-20 flex items-center rounded-full border border-neutral-200/50 bg-white p-1 text-xs font-semibold text-black shadow-md">
            <span className="px-3 py-1 font-sans text-xs tracking-tight text-neutral-800 font-bold">
              {rightBottomItem.title}
            </span>
            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white font-mono">
              ${rightBottomItem.price.toFixed(2)} USD
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
