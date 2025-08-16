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
  AnnotationBody,
  ManifestResource,
  Rendering,
  LanguageMap,
  Sequence,
  Manifest,
} from "manifesto.js";
import { DownloadOption } from "../../modules/uv-shared-module/DownloadOption";
import { MediaType } from "@iiif/vocabulary";
import { CroppedImageDimensions } from "./CroppedImageDimensions";

const DownloadDialogue = ({
  canvases,
  confinedImageSize,
  content,
  downloadCurrentViewEnabled,
  downloadWholeImageHighResEnabled,
  downloadWholeImageLowResEnabled,
  getConfinedImageDimensions,
  getConfinedImageUri,
  getCroppedImageDimensions,
  locale,
  manifest,
  maxImageWidth,
  mediaDownloadEnabled,
  onClose,
  onDownloadCurrentView,
  onDownloadSelection,
  onShowTermsOfUse,
  open,
  paged,
  parent,
  resources,
  requiredStatement,
  rotation,
  selectionEnabled,
  sequence,
  termsOfUseEnabled,
  triggerButton,
}: {
  canvases: Canvas[];
  confinedImageSize: number;
  content: { [key: string]: string };
  downloadCurrentViewEnabled: boolean;
  downloadWholeImageHighResEnabled: boolean;
  downloadWholeImageLowResEnabled: boolean;
  getConfinedImageDimensions: (canvas: Canvas) => Size | null;
  getConfinedImageUri: (canvas: Canvas) => string | null;
  getCroppedImageDimensions: (canvas: Canvas) => CroppedImageDimensions | null;
  locale: string;
  manifest: Manifest;
  maxImageWidth: number;
  mediaDownloadEnabled: boolean;
  onClose: () => void;
  onDownloadCurrentView: (canvas: Canvas) => void;
  onDownloadSelection: () => void;
  onShowTermsOfUse: () => void;
  open: boolean;
  paged: boolean;
  parent: HTMLElement;
  resources: IExternalResourceData[] | null;
  requiredStatement: string | null | undefined;
  rotation: number;
  selectionEnabled: boolean;
  sequence: Sequence;
  termsOfUseEnabled: boolean;
  triggerButton: HTMLElement;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: "0px", left: "0px" });
  const [arrowPosition, setArrowPosition] = useState("0px 0px");
  const [selectedPage, setSelectedPage] = useState<"left" | "right">("left");
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

      // Focus on the first element when opened
      const focusableElements = getFocusableElements();
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0]?.focus();
      }
    }
  }, [open]);

  // Method to get focusable elements inside the component
  const getFocusableElements = (): NodeListOf<HTMLElement> | null => {
    return ref.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
  };

  // Focus trapping logic
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusableElements = getFocusableElements();
      if (!focusableElements) return;

      const firstFocusableElement = focusableElements[0] as HTMLElement;
      const lastFocusableElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // If Shift + Tab is pressed and the focus is on the first element, go to the last
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        // If Tab is pressed and the focus is on the last element, go to the first
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleTabKey);
    }

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [open]);

  if (!open) return null;

  function getCanvasDimensions(canvas: Canvas): Size | null {
    // externalResource may not have loaded yet
    if (canvas.externalResource.data) {
      const width: number | undefined = (
        canvas.externalResource.data as IExternalImageResourceData
      ).width;
      const height: number | undefined = (
        canvas.externalResource.data as IExternalImageResourceData
      ).height;
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
    const selectedResource: IExternalResourceData | null =
      getSelectedResource();

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
        if (!downloadCurrentViewEnabled) {
          return false;
        }

        return !paged;
      case DownloadOption.WHOLE_IMAGE_HIGH_RES:
        // If high-res download is disabled, bail out now; otherwise drop into cases below.
        if (!downloadWholeImageHighResEnabled) {
          return false;
        }
      case DownloadOption.CANVAS_RENDERINGS:
      case DownloadOption.IMAGE_RENDERINGS:
        const maxDimensions: Size | null = canvas.getMaxDimensions();

        if (maxDimensions) {
          if (maxDimensions.width <= maxImageWidth) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      case DownloadOption.WHOLE_IMAGE_LOW_RES:
        if (!downloadWholeImageLowResEnabled) {
          return false;
        }

        // hide low-res option if hi-res width is smaller than constraint
        const size: Size | null = getCanvasComputedDimensions(canvas);
        if (!size) {
          return false;
        }
        return Math.max(size.width, size.height) > confinedImageSize;
      case DownloadOption.SELECTION:
        return selectionEnabled;
      case DownloadOption.RANGE_RENDERINGS:
        if (canvas.ranges && canvas.ranges.length) {
          const range: Range = canvas.ranges[0];
          return range.getRenderings().length > 0;
        }
        return false;
      case DownloadOption.ENTIRE_FILE_AS_ORIGINAL:
        return mediaDownloadEnabled;
      default:
        return true;
    }
  }

  function getCanvasImageResource(canvas: Canvas): Resource | null {
    const images: Annotation[] = canvas.getImages();
    if (images[0]) {
      return images[0].getResource();
    }
    return null;
  }

  function getCanvasImageAnnotationBody(canvas: Canvas): AnnotationBody | null {
    const images: Annotation[] = canvas.getContent();
    if (images.length == 0) {
      return null;
    }

    const bodies: AnnotationBody[] = images[0].getBody();
    if (bodies.length == 0) {
      return null;
    }

    return bodies[0];
  }

  function getCanvasMimeType(canvas: Canvas): string | null {
    // presentation api version 2
    const resource: Resource | null = getCanvasImageResource(canvas);

    if (resource) {
      const format: MediaType | null = resource.getFormat();

      if (format) {
        return format.toString();
      }
    }

    // presentation api version 3
    const annotationBody: AnnotationBody | null =
      getCanvasImageAnnotationBody(canvas);
    if (annotationBody) {
      const format: MediaType | null = annotationBody.getFormat();

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
        label = Strings.format(content.wholeImageHighRes, "?", "?", mime);
      }
    } else {
      label = hasNormalDimensions
        ? Strings.format(
            content.wholeImageHighRes,
            size.width.toString(),
            size.height.toString(),
            mime
          )
        : Strings.format(
            content.wholeImageHighRes,
            size.height.toString(),
            size.width.toString(),
            mime
          );
    }

    return label;
  }

  function getWholeImageLowResLabel() {
    const canvas: Canvas = getSelectedCanvas();
    const size: Size | null = getConfinedImageDimensions(canvas);

    let label = "";

    if (size) {
      label = hasNormalDimensions
        ? Strings.format(
            content.wholeImageLowResAsJpg,
            size.width.toString(),
            size.height.toString()
          )
        : Strings.format(
            content.wholeImageLowResAsJpg,
            size.height.toString(),
            size.width.toString()
          );
    }

    return label;
  }

  function getCurrentViewLabel() {
    let label: string = content.currentViewAsJpg;
    const dimensions: CroppedImageDimensions | null =
      getCroppedImageDimensions(getSelectedCanvas());

    // dimensions
    if (dimensions) {
      label = hasNormalDimensions
        ? Strings.format(
            label,
            dimensions.size.width.toString(),
            dimensions.size.height.toString()
          )
        : Strings.format(
            label,
            dimensions.size.height.toString(),
            dimensions.size.width.toString()
          );
    }

    return label;
  }

  function Renderings({
    resource,
    defaultLabel,
  }: {
    resource: ManifestResource;
    defaultLabel: string;
  }) {
    const renderings: Rendering[] = resource.getRenderings();

    return (
      <>
        {renderings.map((rendering: Rendering, index: number) => {
          let label: string | null = LanguageMap.getValue(
            rendering.getLabel(),
            locale
          );

          if (label) {
            label += " ({0})";
          } else {
            label = defaultLabel;
          }

          const mime: string = Files.simplifyMimeType(
            rendering.getFormat().toString()
          );

          label = Strings.format(label!, mime);

          return (
            <li key={index}>
              <button
                onClick={() => {
                  window.open(rendering.id, "_blank");
                }}
              >
                {label}
              </button>
            </li>
          );
        })}
      </>
    );
  }

  // function getRangeRenderings(): boolean {
  //   return resource.getRenderings().length > 0;
  // }

  function RangeRenderings() {
    const canvas: Canvas = getSelectedCanvas();

    return (
      <>
        {canvas.ranges?.map((range: Range, index) => (
          <Renderings
            resource={range}
            defaultLabel={content.entireFileAsOriginal}
            key={`range-rendering-${String(index)}`}
          />
        ))}
      </>
    );
  }

  function ImageRenderings() {
    const canvas: Canvas = getSelectedCanvas();
    const images: Annotation[] = canvas.getImages();

    return (
      <>
        {images.map((image: Annotation, index) => (
          <Renderings
            resource={image.getResource()}
            defaultLabel={content.entireFileAsOriginal}
            key={`image-rendering-${String(index)}`}
          />
        ))}
      </>
    );
  }

  function CanvasRenderings() {
    const canvas: Canvas = getSelectedCanvas();

    return (
      <Renderings
        resource={canvas}
        defaultLabel={content.entireFileAsOriginal}
      />
    );
  }

  function hasManifestRenderings(): boolean {
    return (
      sequence.getRenderings().length > 0 || manifest.getRenderings.length > 0
    );
  }

  function ManifestRenderings() {
    return (
      <>
        <Renderings
          resource={sequence}
          defaultLabel={content.entireFileAsOriginal}
        />
        <Renderings
          resource={manifest}
          defaultLabel={content.entireFileAsOriginal}
        />
      </>
    );
  }

  function TermsOfUse() {
    return termsOfUseEnabled && requiredStatement ? (
      <button
        onClick={() => {
          onShowTermsOfUse();
        }}
      >
        {content.termsOfUse}
      </button>
    ) : null;
  }

  return (
    <div ref={ref} className={cx("overlay download")} style={position}>
      <div className="top"></div>
      <div className="middle">
        <div className="content">
          <div role="heading" className="heading">
            {content.download}
          </div>
          {/* <div className="nonAvailable">No download options are available</div> */}
          {/* if in two-up, show two pages next to each other to choose from */}
          <h2>{content.individualPages}</h2>
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
                <span className="label">
                  {canvases[0].getLabel().getValue()}
                </span>
              </div>
              <div
                onClick={() => {
                  setSelectedPage("right");
                }}
                className={cx("page right", {
                  selected: selectedPage === "right",
                })}
              >
                <span className="label">
                  {canvases[1].getLabel().getValue()}
                </span>
              </div>
            </div>
          )}
          <ol className="options">
            {isDownloadOptionAvailable(DownloadOption.CURRENT_VIEW) && (
              <li className="option single">
                <button
                  onClick={() => {
                    onDownloadCurrentView(getSelectedCanvas());
                  }}
                >
                  {getCurrentViewLabel()}
                </button>
              </li>
            )}
            {isDownloadOptionAvailable(DownloadOption.WHOLE_IMAGE_HIGH_RES) && (
              <li className="option single">
                <button
                  onClick={() => {
                    window.open(getCanvasHighResImageUri(getSelectedCanvas()));
                  }}
                >
                  {getWholeImageHighResLabel()}
                </button>
              </li>
            )}
            {isDownloadOptionAvailable(DownloadOption.WHOLE_IMAGE_LOW_RES) && (
              <li className="option single">
                <button
                  onClick={() => {
                    const imageUri: string | null =
                      getConfinedImageUri(getSelectedCanvas());

                    if (imageUri) {
                      window.open(imageUri);
                    }
                  }}
                >
                  {getWholeImageLowResLabel()}
                </button>
              </li>
            )}
            {isDownloadOptionAvailable(DownloadOption.RANGE_RENDERINGS) && (
              <RangeRenderings />
            )}
            {isDownloadOptionAvailable(DownloadOption.IMAGE_RENDERINGS) && (
              <ImageRenderings />
            )}
            {isDownloadOptionAvailable(DownloadOption.CANVAS_RENDERINGS) && (
              <CanvasRenderings />
            )}
          </ol>
          {(hasManifestRenderings() ||
            isDownloadOptionAvailable(DownloadOption.SELECTION)) && (
            <h2>{content.allPages}</h2>
          )}
          <ol className="options">
            {isDownloadOptionAvailable(DownloadOption.MANIFEST_RENDERINGS) && (
              <ManifestRenderings />
            )}
            {isDownloadOptionAvailable(DownloadOption.SELECTION) && (
              <li className="option single">
                <button
                  onClick={() => {
                    onDownloadSelection();
                  }}
                >
                  {content.selection}
                </button>
              </li>
            )}
          </ol>
          <div className="footer">
            <TermsOfUse />
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
            {content.close}
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
