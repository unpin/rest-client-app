'use client';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  name: string;
  className?: string;
  disabled?: boolean;
};

export default function ButtonAction({
  type = 'button',
  onClick,
  name,
  className = '',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
}
