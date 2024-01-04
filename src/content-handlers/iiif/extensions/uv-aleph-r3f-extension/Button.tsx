import React, { useRef } from "react";
import cx from "classnames";
import { StoreApi, UseBoundStore } from "zustand";
import { State } from "./Store";
// import useStore from "./Store";

const Button = ({ getStore }: { getStore: UseBoundStore<StoreApi<State>> }) => {
  // const { ambientLightIntensity, setAmbientLightIntensity } = useStore();
  const { ambientLightIntensity, setAmbientLightIntensity } = getStore();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref}>
      <button
        className={cx("uv-aleph-r3f-extension-button")}
        onClick={() => {
          setAmbientLightIntensity(ambientLightIntensity + 0.1);
        }}
      >
        Intensity++
      </button>
      <br />
      intensity: {ambientLightIntensity}
    </div>
  );
};

export default Button;
