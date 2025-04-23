import React, { useState, useEffect } from "react";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { IIIFEvents } from "../../IIIFEvents";
import { Events } from "../../../../Events";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { HeaderPanelContent, HeaderPanelOptions } from "../../BaseConfig";
import { Download, Share, Print, Mail, Bookmark, FullScreen, ExitFullScreen, Settings} from "../../../../icons/icons"

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
    <div style={{ marginTop: "5px" }}>
      {options.helpEnabled && content.helpUrl && (
        <HeaderButton
          onClick={() => window.open(content.helpUrl)}
          title={content.help}
          label={""}
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
          label={""}
        >
          <Download aria-hidden="true" />
          <span className="sr-only">{content.download}</span>
        </HeaderButton>
      )}

      {options.shareEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(IIIFEvents.SHOW_SHARE_DIALOGUE, event.currentTarget)
          }
          title={content.share}
          label={""}
        >
          <Share aria-hidden="true" />
          <span className="sr-only">{content.share}</span>
        </HeaderButton>
      )}

      {options.printEnabled && (
        <HeaderButton
          onClick={() =>
            extensionHost.publish(OpenSeadragonExtensionEvents.PRINT)
          }
          title={content.print}
          label={""}
        >
          <Print aria-hidden="true" />
          <span className="sr-only">{content.print}</span>
        </HeaderButton>
      )}

      {options.bookmarkEnabled && (
        <HeaderButton
          onClick={() =>
            extensionHost.publish(IIIFEvents.BOOKMARK)
          }
          title={content.bookmark}
          label={""}
        >
          <Bookmark aria-hidden="true" />
          <span className="sr-only">{content.bookmark}</span>
        </HeaderButton>
      )}

      {options.feedbackEnabled && (
        <HeaderButton
          onClick={() =>
            extensionHost.publish(IIIFEvents.FEEDBACK)
          }
          title={content.feedback}
          label={""}
        >
          <Mail aria-hidden="true" />
          <span className="sr-only">{content.feedback}</span>
        </HeaderButton>
      )}

      {options.settingsButtonEnabled && (
        <HeaderButton
          onClick={(event) =>
            extensionHost.publish(IIIFEvents.SHOW_SETTINGS_DIALOGUE, event.currentTarget)
          }
          title={content.settings}
          label={""}
        >
          <Settings aria-hidden="true" />
          <span className="sr-only">{content.settings}</span>
        </HeaderButton>
      )}

      {options.fullscreenEnabled && (
        <HeaderButton
        onClick={handleFullScreenClick}
        title={isFullScreen ? content.exitFullScreen : content.fullScreen}
        label={""}
      >
        {isFullScreen ? (
          <ExitFullScreen aria-hidden="true" />
        ) : (
          <FullScreen aria-hidden="true" />
        )}
        <span className="sr-only">
          {isFullScreen ? content.exitFullScreen : content.fullScreen}
        </span>
      </HeaderButton>      
      )}
    </div>
  );
};

export default HeaderPanelRightOptions;
