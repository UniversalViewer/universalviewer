import React from "react";

interface PageToggleProps {
  onOneUpClick: () => void;
  onTwoUpClick: () => void;
  isPaged: boolean;
  onGalleryClick: () => void;
}

const PageToggle: React.FC<PageToggleProps> = ({ onOneUpClick, onTwoUpClick, onGalleryClick, isPaged }) => {
  if (!isPaged) return null;


  return (
    <div className="osd-controls" style={{ marginLeft: "30px" }}>
      <button className="btn imageBtn one-up" onClick={onOneUpClick}>
        <i className="uv-icon-one-up" aria-hidden="true"></i>
      </button>

      <button className="btn imageBtn two-up" onClick={onTwoUpClick}>
        <i className="uv-icon-two-up" aria-hidden="true"></i>
      </button>
      <button className="btn imageBtn gallery" onClick={onGalleryClick}>
        <i className="uv-icon-gallery" aria-hidden="true"></i>
      </button>

    </div>
  );
};

export default PageToggle;