import { BaseView } from "./BaseView";
import { ModuleConfig } from "../../BaseConfig";

export class BackgroundPanel<T extends ModuleConfig> extends BaseView<T> {
  constructor($element: JQuery) {
    super($element);
  }
}
