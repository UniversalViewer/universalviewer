import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import {
  IIIFPlayer,
  MediaPlayer,
  StructuredNavigation,
  Transcript,
} from "@samvera/ramp";
import { UVSyncBridge } from "./UVSyncBridge";
import { getRampProps, RampModuleConfig } from "./getRampProps";

const PLAYER_ID = "ramp-player";

interface RAMPBridgeProps {
  manifestUrl: string;
  rampConfig: RampModuleConfig;
  centerPanelEl: HTMLElement | null;
  navEl: HTMLElement | null;
  transcriptEl: HTMLElement | null;
  extensionHost: any;
  startCanvasId?: string;
  startCanvasTime?: number;
}

export function RAMPBridge({
  manifestUrl,
  rampConfig,
  startCanvasId,
  startCanvasTime,
  centerPanelEl,
  navEl,
  transcriptEl,
  extensionHost,
}: RAMPBridgeProps) {
  const props = useMemo(
    () =>
      getRampProps(rampConfig, {
        manifestUrl,
        startCanvasId,
        startCanvasTime,
        playerID: PLAYER_ID,
      }),
    [rampConfig, manifestUrl, startCanvasId, startCanvasTime]
  );

  return (
    <IIIFPlayer
      manifestUrl={manifestUrl}
      startCanvasId={startCanvasId}
      startCanvasTime={startCanvasTime}
    >
      {/* Sync bridge lives inside the context tree but renders nothing */}
      <UVSyncBridge extensionHost={extensionHost} />

      {/* MediaPlayer portals into the center panel content area */}
      {centerPanelEl &&
        createPortal(
          <div className="ramp-player-scope">
            <MediaPlayer {...props.mediaPlayer} />
          </div>,
          centerPanelEl
        )}

      {navEl &&
        createPortal(
          <StructuredNavigation {...props.structuredNavigation} />,
          navEl
        )}

      {transcriptEl &&
        createPortal(<Transcript {...props.transcript} />, transcriptEl)}
    </IIIFPlayer>
  );
}
