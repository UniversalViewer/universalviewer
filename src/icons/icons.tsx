import React from "react";

interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: React.CSSProperties;
}

export const Bookmark: React.FC<IconProps> = ({
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
  >
    <g>
      <polygon points="20,23.1 15,19.1 10,23 10,8 20,8" />
    </g>
  </svg>
);

export const Contrast: React.FC<IconProps> = ({
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

export const Download: React.FC<IconProps> = ({
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
  >
    <path
      d="M19.4,14.1L15,18.5l-4.4-4.4l1.2-1.3L14,15V8h2v7l2.2-2.1L19.4,14.1z M20,17v3c-3.3,0-6.7,0-10,0
        v-3H8c0,1.7,0,3.3,0,5c4.7,0,9.3,0,14,0c0-1.7,0-3.3,0-5H20z"
    />
  </svg>
);

export const ExitFullScreen: React.FC<IconProps> = ({
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
  >
    <g id="XMLID_467_">
      <polygon points="22,17 19.3,17 17,17 17,18.6 17,22 19,22 19,19 22,19 	" />
      <polygon points="17,8 17,10.7 17,13 18.6,13 22,13 22,11 19,11 19,8 	" />
      <polygon points="8,13 10.7,13 13,13 13,11.4 13,8 11,8 11,11 8,11 	" />
      <polygon points="13,22 13,19.3 13,17 11.4,17 8,17 8,19 11,19 11,22 	" />
    </g>
  </svg>
);

export const FirstPage: React.FC<IconProps> = ({
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
  >
    <g>
      <path d="M19.5,8V22l-7-7L19.5,8z M10.5,22h2V8h-2V22z" />
    </g>
  </svg>
);

export const FullScreen: React.FC<IconProps> = ({
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
  >
    <g>
      <polygon points="13,8 10.3,8 8,8 8,9.6 8,13 10,13 10,10 13,10 	" />
      <polygon points="8,17 8,19.7 8,22 9.6,22 13,22 13,20 10,20 10,17 	" />
      <polygon points="17,22 19.7,22 22,22 22,20.4 22,17 20,17 20,20 17,20 	" />
      <polygon points="22,13 22,10.3 22,8 20.4,8 17,8 17,10 20,10 20,13 	" />
    </g>
  </svg>
);

export const Goto: React.FC<IconProps> = ({
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
  >
    <g>
      <polygon points="15,15 8,22 8,8 	" />
      <polygon points="22,15 15,22 15,8 	" />
    </g>
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
  >
    <path d="M14,14H8V8h6V14z M22,8h-6v6h6V8z M14,16H8v6h6V16z M22,16h-6v6h6V16z" />
  </svg>
);

export const LastPage: React.FC<IconProps> = ({
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
  >
    <path d="M17.5,15l-7,7V8L17.5,15z M19.5,8h-2v14h2V8z" />{" "}
  </svg>
);

export const NextPage: React.FC<IconProps> = ({
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
  >
    <polygon points="19,15 12,22 12,8 " />
  </svg>
);

export const OneUp: React.FC<IconProps> = ({
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
  >
    <g>
      <rect x="10" y="8" width="10" height="14" />
    </g>
  </svg>
);

export const OpenLeftPanel: React.FC<IconProps> = ({
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
  >
    <path d="M8,8v14h14V8H8z M9,21V9h3v12H9z M21,21h-8V9h8V21z M19,15l-3.1,3.1v-6.2L19,15z" />
  </svg>
);

export const OpenRightPanel: React.FC<IconProps> = ({
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
  >
    <path d="M8,8v14h14V8H8z M18,21V9h3v12H18z M9,9h8v12H9V9z M14.1,11.9v6.2L11,15L14.1,11.9z" />
  </svg>
);

export const PreviousPage: React.FC<IconProps> = ({
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
  >
    <polygon points="11.5,15 18.5,22 18.5,8 " />
  </svg>
);

export const Print: React.FC<IconProps> = ({
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
  >
    <g>
      <polygon points="21,14 21,19 20,19 20,17 10,17 10,19 9,19 9,14 10,14 20,14 			" />
      <path
        d="M19,13V9h-8v4H19z M19,22v-2v-1v-1h-8v1v1v2H19z M21,19v-5h-1H10H9v5h1v-2h10v2H21z M22,13v7
				h-2v3H10v-3H8v-7h2V8h10v5H22z"
      />
    </g>
  </svg>
);

export const Rotate: React.FC<IconProps> = ({
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

export const Search: React.FC<IconProps> = ({
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
  >
    <path
      d="M22.3,20.2l-3.6-3.6c0.5-0.8,0.8-1.8,0.8-2.9c0-3.2-2.6-5.8-5.8-5.8S8,10.6,8,13.8
      c0,3.2,2.6,5.8,5.8,5.8c1,0,2-0.3,2.9-0.8l3.6,3.6L22.3,20.2z M10,13.8c0-2.1,1.7-3.8,3.8-3.8s3.8,1.7,3.8,3.8s-1.7,3.8-3.8,3.8
      S10,15.8,10,13.8z"
    />
  </svg>
);

export const Settings: React.FC<IconProps> = ({
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

export const Share: React.FC<IconProps> = ({
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
  >
    <path
      d="M19.3,16.5c-0.8,0-1.4,0.3-1.9,0.8l-3.9-1.9c0-0.2,0.1-0.4,0.1-0.6c0,0,0-0.1,0-0.1l3.8-1.9
	c0.5,0.5,1.2,0.8,1.9,0.8c1.5,0,2.8-1.2,2.8-2.8C22,9.2,20.8,8,19.3,8s-2.8,1.2-2.8,2.8c0,0,0,0.1,0,0.1l-3.8,1.9
	c-0.5-0.5-1.2-0.8-1.9-0.8C9.2,12,8,13.2,8,14.8c0,1.5,1.2,2.8,2.8,2.8c0.6,0,1.1-0.2,1.6-0.5l4.2,2.1c0,0,0,0.1,0,0.1
	c0,1.5,1.2,2.8,2.8,2.8s2.8-1.2,2.8-2.8C22,17.7,20.8,16.5,19.3,16.5z"
    />
  </svg>
);

export const TwoUp: React.FC<IconProps> = ({
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
  >
    <polygon points="22,14 16,14 16,8 14,8 14,14 8,14 8,16 14,16 14,22 16,22 16,16 22,16 " />
  </svg>
);

export const ZoomOut: React.FC<IconProps> = ({
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
  >
    <rect x="8" y="14" width="14" height="2" />
  </svg>
);
