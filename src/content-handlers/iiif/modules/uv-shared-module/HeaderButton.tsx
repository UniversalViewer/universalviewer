import React from "react";

interface HeaderButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  onClick,
  label,
  disabled = false,
  children,
}) => {
  return (
    <button
      className={`header-button ${disabled ? "header-button--disabled" : ""}`}
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default HeaderButton;
