// import React from "react";
// import { OneUp, TwoUp, Gallery } from "../../../../icons/icons";

// interface PageToggleProps {
//   onOneUpClick: () => void;
//   onTwoUpClick: () => void;
//   isPaged: boolean;
//   isTwoUp: boolean;
//   onGalleryClick: () => void;
// }

// const PageToggle: React.FC<PageToggleProps> = ({
//   onOneUpClick,
//   onTwoUpClick,
//   onGalleryClick,
//   isPaged,
//   isTwoUp,
// }) => {
//   const containerStyle = {};

//   return (
//     <div className="osd-controls" style={containerStyle}>
//       {isPaged && (
//         <button
//           className={`btn imageBtn ${isTwoUp ? "one-up" : "two-up"}`}
//           onClick={isTwoUp ? onOneUpClick : onTwoUpClick}
//         >
//           {isTwoUp ? <OneUp aria-hidden="true" /> : <TwoUp aria-hidden="true" />}
//         </button>
//       )}
//       <button className="btn imageBtn gallery" onClick={onGalleryClick}>
//         <Gallery aria-hidden="true" />
//       </button>
//     </div>
//   );
// };

// export default PageToggle;
