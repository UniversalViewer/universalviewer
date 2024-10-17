import { IUVData } from "../../../../IUVData";
import { Config } from "./config/Config";

export interface IEbookExtensionData extends IUVData<Config> {
  cfi: string;
}
