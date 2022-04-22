import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { Maths } from "@edsilv/utils";

const DownloadDialogue = ({
  onClose,
  open,
  paged,
  parent,
  triggerButton,
}: {
  onClose: () => void;
  open: boolean;
  paged: boolean;
  parent: HTMLElement;
  triggerButton: HTMLElement;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ top: "0px", left: "0px" });
  const [arrowPosition, setArrowPosition] = useState("0px 0px");

  useEffect(() => {
    if (open) {
      const top: number =
        parent.clientHeight -
        ref.current!.clientHeight -
        triggerButton.clientHeight;

      let left: number =
        triggerButton.getBoundingClientRect().left -
        parent.getBoundingClientRect().left;

      const normalisedPos: number = Maths.normalise(
        left,
        0,
        parent.clientWidth
      );

      left =
        parent.clientWidth * normalisedPos -
        ref.current!.clientWidth * normalisedPos;

      const arrowLeft = ref.current!.clientWidth * normalisedPos;

      setPosition({ top: `${top}px`, left: `${left}px` });
      setArrowPosition(`${arrowLeft}px 0px`);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div ref={ref} className={cx("overlay download")} style={position}>
      <div className="top"></div>
      <div className="middle">
        <div className="content">
          <div role="heading" className="heading">
            Download
          </div>
          {/* <div className="nonAvailable">No download options are available</div> */}
          <ol className="options">
            <li className="group image">
              <ul>
                <li className="option">test option</li>
              </ul>
            </li>
          </ol>
        </div>
        <div className="buttons">
          <button
            type="button"
            className="btn btn-default close"
            tabIndex={0}
            onClick={() => {
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div
        className={cx("bottom")}
        style={{
          backgroundPosition: arrowPosition,
        }}
      ></div>
    </div>
  );
};

export default DownloadDialogue;
