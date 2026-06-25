/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface LogoOverlayProps {
  productCategory: string;
  viewType: 'front' | 'back';
  isBlackProduct: boolean;
  isPinkEdition: boolean;
  className?: string;
  isThumbnail?: boolean;
  skipOverlay?: boolean;
}

export default function LogoOverlay({
  productCategory,
  viewType,
  isBlackProduct,
  isPinkEdition,
  className = '',
  isThumbnail = false,
  skipOverlay = false,
}: LogoOverlayProps) {
  const [hasError, setHasError] = useState(false);

  if (skipOverlay) {
    return null;
  }

  // Helper to determine the text color of the fallback logo
  const getFallbackColorClass = () => {
    if (isPinkEdition) return 'text-[#FF2A85]';
    return 'text-[#0D5DF1]';
  };

  if (hasError) {
    const textColorClass = getFallbackColorClass();

    if (productCategory === 'caps') {
      return (
        <div 
          className={`absolute flex flex-col text-center leading-[0.8] font-sans font-black tracking-tighter uppercase scale-y-[1.1] select-none ${textColorClass} ${className}`}
          style={{
            top: isThumbnail ? '44%' : '43%',
            left: '50%',
            transform: `translateX(-50%) rotate(-4deg) scale(${isThumbnail ? 0.5 : 1.15})`,
            fontSize: '8px',
          }}
        >
          <span>MOSTA</span>
          <span>RUN</span>
          <span>CLUB</span>
        </div>
      );
    }

    if (productCategory === 't-shirts') {
      if (viewType === 'back') {
        return (
          <div 
            className={`absolute flex flex-col text-center leading-[0.8] font-sans font-black tracking-tighter uppercase scale-y-[1.15] select-none ${textColorClass} ${className}`}
            style={{
              top: isThumbnail ? '33%' : '32%',
              left: '50%',
              transform: `translateX(-50%) scale(${isThumbnail ? 0.7 : 1.8})`,
              fontSize: '12px',
              width: '100%',
            }}
          >
            <span>MOSTA</span>
            <span>RUN</span>
            <span>CLUB</span>
          </div>
        );
      } else {
        // Front - Left Chest (right side of flat-lay image)
        return (
          <div 
            className={`absolute flex flex-col text-left leading-[0.8] font-sans font-black tracking-tighter uppercase scale-y-[1.1] select-none ${textColorClass} ${className}`}
            style={{
              top: isThumbnail ? '39%' : '38%',
              left: isThumbnail ? '57%' : '58%',
              transform: `scale(${isThumbnail ? 0.45 : 0.85})`,
              fontSize: '10px',
            }}
          >
            <span>MOSTA</span>
            <span>RUN</span>
            <span>CLUB</span>
          </div>
        );
      }
    }

    if (productCategory === 'polos') {
      return (
        <div 
          className={`absolute flex flex-col text-left leading-[0.8] font-sans font-black tracking-tighter uppercase scale-y-[1.1] select-none ${textColorClass} ${className}`}
          style={{
            top: isThumbnail ? '41%' : '40%',
            left: isThumbnail ? '55%' : '56%',
            transform: `scale(${isThumbnail ? 0.4 : 0.75})`,
            fontSize: '10px',
          }}
        >
          <span>MOSTA</span>
          <span>RUN</span>
          <span>CLUB</span>
        </div>
      );
    }

    return null;
  }

  // If logo loaded successfully, render the real logo.png!
  // To make it fit the colors (Blue Edition vs Pink Edition), we can apply CSS filters if it's pink edition.
  const filterStyle: React.CSSProperties = {};
  if (isPinkEdition) {
    // Transform blue to hot pink using CSS filters
    filterStyle.filter = 'hue-rotate(130deg) saturate(2.5) brightness(0.9)';
  } else {
    // Keep blue or default
  }

  const mixBlendMode = isBlackProduct ? 'screen' : 'multiply';

  if (productCategory === 'caps') {
    return (
      <img
        src="/logo.png"
        alt="Mosta Logo"
        onError={() => setHasError(true)}
        style={{
          position: 'absolute',
          top: isThumbnail ? '43%' : '42%',
          left: '50%',
          transform: `translateX(-50%) rotate(-4deg) scale(${isThumbnail ? 0.6 : 1.25})`,
          width: isThumbnail ? '14%' : '24%',
          height: 'auto',
          mixBlendMode: mixBlendMode,
          opacity: 0.95,
          ...filterStyle
        }}
        className={`z-20 pointer-events-none select-none ${className}`}
      />
    );
  }

  if (productCategory === 't-shirts') {
    if (viewType === 'back') {
      return (
        <img
          src="/logo.png"
          alt="Mosta Logo Back"
          onError={() => setHasError(true)}
          style={{
            position: 'absolute',
            top: isThumbnail ? '32%' : '30%',
            left: '50%',
            transform: `translateX(-50%) scale(${isThumbnail ? 0.8 : 1.95})`,
            width: isThumbnail ? '18%' : '30%',
            height: 'auto',
            mixBlendMode: mixBlendMode,
            opacity: 0.95,
            ...filterStyle
          }}
          className={`z-20 pointer-events-none select-none ${className}`}
        />
      );
    } else {
      return (
        <img
          src="/logo.png"
          alt="Mosta Logo Front"
          onError={() => setHasError(true)}
          style={{
            position: 'absolute',
            top: isThumbnail ? '38%' : '37%',
            left: isThumbnail ? '56%' : '58%',
            transform: `scale(${isThumbnail ? 0.5 : 0.95})`,
            width: isThumbnail ? '8%' : '14%',
            height: 'auto',
            mixBlendMode: mixBlendMode,
            opacity: 0.95,
            ...filterStyle
          }}
          className={`z-20 pointer-events-none select-none ${className}`}
        />
      );
    }
  }

  if (productCategory === 'polos') {
    return (
      <img
        src="/logo.png"
        alt="Mosta Logo Polo"
        onError={() => setHasError(true)}
        style={{
          position: 'absolute',
          top: isThumbnail ? '40%' : '39%',
          left: isThumbnail ? '54%' : '56%',
          transform: `scale(${isThumbnail ? 0.45 : 0.85})`,
          width: isThumbnail ? '7%' : '12%',
          height: 'auto',
          mixBlendMode: mixBlendMode,
          opacity: 0.95,
          ...filterStyle
        }}
        className={`z-20 pointer-events-none select-none ${className}`}
      />
    );
  }

  return null;
}
