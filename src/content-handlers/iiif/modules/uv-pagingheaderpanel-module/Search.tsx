import React, { useState } from "react";
import HeaderButton from "../uv-shared-module/HeaderButton";


const Search: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

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
    </>
  );
};

export default Search;
