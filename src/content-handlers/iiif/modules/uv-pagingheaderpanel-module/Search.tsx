import React, { useState, useRef, useEffect } from "react";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";

interface SearchProps {
  extension: OpenSeadragonExtension;
  extensionHost: IIIFExtensionHost;
  content: any;
  options: any;
}

export const Search: React.FC<SearchProps> = ({
    extension,
  extensionHost,
  content,
  options,
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
    const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
  
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<string[]>([]);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);
  

  //dev only, set width
  const inputWidth = "20ch";

  useEffect(() => {
    if (isSearchVisible && containerRef.current) {
      setMaxWidth(containerRef.current.scrollWidth);
      inputRef.current?.focus();
    }
  }, [isSearchVisible]);

  const handleSearchSubmit = (terms: string): void => {
    extensionHost.publish(OpenSeadragonExtensionEvents.SEARCH, terms);
  };

  const fetchSuggestions = async (term: string) => {
    const autocompleteService = extension.getAutoCompleteUri();
    if (!autocompleteService) return;

    try {
      const response = await fetch(autocompleteService.replace("{0}", term));
      const results = await response.json();
      const matches = results.terms.map((result: any) => result.match);
      setAutoCompleteOptions(matches);
      setShowAutoComplete(matches.length > 0)
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setAutoCompleteOptions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFocusedOptionIndex(-1);
    setShowAutoComplete(false)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
        setAutoCompleteOptions([]);
    }
  };

  useEffect(() => {
    if (focusedOptionIndex >= 0 && dropdownRef.current) {
      const suggestionItems = dropdownRef.current.querySelectorAll("li");
      const highlightedItem = suggestionItems[focusedOptionIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [focusedOptionIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (autoCompleteOptions.length > 0) {
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
        case "Tab":
        e.preventDefault();
        if (e.shiftKey) {
            setFocusedOptionIndex(prev => prev > 0 ? prev - 1 : 0);
        } else {
            setFocusedOptionIndex(prev => 
            prev < autoCompleteOptions.length - 1 ? prev + 1 : prev
            );
        }
        break;
        case "Enter":
          e.preventDefault();
          if (focusedOptionIndex >= 0) {
            const selectedTerm = autoCompleteOptions[focusedOptionIndex];
            go(selectedTerm);
          } else if (searchTerm) {
            go(searchTerm);
          }
          break;
        case "Escape":
          setAutoCompleteOptions([]);
          break;
      }
    } else if (e.key === "Enter" && searchTerm) {
      go(searchTerm);
    }
  };

  const go = (term) => {
    setAutoCompleteOptions([]);
    setSearchTerm("");
    handleSearchSubmit(term);
  };

const handleAutoCompleteSelect = (suggestion: string) => {
    handleSearchSubmit(suggestion);
    setSearchTerm("");
    setAutoCompleteOptions([]);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

    function positionDropdown(triggerElement, dropdownElement) {
      if (!triggerElement || !dropdownElement) return;
    
      const rect = triggerElement.getBoundingClientRect();
      dropdownElement.style.top = `${rect.bottom}px`;
      dropdownElement.style.left = `${rect.left}px`;
    }
    
    useEffect(() => {
      const input = document.querySelector('#text-search');
      const portal = document.querySelector('#text-dropdown-portal');
      positionDropdown(input, portal);
      console.log(input)
    }, [showAutoComplete]);

  return (
    <>
      <HeaderButton
        onClick={toggleSearch}
        label={isSearchVisible ? "Hide search" : "Show search"}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="13" cy="13" r="8" stroke="white" strokeWidth="4" />
          <line
            x1="20"
            y1="20"
            x2="27"
            y2="27"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="square"
          />
        </svg>
      </HeaderButton>
      <div
        //   remember to fix the 'ahidden' thing
        className={`slide-out-container ${
          isSearchVisible ? "avisible" : "ahidden"
        }`}
        ref={containerRef}
        style={{
          maxWidth: isSearchVisible ? `${maxWidth}px` : "0",
          opacity: isSearchVisible ? 1 : 0,
        }}
      >
        {/* NB change classname and css selectors to search (or whatever) when old elements deleted */}
        <div className="search-new">
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                id="text-search"
                ref={inputRef}
                placeholder={content.enterKeyword}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}

                // onFocus={handleInputFocus}
                // onBlur={handleInputBlur}
                // onKeyDown={handleInputKeyDown}
                // aria-label={content.pageSearchLabel}
                // aria-expanded={showAutoComplete}
                // aria-autocomplete="list"
                // aria-controls="autocomplete-list"
                // aria-activedescendant={
                //   focusedOptionIndex >= 0
                //     ? `option-${focusedOptionIndex}`
                //     : undefined
                // }
                maxLength={30}
                style={{ width: inputWidth }}
              />
            </div>
        </div>
      </div>
      {/* the dropdown is rendered in a portal because 'hidden' needs to applied to the container above for animations to work nicely.  */}
      <div className="dropdown-portal" id="text-dropdown-portal">
            {options.autoCompleteBoxEnabled && (
              <ul
                id="autocomplete-list"
                ref={dropdownRef}
                className="autocomplete-dropdown"
                style={{ width: inputWidth }}
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
</div>
    </>
  );
};

export default Search;
