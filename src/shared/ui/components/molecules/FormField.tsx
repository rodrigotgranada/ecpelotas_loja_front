import React from 'react';

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField = ({ label, error, required, children }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
        {label}
        {required && <span className="text-[#ea580c] ml-1">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-[#ea580c] font-medium">{error}</span>}
    </div>
  );
};
