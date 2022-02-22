export const isWorkboxPresent =
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  window.workbox !== undefined;
