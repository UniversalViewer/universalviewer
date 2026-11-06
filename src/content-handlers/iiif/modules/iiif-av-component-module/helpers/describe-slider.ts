// Presents a jQuery UI slider to screen readers: its handle is a slider, with
// a name and its current value, as a number and in words (`text`). Does
// nothing until the slider exists.
export function describeSlider(
  $slider: JQuery,
  label: string,
  text: string
): void {
  if (!$slider.slider("instance")) {
    return;
  }
  $slider.find(".ui-slider-handle").attr({
    role: "slider",
    "aria-label": label,
    "aria-valuemin": $slider.slider("option", "min"),
    "aria-valuemax": $slider.slider("option", "max"),
    "aria-valuenow": $slider.slider("value"),
    "aria-valuetext": text,
  });
}
