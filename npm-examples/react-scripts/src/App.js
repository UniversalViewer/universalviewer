import React, { useRef, useState } from "react";
import "./style.css";
import "universalviewer/dist/esm/index.css";
import { useUniversalViewer, useEvent } from "./use-universal-viewer";
import { BaseEvents } from "universalviewer";

const UV = ({ manifest, parentWidth }) => {
  const el = useRef();
  const viewer = useUniversalViewer(
    el,
    {
      manifest,
    },
    [parentWidth]
  );

  useEvent(viewer, BaseEvents.CANVAS_INDEX_CHANGE, (cidx) => {
    console.log("New canvas index", cidx);
  });

  return <div ref={el} className="uv" />;
};

export default function App() {
  const [view, setView] = useState("1");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div>
        <button onClick={() => setView("1")}>One</button>
        <button onClick={() => setView("2")}>Two</button>
      </div>
      <div style={{ display: "flex", flex: "1 1 0px" }}>
        <div
          style={{
            width: view === "2" ? "50%" : "100%",
            display: "flex",
            alignContent: "stretch",
          }}
        >
          <UV
            manifest="https://iiif-commons.github.io/iiif-av-component/examples/data/bl/sounds-tests/loose-ends/C1685_98_P3.json"
            parentWidth={view === "2" ? "50%" : "100%"}
          />
        </div>
        {view === "2" ? (
          <div style={{ width: "50%", alignContent: "stretch" }}>
            <UV
              manifest="https://wellcomelibrary.org/iiif/b18035723/manifest"
              parentWidth={view === "2" ? "50%" : "100%"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
