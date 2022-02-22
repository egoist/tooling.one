import type { Workbox } from "workbox-window";

interface CustomWorkBox extends Workbox {
  messageSkipWaiting: () => void;
}

export declare global {
  interface Window {
    workbox: CustomWorkBox;
  }
}
