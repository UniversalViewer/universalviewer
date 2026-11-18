const $ = require("jquery");
import { BaseComponent, IBaseComponentOptions } from "@iiif/base-component";
import { CaptionTrack } from "./CaptionTrack";
import { CaptionStyle, captionStyleId } from "./CaptionStyle";

export class CaptionsEvents {
  // Fired with the id of the caption track chosen, or null for none.
  static CAPTION_TRACK_CHOSEN = "captiontrackchosen";
  // Fired with the id of the caption style (colours) chosen.
  static CAPTION_STYLE_CHOSEN = "captionstylechosen";
}

// The control's text, from the player's (localised) content.
export interface CaptionsContent {
  captions: string;
  captionsOff: string;
  captionLanguages: string;
  captionColours: string;
  captionWhiteOnBlack: string;
  captionBlackOnWhite: string;
  captionDarkBlueOnPeach: string;
  captionDarkRedOnMint: string;
  captionDarkPurpleOnYellow: string;
}

export interface CaptionsControlState {
  // The caption tracks to offer.
  tracks: CaptionTrack[];
  // The id of the track being shown, or null for none.
  shownId: string | null;
  // The caption styles (colours) to offer.
  styles: CaptionStyle[];
  // The id of the one chosen (captionStyleId).
  styleId: string;
}

let menuCount = 0;

const menuItem = (label: string, checked: boolean): JQuery =>
  $('<div role="menuitemradio" tabindex="-1"></div>')
    .attr("aria-checked", String(checked))
    .text(label);

// Identifies an item across rebuilds of the menu.
const itemKey = (item: HTMLElement): string =>
  item.hasAttribute("data-style")
    ? `style:${item.getAttribute("data-style")}`
    : `track:${item.getAttribute("data-id")}`;

// The captions button and its menu, in two groups: the languages ("Off" plus
// one item per caption track) and the colours. The button's name says which
// captions are showing. The control is hidden while there are no tracks to
// offer. Choosing a language fires CAPTION_TRACK_CHOSEN with the track's id,
// or null for "Off"; choosing colours fires CAPTION_STYLE_CHOSEN.
export class CaptionsControl extends BaseComponent {
  private _$button: JQuery;
  private _$menu: JQuery;
  private _$languages: JQuery;
  private _$colours: JQuery;
  private _$element: JQuery;
  private _rebuilding = false;
  private _closeOnOutsidePress = (e: Event) => {
    if (!this._$element[0].contains(e.target as Node)) {
      this._close(false);
    }
  };

  constructor(options: IBaseComponentOptions) {
    super(options);
    this._init();
  }

