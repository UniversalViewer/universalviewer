import { IUVData } from "./IUVData";
const filterXSS = require("xss");

export const sanitize = (html: string) => {
  return filterXSS(html, {
    whiteList: {
      a: ["href", "title", "target", "class"],
      b: [],
      br: [],
      i: [],
      img: ["src", "alt"],
      p: [],
      small: [],
      span: [],
      strong: [],
      sub: [],
      sup: []
    }
  });
};

export const isValidUrl = (value: string): boolean => {
  const a = document.createElement("a");
  a.href = value;
  return !!a.host && a.host !== window.location.host;
};

export const debounce = (callback: (args: any) => void, wait: number) => {
  let timeout: NodeJS.Timer;
  return (...args) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), wait);
  };
};

export const propertiesChanged = (
  newData: IUVData,
  currentData: IUVData,
  properties: string[]
): boolean => {
  let propChanged: boolean = false;

  for (var i = 0; i < properties.length; i++) {
    propChanged = propertyChanged(newData, currentData, properties[i]);
    if (propChanged) {
      break;
    }
  }

  return propChanged;
};

export const propertyChanged = (
  newData: IUVData,
  currentData: IUVData,
  propertyName: string
): boolean => {
  return currentData[propertyName] !== newData[propertyName];
};
