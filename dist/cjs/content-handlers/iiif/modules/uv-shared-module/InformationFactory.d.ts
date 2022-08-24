import { Information } from "./Information";
import { InformationArgs } from "./InformationArgs";
import { IExtension } from "./IExtension";
export declare class InformationFactory {
    extension: IExtension;
    constructor(extension: IExtension);
    Get(args: InformationArgs): Information;
}
