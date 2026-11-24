'use client';

import React, { useState } from 'react';
import { Package } from 'lucide-react';

export interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export const SafeImage = ({ src, alt, className = '' }: SafeImageProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-background/80 text-text-secondary ${className}`}>
        <Package className="w-8 h-8 opacity-40" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
