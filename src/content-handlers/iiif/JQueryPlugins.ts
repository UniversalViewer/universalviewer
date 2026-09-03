import { Strings } from "../iiif/Utils";

export default function jqueryPlugins($) {
  $.fn.checkboxButton = function (onClick: (checked: boolean) => void) {
    return this.each(function () {
      const $this: JQuery = $(this);

      $this.on(
        "click",
        function (e) {
          const tagName: string = (<any>e.target).tagName;
          const $checkbox: JQuery = $(this).find(":checkbox");

          if (tagName !== "INPUT") {
            e.preventDefault();
            $checkbox.prop("checked", !$checkbox.prop("checked"));
          }

          const checked: boolean = $checkbox.is(":checked");
          onClick.call(this, checked);
        },
        0
      );
    });
  };

  $.fn.disable = function () {
    return this.each(function () {
      const $this: JQuery = $(this);
      $this.addClass("disabled");
      $this.data("tabindex", $this.attr("tabindex"));
      $this.removeAttr("tabindex");
    });
  };

  $.fn.ellipsis = function (chars: number) {
    return this.each(function () {
      const $self: JQuery = $(this);
      const text: string = $self.text();

      if (text.length > chars) {
        let trimmedText: string = text.substr(0, chars);
        trimmedText = trimmedText.substr(
          0,
          Math.min(trimmedText.length, trimmedText.lastIndexOf(" "))
        );

        $self.empty().html(trimmedText + "&hellip;");
      }
    });
  };

  $.fn.ellipsisFill = function (text: string) {
    let textPassed: boolean = true;
    if (!text) textPassed = false;

    return this.each(function () {
      const $self: JQuery = $(this);

      if (!textPassed) text = $self.text();

      $self.empty();

      const $spanElem: JQuery = $('<span title="' + text + '"></span>');
      $self.append($spanElem);
      $self.css("overflow", "hidden");
      $spanElem.css("white-space", "nowrap");
      $spanElem.html(text);

      // get the width of the span.
      // if it's wider than the container, remove a word until it's not.
      if ($spanElem.width() > $self.width()) {
        let lastText: string | null = null;

        while ($spanElem.width() > $self.width()) {
          let t: string = $spanElem.html();
          t = t.substring(0, t.lastIndexOf(" ")) + "&hellip;";
          if (t === lastText) break;
          $spanElem.html(t);
          lastText = t;
        }
      }
    });
  };

  // Truncates to a certain number of letters, while ignoring and preserving HTML
  $.fn.ellipsisHtmlFixed = function (chars: number, cb: Function) {
    return this.each(function () {
      const $self: JQuery = $(this);
      const expandedText: string = $self.html();

      const $trunc: JQuery = $("<span></span>");
      $trunc.html(
        $self
          .html()
          .replace(/\s[\s]*/g, " ")
          .trim()
      );

      if ($trunc.text().trim().length <= chars) {
        return; // do nothing if we're under the limit!
      }

      while ($trunc.text().trim().length > chars) {
        $trunc.removeLastWord(chars);
      }

      const collapsedText: string = $trunc.html();

      // Toggle function
      let expanded: boolean = false;

      (<any>$self).toggle = function () {
        $self.empty();

        const $toggleButton: JQuery = $('<a href="#" class="toggle"></a>');

        if (expanded) {
          $self.html(expandedText + " ");
          $toggleButton.text("less");
          $toggleButton.switchClass("less", "more");
        } else {
          $self.html(collapsedText + "&hellip; ");
          $toggleButton.text("more");
          $toggleButton.switchClass("more", "less");
        }

        $toggleButton.one("click", function (e) {
          e.preventDefault();
          $self.toggle();
        });

        expanded = !expanded;

        $self.append($toggleButton);

        if (cb) cb();
      };

      $self.toggle();
    });
  };

  $.fn.enable = function () {
    return this.each(function () {
      const $self: JQuery = $(this);
      $self.removeClass("disabled");
      $self.attr("tabindex", $self.data("tabindex"));
    });
  };

  $.fn.equaliseHeight = function (reset: boolean, average: boolean) {
    let maxHeight: number = -1;
    let minHeight: number = Number.MAX_VALUE;
    const heights: number[] = [];

    // reset all heights to auto first so they can be re-measured.
    if (reset) {
      this.each(function () {
        $(this).height("auto");
      });
    }

    this.each(function () {
      const currentHeight: number = $(this).height();
      heights.push(currentHeight);
      maxHeight = maxHeight > currentHeight ? maxHeight : currentHeight;
      minHeight = minHeight < currentHeight ? minHeight : currentHeight;
    });

    let finalHeight: number = maxHeight;

    if (average) {
      heights.sort(function (a, b) {
        return a - b;
      });
      const half = Math.floor(heights.length / 2);

      if (heights.length % 2) {
        finalHeight = heights[half];
      } else {
        finalHeight = (heights[half - 1] + heights[half]) / 2.0;
      }
    }

    this.each(function () {
      $(this).height(finalHeight);
    });

    return this;
  };

  $.fn.getVisibleElementWithGreatestTabIndex = function () {
    const $self: JQuery = $(this);

    let maxTabIndex: number = 0;
    let $elementWithGreatestTabIndex: JQuery | null = null;

    $self.find("*:visible[tabindex]").each(function (
      index: number,
      el: Element
    ) {
      const $el: JQuery = $(el);
      const tabIndex: number = parseInt($el.attr("tabindex"));
      if (tabIndex > maxTabIndex) {
        maxTabIndex = tabIndex;
        $elementWithGreatestTabIndex = $el;
      }
    });

    return $elementWithGreatestTabIndex;
  };

  $.fn.horizontalMargins = function () {
    const $self: JQuery = $(this);
    return (
      parseInt($self.css("marginLeft")) + parseInt($self.css("marginRight"))
    );
  };

  $.fn.leftMargin = function () {
    const $self: JQuery = $(this);
    return parseInt($self.css("marginLeft"));
  };

  $.fn.rightMargin = function () {
    const $self: JQuery = $(this);
    return parseInt($self.css("marginRight"));
  };

  $.fn.horizontalPadding = function () {
    const $self: JQuery = $(this);
    return (
      parseInt($self.css("paddingLeft")) + parseInt($self.css("paddingRight"))
    );
  };

  $.fn.leftPadding = function () {
    const $self: JQuery = $(this);
    return parseInt($self.css("paddingLeft"));
  };

  $.fn.rightPadding = function () {
    const $self: JQuery = $(this);
    return parseInt($self.css("paddingRight"));
  };

  $.mlp = { x: 0, y: 0 }; // Mouse Last Position
  function documentHandler() {
    const $current: JQuery = this === document ? $(this) : $(this).contents();
    $current.mousemove(function (e) {
      $.mlp = { x: e.pageX, y: e.pageY };
    });
    $current.find("iframe").on("load", documentHandler);
  }
  $(documentHandler);
  $.fn.ismouseover = function () {
    let result: boolean = false;
    this.eq(0).each(function () {
      const $current: JQuery = $(this).is("iframe")
        ? $(this).contents().find("body")
        : $(this);
      const offset: JQueryCoordinates = $current.offset();
      result =
        offset.left <= $.mlp.x &&
        offset.left + $current.outerWidth() > $.mlp.x &&
        offset.top <= $.mlp.y &&
        offset.top + $current.outerHeight() > $.mlp.y;
    });
    return result;
  };

  const on = $.fn.on;
  let timer: any;

  $.fn.on = function () {
    const args: any = Array.apply(null, arguments);
    const last: any = args[args.length - 1];

    if (isNaN(last) || (last === 1 && args.pop())) return on.apply(this, args);

    const delay: any = args.pop();
    const fn: any = args.pop();

    args.push(function () {
      const self: any = this;
      const params: any = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(self, params);
      }, delay);
    });

    return on.apply(this, args);
  };

  $.fn.onEnter = function (cb: Function) {
    return this.each(function () {
      const $this: JQuery = $(this);

      $this.on(
        "keyup",
        function (e) {
          if (e.keyCode === 13) {
            e.preventDefault();
            cb();
          }
        },
        0
      );
    });
  };

  $.fn.onPressed = function (cb: Function) {
    return this.each(function () {
      const $this: JQuery = $(this);

      $this.on(
        "click",
        function (e) {
          e.preventDefault();
          cb(e);
        },
        0
      );

      $this.on(
        "keydown",
        function (e) {
          if (e.keyCode === 13) {
            e.preventDefault();
            cb(e);
          }
        },
        0
      );
    });
  };

  // Recursively removes the last empty element (img, audio, etc) or word in an element
  $.fn.removeLastWord = function (chars: number = 8, depth: number = 0) {
    return this.each(function () {
      const $self: JQuery = $(this);
      if ($self.contents().length > 0) {
        const $lastElement: JQuery = $self.contents().last();
        if ($lastElement[0].nodeType === 3) {
          const words: string[] = $lastElement.text().trim().split(" ");
          if (words.length > 1) {
            words.splice(words.length - 1, 1);
            (<any>$lastElement[0]).data = words.join(" "); // textnode.data
            return;
          } else if (
            "undefined" !== typeof chars &&
            words.length === 1 &&
            words[0].length > chars
          ) {
            (<any>$lastElement[0]).data = words.join(" ").substring(0, chars);
            return;
          }
        }

        $lastElement.removeLastWord(chars, depth + 1); // Element
      } else if (depth > 0) {
        // Empty element
        $self.remove();
      }
    });
  };

  $.fn.switchClass = function (class1: string, class2: string) {
    return this.each(function () {
      $(this).removeClass(class1).addClass(class2);
    });
  };

  $.fn.targetBlank = function () {
    return this.each(function () {
      $(this).find("a").prop("target", "_blank");
    });
  };

  $.fn.toggleExpandText = function (
    chars: number,
    lessText: string,
    moreText: string,
    cb: () => void
  ) {
    return this.each(function () {
      const $self: JQuery = $(this);
      const expandedText: string = $self.html();

      if (chars > expandedText.length) return;

      let expanded: boolean = false;

      let collapsedText: string = expandedText.substr(0, chars);
      collapsedText = collapsedText.substr(
        0,
        Math.min(collapsedText.length, collapsedText.lastIndexOf(" "))
      );

      (<any>$self).toggle = function () {
        $self.empty();

        const $toggleButton: JQuery = $('<a href="#" class="toggle"></a>');

        if (expanded) {
          $self.html(expandedText + "&nbsp;");
          $toggleButton.text(lessText);
          $toggleButton.switchClass("less", "more");
        } else {
          $self.html(collapsedText + "&nbsp;");
          $toggleButton.text(moreText);
          $toggleButton.switchClass("more", "less");
        }

        $toggleButton.one("click", function (e) {
          e.preventDefault();
          $self.toggle();
        });

        expanded = !expanded;

        $self.append($toggleButton);

        if (cb) cb();
      };

      $self.toggle();
    });
  };

  // Toggle expansion by number of lines
  $.fn.toggleExpandTextByLines = function (
    lines: number,
    lessText: string,
    moreText: string,
    cb: () => void,
    lessAriaLabelTemplate: string = "Less information: Hide {0}",
    moreAriaLabelTemplate: string = "More information: Reveal {0}"
  ) {
    return this.each(function () {
      const $self: JQuery = $(this);
      const $label: JQuery = $self.find(".label");
      const $value: JQuery = $self.find(".value");
      const expandedText: string = $value.html();
      const labelText: string = $label.html();
      // add 'pad' to account for the right margin in the sidebar
      const $buttonPad: JQuery = $(
        '<span>&hellip; <a href="#" class="toggle more">morepad</a></span>'
      );
      // when height changes, store string, then pick from line counts
      const stringsByLine: string[] = [expandedText];
      let lastHeight: number = $self.height();
      // Until empty
      while ($value.text().length > 0) {
        $value.removeLastWord();
        const html: string = $value.html();
        $value.append($buttonPad);

        if (lastHeight > $value.height()) {
          stringsByLine.unshift(html);
          lastHeight = $value.height();
        }

        $buttonPad.remove();
      }

      if (stringsByLine.length <= lines) {
        $value.html(expandedText);
        return;
      }

      const collapsedText: string = stringsByLine[lines - 1];

      // Toggle function
      let expanded: boolean = false;

      (<any>$value).toggle = function () {
        $value.empty();
        const $toggleButton: JQuery = $('<a href="#" class="toggle"></a>');
        if (expanded) {
          const lessAriaLabel: string = Strings.format(
            lessAriaLabelTemplate,
            labelText
          );
          $value.html(expandedText + " ");
          $toggleButton.text(lessText);
          $toggleButton.switchClass("less", "more");
          $toggleButton.attr("aria-label", lessAriaLabel);
        } else {
          const moreAriaLabel: string = Strings.format(
            moreAriaLabelTemplate,
            labelText
          );
          $value.html(collapsedText + "&hellip; ");
          $toggleButton.text(moreText);
          $toggleButton.switchClass("more", "less");
          $toggleButton.attr("aria-label", moreAriaLabel);
        }
        $toggleButton.one("click", function (e) {
          e.preventDefault();
          $value.toggle();
        });
        expanded = !expanded;
        $value.append($toggleButton);
        if (cb) cb();
      };
      $value.toggle();
    });
  };

  $.fn.toggleText = function (text1: string, text2: string) {
    return this.each(function () {
      const $self: JQuery = $(this);

      if ($self.text() === text1) {
        $(this).text(text2);
      } else {
        $(this).text(text1);
      }
    });
  };

  $.fn.updateAttr = function (
    attrName: string,
    oldVal: string,
    newVal: string
  ) {
    return this.each(function () {
      const $self: JQuery = $(this);
      let attr: string = $self.attr(attrName);

      if (attr && attr.indexOf(oldVal) === 0) {
        attr = attr.replace(oldVal, newVal);
        $self.attr(attrName, attr);
      }
    });
  };

  $.fn.verticalMargins = function () {
    const $self: JQuery = $(this);
    return (
      parseInt($self.css("marginTop")) + parseInt($self.css("marginBottom"))
    );
  };

  $.fn.verticalPadding = function () {
    const $self: JQuery = $(this);
    return (
      parseInt($self.css("paddingTop")) + parseInt($self.css("paddingBottom"))
    );
  };
}

