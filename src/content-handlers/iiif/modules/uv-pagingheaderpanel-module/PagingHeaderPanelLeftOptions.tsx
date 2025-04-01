import React from 'react'
import HeaderButton from "../uv-shared-module/HeaderButton"

const PagingHeaderPanelLeftOptions = () => {
  return (
    <>
      <HeaderButton
        onClick={() => console.log('Left options button test')} 
        label="Test button">
        T
        {/* icon goes here */}
      </HeaderButton>
      <HeaderButton
        onClick={() => console.log('Left options button test')} 
        label="Test button">
        T
        {/* icon goes here */}
      </HeaderButton>
    </>
  )
}

export default PagingHeaderPanelLeftOptions