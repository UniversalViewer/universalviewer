import { BaseConfig } from "@/content-handlers/iiif/BaseConfig";

type Modules = {};

export type Config = BaseConfig & {
  modules: Modules;
};
