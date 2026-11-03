import { BaseView } from "./BaseView";
import { BaseConfig } from "../../BaseConfig";

export class BackgroundPanel<
  T extends BaseConfig["modules"]["backgroundPanel"],
> extends BaseView<T> {
  constructor($element: JQuery) {
    super($element);
  }
}
