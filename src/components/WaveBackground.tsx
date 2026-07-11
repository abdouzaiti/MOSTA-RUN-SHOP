/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export default function WaveBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none" id="main-wave-background">
      {/* Soft Blue Glow */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.1, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut"
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(13, 93, 241, 0.3) 0%, transparent 70%)
          `,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
