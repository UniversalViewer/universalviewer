import React, { useState, useRef, useEffect } from "react";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Search as SearchIcon } from "../../../../icons/icons"

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

  const handleInputBlur = () => {
    // Add a small delay before hiding autocomplete to allow click events to register
    setTimeout(() => {
      setAutoCompleteOptions([]);
      setShowAutoComplete(false);
    }, 150);
  }

  useEffect(() => {
    if (focusedOptionIndex >= 0 && dropdownRef.current) {
      const suggestionItems = dropdownRef.current.querySelectorAll("li");
      const highlightedItem = suggestionItems[focusedOptionIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
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
            // If an option is focused, use it
            const selectedTerm = autoCompleteOptions[focusedOptionIndex];
            go(selectedTerm);
          } else {
            // Otherwise use the current search term
            go(searchTerm);
          }
          break;
        case "Escape":
          setAutoCompleteOptions([]);
          setShowAutoComplete(false);
          break;
      }
    } else if (e.key === "Enter" && searchTerm.trim()) {
      // Handle Enter key when no autocomplete options are showing
      e.preventDefault();
      go(searchTerm);
    }
  };

  const go = (term) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    
    handleSearchSubmit(term);
    setSearchTerm("");
    toggleSearch();
    setAutoCompleteOptions([]);
    setShowAutoComplete(false);
  };

  const handleAutoCompleteSelect = (suggestion: string) => {
    go(suggestion);
  };

  const toggleSearch = () => {
    setShowAutoComplete(false);
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
  }, [showAutoComplete]);

  return (
    <>
      <HeaderButton
        onClick={toggleSearch}
        title="Search"
        label="Search"
      >
        <SearchIcon />
      </HeaderButton>
      <div
        className={`slide-out-container ${
          isSearchVisible ? "avisible" : "ahidden"
        }`}
        ref={containerRef}
        style={{
          maxWidth: isSearchVisible ? `${maxWidth}px` : "0",
          opacity: isSearchVisible ? 1 : 0,
        }}
      >
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
                onBlur={handleInputBlur}
                maxLength={30}
                style={{ width: inputWidth }}
                aria-label="Search text"
                aria-expanded={showAutoComplete}
                aria-autocomplete="list"
                aria-controls={showAutoComplete ? "autocomplete-list" : undefined}
                aria-activedescendant={
                  focusedOptionIndex >= 0
                    ? `option-${focusedOptionIndex}`
                    : undefined
                }
              />
            </div>
        </div>
      </div>
      {showAutoComplete && options.autoCompleteBoxEnabled && (
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
      </div>)}
    </>
  );
};

export default Search;