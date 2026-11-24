import React from "react";
import Button from "../uv-shared-module/Button";
import { IIIFEvents } from "../../IIIFEvents";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";

type PagingHeaderPanelConfig = Config["modules"]["pagingHeaderPanel"];

interface Props {
  extensionHost: IIIFExtensionHost;
  extension: OpenSeadragonExtension;
  options: PagingHeaderPanelConfig["options"];
  content: PagingHeaderPanelConfig["content"];
  galleryOpen: boolean;
  onPagingChange: (enabled: boolean) => void;
}

const PagingHeaderRightOptions: React.FC<Props> = ({
  extensionHost,
  extension,
  options,
  content,
  galleryOpen,
  onPagingChange,
}) => {
  const isMobile = extension.isMobileMetric();

  const showPagingToggle =
    options.pagingToggleEnabled !== false &&
    extension.helper.isPagingAvailable() &&
    !isMobile;

  const showGallery =
    options.galleryButtonEnabled !== false &&
    extension.isLeftPanelEnabled() &&
    !isMobile;

  // In gallery view neither paging button is "on"
  const pagingEnabled = extension.isPagingSettingEnabled();
  const oneUpOn = !galleryOpen && !pagingEnabled;
  const twoUpOn = !galleryOpen && pagingEnabled;

  return (
    <>
      {showPagingToggle && (
        <>
          <Button
            className={oneUpOn ? "one-up on" : "one-up"}
            label={content.oneUp}
            aria-pressed={oneUpOn}
            onClick={() => onPagingChange(false)}
          >
            <i className="uv-icon-one-up" aria-hidden="true" />
          </Button>
          <Button
            className={twoUpOn ? "two-up on" : "two-up"}
            label={content.twoUp}
            aria-pressed={twoUpOn}
            onClick={() => onPagingChange(true)}
          >
            <i className="uv-icon-two-up" aria-hidden="true" />
          </Button>
        </>
      )}

      {showGallery && (
        <Button
          className={galleryOpen ? "gallery on" : "gallery"}
          label={content.gallery}
          aria-pressed={galleryOpen}
          onClick={() =>
            extensionHost.publish(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL)
          }
        >
          <i className="uv-icon-gallery" aria-hidden="true" />
        </Button>
      )}
    </>
  );
};

export default PagingHeaderRightOptions;
