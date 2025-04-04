import React, { useState, useEffect } from "react";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { IIIFEvents } from "../../IIIFEvents";
import { Events } from "../../../../Events";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";

interface Props {
  extensionHost: IIIFExtensionHost;
}

const HeaderPanelRightOptions: React.FC<Props> = ({ extensionHost }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    extensionHost.publish(Events.TOGGLE_FULLSCREEN);
  };

  useEffect(() => {
    const handleToggleFullScreen = () => setIsFullScreen((prev) => !prev);
    const handleExitFullScreen = () => setIsFullScreen(false);

    extensionHost.subscribe(Events.TOGGLE_FULLSCREEN, handleToggleFullScreen);
    extensionHost.subscribe(Events.EXIT_FULLSCREEN, handleExitFullScreen);

    return () => {
      setIsFullScreen(false);
    };
  }, [extensionHost]);

  return (
    <>
      <HeaderButton
  onClick={(event) => {
    console.log("event.currentTarget:", event.currentTarget);
    extensionHost.publish(IIIFEvents.SHOW_DOWNLOAD_DIALOGUE, event.currentTarget);
  }}
  label="Download"
>
  <i className="uv-icon uv-icon-download" aria-hidden="true"></i>
</HeaderButton>


      <HeaderButton
        onClick={(event) => extensionHost.publish(IIIFEvents.SHOW_SHARE_DIALOGUE, event.currentTarget)}
        label="Share"
      >
        <i className="uv-icon uv-icon-share" aria-hidden="true"></i>
      </HeaderButton>
      {/* <HeaderButton
      //   onClick={(event) => extensionHost.publish(IIIFEvents.SHOW_EMBED_DIALOGUE, event.currentTarget)}
      //   label="Embed"
      // >
      //   <i className="uv-icon uv-icon-embed" aria-hidden="true"></i>
      // </HeaderButton> */}
      <HeaderButton
        onClick={(event) => extensionHost.publish(OpenSeadragonExtensionEvents.PRINT)}
        label="Print"
      >
        <i className="uv-icon uv-icon-print" aria-hidden="true"></i>
      </HeaderButton>
      {/* <HeaderButton
        onClick={(event) => extensionHost.publish(IIIFEvents.BOOKMARK, event.currentTarget)}
        label="Bookmark"
      >
        <i className="uv-icon uv-icon-bookmark" aria-hidden="true"></i>
      </HeaderButton>
      <HeaderButton
        onClick={(event) => extensionHost.publish(IIIFEvents.FEEDBACK, event.currentTarget)}
        label="Feedback"
      >
        <i className="uv-icon uv-icon-feedback" aria-hidden="true"></i>
      </HeaderButton> */}
      {/* <HeaderButton
        onClick={(event) => extensionHost.publish(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL, event.currentTarget)}
        label="Gallery"
      >
        <i className="uv-icon uv-icon-gallery" aria-hidden="true"></i> */}
      {/* </HeaderButton> */}
      <HeaderButton
        onClick={(event) => extensionHost.publish(IIIFEvents.SHOW_SETTINGS_DIALOGUE, event.currentTarget)}
        label="Settings"
      > 
        <i className="uv-icon uv-icon-settings" aria-hidden="true"></i>
      </HeaderButton>
      <HeaderButton
        onClick={handleFullScreenClick}
        label={isFullScreen ? "Minimize" : "Maximize"}
      >
        <i className={`uv-icon ${isFullScreen ? "uv-icon-exit-fullscreen" : "uv-icon-fullscreen"}`} aria-hidden="true"></i>
      </HeaderButton>
      {/* <HeaderButton
        onClick={() => window.open()}
        label={"Help"}
      >
        <i className="uv-icon uv-icon-help" aria-hidden="true"></i>
      </HeaderButton> */}

    </>
  );
};

export default HeaderPanelRightOptions;
