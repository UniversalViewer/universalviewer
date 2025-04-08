import React, { useState, useEffect } from "react";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { IIIFEvents } from "../../IIIFEvents";
import { Events } from "../../../../Events";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { HeaderPanelContent, HeaderPanelOptions } from "../../BaseConfig";

interface Props {
  extensionHost: IIIFExtensionHost;
  options: HeaderPanelOptions;
  content: HeaderPanelContent;
}

const HeaderPanelRightOptions: React.FC<Props> = ({ extensionHost, options, content }) => {
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
      {options.helpEnabled && content.helpUrl && (
        <HeaderButton
          onClick={() => window.open(content.helpUrl)}
          label={content.help}
        >
          <i className="uv-icon uv-icon-help" aria-hidden="true"></i>
        </HeaderButton>
      )}

      {options.downloadEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(IIIFEvents.SHOW_DOWNLOAD_DIALOGUE, event.currentTarget)
          }
          label={content.download || "Download"}
        >
          <i className="uv-icon uv-icon-download" aria-hidden="true"></i>
        </HeaderButton>
      )}

      {options.shareEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(IIIFEvents.SHOW_SHARE_DIALOGUE, event.currentTarget)
          }
          label={content.share || "Share"}
        >
          <i className="uv-icon uv-icon-share" aria-hidden="true"></i>
        </HeaderButton>
      )}

      {options.printEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(OpenSeadragonExtensionEvents.PRINT)
          }
          label={content.print || "Print"}
        >
          <i className="uv-icon uv-icon-print" aria-hidden="true"></i>
        </HeaderButton>
      )}

      {options.settingsButtonEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(IIIFEvents.SHOW_SETTINGS_DIALOGUE, event.currentTarget)
          }
          label={content.settings}
        >
          <i className="uv-icon uv-icon-settings" aria-hidden="true"></i>
        </HeaderButton>
      )}
      {options.fullscreenEnabled && (
        <HeaderButton
          onClick={handleFullScreenClick}
          label={isFullScreen ? content.minimize || "Minimize" : content.maximize || "Maximize"}
        >
          <i
            className={`uv-icon ${
              isFullScreen ? "uv-icon-exit-fullscreen" : "uv-icon-fullscreen"
            }`}
            aria-hidden="true"
          ></i>
        </HeaderButton>
      )}
    </>
  );
};

export default HeaderPanelRightOptions;
