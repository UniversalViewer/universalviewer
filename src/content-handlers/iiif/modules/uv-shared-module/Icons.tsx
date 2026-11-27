import React from "react";

interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: React.CSSProperties;
}

export const AdjustImage: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <g>
      <path
        d="M15,22.5c-1,0-2-0.2-2.9-0.6c-0.9-0.4-1.7-0.9-2.4-1.6c-0.7-0.7-1.2-1.5-1.6-2.4
		C7.7,17,7.5,16,7.5,15s0.2-2,0.6-2.9S9,10.4,9.7,9.7c0.7-0.7,1.5-1.2,2.4-1.6C13,7.7,14,7.5,15,7.5s2,0.2,2.9,0.6s1.7,0.9,2.4,1.6
		c0.7,0.7,1.2,1.5,1.6,2.4c0.4,0.9,0.6,1.9,0.6,2.9s-0.2,2-0.6,2.9c-0.4,0.9-0.9,1.7-1.6,2.4c-0.7,0.7-1.5,1.2-2.4,1.6
		C17,22.3,16,22.5,15,22.5z M15.8,20.9c1.5-0.2,2.7-0.8,3.7-2s1.5-2.4,1.5-4s-0.5-2.9-1.5-4s-2.3-1.8-3.7-2V20.9z"
      />
    </g>
  </svg>
);

export const CollapseRightPanel: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 8L22 8L22 22L8 22L8 8ZM20 10L18 10L18 20L20 20L20 10ZM16 10L10 10L10 20L16 20L16 10ZM12 11L15 15L12 19L12 11Z" />
    <rect x="37" y="20" width="8" height="8" />
    <rect x="53" y="21" width="8" height="8" />
  </svg>
);

export const CollapseLeftPanel: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M22 22H8V8H22V22ZM10 20H12V10H10V20ZM14 20H20V10H14V20ZM18 19L15 15L18 11V19Z" />
    <rect x="37" y="20" width="8" height="8" />
    <rect x="53" y="21" width="8" height="8" />
  </svg>
);

export const ExpandRightPanel: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 8L22 8L22 22L8 22L8 8ZM20 10L18 10L18 20L20 20L20 10ZM16 10L10 10L10 20L16 20L16 10ZM11 15L14 11L14 19L11 15Z" />
    <rect x="30" y="22" width="8" height="8" />
    <rect x="53" y="21" width="8" height="8" />
  </svg>
);

export const ExpandLeftPanel: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M22 22H8V8H22V22ZM10 20H12V10H10V20ZM14 20H20V10H14V20ZM19 15L16 19V11L19 15Z" />
  </svg>
);

export const FitImage: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M10 20H13V22H8V17H10V20ZM22 22H17V20H20V17H22V22ZM15 12C16.6569 12 18 13.3431 18 15C18 16.6569 16.6569 18 15 18C13.3431 18 12 16.6569 12 15C12 13.3431 13.3431 12 15 12ZM15 13.5C14.1716 13.5 13.5 14.1716 13.5 15C13.5 15.8284 14.1716 16.5 15 16.5C15.8284 16.5 16.5 15.8284 16.5 15C16.5 14.1716 15.8284 13.5 15 13.5ZM13 10H10V13H8V8H13V10ZM22 13H20V10H17V8H22V13Z" />
  </svg>
);

export const Gallery: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M14,14H8V8h6V14z M22,8h-6v6h6V8z M14,16H8v6h6V16z M22,16h-6v6h6V16z" />
  </svg>
);

export const Layers: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M15 23L7 17.1207L8.46667 16.0709L15 20.8583L21.5333 16.0709L23 17.1207L15 23ZM15 18.7585L7 12.8793L15 7L23 12.8793L15 18.7585ZM15 16.6168L20.1111 12.8793L15 9.14173L9.88889 12.8793L15 16.6168Z"
      fill="white"
    />
  </svg>
);

export const OneUp: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <g>
      <rect x="10" y="8" width="10" height="14" />
    </g>
  </svg>
);

export const Rotate: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <g>
      <path
        d="M15,22.5c-2.1,0-3.9-0.7-5.3-2.2S7.5,17.1,7.5,15s0.7-3.9,2.2-5.3s3.2-2.2,5.3-2.2
		c1.1,0,2.1,0.2,3.1,0.7s1.8,1.1,2.5,1.9V7.5h1.9v6.6h-6.6v-1.9h3.9c-0.5-0.9-1.2-1.6-2.1-2.1C17,9.6,16,9.4,15,9.4
		c-1.6,0-2.9,0.5-4,1.6s-1.6,2.4-1.6,4s0.5,2.9,1.6,4s2.4,1.6,4,1.6c1.2,0,2.3-0.3,3.3-1s1.6-1.6,2-2.7h2c-0.4,1.7-1.3,3-2.7,4.1
		S16.7,22.5,15,22.5z"
      />
    </g>
  </svg>
);

export const Settings: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M20.5,13.5c-0.1-0.5-0.3-1-0.6-1.4l1.1-1.6C20.5,10,20,9.4,19.4,8.9L17.9,10
	c-0.4-0.3-0.9-0.4-1.4-0.6l-0.3-1.9c-0.8,0-1.6,0-2.4,0l-0.3,2c-0.5,0.1-1,0.3-1.4,0.6l-1.6-1.1C9.9,9.5,9.4,10,8.8,10.6l1.2,1.6
	c-0.3,0.4-0.4,0.9-0.6,1.4l-1.9,0.3c0,0.8,0,1.6,0,2.4l2,0.3c0.1,0.5,0.3,1,0.6,1.4l-1.2,1.6c0.6,0.6,1.1,1.1,1.7,1.7l1.6-1.2
	c0.4,0.2,0.9,0.4,1.4,0.5l0.3,1.9c0.8,0,1.6,0,2.4,0l0.3-2c0.5-0.1,0.9-0.3,1.4-0.6l1.6,1.2c0.6-0.6,1.1-1.1,1.7-1.7L20,17.8
	c0.2-0.4,0.4-0.9,0.5-1.4l1.9-0.3c0-0.8,0-1.6,0-2.4L20.5,13.5z M15,17.6c-3.3,0-3.3-5.2,0-5.2S18.3,17.6,15,17.6z"
    />
  </svg>
);

export const TwoUp: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <g>
      <g>
        <rect x="4" y="8" width="10" height="14" />
      </g>
      <g>
        <rect x="16" y="8" width="10" height="14" />
      </g>
    </g>
  </svg>
);

export const ZoomIn: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path d="M16 14H20V16H16V20H14V16H10V14H14V10H16V14Z" />
  </svg>
);

export const ZoomOut: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect x="10" y="14" width="10" height="2" />
  </svg>
);