  protected _init(): boolean {
    const success: boolean = super._init();
    const content: CaptionsContent = this.options.data.content;
    const menuId = `captions-menu-${++menuCount}`;

    this._$element = $(this.el);
    this._$button = $(`
      <button type="button" class="btn captions-button" aria-haspopup="menu" aria-expanded="false" aria-controls="${menuId}">
        <i class="captions-icon" aria-hidden="true"></i>
        <span class="sr-only"></span>
      </button>
    `);
    this._setButtonLabel(content.captions);

    this._$menu = $(
      `<div class="captions-menu" role="menu" id="${menuId}"></div>`
    );
    this._$languages = $('<div class="captions-languages" role="group"></div>');
    this._$colours = $('<div class="captions-colours" role="group"></div>');
    this._$menu
      .attr("aria-label", content.captions)
      .append(
        this._$languages.attr("aria-label", content.captionLanguages),
        $('<div class="captions-separator" role="separator"></div>'),
        this._$colours.attr("aria-label", content.captionColours)
      )
      .hide();

    this._$element.append(this._$button, this._$menu).hide();

    this._$button.on("click", () => {
      if (this._isOpen()) {
        this._close(true);
      } else {
        this._open();
      }
    });

    this._$button.on("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        this._open();
      }
    });

    this._$menu.on("click", "[role=menuitemradio]", (e: Event) => {
      this._choose($(e.currentTarget));
    });

    this._$menu.on("keydown", (e: KeyboardEvent) => this._onMenuKeydown(e));

    // Close the menu when focus leaves it some other way than its keys, e.g.
    // a screen reader moving focus elsewhere. Rebuilding the menu removes the
    // focused item, which also moves focus, so that's not a reason to close.
    this._$element.on("focusout", (e: JQuery.FocusOutEvent) => {
      const to = e.relatedTarget as Node | null;
      if (!this._rebuilding && !(to && this._$element[0].contains(to))) {
        this._close(false);
      }
    });

    return success;
  }

  // Offers the given tracks, with the one being shown checked (or "Off"),
  // and the colours, with the chosen ones checked.
  public set({ tracks, shownId, styles, styleId }: CaptionsControlState): void {
    const content: CaptionsContent = this.options.data.content;
    const languages = [
      { id: "", label: content.captionsOff },
      ...tracks.map((track) => ({ id: track.id, label: track.label || "" })),
    ];
    const shown =
      languages.find(({ id }) => id === (shownId || "")) || languages[0];
    const $focused = this._items().filter(
      (_, item) => item === document.activeElement
    );
    const focusedKey = $focused.length ? itemKey($focused[0]) : undefined;

    this._rebuilding = true;
    this._$languages
      .empty()
      .append(
        languages.map(({ id, label }) =>
          menuItem(label, id === shown.id).attr("data-id", id)
        )
      );
    this._$colours.empty().append(
      styles.map((style) =>
        menuItem(style.label, captionStyleId(style) === styleId)
          .attr("data-style", captionStyleId(style))
          .prepend(
            // A sample of the colours, drawn by CSS so it isn't read out.
            $('<span class="captions-swatch" aria-hidden="true"></span>').css({
              backgroundColor: style.background,
              color: style.color,
            })
          )
      )
    );

    this._setButtonLabel(`${content.captions}: ${shown.label}`);
    this._$button.toggleClass("on", !!shownId);
    this._$element.toggle(tracks.length > 0);

    if (!tracks.length) {
      this._close(false);
    } else if (focusedKey !== undefined) {
      // The menu was rebuilt while open (e.g. the canvas changed): keep focus
      // on the same item where it's still offered, otherwise on "Off".
      const $same = this._items().filter(
        (_, item) => itemKey(item) === focusedKey
      );
      this._focus($same.length ? $same : this._items().first());
    }
    this._rebuilding = false;
  }

  public destroy(): void {
    document.removeEventListener("mousedown", this._closeOnOutsidePress);
  }

  // The button's name, also its tooltip, e.g. "Captions: Welsh captions".
  private _setButtonLabel(label: string): void {
    this._$button.attr("title", label);
    this._$button.find(".sr-only").text(label);
  }

  private _items(): JQuery {
    return this._$menu.find("[role=menuitemradio]");
  }

  // Focuses an element without scrolling the player's containers (which may
  // hide overflow); a menu item is scrolled into view within the menu.
  private _focus($element: JQuery): void {
    const element = $element[0] as HTMLElement | undefined;
    if (!element) {
      return;
    }
    element.focus({ preventScroll: true });

    const menu = this._$menu[0];
    if (menu.contains(element)) {
      const top = element.offsetTop;
      const bottom = top + element.offsetHeight;
      if (top < menu.scrollTop) {
        menu.scrollTop = top;
      } else if (bottom > menu.scrollTop + menu.clientHeight) {
        menu.scrollTop = bottom - menu.clientHeight;
      }
    }
  }

  // Keeps the open menu within what the player shows: above the button and
  // below the top of whatever clips it (the window, or a container hiding
  // overflow), scrolling the menu when it's taller than that.
  private _fitMenu(): void {
    const menu = this._$menu[0];
    menu.style.maxHeight = "";

    let top = 0;
    for (let el = menu.parentElement; el; el = el.parentElement) {
      if (getComputedStyle(el).overflowY !== "visible") {
        top = Math.max(top, el.getBoundingClientRect().top);
      }
    }

    const available = menu.getBoundingClientRect().bottom - top - 4;
    if (menu.scrollHeight > available) {
      menu.style.maxHeight = `${Math.floor(available)}px`;
    }
  }

  private _isOpen(): boolean {
    return this._$button.attr("aria-expanded") === "true";
  }

  private _open(): void {
    this._$menu.show();
    this._fitMenu();
    this._$button.attr("aria-expanded", "true");
    document.addEventListener("mousedown", this._closeOnOutsidePress);

    // Focus starts on the language showing.
    const $checked = this._$languages.find("[aria-checked=true]");
    this._focus($checked.length ? $checked : this._items().first());
  }

  private _close(returnFocus: boolean): void {
    this._$menu.hide();
    this._$button.attr("aria-expanded", "false");
    document.removeEventListener("mousedown", this._closeOnOutsidePress);

    if (returnFocus) {
      this._focus(this._$button);
    }
  }

  private _choose($item: JQuery): void {
    this._close(true);

    const styleId = $item.attr("data-style");
    if (styleId) {
      this.fire(CaptionsEvents.CAPTION_STYLE_CHOSEN, styleId);
    } else {
      this.fire(
        CaptionsEvents.CAPTION_TRACK_CHOSEN,
        $item.attr("data-id") || null
      );
    }
  }

  private _onMenuKeydown(e: KeyboardEvent): void {
    const $items = this._items();
    const index = $items.index(document.activeElement as HTMLElement);
    const focus = (i: number) =>
      this._focus($items.eq((i + $items.length) % $items.length));

    switch (e.key) {
      case "ArrowDown":
        focus(index + 1);
        break;
      case "ArrowUp":
        focus(index - 1);
        break;
      case "Home":
        focus(0);
        break;
      case "End":
        focus($items.length - 1);
        break;
      case "Enter":
      case " ":
        if (index !== -1) {
          this._choose($items.eq(index));
        }
        break;
      case "Escape":
        this._close(true);
        break;
      case "Tab":
        this._close(false);
        return;
      default:
        return;
    }
    e.preventDefault();
  }

  protected _resize(): void {
    // no-op
  }
}
