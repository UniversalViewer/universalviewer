import { Strings } from "../../Utils";

function switchClass(element: JQuery, class1: string, class2: string) {
  return element.each(function () {
    $(this).removeClass(class1).addClass(class2);
  });
}

function removeLastWord(element: any, chars: number = 8, depth: number = 0) {
  return element.each(function () {
    const $self: JQuery = $(this);
    if ($self.contents().length > 0) {
      const $lastElement = $self.contents().last();
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

      removeLastWord($lastElement, chars, depth + 1); // Element
    } else if (depth > 0) {
      // Empty element
      $self.remove();
    }
  });
}

export default function toggleExpandTextByLines(
  items: JQuery,
  lines: number,
  lessText: string,
  moreText: string,
  cb: () => void,
  lessAriaLabelTemplate: string = "Less information: Hide {0}",
  moreAriaLabelTemplate: string = "More information: Reveal {0}"
) {
  return items.each(function () {
    const $self: JQuery = $(this);
    const $label: JQuery = $self.find(".label");
    const $values: JQuery = $self.find(".value");
    $values.each(function (i, value) {
      const $value = $(value);
      const expandedText: string = $value.html();
      const labelText: string = $label
        .contents()
        .filter(function () {
          return this.nodeType === Node.TEXT_NODE;
        })
        .text()
        .trim();
      // add 'pad' to account for the right margin in the sidebar
      const $buttonPad: JQuery = $(
        '<span>&hellip; <a href="#" class="toggle more">morepad</a></span>'
      );
      // when height changes, store string, then pick from line counts
      const stringsByLine: string[] = [expandedText];
      let lastHeight = $self.height();
      // Until empty
      while ($value.text().length > 0) {
        removeLastWord($value);
        const html: string = $value.html();
        $value.append($buttonPad);

        const valueHeight = $value.height();
        if (
          valueHeight !== undefined &&
          lastHeight !== undefined &&
          lastHeight > valueHeight
        ) {
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
          switchClass($toggleButton, "less", "more");
          $toggleButton.attr("aria-label", lessAriaLabel);
        } else {
          const moreAriaLabel: string = Strings.format(
            moreAriaLabelTemplate,
            labelText
          );
          $value.html(collapsedText + "&hellip; ");
          $toggleButton.text(moreText);
          switchClass($toggleButton, "more", "less");
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
  });
}
