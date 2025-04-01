import React from "react";

interface HeaderButtonProps {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  onClick,
  label,
  children,
}) => {
  return (
    <button
      className="header-button"
      type="button"
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </button>
  );
};

export default HeaderButton;
