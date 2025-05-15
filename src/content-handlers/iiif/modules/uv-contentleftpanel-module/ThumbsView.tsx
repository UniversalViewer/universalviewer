import { ViewingDirection, ViewingHint } from "@iiif/vocabulary";
import cx from "classnames";
import { Thumb } from "manifesto.js";
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

const ThumbImage = ({
  first,
  onClick,
  onKeyDown,
  paged,
  selected,
  thumb,
  truncateThumbnailLabels,
  viewingDirection,
}: {
  first: boolean;
  onClick: (thumb: Thumb) => void;
  onKeyDown: (thumb: Thumb) => void;
  paged: boolean;
  selected: boolean;
  thumb: Thumb;
  truncateThumbnailLabels: boolean;
  viewingDirection: ViewingDirection;
}) => {
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: "0px 0px 0px 0px",
    triggerOnce: true,
  });

  var keydownHandler = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onKeyDown(thumb);
    }
  };
  return (
    <div
      onClick={() => onClick(thumb)}
      onKeyDown={keydownHandler}
      className={cx("thumb", {
        first: first,
        placeholder: !thumb.uri,
        twoCol:
          paged &&
          (viewingDirection === ViewingDirection.LEFT_TO_RIGHT ||
            viewingDirection === ViewingDirection.RIGHT_TO_LEFT),
        oneCol: !paged,
        selected: selected,
        "truncate-labels": truncateThumbnailLabels,
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
          {thumb.label}
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
  onKeyDown,
  paged,
  selected,
  thumbs,
  viewingDirection,
  truncateThumbnailLabels,
}: {
  onClick: (thumb: Thumb) => void;
  onKeyDown: (thumb: Thumb) => void;
  paged: boolean;
  selected: number[];
  thumbs: Thumb[];
  viewingDirection: ViewingDirection;
  truncateThumbnailLabels: boolean;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

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
      // if paged, show separator after every 2 thumbs
      return !((index - 1) % 2 === 0);
    }

    return true;
  }

  const firstNonPagedIndex: number = thumbs.findIndex((t) => {
    return t.viewingHint !== ViewingHint.NON_PAGED;
  });

  return (
    <div
      ref={ref}
      className={cx("thumbs", {
        "left-to-right": viewingDirection === ViewingDirection.LEFT_TO_RIGHT,
        "right-to-left": viewingDirection === ViewingDirection.RIGHT_TO_LEFT,
        paged: paged,
        "truncate-labels": truncateThumbnailLabels,
      })}
    >
      {thumbs.map((thumb, index) => (
        <span
          key={`thumb-${index}`}
          id={`thumb-${index}`}
          className="thumb-container"
        >
          <ThumbImage
            first={index === firstNonPagedIndex}
            onClick={onClick}
            onKeyDown={onKeyDown}
            paged={paged}
            selected={selected.includes(index)}
            thumb={thumb}
            truncateThumbnailLabels={truncateThumbnailLabels}
            viewingDirection={viewingDirection}
          />
          {showSeparator(paged, thumb.viewingHint, index) && (
            <div className="separator"></div>
          )}
        </span>
      ))}
    </div>
  );
};

export default Thumbnails;
