import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { Files, Maths, Strings } from "@edsilv/utils";
import {
  Canvas,
  Size,
  Range,
  IExternalResourceData,
  Utils,
  IExternalImageResourceData,
  Resource,
  Annotation,
} from "manifesto.js";
import { DownloadOption } from "../../modules/uv-shared-module/DownloadOption";
import { MediaType } from "@iiif/vocabulary";

const DownloadDialogue = ({
  config,
  onClose,
  onDownloadCurrentView,
  open,
  canvases,
  paged,
  parent,
  rotation,
  triggerButton,
  resources,
}: {
  config: {
    options: { [key: string]: string | number | boolean };
    content: { [key: string]: string };
  };
  onClose: () => void;
  onDownloadCurrentView: (canvas: Canvas) => void;
  open: boolean;
  canvases: Canvas[];
  paged: boolean;
  parent: HTMLElement;
  rotation: number;
  triggerButton: HTMLElement;
  resources: IExternalResourceData[] | null;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ top: "0px", left: "0px" });
  const [arrowPosition, setArrowPosition] = useState("0px 0px");

  const hasNormalDimensions: boolean = rotation % 180 == 0;

  useEffect(() => {
    if (open) {
      const top: number =
        parent.clientHeight -
        ref.current!.clientHeight -
        triggerButton.clientHeight;

      let left: number =
        triggerButton.getBoundingClientRect().left -
        parent.getBoundingClientRect().left;

      const normalisedPos: number = Maths.normalise(
        left,
        0,
        parent.clientWidth
      );

      left =
        parent.clientWidth * normalisedPos -
        ref.current!.clientWidth * normalisedPos;

      const arrowLeft = ref.current!.clientWidth * normalisedPos;

      setPosition({ top: `${top}px`, left: `${left}px` });
      setArrowPosition(`${arrowLeft}px 0px`);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const [selectedPage, setSelectedPage] = useState<"left" | "right">("left");

  function getCanvasDimensions(canvas: Canvas): Size | null {
    // externalResource may not have loaded yet
    if (canvas.externalResource.data) {
      const width: number | undefined = (canvas.externalResource
        .data as IExternalImageResourceData).width;
      const height: number | undefined = (canvas.externalResource
        .data as IExternalImageResourceData).height;
      if (width && height) {
        return new Size(width, height);
      }
    }

    return null;
  }

  function getCanvasComputedDimensions(canvas: Canvas): Size | null {
    const imageSize: Size | null = getCanvasDimensions(canvas);
    const requiredSize: Size | null = canvas.getMaxDimensions();

    if (!imageSize) {
      return null;
    }

    if (!requiredSize) {
      return imageSize;
    }

    if (
      imageSize.width <= requiredSize.width &&
      imageSize.height <= requiredSize.height
    ) {
      return imageSize;
    }

    const scaleW: number = requiredSize.width / imageSize.width;
    const scaleH: number = requiredSize.height / imageSize.height;
    const scale: number = Math.min(scaleW, scaleH);

    return new Size(
      Math.floor(imageSize.width * scale),
      Math.floor(imageSize.height * scale)
    );
  }

  function isLevel0(profile: any): boolean {
    if (!profile || !profile.length) return false;

    return Utils.isLevel0ImageProfile(profile[0]);
  }

  function getSelectedCanvas(): Canvas {
    return canvases[selectedPage === "left" ? 0 : 1];
  }

  function getSelectedResource(): IExternalResourceData | null {
    if (resources && resources.length) {
      if (resources.length > 1) {
        return resources[selectedPage === "left" ? 0 : 1];
      } else {
        return resources[0];
      }
    }

    return null;
  }

  function isDownloadOptionAvailable(option: DownloadOption) {
    const selectedResource: IExternalResourceData | null = getSelectedResource();

    if (!selectedResource) {
      return false;
    }

    const canvas: Canvas = getSelectedCanvas();

    // if the external resource doesn't have a service descriptor or is level 0
    // only allow wholeImageHighRes
    if (
      !canvas.externalResource.hasServiceDescriptor() ||
      isLevel0(canvas.externalResource.data.profile)
    ) {
      if (option === DownloadOption.WHOLE_IMAGE_HIGH_RES) {
        // if in one-up mode, or in two-up mode with a single page being shown
        if (!(paged || (paged && selectedResource))) {
          return true;
        }
      }
      return false;
    }

    switch (option) {
      case DownloadOption.CURRENT_VIEW:
        return !paged;
      case DownloadOption.CANVAS_RENDERINGS:
      case DownloadOption.IMAGE_RENDERINGS:
      case DownloadOption.WHOLE_IMAGE_HIGH_RES:
        const maxDimensions: Size | null = canvas.getMaxDimensions();

        if (maxDimensions) {
          if (maxDimensions.width <= config.options.maxImageWidth) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      case DownloadOption.WHOLE_IMAGE_LOW_RES:
        // hide low-res option if hi-res width is smaller than constraint
        const size: Size | null = getCanvasComputedDimensions(canvas);
        if (!size) {
          return false;
        }
        return !paged && size.width > config.options.confinedImageSize;
      case DownloadOption.SELECTION:
        return config.options.selectionEnabled;
      case DownloadOption.RANGE_RENDERINGS:
        if (canvas.ranges && canvas.ranges.length) {
          const range: Range = canvas.ranges[0];
          return range.getRenderings().length > 0;
        }
        return false;
      default:
        return false; // super.isDownloadOptionAvailable(option);
    }
  }

  function getCanvasImageResource(canvas: Canvas): Resource | null {
    const images: Annotation[] = canvas.getImages();
    if (images[0]) {
      return images[0].getResource();
    }
    return null;
  }

  function getCanvasMimeType(canvas: Canvas): string | null {
    const resource: Resource | null = getCanvasImageResource(canvas);

    if (resource) {
      const format: MediaType | null = resource.getFormat();

      if (format) {
        return format.toString();
      }
    }

    return null;
  }

  function getCanvasHighResImageUri(canvas: Canvas): string {
    const size: Size | null = getCanvasComputedDimensions(canvas);

    if (size) {
      const width: number = size.width;
      let uri: string = canvas.getCanonicalImageUri(width);

      if (
        canvas.externalResource &&
        canvas.externalResource.hasServiceDescriptor()
      ) {
        const uriParts: string[] = uri.split("/");
        uriParts[uriParts.length - 2] = String(rotation);
        uri = uriParts.join("/");
      }

      return uri;
    } else if (
      canvas.externalResource &&
      !canvas.externalResource.hasServiceDescriptor()
    ) {
      // if there is no image service, return the dataUri.
      return canvas.externalResource.dataUri as string;
    }

    return "";
  }

  function getWholeImageHighResLabel(): string {
    let label: string = "";
    const canvas: Canvas = getSelectedCanvas();

    let mime: string | null = getCanvasMimeType(canvas);

    if (mime) {
      mime = Files.simplifyMimeType(mime);
    } else {
      mime = "?";
    }

    // dimensions
    const size: Size | null = getCanvasComputedDimensions(canvas);

    if (!size) {
      // if there is no image service, allow the image to be downloaded directly.
      if (
        canvas.externalResource &&
        !canvas.externalResource.hasServiceDescriptor()
      ) {
        label = Strings.format(
          config.content.wholeImageHighRes,
          "?",
          "?",
          mime
        );
      }
    } else {
      label = hasNormalDimensions
        ? Strings.format(
            config.content.wholeImageHighRes,
            size.width.toString(),
            size.height.toString(),
            mime
          )
        : Strings.format(
            config.content.wholeImageHighRes,
            size.height.toString(),
            size.width.toString(),
            mime
          );
    }

    return label;
  }

  return (
    <div ref={ref} className={cx("overlay download")} style={position}>
      <div className="top"></div>
      <div className="middle">
        <div className="content">
          <div role="heading" className="heading">
            {config.content.download}
          </div>
          {/* <div className="nonAvailable">No download options are available</div> */}
          {/* if in two-up, show two pages next to each other to choose from */}
          {canvases.length === 2 && (
            <div className="pages">
              <div
                onClick={() => {
                  setSelectedPage("left");
                }}
                className={cx("page left", {
                  selected: selectedPage === "left",
                })}
              >
                {canvases[0].getLabel().getValue()}
              </div>
              <div
                onClick={() => {
                  setSelectedPage("right");
                }}
                className={cx("page right", {
                  selected: selectedPage === "right",
                })}
              >
                {canvases[1].getLabel().getValue()}
              </div>
            </div>
          )}
          <ol className="options">
            <li className="group image">
              <ul>
                {isDownloadOptionAvailable(DownloadOption.CURRENT_VIEW) && (
                  <li
                    className="option single"
                    onClick={() => {
                      onDownloadCurrentView(getSelectedCanvas());
                    }}
                  >
                    <button>{config.content.currentViewAsJpg}</button>
                  </li>
                )}
                {isDownloadOptionAvailable(
                  DownloadOption.WHOLE_IMAGE_HIGH_RES
                ) && (
                  <li className="option single">
                    <button
                      onClick={() => {
                        window.open(
                          getCanvasHighResImageUri(getSelectedCanvas())
                        );
                      }}
                    >
                      {getWholeImageHighResLabel()}
                    </button>
                  </li>
                )}
                {isDownloadOptionAvailable(
                  DownloadOption.WHOLE_IMAGE_LOW_RES
                ) && (
                  <li className="option single">
                    <button>{config.content.wholeImageLowRes}</button>
                  </li>
                )}
              </ul>
            </li>
            <li className="group canvas">
              <ul>
                <li className="option dynamic">Original source file</li>
                <li className="option dynamic">Raw OCR Data</li>
                <li className="option dynamic">Technical Metadata (xml)</li>
              </ul>
            </li>
            <li className="group manifest">
              <ul>
                <li className="option">selection</li>
                <li className="option dynamic">pdf</li>
              </ul>
            </li>
          </ol>
          <div className="footer">
            <a href="#">Terms of Use</a>
          </div>
        </div>
        <div className="buttons">
          <button
            type="button"
            className="btn btn-default close"
            tabIndex={0}
            onClick={() => {
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div
        className={cx("bottom")}
        style={{
          backgroundPosition: arrowPosition,
        }}
      ></div>
    </div>
  );
};

export default DownloadDialogue;
