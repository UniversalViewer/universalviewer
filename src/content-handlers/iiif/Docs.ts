import { Config as ModelViewerExtensionConfig } from "@/content-handlers/iiif/extensions/uv-model-viewer-extension/config/Config";
import { Config as AlephExtensionConfig } from "@/content-handlers/iiif/extensions/uv-aleph-extension/config/Config";
import { Config as AVExtensionConfig } from "@/content-handlers/iiif/extensions/uv-av-extension/config/Config";
import { Config as EbookExtensionConfig } from "@/content-handlers/iiif/extensions/uv-ebook-extension/config/Config";
import { Config as MediaElementExtensionConfig } from "@/content-handlers/iiif/extensions/uv-mediaelement-extension/config/Config";
import { Config as OSDExtensionConfig } from "@/content-handlers/iiif/extensions/uv-openseadragon-extension/config/Config";
import { Config as DefaultExtensionConfig } from "@/content-handlers/iiif/extensions/uv-default-extension/config/Config";
import { Config as PDFExtensionConfig } from "@/content-handlers/iiif/extensions/uv-pdf-extension/config/Config";

export type IIIFContentHandlerConfig = {
  aleph: AlephExtensionConfig;
  av: AVExtensionConfig;
  default: DefaultExtensionConfig;
  ebook: EbookExtensionConfig;
  mediaelement: MediaElementExtensionConfig;
  modelViewer: ModelViewerExtensionConfig;
  osd: OSDExtensionConfig;
  pdf: PDFExtensionConfig;
};
