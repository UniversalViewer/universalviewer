import React from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";
export interface ButtonProps
  extends Omit<React.ComponentPropsWithRef<"button">, "title" | "aria-label"> {
  label: string;
  tooltipPlacement?: TooltipPlacement;
  tooltipAlign?: TooltipAlign;
}

export default function Button({
  label,
  tooltipPlacement = "bottom",
  tooltipAlign = "center",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = ["btn", "imageBtn", className].filter(Boolean).join(" ");
  const tooltipClasses = [
    "uv-tooltip",
    `uv-tooltip--${tooltipPlacement}`,
    `uv-tooltip--align-${tooltipAlign}`,
  ].join(" ");

  return (
    <button {...rest} type="button" className={classes} aria-label={label}>
      {children}
      <span className={tooltipClasses} aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
