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
  const locales = extension.data.locales;
  const showLocale =
    options.localeToggleEnabled === true &&
    !!locales &&
    locales.length > 1 &&
    !extension.isMobileMetric();
  const alternateLocale = showLocale ? extension.getAlternateLocale() : null;
  const localeCode = alternateLocale?.name.split("-")[0].toUpperCase();

  const showHelp = !!(options.helpEnabled && options.helpUrl);
  const showSettings = options.settingsButtonEnabled !== false;

  // The far right button gets its tooltip aligned to the end so it doesn't run off the edge of the viewer
  const lastButton = showSettings ? "settings" : showHelp ? "help" : "locale";
  const alignFor = (name: string) => (lastButton === name ? "end" : "center");

  return (
    <>
      {alternateLocale && (
        <Button
          className="localeToggle"
          label={`${alternateLocale.label} (${localeCode})`}
          tooltipAlign={alignFor("locale")}
          lang={alternateLocale.name}
          onClick={() => extension.changeLocale(alternateLocale.name)}
        >
          {localeCode}
        </Button>
      )}
      {showHelp && (
        <Button
          className="help"
          label={content.help}
          tooltipAlign={alignFor("help")}
          onClick={() =>
            window.open(options.helpUrl, "_blank", "noopener,noreferrer")
          }
        >
          {/* JM todo: replace with new Help svg icon */}
          <i className="uv-icon-help" aria-hidden="true" />
        </Button>
      )}
      {showSettings && (
        <Button
          className="settings"
          label={content.settings}
          tooltipAlign={alignFor("settings")}
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
