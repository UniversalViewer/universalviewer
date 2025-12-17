import { IIIFEvents } from "../../IIIFEvents";

const $ = require("jquery");
import { BaseView } from "./BaseView";
import { Position } from "./Position";
import { sanitize, isVisible } from "../../../../Utils";
import { Bools } from "../../Utils";
import { BaseConfig } from "../../BaseConfig";

export class CenterPanel<
  // todo: create new BaseConfig for backgroundPane
  T extends BaseConfig["modules"]["centerPanel"],
> extends BaseView<T> {
  $content: JQuery;

  constructor($element: JQuery) {
    super($element, false, true);
  }

  create(): void {
    super.create();

    this.$content = $('<div id="content" class="content"></div>');
  }

  resize(): void {
    super.resize();
  }
}
