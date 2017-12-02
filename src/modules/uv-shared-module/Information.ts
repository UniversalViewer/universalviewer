import {InformationAction} from "./InformationAction";

export class Information {
    constructor(public message: string, public actions: InformationAction[]) {

    }
}