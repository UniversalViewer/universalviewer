import { IUVData } from "../../../../IUVData";
import { Config } from "./config/Config";

export interface IPDFExtensionData extends IUVData<Config> {
  anchor: string | null;
}
