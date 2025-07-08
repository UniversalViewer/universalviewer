const IS_DEV =
  process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";

declare global {
  interface Window {
    __DEBUG_AV_COMPONENT__?: boolean;
  }
}

const isDev = () => IS_DEV && window && window.__DEBUG_AV_COMPONENT__;

export const Logger = {
  enabled: true,
  log(...args) {
    if (this.enabled && isDev()) {
      console.log(...args);
    }
  },
  warn(...args) {
    if (this.enabled && isDev()) {
      console.warn(...args);
    }
  },
  error(...args) {
    if (this.enabled && isDev()) {
      console.error(...args);
    }
  },
  groupCollapsed(...args) {
    if (this.enabled && isDev()) {
      console.group(...args);
    }
  },
  group(...args) {
    if (this.enabled && isDev()) {
      console.group(...args);
    }
  },
  groupEnd() {
    if (this.enabled && isDev()) {
      console.groupEnd();
    }
  },
};
