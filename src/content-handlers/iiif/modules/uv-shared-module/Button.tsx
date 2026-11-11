import React from "react";

export interface ButtonProps
  extends Omit<React.ComponentPropsWithRef<"button">, "title" | "aria-label"> {
  label: string;
}

export default function Button({ label, className, children, ...rest }: ButtonProps) {
  const classes = ["btn", "imageBtn", className].filter(Boolean).join(" ");

  return (
    <button {...rest} type="button" className={classes} aria-label={label}>
      {children}
      <span className="tooltip" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}