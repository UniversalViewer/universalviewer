import React, { useEffect, useRef, useState } from "react";
import { Thumb } from "manifesto.js";
import { ViewingDirection, ViewingHint } from "@iiif/vocabulary";
import { useInView } from "react-intersection-observer";
import cx from "classnames";

const ThumbImage = ({
  first,
  onClick,
  paged,
  selected,
  thumb,
  viewingDirection,
}: {
  first: boolean;
  onClick: (thumb: Thumb) => void;
  paged: boolean;
  selected: boolean;
  thumb: Thumb;
  viewingDirection: ViewingDirection;
}) => {
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: "0px 0px 0px 0px",
    triggerOnce: true,
  });

  return (
    <div
      onClick={() => onClick(thumb)}
      className={cx("thumb", {
        first: first,
        placeholder: !thumb.uri,
        twoCol:
          paged &&
          (viewingDirection === ViewingDirection.LEFT_TO_RIGHT ||
            viewingDirection === ViewingDirection.RIGHT_TO_LEFT),
        oneCol: !paged,
        selected: selected,
      })}
      tabIndex={0}
    >
      <div
        ref={ref}
        className="wrap"
        style={{
          height: thumb.height + 8 + "px",
        }}
      >
        {inView && <img src={thumb.uri} alt={thumb.label} />}
      </div>
      <div className="info">
        <span className="label" title={thumb.label}>
          {thumb.label}&nbsp;
        </span>
        {thumb.data.searchResults && (
          <span className="searchResults">{thumb.data.searchResults}</span>
        )}
      </div>
    </div>
  );
};

const Thumbnails = ({
  onClick,
  paged,
  selected,
  thumbs,
  viewingDirection,
}: {
  onClick: (thumb: Thumb) => void;
  paged: boolean;
  selected: number[];
  thumbs: Thumb[];
  viewingDirection: ViewingDirection;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [extendLabels, setExtendLabels] = useState(false);
  const [shouldShowCheckbox, setShouldShowCheckbox] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        const thumbLabels = ref.current.querySelectorAll('.thumb .info .label');
        let overflowDetected = false;
  
        thumbLabels.forEach((label) => {
          if (label.scrollWidth > label.clientWidth) {
            overflowDetected = true;
            return;
          }
        });
  
        setShouldShowCheckbox(overflowDetected);
      } else {
        setShouldShowCheckbox(false);
      }
    };
  
    
    checkOverflow();
  
    
  
    
    return () => {
      
    };
  }, [thumbs]);  
  

  useEffect(() => {
    const thumb: HTMLElement = ref.current?.querySelector(
      `#thumb-${selected[0]}`
    ) as HTMLElement;
    const y: number = thumb?.offsetTop;
    ref.current?.parentElement!.scrollTo({
      top: y,
      left: 0,
      behavior: "smooth",
    });
  }, [selected]);

  function showSeparator(
    paged: boolean,
    viewingHint: ViewingHint | null,
    index: number
  ) {
    if (viewingHint === ViewingHint.NON_PAGED) {
      return true;
    }

    if (paged) {
      return !((index - 1) % 2 === 0);
    }

    return true;
  }

  const firstNonPagedIndex: number = thumbs.findIndex((t) => {
    return t.viewingHint !== ViewingHint.NON_PAGED;
  });

  return (
    <div>
      {shouldShowCheckbox && (
        <div>
          <label htmlFor="extendLabelsCheckbox">Show full labels </label>
          <input
            type="checkbox"
            id="extendLabelsCheckbox"
            checked={extendLabels}
            onChange={(e) => setExtendLabels(e.target.checked)}
          />
        </div>
      )}
      <div
        ref={ref}
        className={cx("thumbs", {
          "extend-labels": extendLabels,
          "left-to-right": viewingDirection === ViewingDirection.LEFT_TO_RIGHT,
          "right-to-left": viewingDirection === ViewingDirection.RIGHT_TO_LEFT,
          paged: paged,
        })}
      >
        {thumbs.map((thumb, index) => (
          <span key={`thumb-${index}`} id={`thumb-${index}`}>
            <ThumbImage
              first={index === firstNonPagedIndex}
              onClick={onClick}
              paged={paged}
              selected={selected.includes(index)}
              thumb={thumb}
              viewingDirection={viewingDirection}
            />
            {showSeparator(paged, thumb.viewingHint, index) && (
              <div className="separator"></div>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Thumbnails;
