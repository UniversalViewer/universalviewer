import { IUVData } from "./IUVData";
export declare const merge: any;
export declare const sanitize: (html: string) => any;
export declare const isValidUrl: (value: string) => boolean;
export declare const debounce: (callback: (args: any) => void, wait: number) => (...args: any[]) => void;
export declare const propertiesChanged: (newData: IUVData, currentData: IUVData, properties: string[]) => boolean;
export declare const propertyChanged: (newData: IUVData, currentData: IUVData, propertyName: string) => boolean;
export declare const loadScripts: (sources: string[]) => Promise<void>;
export declare const loadCSS: (sources: string[]) => Promise<void>;
export declare const isVisible: (el: JQuery) => boolean;
export declare const defaultLocale: {
    name: string;
};
export declare const getUUID: () => string;
