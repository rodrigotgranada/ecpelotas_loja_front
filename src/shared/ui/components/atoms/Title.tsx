import React from 'react';

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  children: React.ReactNode;
}

export const Title = ({ level: Tag = 'h2', className = '', children, ...props }: TitleProps) => {
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};
