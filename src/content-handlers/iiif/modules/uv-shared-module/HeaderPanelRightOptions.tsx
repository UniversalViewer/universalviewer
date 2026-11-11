import React from "react";
import Button from "./Button";
import { IIIFEvents } from "../../IIIFEvents";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { HeaderPanelContent, HeaderPanelOptions } from "../../BaseConfig";
import { Settings } from "./Icons";

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
    <>  {options.settingsButtonEnabled && (
      <Button
        className="settings"
        label={content.settings}
        onClick={(e) => {
          const el = e.currentTarget;
          extensionHost.publish(IIIFEvents.SHOW_SETTINGS_DIALOGUE, el);
        }}
      >
        <Settings />
      </Button>
    )}</>
  )

}

export default HeaderPanelRightOptions;