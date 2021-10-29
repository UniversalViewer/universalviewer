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
  let timeout;
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

function appendScript(src: string) {
  return new Promise<void>(resolve => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function appendCSS(src: string) {
  return new Promise<void>(resolve => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = src;
    link.onload = () => resolve();
    document.head.appendChild(link);
  });
}

export const loadScripts = async (sources: string[]) => {
  await Promise.all(
    sources.map(async (src: string) => {
      await appendScript(src);
    })
  );
};

export const loadCSS = async (sources: string[]) => {
  await Promise.all(
    sources.map(async (src: string) => {
      await appendCSS(src);
    })
  );
};

export const isVisible = (el: JQuery) => {
  // return el.css("visibility") !== "hidden"
  return el.is(":visible");
};
