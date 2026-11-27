import React from "react";
import Button from "../uv-shared-module/Button";
import { IIIFEvents } from "../../IIIFEvents";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";
import {
  AdjustImage,
  FitImage,
  Layers,
  Rotate,
  ZoomIn,
  ZoomOut,
} from "../uv-shared-module/Icons";

type CenterPanelConfig = Config["modules"]["openSeadragonCenterPanel"];

interface Props {
  extensionHost: IIIFExtensionHost;
  content: CenterPanelConfig["content"];
  showHomeButton: boolean;
  showAdjustImageButton: boolean;
  hasChoices: boolean;
}

const ImageControls: React.FC<Props> = ({
  extensionHost,
  content,
  showHomeButton,
  showAdjustImageButton,
  hasChoices,
}) => {
  return (
    <>
      <Button
        className="zoomIn imageControlButton viewportNavButton"
        label={content.zoomIn}
        onClick={() =>
          extensionHost.publish(OpenSeadragonExtensionEvents.ZOOM_IN)
        }
      >
        <ZoomIn />
      </Button>

      <Button
        className="zoomOut imageControlButton viewportNavButton"
        label={content.zoomOut}
        onClick={() =>
          extensionHost.publish(OpenSeadragonExtensionEvents.ZOOM_OUT)
        }
      >
        <ZoomOut />
      </Button>

      <Button
        className="rotate imageControlButton viewportNavButton"
        label={content.rotateRight}
        onClick={() =>
          extensionHost.publish(OpenSeadragonExtensionEvents.ROTATE)
        }
      >
        <Rotate />
      </Button>

      {showHomeButton && (
        <Button
          className="goHome imageControlButton viewportNavButton"
          label={content.goHome}
          onClick={() =>
            extensionHost.publish(OpenSeadragonExtensionEvents.GO_HOME)
          }
        >
          <FitImage />
        </Button>
      )}

      {showAdjustImageButton && (
        <Button
          className="adjustImage imageControlButton viewportNavButton"
          label={content.adjustImage}
          onClick={() =>
            extensionHost.publish(IIIFEvents.SHOW_ADJUSTIMAGE_DIALOGUE)
          }
        >
          <AdjustImage />
        </Button>
      )}

      {hasChoices && (
        <Button
          className="choiceSwitch imageControlButton viewportNavButton"
          label={content.layers}
          onClick={() =>
            extensionHost.publish(IIIFEvents.SHOW_CHOICE_SWITCH_DIALOGUE)
          }
        >
          <Layers />
        </Button>
      )}
    </>
  );
};

export default ImageControls;
