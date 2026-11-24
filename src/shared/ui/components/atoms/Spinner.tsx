import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ text }: { text?: string }) => (
  <div className="flex items-center justify-center gap-2.5 text-sm text-text-secondary py-6">
    <Loader2 className="w-5 h-5 animate-spin text-primary" />
    {text && <span>{text}</span>}
  </div>
);
