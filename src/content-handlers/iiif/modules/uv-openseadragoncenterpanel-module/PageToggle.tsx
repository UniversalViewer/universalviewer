import React from "react";
import { OneUp, TwoUp, Gallery} from "../../../../icons/icons"

interface PageToggleProps {
  onOneUpClick: () => void;
  onTwoUpClick: () => void;
  isPaged: boolean;
  onGalleryClick: () => void;
}

const PageToggle: React.FC<PageToggleProps> = ({ onOneUpClick, onTwoUpClick, onGalleryClick, isPaged }) => {
  if (!isPaged) return null;


  return (
    <div className="osd-controls" style={{ marginLeft: "25px"}}>
      <button className="btn imageBtn one-up" onClick={onOneUpClick}>
        <OneUp aria-hidden="true" />
      </button>
      <button className="btn imageBtn two-up" onClick={onTwoUpClick}>
        <TwoUp aria-hidden="true" />
      </button>
      <button className="btn imageBtn gallery" onClick={onGalleryClick}>
        <Gallery aria-hidden="true" />
      </button>

    </div>
  );
};

export default PageToggle;