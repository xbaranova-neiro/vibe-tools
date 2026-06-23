export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function isMobileDevice(): boolean {
  return isIosDevice() || isAndroidDevice();
}

export type MobilePlatform = "ios" | "android" | "other";

export function getMobilePlatform(): MobilePlatform {
  if (isIosDevice()) return "ios";
  if (isAndroidDevice()) return "android";
  return "other";
}

/** iPhone и Android Chrome — можно добавить ярлык на рабочий стол. */
export function canInstallToHomeScreen(): boolean {
  return isIosDevice() || isAndroidDevice();
}
