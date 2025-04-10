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
          title={content.help}
        >
          <i className="uv-icon uv-icon-help" aria-hidden="true"></i>
          <span className="sr-only">{content.help}</span>
        </HeaderButton>
      )}

      {options.downloadEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(IIIFEvents.SHOW_DOWNLOAD_DIALOGUE, event.currentTarget)
          }
          title={content.download || "Download"}
        >
          <i className="uv-icon uv-icon-download" aria-hidden="true"></i>
          <span className="sr-only">{content.download}</span>
        </HeaderButton>
      )}

      {options.shareEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(IIIFEvents.SHOW_SHARE_DIALOGUE, event.currentTarget)
          }
          title={content.share}
        >
          <i className="uv-icon uv-icon-share" aria-hidden="true"></i>
          <span className="sr-only">{content.share}</span>
        </HeaderButton>
      )}

      {options.printEnabled && (
        <HeaderButton
          onClick={() =>
            extensionHost.publish(OpenSeadragonExtensionEvents.PRINT)
          }
          title={content.print}
        >
          <i className="uv-icon uv-icon-print" aria-hidden="true"></i>
          <span className="sr-only">{content.print}</span>
        </HeaderButton>
      )}

      {options.bookmarkEnabled && (
        <HeaderButton
          onClick={() =>
            extensionHost.publish(IIIFEvents.BOOKMARK)
          }
          title={content.bookmark}
        >
          <i className="uv-icon uv-icon-bookmark" aria-hidden="true"></i>
          <span className="sr-only">{content.bookmark}</span>
        </HeaderButton>
      )}

      {options.feedbackEnabled && (
        <HeaderButton
          onClick={() =>
            extensionHost.publish(IIIFEvents.FEEDBACK)
          }
          title={content.feedback}
        >
          <i className="uv-icon uv-icon-feedback" aria-hidden="true"></i>
          <span className="sr-only">{content.feedback}</span>
        </HeaderButton>
      )}

      {options.settingsButtonEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(IIIFEvents.SHOW_SETTINGS_DIALOGUE, event.currentTarget)
          }
          title={content.settings}
        >
          <i className="uv-icon uv-icon-settings" aria-hidden="true"></i>
          <span className="sr-only">{content.settings}</span>
        </HeaderButton>
      )}

      {options.fullscreenEnabled && (
        <HeaderButton
          onClick={handleFullScreenClick}
          title={isFullScreen ? content.exitFullScreen : content.fullScreen}
        >
          <i
            className={`uv-icon ${
              isFullScreen ? "uv-icon-exit-fullscreen" : "uv-icon-fullscreen"
            }`}
            aria-hidden="true"
          ></i>
          <span className="sr-only"> isFullScreen ? content.exitFullScreen : content.fullScreen </span>
        </HeaderButton>
      )}
    </>
  );
};

export default HeaderPanelRightOptions;
