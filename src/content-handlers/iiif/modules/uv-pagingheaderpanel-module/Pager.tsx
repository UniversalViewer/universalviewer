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
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<string[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const [isPagerVisible, setIsPagerVisible] = useState(false);
  const [lastValidValue, setLastValidValue] = useState<string>(
    String(helper.canvasIndex + 1)
  );
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const [firstButtonEnabled, setFirstButtonEnabled] = useState<boolean>(true);
  const [prevButtonEnabled, setPrevButtonEnabled] = useState<boolean>(true);
  const [nextButtonEnabled, setNextButtonEnabled] = useState<boolean>(true);
  const [lastButtonEnabled, setLastButtonEnabled] = useState<boolean>(true);

  const dropdownRef = useRef<HTMLUListElement>(null);
  const pagerRef = useRef<HTMLDivElement>(null);

  const viewingDirection =
    helper.getViewingDirection() || ViewingDirection.LEFT_TO_RIGHT;
  const isPageModeEnabled = () => Boolean(options.pageModeEnabled);

  //for development only, toggle this to show the full << < > >> buttons (could change to config setting)
  const showFullControls = false;
  const inputWidth = "6ch"; //set this dynamically based on character length of longest canvas index/label

  useEffect(() => {
    if (focusedOptionIndex >= 0 && dropdownRef.current) {
      const focusedOption = document.getElementById(`option-${focusedOptionIndex}`);
      if (focusedOption) {
        focusedOption.scrollIntoView({
          behavior: 'instant',
          block: 'nearest'
        });
      }
    }
  }, [focusedOptionIndex]);

  useEffect(() => {
    if (isPagerVisible && pagerRef.current) {
      setMaxWidth(pagerRef.current.scrollWidth);
    }
  }, [isPagerVisible]);

  useEffect(() => {
    setButtonStates();
  }, []);

  const togglePager = () => {
    setIsPagerVisible(!isPagerVisible);
  };

  extensionHost.subscribe(
    IIIFEvents.CANVAS_INDEX_CHANGE,
    (canvasIndex: number) => {
      updateSearchFieldValue(canvasIndex);
      setButtonStates();
    }
  );

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
    setLastValidValue(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setFocusedOptionIndex(-1);

    if (options.autoCompleteBoxEnabled) {
      const results: string[] = [];

      for (let i = 0; i < helper.getTotalCanvases(); i++) {
        const canvas = helper.getCanvasByIndex(i);

        if (isPageModeEnabled()) {
          const label = LanguageMap.getValue(canvas.getLabel());
          if (label && label.startsWith(value)) {
            results.push(String(label));
          }
        } else if (String(i + 1).startsWith(value)) {
          results.push(String(i + 1));
        }
      }

      setAutoCompleteOptions(results);
      setShowAutoComplete(results.length > 0 && value.length > 0);
    }
  };

  const handleAutoCompleteSelect = (value: string) => {
    setSearchValue(value);
    setShowAutoComplete(false);
    handleSearch(value);
  };

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
  };

  const handleInputFocus = () => {
    setSearchValue("");
    setFocusedOptionIndex(-1);
    const allCanvases: string[] = [];
    for (let i = 0; i < helper.getTotalCanvases(); i++) {
      if (isPageModeEnabled()) {
        // const canvas = helper.getCanvasByIndex(i);
        // const label = LanguageMap.getValue(canvas.getLabel());
        // if (label) {
        //     allCanvases.push(String(label));
        // }
      } else {
        allCanvases.push(String(i + 1));
      }
    }
    setAutoCompleteOptions(allCanvases);
    setShowAutoComplete(true);
  };

  const handleInputBlur = () => {
    setShowAutoComplete(false);
    setSearchValue(lastValidValue);
  };

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

        //also check if search is in range before submitting
        // maybe no alert, just return to current value if input is invalid?
        return;
      }

      extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, index);
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

  // move this to condition rendering in the parent component.
  if (helper.getTotalCanvases() <= 1) {
    return null;
  }

  //keyboard navigation
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (
        showAutoComplete &&
        focusedOptionIndex >= 0 &&
        focusedOptionIndex < autoCompleteOptions.length
      ) {
        handleAutoCompleteSelect(autoCompleteOptions[focusedOptionIndex]);
      } else {
        handleSearch(searchValue);
      }
      return;
    }

    if (!showAutoComplete) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedOptionIndex((prev) =>
          prev < autoCompleteOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedOptionIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Escape":
        setShowAutoComplete(false);
        setFocusedOptionIndex(-1);
        handleInputBlur();
        break;
      default:
        break;
    }
  };

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
          fill={isPagerVisible ? "#10819A" : "white"}
        >
          <path d="M2 2.5L15 15L2 27.5V2.5Z" />
          <path d="M15 2.5L28 15L15 27.5V2.5Z" />
        </svg>
      </HeaderButton>
      <div
        //   remember to fix the 'ahidden' thing
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
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                aria-label={content.pageSearchLabel}
                aria-expanded={showAutoComplete}
                aria-autocomplete="list"
                aria-controls="autocomplete-list"
                aria-activedescendant={
                  focusedOptionIndex >= 0
                    ? `option-${focusedOptionIndex}`
                    : undefined
                }
                maxLength={30}
                style={{ width: inputWidth }}
              />

              {showAutoComplete && options.autoCompleteBoxEnabled && (
                <ul 
  id="autocomplete-list" 
  ref={dropdownRef}
  className="autocomplete-dropdown" 
  style={{width: inputWidth}}
  role="listbox"
>
                  {autoCompleteOptions.map((option, index) => (
                    <li
                      key={index}
                      id={`option-${index}`}
                      role="option"
                      aria-selected={focusedOptionIndex === index}
                      className={
                        focusedOptionIndex === index ? "focused-option" : ""
                      }
                      onMouseDown={() => {
                        handleAutoCompleteSelect(option);
                      }}
                      onMouseEnter={() => setFocusedOptionIndex(index)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}

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
