import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import { Events, init, Viewer } from "..";
import { Events, init, Viewer } from '../../dist/esm/';

// type Duration = [number, number];

type UniversalViewerProps = {
  // autoPlay?: boolean;
  // duration?: number | Duration | null;
  iiifManifestId?: string;
  leftPanelEnabled?: boolean;
  // muted?: boolean;
  // rotation?: number | null;
  // target?: string | null;
  // youTubeVideoId?: string;
};

const UniversalViewer: React.FC<UniversalViewerProps> = ({
  // autoPlay,
  // duration = null,
  iiifManifestId,
  leftPanelEnabled,
  // muted,
  // rotation = null,
  // target = null,
  // youTubeVideoId,
}) => {
  const el = useRef<HTMLDivElement>(null);
  const uv = useRef<Viewer | null>(null);
  const refLoaded = useRef<boolean>(false);
  const refIIIFConfig = useRef<Object>({});
  const [loaded, setLoaded] = useState<boolean>(false);

  function initUV() {
    refLoaded.current = false;
    setLoaded(false);

    //if (iiifManifestId || youTubeVideoId) {
    if (iiifManifestId) {
      uv.current = init(el.current!, {
        iiifManifestId,
      });

      uv.current!.on(
        Events.LOAD,
        (_args?: any) => {
          if (el.current) {
            refLoaded.current = true;
            setLoaded(true);
            setTimeout(() => {
              uv.current!.resize();
            }, 250);
          }
        },
        false
      );

      uv.current!.on(
        Events.CONFIGURE,
        ({ config: _baseConfig, cb }: {
          config: Object;
          cb: Function;
        }) => {
          if (iiifManifestId) {
            cb(refIIIFConfig.current);
          }
          // else if (youTubeVideoId) {
          //   cb(refYouTubeConfig.current);
          // }
        },
        false
      );
    }
  }

  useLayoutEffect(() => {

    initUV();

    // cleanup
    return () => {
      uv.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iiifManifestId]); //[iiifManifestId, youTubeVideoId]);

  // when the target, duration, or rotation changes, update the viewer
  useEffect(() => {
    if (uv.current && refLoaded.current === true && loaded === true) {
      uv.current.set({
        iiifManifestId,
        // youTubeVideoId,
        // autoPlay,
        // muted,
        // target,
        // duration,
        // rotation: rotation !== 0 ? rotation : 360,
      } as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]); //[loaded, rotation, target, duration, autoPlay, muted]);

  // config changes
  useEffect(() => {
    uv.current?.dispose();

    refIIIFConfig.current = {
      options: {
        leftPanelEnabled,
      }
    }

    initUV();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPanelEnabled]);

  return useMemo(() => {
    return (
      <>
        {/* todo: can we use the css from the dist folder? */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/universalviewer@latest/dist/esm/index.css"
        />
        <div
          ref={el}
          id="uv"
          style={{
            width: "94vw",
            height: "100vh",
          }}
        />
      </>
    );
  }, []);
};

export default UniversalViewer;