import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', ...props }) => {
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.pageX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.pageY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);

    // Trigger the original onClick if provided
    if (onClick) onClick(event);
  };

  return (
    <button onClick={createRipple} type={type} {...props}>
      {children}
    </button>
  );
};

export default Button;
