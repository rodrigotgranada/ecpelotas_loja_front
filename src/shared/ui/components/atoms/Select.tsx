import React from 'react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export type SelectOptionProps = React.OptionHTMLAttributes<HTMLOptionElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = 'Select';

export const SelectOption = ({ children, ...props }: SelectOptionProps) => {
  return <option {...props}>{children}</option>;
};
