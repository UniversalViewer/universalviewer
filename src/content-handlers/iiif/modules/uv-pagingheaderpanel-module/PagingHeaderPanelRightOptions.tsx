import React from 'react'
import HeaderButton from "../uv-shared-module/HeaderButton"
import { Print, Download, FullScreen, Bookmark, ExitFullScreen, Settings, Share } from "../../../../icons/icons"

const PagingHeaderPanelRightOptions = () => {
  return (
    <>
      <HeaderButton
        onClick={() => console.log('Right options button test')} 
        label="Test button"
        title="test">
          <Print />
      </HeaderButton>
      <HeaderButton
        onClick={() => console.log('Left options button test')} 
        label="Test button"
        title="test">
          <Download />
      </HeaderButton>

            <HeaderButton
        onClick={() => console.log('Left options button test')} 
        label="Test button"
        title="test">
          <Bookmark />
        </HeaderButton>
          <HeaderButton
        onClick={() => console.log('Left options button test')} 
        label="Test button"
        title="test">
          <ExitFullScreen />
      </HeaderButton>
      <HeaderButton
        onClick={() => console.log('Left options button test')} 
        label="Test button"
        title="test">
          <Settings />
      </HeaderButton>
      <HeaderButton
        onClick={() => console.log('Left options button test')} 
        label="Test button"
        title="test">
          <Share />
      </HeaderButton>
      <HeaderButton
        onClick={() => console.log('Left options button test')} 
        label="Test button"
        title="test">
          <FullScreen />
      </HeaderButton>
    </>
  )
}

export default PagingHeaderPanelRightOptions