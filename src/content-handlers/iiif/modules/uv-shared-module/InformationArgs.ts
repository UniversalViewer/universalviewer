import { InformationType } from "./InformationType";

export class InformationArgs {

  informationType: InformationType;
  param: any;

  constructor(informationType: InformationType, param: any) {
    this.informationType = informationType;
    this.param = param;
  }
}
