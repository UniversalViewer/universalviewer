import React from "react";
import Button from "./Button";
import { IIIFEvents } from "../../IIIFEvents";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { HeaderPanelContent, HeaderPanelOptions } from "../../BaseConfig";

interface Props {
  extensionHost: IIIFExtensionHost;
  options: HeaderPanelOptions;
  content: HeaderPanelContent;
}


const HeaderPanelRightOptions: React.FC<Props> = ({
  extensionHost,
  options,
  content,
}) => {

  return (
    <div>  {options.settingsButtonEnabled && (
      <Button
        className="settings"
        label={content.settings}
        onClick={(e) => {
          const el = e.currentTarget;
          extensionHost.publish(IIIFEvents.SHOW_SETTINGS_DIALOGUE, el);
        }}
      >
        S {/* icon goes here */}
      </Button>
    )}</div>
  )

}

export default HeaderPanelRightOptions;







