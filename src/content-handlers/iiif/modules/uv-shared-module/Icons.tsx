import React from "react";

interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: React.CSSProperties;
}

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
