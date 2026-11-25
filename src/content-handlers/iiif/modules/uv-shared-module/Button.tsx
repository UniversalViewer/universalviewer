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

// Tooltip warm-up: once a tooltip has been shown, the viewer gets a "warm" class and css shows the next tooltip without a delay.
const TOOLTIP_DELAY_MS = 300;
const WARMUP_MS = 300;
const WARM_CLASS = "uv-tooltips-warm";
let warmRoot: Element | null = null;
let warmTimer: number | undefined;
let coolTimer: number | undefined;

function warmUp(root: Element) {
  root.classList.add(WARM_CLASS);
  warmRoot = root;
}

function coolDown() {
  window.clearTimeout(warmTimer);
  window.clearTimeout(coolTimer);
  warmRoot?.classList.remove(WARM_CLASS);
  warmRoot = null;
}

export default function Button({
  label,
  tooltipPlacement = "bottom",
  tooltipAlign = "center",
  className,
  children,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  ...rest
}: ButtonProps) {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  useEffect(() => {
    if (tooltipDismissed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTooltipDismissed(true);
        coolDown();
      }
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
    window.clearTimeout(coolTimer); // stay warm while on a button

    const root = e.currentTarget.closest(".uv");
    if (root && !root.classList.contains(WARM_CLASS)) {
      warmTimer = window.setTimeout(() => warmUp(root), TOOLTIP_DELAY_MS);
    }

    onPointerEnter?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    window.clearTimeout(warmTimer); // left before the tooltip appeared
    coolTimer = window.setTimeout(coolDown, WARMUP_MS);
    onPointerLeave?.(e);
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
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
    >
      {children}
      <span className={tooltipClasses} aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
