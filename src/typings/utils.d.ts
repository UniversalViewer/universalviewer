declare module Utils {
    class Bools {
        static GetBool(val: any, defaultVal: boolean): boolean;
    }
}
declare module Utils {
    class Color {
        static Float32ColorToARGB(float32Color: number): number[];
        private static _ComponentToHex(c);
        static RGBToHexString(rgb: number[]): string;
        static ARGBToHexString(argb: number[]): string;
        static Coalesce(arr: any[]): void;
    }
}
declare module Utils {
    class Dates {
        static GetTimeStamp(): number;
    }
}
declare module Utils.Measurement {
    class Size {
        width: number;
        height: number;
        constructor(width: number, height: number);
    }
    class Dimensions {
        static FitRect(width1: number, height1: number, width2: number, height2: number): Size;
    }
}
declare module Utils {
    class Numbers {
        static NumericalInput(event: JQueryKeyEventObject): boolean;
    }
}
declare module Utils {
    class Objects {
        static ConvertToPlainObject(obj: any): any;
    }
}
declare module Utils {
    class Strings {
        static Ellipsis(text: string, chars: number): string;
        static HtmlDecode(encoded: string): string;
    }
}
declare module Utils {
    class Urls {
        static GetHashParameter(key: string, doc?: Document): string;
        static SetHashParameter(key: string, value: any, doc?: Document): void;
        static GetQuerystringParameter(key: string, w?: Window): string;
        static GetQuerystringParameterFromString(key: string, querystring: string): string;
        static SetQuerystringParameter(key: string, value: any, doc?: Document): void;
        static UpdateURIKeyValuePair(uriSegment: string, key: string, value: string): string;
        static GetUrlParts(url: string): any;
        static ConvertToRelativeUrl(url: string): string;
    }
}
