import React from "react";
import Button from "./Button";
import { IIIFEvents } from "../../IIIFEvents";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { IExtension } from "./IExtension";
import { HeaderPanelContent, HeaderPanelOptions } from "../../BaseConfig";
import { Settings } from "./Icons";

interface Props {
  extensionHost: IIIFExtensionHost;
  extension: IExtension;
  options: HeaderPanelOptions;
  content: HeaderPanelContent;
}

const HeaderPanelRightOptions: React.FC<Props> = ({
  extensionHost,
  extension,
  options,
  content,
}) => {
  return (
    <>
      {options.helpEnabled && options.helpUrl && (
        <Button
          className="help"
          label={content.help}
          tooltipAlign="end"
          onClick={() =>
            window.open(options.helpUrl, "_blank", "noopener,noreferrer")
          }
        >
          {/* JM todo: replace with new Help svg icon */}
          <i className="uv-icon-help" aria-hidden="true" />
        </Button>
      )}
      {options.settingsButtonEnabled && (
        <Button
          className="settings"
          label={content.settings}
          tooltipAlign="end"
          onClick={(e) => {
            const el = e.currentTarget;
            extensionHost.publish(IIIFEvents.SHOW_SETTINGS_DIALOGUE, el);
          }}
        >
          <Settings />
        </Button>
      )}
    </>
  );
};

export default HeaderPanelRightOptions;