interface JQuery {
  attr: any;
  css: any;
  append: any;
  text: any;
  toggle: any;
  html: any;
  empty: any;
  one: any;
  remove: any;
  height: any;
  contents: any;
  outerWidth: any;
  outerHeight: any;
  offset: any;
  mousemove: any;
  find: any;
  data: any;
  addClass: any;
  removeClass: any;
  width: any;
  removeAttr: any;
  prop: any;
  is: any;
  checkboxButton(onClicked: (checked: boolean) => void): void;
  disable(): void;
  ellipsis(chars: number): string;
  ellipsisFill(text?: string): any;
  ellipsisFixed(chars: number, buttonText: string): any;
  ellipsisHtmlFixed(chars: number, callback: () => void): any;
  enable(): void;
  equaliseHeight(reset?: boolean, average?: boolean): any;
  getVisibleElementWithGreatestTabIndex(): any;
  horizontalMargins(): number;
  horizontalPadding(): number;
  ismouseover(): boolean;
  leftMargin(): number;
  leftPadding(): number;
  on(
    events: string,
    handler: (eventObject: JQueryEventObject, ...args: any[]) => any,
    wait: Number
  ): JQuery;
  onEnter(callback: () => void): any;
  onPressed(callback: (e: any) => void): any;
  removeLastWord(chars?: number, depth?: number): any;
  rightMargin(): number;
  rightPadding(): number;
  switchClass(class1: string, class2: string): any;
  targetBlank(): void;
  toggleExpandText(
    chars: number,
    lessText: string,
    moreText: string,
    cb: () => void
  ): any;
  toggleExpandTextByLines(
    lines: number,
    lessText: string,
    moreText: string,
    cb: () => void
  ): any;
  toggleText(text1: string, text2: string): any;
  updateAttr(attrName: string, oldVal: string, newVal: string): void;
  verticalMargins(): number;
  verticalPadding(): number;
}
