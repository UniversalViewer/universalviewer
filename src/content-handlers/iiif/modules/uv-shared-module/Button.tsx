import React, { useEffect, useState } from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";
export interface ButtonProps
  // title and aria-label need to be omitted from the native props:
  // we're passing the content label for the aria-label instead,
  // and omitting title so the button doesn't create the native browser tooltip.
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
  onClick,
  onPointerEnter,
  onFocus,
  ...rest
}: ButtonProps) {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  useEffect(() => {
    if (tooltipDismissed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTooltipDismissed(true);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [tooltipDismissed]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTooltipDismissed(true);
    onClick?.(e);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    setTooltipDismissed(false);
    onPointerEnter?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    setTooltipDismissed(false);
    onFocus?.(e);
  };

  const classes = ["uv-btn", className].filter(Boolean).join(" ");
  const tooltipClasses = [
    "uv-tooltip",
    `uv-tooltip--${tooltipPlacement}`,
    `uv-tooltip--align-${tooltipAlign}`,
    tooltipDismissed && "uv-tooltip--dismissed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      type="button"
      className={classes}
      aria-label={label}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onFocus={handleFocus}
    >
      {children}
      <span className={tooltipClasses} aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
