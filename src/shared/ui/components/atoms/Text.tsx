import React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'small';
  children: React.ReactNode;
}

export const Text = ({ as: Component = 'p', className = '', children, ...props }: TextProps) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};
