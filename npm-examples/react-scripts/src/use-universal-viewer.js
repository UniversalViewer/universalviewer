import { useLayoutEffect, useState } from "react";
import { init } from "universalviewer";

export function useEvent(viewer, name, cb) {
  useLayoutEffect(() => {
    if (viewer) {
      return viewer.subscribe(name, cb);
    }
  }, [viewer]);
}

export function useUniversalViewer(ref, options, resizeIfTheseChange = []) {
  const [uv, setUv] = useState();

  useLayoutEffect(() => {
    if (uv) {
      try {
        ref.current.firstChild.style.width = ref.current.offsetWidth + "px";
        ref.current.firstChild.style.height = ref.current.offsetHeight + "px";
        uv.resize();
      } catch (e) {
        // This may fail if we are disposed.
      }
    }
  }, resizeIfTheseChange);

  useLayoutEffect(() => {
    const currentUv = init(ref.current, options);
    setUv(currentUv);

    return () => {
      currentUv.dispose();
    };
  }, []);

  return uv;
}
