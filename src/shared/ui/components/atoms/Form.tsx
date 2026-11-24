import React from 'react';

export type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

export const Form = ({ className = '', children, ...props }: FormProps) => {
  return (
    <form className={className} {...props}>
      {children}
    </form>
  );
};
