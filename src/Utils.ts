import { IUVData } from "./IUVData";
const filterXSS = require("xss");
export const merge = require("lodash/merge");

export const sanitize = (html: string) => {
  return filterXSS(html, {
    whiteList: {
      a: ["href", "title", "target", "class", "data-uv-navigate"],
      b: [],
      br: [],
      em: [],
      i: [],
      img: ["src", "alt"],
      p: [],
      small: [],
      span: ["data-uv-navigate"],
      strong: [],
      sub: [],
      sup: [],
    },
  });
};

export const isValidUrl = (value: string): boolean => {
  const a = document.createElement("a");
  a.href = value;
  return !!a.host && a.host !== window.location.host;
};

export const debounce = (callback: (args: any) => void, wait: number) => {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), wait);
  };
};

export const propertiesChanged = (
  newData: IUVData<any>,
  currentData: IUVData<any>,
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
  newData: IUVData<any>,
  currentData: IUVData<any>,
  propertyName: string
): boolean => {
  return currentData[propertyName] !== newData[propertyName];
};

function appendScript(src: string) {
  return new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function appendCSS(src: string) {
  return new Promise<void>((resolve) => {
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

export const defaultLocale = {
  name: "en-GB",
};

export const getUUID = () => {
  return URL.createObjectURL(new Blob()).substr(-36);
};

export class Storage {
  private static _memoryStorage: any = {};

  public static clear(storageType: StorageType = StorageType.MEMORY): void {
    switch (storageType) {
      case StorageType.MEMORY:
        this._memoryStorage = {};
        break;
      case StorageType.SESSION:
        sessionStorage.clear();
        break;
      case StorageType.LOCAL:
        localStorage.clear();
        break;
    }
  }

  public static clearExpired(
    storageType: StorageType = StorageType.MEMORY
  ): void {
    const items: StorageItem[] = this.getItems(storageType);

    for (let i = 0; i < items.length; i++) {
      var item = items[i];

      if (this._isExpired(item)) {
        this.remove(item.key);
      }
    }
  }

  public static get(
    key: string,
    storageType: StorageType = StorageType.MEMORY
  ): StorageItem | null {
    let data: string | null = null;

    switch (storageType) {
      case StorageType.MEMORY:
        data = this._memoryStorage[key];
        break;
      case StorageType.SESSION:
        data = sessionStorage.getItem(key);
        break;
      case StorageType.LOCAL:
        data = localStorage.getItem(key);
        break;
    }

    if (!data) return null;

    let item: StorageItem | null = null;

    try {
      item = JSON.parse(data);
    } catch (error) {
      return null;
    }

    if (!item) return null;

    if (this._isExpired(item)) return null;

    // useful reference
    item.key = key;

    return item;
  }

  private static _isExpired(item: StorageItem): boolean {
    if (new Date().getTime() < item.expiresAt) {
      return false;
    }

    return true;
  }

  public static getItems(
    storageType: StorageType = StorageType.MEMORY
  ): StorageItem[] {
    const items: StorageItem[] = [];

    switch (storageType) {
      case StorageType.MEMORY:
        const keys: string[] = Object.keys(this._memoryStorage);

        for (let i = 0; i < keys.length; i++) {
          const item: StorageItem | null = this.get(
            keys[i],
            StorageType.MEMORY
          );

          if (item) {
            items.push(item);
          }
        }

        break;
      case StorageType.SESSION:
        for (let i = 0; i < sessionStorage.length; i++) {
          const key: string | null = sessionStorage.key(i);

          if (key) {
            const item: StorageItem | null = this.get(key, StorageType.SESSION);

            if (item) {
              items.push(item);
            }
          }
        }
        break;
      case StorageType.LOCAL:
        for (let i = 0; i < localStorage.length; i++) {
          const key: string | null = localStorage.key(i);

          if (key) {
            const item: StorageItem | null = this.get(key, StorageType.LOCAL);

            if (item) {
              items.push(item);
            }
          }
        }
        break;
    }

    return items;
  }

  public static remove(
    key: string,
    storageType: StorageType = StorageType.MEMORY
  ) {
    switch (storageType) {
      case StorageType.MEMORY:
        delete this._memoryStorage[key];
        break;
      case StorageType.SESSION:
        sessionStorage.removeItem(key);
        break;
      case StorageType.LOCAL:
        localStorage.removeItem(key);
        break;
    }
  }

  public static set(
    key: string,
    value: any,
    expirationSecs: number,
    storageType: StorageType = StorageType.MEMORY
  ): StorageItem {
    const expirationMS: number = expirationSecs * 1000;

    const record: StorageItem = new StorageItem();
    record.value = value;
    record.expiresAt = new Date().getTime() + expirationMS;

    switch (storageType) {
      case StorageType.MEMORY:
        this._memoryStorage[key] = JSON.stringify(record);
        break;
      case StorageType.SESSION:
        sessionStorage.setItem(key, JSON.stringify(record));
        break;
      case StorageType.LOCAL:
        localStorage.setItem(key, JSON.stringify(record));
        break;
    }

    return record;
  }
}

export class StorageItem {
  public key: string;
  public value: any;
  public expiresAt: number;
}

export enum StorageType {
  MEMORY = "memory",
  SESSION = "session",
  LOCAL = "local",
}
