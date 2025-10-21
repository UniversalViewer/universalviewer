import React, { useState } from "react";

interface HeaderButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  onClick,
  title,
  label,
  disabled = false,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowTooltip(false);
    onClick(event);
  };

  return (
    <div className="header-button-container">
      <button
        className={`header-button ${disabled ? "header-button--disabled" : ""}`}
        type="button"
        onClick={handleClick}
        aria-label={label}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {children}
      </button>

      {title && (
        <div
          className={`tooltip ${showTooltip ? "tooltip-visible" : "tooltip-hidden"}`}
          role="tooltip"
        >
          {title}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default HeaderButton;
