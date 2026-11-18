const $ = require("jquery");

// A control button: an icon, with a label that's both visually hidden text
// (for screen readers) and the button's tooltip.
export function controlButton(
  buttonClass: string,
  iconClass: string,
  label: string
): JQuery {
  const $button = $(`
    <button type="button">
      <i aria-hidden="true"></i>
      <span class="sr-only"></span>
    </button>
  `);
  $button.addClass(buttonClass).find("i").addClass(iconClass);
  setButtonLabel($button, label);
  return $button;
}

// Changes a control button's label, e.g. from "Play" to "Pause".
export function setButtonLabel($button: JQuery, label: string): void {
  $button.attr("title", label).find(".sr-only").text(label);
}
