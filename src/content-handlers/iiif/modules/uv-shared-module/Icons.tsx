import React from "react";

interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: React.CSSProperties;
}

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
