import React, { useEffect, useState } from "react";

const ThumbsViewReact = ({
  manifestId,
  paged,
}: {
  manifestId: string;
  paged: boolean;
}) => {
  const [thumbs, setThumbs] = useState([]);

  useEffect(() => {
    setThumbs([
      {
        label: "thumb 1",
      },
      {
        label: "thumb 2",
      },
      {
        label: "thumb 3",
      },
    ]);
  }, []);

  return (
    <>
      {paged ? "paged" : "not paged"}
      {thumbs.map((thumb) => (
        <div key={thumb.label}>{thumb.label}</div>
      ))}
    </>
  );
};

export default ThumbsViewReact;
