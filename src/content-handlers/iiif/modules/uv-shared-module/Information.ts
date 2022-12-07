import { InformationAction } from "./InformationAction";

export class Information {
  message: string;
  actions: InformationAction[];

  constructor(message: string, actions: InformationAction[]) {
    this.message = message;
    this.actions = actions;
  }
}
