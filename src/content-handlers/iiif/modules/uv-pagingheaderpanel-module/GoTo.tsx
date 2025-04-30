import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "manifesto.js";
import { ViewingDirection } from "@iiif/vocabulary/dist-commonjs/";
import { Strings } from "@edsilv/utils";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { IIIFEvents } from "../../IIIFEvents";
import { Goto, FirstPage, LastPage } from "../../../../icons/icons";

//Notes
// This rewrites some of the original logic in the PagingHeaderPanel 'search' function for navigating to new pages:
// that function uses the OpenSeadragonExtensionEvents.PAGE_SEARCH event to navigate to new pages by page label if pagingMode is enabled.
// However, that functionality had no way of handling items where there were multiple identical page labels (e.g. first few pages of Wunder Der Verebung).
// There is a hack that just ignored the duplicate '-' labels in the previous component.
// I've duplicated most of the functionality of the original autocomplete/paging navigation here, except defaulting to page labels (as discussed with Scott Jenson et al.)
// and made it so that the underlying logic always relies on the canvas index (i.e. the unique value) for navigating, which explains why some of this code seems complicated - not unneccessarily so!
// The component currently uses a Canvas[] as its data source and calls the various methods on this as needed. I think all that's needed here is the index and the label
// so it would be better to load this upfront as a memoized array of labels and grab the label/index from that

// a lot of the bulky code here is to do with keyboard navigation: lots of the natural browser nav is overridden to make the UI work properly


interface GoToProps {
  helper: any;
  extensionHost: any;
  content: any;
  options: any;
}

