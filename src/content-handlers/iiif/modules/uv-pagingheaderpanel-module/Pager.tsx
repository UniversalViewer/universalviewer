import React, { useState, useEffect, useRef } from "react";
import { LanguageMap } from "manifesto.js";
import { ViewingDirection } from "@iiif/vocabulary/dist-commonjs/";
import { Strings } from "@edsilv/utils";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { IIIFEvents } from "../../IIIFEvents";

interface PagerProps {
  helper: any;
  extensionHost: any;
  content: any;
  options: any;
}

export const Pager: React.FC<PagerProps> = ({
  helper,
  extensionHost,
  content,
  options,
}) => {

  const [searchValue, setSearchValue] = useState<string>(
    String(helper.canvasIndex + 1)
  );
//   const [autoCompleteOptions, setAutoCompleteOptions] = useState<string[]>([]);
//   const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
  const pagerRef = useRef<HTMLDivElement>(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const [isPagerVisible, setIsPagerVisible] = useState(false);

  const viewingDirection =
    helper.getViewingDirection() || ViewingDirection.LEFT_TO_RIGHT;
    
    const isPageModeEnabled = () => Boolean(options.pageModeEnabled);

  //for development only, toggle this to show the full << < > >> buttons (could change to config setting)
  const showFullControls = true;

  useEffect(() => {
    if (isPagerVisible && pagerRef.current) {
      setMaxWidth(pagerRef.current.scrollWidth);
    }
  }, [isPagerVisible]);

  const togglePager = () => {
    setIsPagerVisible(!isPagerVisible);
  };

  // Button states
  const [firstButtonEnabled, setFirstButtonEnabled] = useState<boolean>(true);
  const [prevButtonEnabled, setPrevButtonEnabled] = useState<boolean>(true);
  const [nextButtonEnabled, setNextButtonEnabled] = useState<boolean>(true);
  const [lastButtonEnabled, setLastButtonEnabled] = useState<boolean>(true);

  useEffect(() => {
    setButtonStates();
  }, [])

  const updateSearchFieldValue = (canvasIndex) => {
    let value: string;

    if (isPageModeEnabled()) {
      //   const orderLabel = LanguageMap.getValue(canvas.getLabel());
      //   value = orderLabel === "-" ? "" : String(orderLabel);
      value = "test";
    } else {
      value = String(canvasIndex + 1);
    }

    setSearchValue(value);
  };

  extensionHost.subscribe(
    IIIFEvents.CANVAS_INDEX_CHANGE,
    (canvasIndex: number) => {
      updateSearchFieldValue(canvasIndex);
      setButtonStates();
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // if (options.autoCompleteBoxEnabled) {
    //   const results: string[] = [];

    //   for (let i = 0; i < helper.totalCanvases; i++) {
    //     const canvas = helper.getCanvasByIndex(i);

    //     if (isPageModeEnabled()) {
    //       const label = LanguageMap.getValue(canvas.getLabel());
    //       if (label && label.startsWith(value)) {
    //         results.push(String(label));
    //       }
    //     } else if (String(i + 1).startsWith(value)) {
    //       results.push(String(i + 1));
    //     }
    //   }

    //   setAutoCompleteOptions(results);
    //   setShowAutoComplete(results.length > 0 && value.length > 0);
    // }
  };

//   const handleAutoCompleteSelect = (value: string) => {
//     setSearchValue(value);
//     setShowAutoComplete(false);
//     handleSearch(value);
//   };

  const setButtonStates = () => {
    if (viewingDirection === ViewingDirection.RIGHT_TO_LEFT) {
        setFirstButtonEnabled(!helper.isLastCanvas());
        setPrevButtonEnabled(!helper.isLastCanvas());
        setNextButtonEnabled(!helper.isFirstCanvas());
        setLastButtonEnabled(!helper.isFirstCanvas());
      } else {
        setFirstButtonEnabled(!helper.isFirstCanvas());
        setPrevButtonEnabled(!helper.isFirstCanvas());
        setNextButtonEnabled(!helper.isLastCanvas());
        setLastButtonEnabled(!helper.isLastCanvas());
      }
    }

  const handleSearch = (value: string) => {
    if (!value) {
      alert(content.emptyValue);
      return;
    }

    if (isPageModeEnabled()) {
      // Search by page label
      for (let i = 0; i < helper.totalCanvases; i++) {
        const canvas = helper.getCanvasByIndex(i);
        const label = LanguageMap.getValue(canvas.getLabel());

        if (label === value) {
          helper.onCanvasIndexChange(i);
          return;
        }
      }
    } else {
      // Search by page number
      const index = parseInt(value, 10) - 1;

      if (isNaN(index) || index < 0 || index >= helper.totalCanvases) {
        alert("Invalid page number");
        return;
      }

      extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, index)
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchValue);
  };

  const getNavigationTitle = (type: "first" | "prev" | "next" | "last") => {
    if (isPageModeEnabled()) {
      if (helper.isRightToLeft()) {
        const titles = {
          first: content.lastPage,
          prev: content.nextPage,
          next: content.previousPage,
          last: content.firstPage,
        };
        return titles[type];
      } else {
        const titles = {
          first: content.firstPage,
          prev: content.previousPage,
          next: content.nextPage,
          last: content.lastPage,
        };
        return titles[type];
      }
    } else {
      if (helper.isRightToLeft()) {
        const titles = {
          first: content.lastImage,
          prev: content.nextImage,
          next: content.previousImage,
          last: content.firstImage,
        };
        return titles[type];
      } else {
        const titles = {
          first: content.firstImage,
          prev: content.previousImage,
          next: content.nextImage,
          last: content.lastImage,
        };
        return titles[type];
      }
    }
  };

  const handleNavigation = (action: "first" | "prev" | "next" | "last") => {
    const viewingDirection =
      helper.getViewingDirection() || ViewingDirection.LEFT_TO_RIGHT;

    if (viewingDirection === ViewingDirection.RIGHT_TO_LEFT) {
      switch (action) {
        case "first":
          extensionHost.publish(IIIFEvents.LAST);
          break;
        case "prev":
          extensionHost.publish(IIIFEvents.NEXT);
          break;
        case "next":
          extensionHost.publish(IIIFEvents.PREV);
          break;
        case "last":
          extensionHost.publish(IIIFEvents.FIRST);
          break;
      }
    } else {
      switch (action) {
        case "first":
          extensionHost.publish(IIIFEvents.FIRST);
          break;
        case "prev":
          extensionHost.publish(IIIFEvents.PREV);
          break;
        case "next":
          extensionHost.publish(IIIFEvents.NEXT);
          break;
        case "last":
          extensionHost.publish(IIIFEvents.LAST);
          break;
      }
    }
  };

  const getTotalLabel = () => {
    if (isPageModeEnabled()) {
      return Strings.format(content.of, helper.getLastCanvasLabel(true));
    } else {
      return Strings.format(content.of, helper.getTotalCanvases().toString());
    }
  };

  // Only show pager if there are multiple canvases
  if (helper.getTotalCanvases() <= 1) {
    return null;
  }

  return (
    <>
      <HeaderButton
        onClick={togglePager}
        label={isPagerVisible ? "Hide pager" : "Show pager"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 30"
          width="30"
          height="30"
          fill="white"
        >
          <path d="M2 2.5L15 15L2 27.5V2.5Z" />
          <path d="M15 2.5L28 15L15 27.5V2.5Z" />
        </svg>
      </HeaderButton>
      <div
    //   fix the 'ahidden' thing
        className={`pager-container ${isPagerVisible ? "avisible" : "ahidden"}`}
        ref={pagerRef}
        style={{
          maxWidth: isPagerVisible ? `${maxWidth}px` : "0",
          opacity: isPagerVisible ? 1 : 0,
        }}
      >
        <div className="pager">
          <div style={{ display: showFullControls ? "block" : "none" }}>
            <HeaderButton
              onClick={() => handleNavigation("first")}
              label={getNavigationTitle("first")}
              disabled={!firstButtonEnabled}
            >
              &lt;&lt;
            </HeaderButton>

            <HeaderButton
              onClick={() => handleNavigation("prev")}
              label={getNavigationTitle("prev")}
              disabled={!prevButtonEnabled}
            >
              &lt;
            </HeaderButton>
          </div>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                value={searchValue}
                onChange={handleSearchChange}
                aria-label={content.pageSearchLabel}
                maxLength={30}
                style={{width: "6ch"}}
              />

              {/* {showAutoComplete && options.autoCompleteBoxEnabled && (
                <ul className="autocomplete-dropdown">
                  {autoCompleteOptions.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => handleAutoCompleteSelect(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )} */}

              <span className="total-label">{getTotalLabel()}</span>
            </div>
          </form>
          <div style={{ display: showFullControls ? "block" : "none" }}>
            <HeaderButton
              onClick={() => handleNavigation("next")}
              label={getNavigationTitle("next")}
              disabled={!nextButtonEnabled}
            >
              &gt;&gt;
            </HeaderButton>

            <HeaderButton
              onClick={() => handleNavigation("last")}
              label={getNavigationTitle("last")}
              disabled={!lastButtonEnabled}
            >
              &gt;
            </HeaderButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pager;
