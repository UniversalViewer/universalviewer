import { MediaElement } from "../elements/media-element";
import { extractMediaFromAnnotationBodies } from "./extract-media-from-annotation-bodies";
import { getMediaSourceFromAnnotationBody } from "./get-media-source-from-annotation-body";
import { CompositeMediaElement } from "../elements/composite-media-element";
import { convertToPercentage } from "./convert-to-percentage";
import { Canvas } from "manifesto.js";

export function compositeMediaFromCanvases(
  canvases: Canvas[],
  options: { adaptiveAuthEnabled?: boolean }
) {
  const mediaElements: MediaElement[] = [];
  const waveforms: string[] = [];
  for (const canvas of canvases) {
    const annotations = canvas.getContent();
    for (const annotation of annotations) {
      const annotationBody = extractMediaFromAnnotationBodies(annotation);
      if (!annotationBody) {
        continue;
      }
      const mediaSource = getMediaSourceFromAnnotationBody(
        annotation,
        annotationBody,
        {
          id: canvas.id,
          duration: canvas.getDuration() || 0,
          height: canvas.getHeight(),
          width: canvas.getWidth(),
        }
      );

      const mediaElement = new MediaElement(mediaSource, options);

      mediaElement.setSize(
        convertToPercentage(mediaSource.x || 0, canvas.getHeight()),
        convertToPercentage(mediaSource.y || 0, canvas.getWidth()),
        convertToPercentage(
          mediaSource.width || canvas.getWidth(),
          canvas.getWidth()
        ),
        convertToPercentage(
          mediaSource.height || canvas.getHeight(),
          canvas.getHeight()
        )
      );

      mediaElements.push(mediaElement);

      const seeAlso: any = annotation.getProperty("seeAlso");
      if (seeAlso && seeAlso.length) {
        const dat: string = seeAlso[0].id;
        waveforms.push(dat);
      }
    }
  }

  return [new CompositeMediaElement(mediaElements), waveforms] as const;
}