export const GoTo: React.FC<GoToProps> = ({
  helper,
  extensionHost,
  content,
  options,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<Canvas[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const [isPagerVisible, setIsPagerVisible] = useState(false);
  const [lastValidValue, setLastValidValue] = useState<string>("");
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  // const [firstButtonEnabled, setFirstButtonEnabled] = useState<boolean>(true);
  // const [prevButtonEnabled, setPrevButtonEnabled] = useState<boolean>(true);
  // const [nextButtonEnabled, setNextButtonEnabled] = useState<boolean>(true);
  // const [lastButtonEnabled, setLastButtonEnabled] = useState<boolean>(true);

  const dropdownRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // const viewingDirection = helper.getViewingDirection() || ViewingDirection.LEFT_TO_RIGHT;
  const pageModeEnabled = Boolean(options.pageModeEnabled);

  const allCanvases: Canvas[] = helper.getCanvases();

  //for development only, toggle this to show the full << < > >> buttons (could change to config setting)
  const showFullControls = true;

  const getInputWidth = () => {
    // Default minimum width
    let maxLabelLength = 6;

    if (pageModeEnabled) {
      for (const canvas of allCanvases) {
        const labelLength = canvas?.getLabel()?.getValue()?.length;
        if (labelLength === undefined) continue;
        if (labelLength > maxLabelLength) {
          maxLabelLength = labelLength;
        }
      }
    } else {
      for (const canvas of allCanvases) {
        const labelLength = String(canvas?.index).length;
        if (labelLength === undefined) continue;
        if (labelLength > maxLabelLength) {
          maxLabelLength = labelLength;
        }
      }
    }

    const maxWidth = 20;
    const clampedLength = Math.min(maxLabelLength, maxWidth);
    return `${clampedLength}ch`;
  };

  useEffect(() => {
    if (focusedOptionIndex >= 0 && dropdownRef.current) {
      const focusedOption = document.getElementById(
        `option-${focusedOptionIndex}`
      );
      if (focusedOption) {
        focusedOption.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    }
  }, [focusedOptionIndex]);

  useEffect(() => {
    const handleScroll = (event) => {
      if (
        showAutoComplete &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowAutoComplete(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showAutoComplete]);

  useEffect(() => {
    if (isPagerVisible && containerRef.current) {
      setMaxWidth(containerRef.current.scrollWidth);
      updateSearchFieldValue();
    }
  }, [isPagerVisible]);

  // useEffect(() => {
  //   setButtonStates();
  // }, []);

  const togglePager = () => {
    setIsPagerVisible(!isPagerVisible);
  };

  extensionHost.subscribe(
    IIIFEvents.CANVAS_INDEX_CHANGE,
    (canvasIndex: number) => {
      updateSearchFieldValue();
      // setButtonStates();
    }
  );

  const updateSearchFieldValue = () => {
    const canvas = helper.getCurrentCanvas();
    let value: string;
    if (pageModeEnabled) {
      value = canvas.getLabel().getValue();
    } else {
      value = String(canvas.getIndex() + 1);
    }
    setSearchValue(value);
    setLastValidValue(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setFocusedOptionIndex(-1);

    if (options.autoCompleteBoxEnabled) {
      let results: Canvas[] = [];

      if (pageModeEnabled) {
        results = allCanvases.filter((canvas) => {
          const label = canvas.getLabel().getValue()?.toLowerCase();
          return label?.includes(value);
        });
      } else {
        results = allCanvases.filter((canvas, index) =>
          String(index).startsWith(value)
        );
      }

      setAutoCompleteOptions(results);
      setShowAutoComplete(results.length > 0 && value.length > 0);
    }
  };

  const handleAutoCompleteSelect = (selection: Canvas) => {
    setShowAutoComplete(false);
    go(selection);
    updateSearchFieldValue();
  };

  // const setButtonStates = () => {
  //   if (viewingDirection === ViewingDirection.RIGHT_TO_LEFT) {
  //     setFirstButtonEnabled(!helper.isLastCanvas());
  //     setPrevButtonEnabled(!helper.isLastCanvas());
  //     setNextButtonEnabled(!helper.isFirstCanvas());
  //     setLastButtonEnabled(!helper.isFirstCanvas());
  //   } else {
  //     setFirstButtonEnabled(!helper.isFirstCanvas());
  //     setPrevButtonEnabled(!helper.isFirstCanvas());
  //     setNextButtonEnabled(!helper.isLastCanvas());
  //     setLastButtonEnabled(!helper.isLastCanvas());
  //   }
  // };

  const handleInputFocus = () => {
    setSearchValue("");
    setFocusedOptionIndex(-1);
    setAutoCompleteOptions(allCanvases);
    setShowAutoComplete(true);
  };

  const handleInputBlur = () => {
    setShowAutoComplete(false);
    setSearchValue(lastValidValue);
  };

  const go = (selection: Canvas) => {
    extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, selection.index);
  };

  const getNavigationTitle = (type: "first" | "prev" | "next" | "last") => {
    if (pageModeEnabled) {
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
    if (pageModeEnabled) {
      return Strings.format(content.of, helper.getLastCanvasLabel(true));
    } else {
      return Strings.format(content.of, helper.getTotalCanvases().toString());
    }
  };

  // // move this to conditional rendering in the parent component.
  // if (helper.getTotalCanvases() <= 1) {
  //   return null;
  // }

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
        if (pageModeEnabled) {
          const target = allCanvases.find(
            (canvas) => canvas.getLabel().getValue() === searchValue
          );
          if (target) {
            go(target);
          }
        } else {
          const target = allCanvases.find(
            (canvas) => String(canvas.index) === searchValue
          );
          if (target) {
            go(target);
          }
        }
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

  function positionDropdown(triggerElement, dropdownElement) {
    if (!triggerElement || !dropdownElement) return;

    const rect = triggerElement.getBoundingClientRect();
    dropdownElement.style.top = `${rect.bottom}px`;
    dropdownElement.style.left = `${rect.left}px`;
  }

  useEffect(() => {
    const input = document.querySelector(".search-input");
    const portal = document.querySelector(".dropdown-portal");
    positionDropdown(input, portal);
  }, [showAutoComplete]);

  return (
    <>
      <HeaderButton
        onClick={togglePager}
        title={isPagerVisible ? content.go : content.go}
        label={isPagerVisible ? content.go : content.go}
      >
        <Goto />
      </HeaderButton>
      <div
        //   remember to fix the 'ahidden' thing
        className={`slide-out-container ${
          isPagerVisible ? "avisible" : "ahidden"
        }`}
        ref={containerRef}
        style={{
          maxWidth: isPagerVisible ? `${maxWidth}px` : "0",
          opacity: isPagerVisible ? 1 : 0,
        }}
      >
        <div
          className="paging-back-buttons"
          style={{ display: showFullControls ? "block" : "none", 
          marginTop: "5px"
          }}
        >
          <HeaderButton
            onClick={() => handleNavigation("first")}
            title={getNavigationTitle("first")}
            label={getNavigationTitle("first")}
            // disabled={!firstButtonEnabled}
          >
            <FirstPage />
          </HeaderButton>

          {/* <HeaderButton
            onClick={() => handleNavigation("prev")}
            title={getNavigationTitle("prev")}
            label={getNavigationTitle("prev")}
            // disabled={!prevButtonEnabled}
          >
            <PreviousPage />
          </HeaderButton> */}
        </div>

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
            style={{ width: getInputWidth() }}
          />

          {!pageModeEnabled && (
            <span className="total-label">{getTotalLabel()}</span>
          )}
        </div>
        <div
          className="paging-forward-buttons"
          style={{
            display: showFullControls ? "block" : "none",
            marginTop: "5px" 
          }}
>
          {/* <HeaderButton
            onClick={() => handleNavigation("next")}
            title={getNavigationTitle("next")}
            label={getNavigationTitle("next")}
            // disabled={!nextButtonEnabled}
          >
            <NextPage />
          </HeaderButton> */}

          <HeaderButton
            onClick={() => handleNavigation("last")}
            title={getNavigationTitle("last")}
            label={getNavigationTitle("last")}
            // disabled={!lastButtonEnabled}
          >
            <LastPage />
          </HeaderButton>
        </div>
      </div>

      {/* the dropdown is rendered in a portal because 'hidden' needs to applied to the container above for animations to work nicely.  */}
      <div className="dropdown-portal">
        {showAutoComplete && options.autoCompleteBoxEnabled && (
          <ul
            id="autocomplete-list"
            ref={dropdownRef}
            className="autocomplete-dropdown"
            style={{ width: getInputWidth() }}
            role="listbox"
          >
            {autoCompleteOptions.map((option, index) => (
              <li
                key={index}
                id={`option-${index}`}
                role="option"
                aria-selected={focusedOptionIndex === index}
                className={focusedOptionIndex === index ? "focused-option" : ""}
                onMouseDown={() => {
                  handleAutoCompleteSelect(option);
                }}
                onMouseEnter={() => setFocusedOptionIndex(index)}
              >
                {pageModeEnabled
                  ? option.getLabel().getValue()
                  : String(option.index)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default GoTo;
