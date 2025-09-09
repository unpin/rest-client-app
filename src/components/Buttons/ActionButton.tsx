'use client';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
};

export default function ActionButton({
  type = 'button',
  onClick,
  label,
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
      {label}
    </button>
  );
}
