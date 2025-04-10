import React, { useState } from "react";

interface HeaderButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  children: React.ReactNode;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  onClick,
  title,
  children
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    setShowTooltip(false);
    onClick();
  };

  return (
    <button
      className="header-button"
      type="button"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
};

export default HeaderButton;