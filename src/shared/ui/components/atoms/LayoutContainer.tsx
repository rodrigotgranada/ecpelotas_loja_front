import React from 'react';

export interface LayoutContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'main' | 'header' | 'footer' | 'nav' | 'article' | 'aside';
  children?: React.ReactNode;
}

export const LayoutContainer = ({
  as: Component = 'div',
  className = '',
  children,
  ...props
}: LayoutContainerProps) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};
