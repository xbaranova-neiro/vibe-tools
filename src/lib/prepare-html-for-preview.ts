import {
  isIosDevice,
  isAndroidDevice,
  isMobileDevice,
  openAppInBrowser,
} from "@/lib/html-payload";
import { isTelegramWebView } from "@/lib/telegram-env";

const MOBILE_FIX_STYLE = `<style id="vibe-mobile-fix">
*,*::before,*::after{box-sizing:border-box}
html{
  -webkit-text-size-adjust:100%;
  height:100%;
  -webkit-tap-highlight-color:transparent;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch
}
body{
  min-height:100%;
  min-height:100dvh;
  min-height:-webkit-fill-available;
  overflow-x:hidden!important;
  overflow-y:auto!important;
  -webkit-overflow-scrolling:touch;
  overscroll-behavior-y:auto;
  position:relative;
  padding-top:env(safe-area-inset-top,0px);
  padding-bottom:env(safe-area-inset-bottom,0px);
  padding-left:env(safe-area-inset-left,0px);
  padding-right:env(safe-area-inset-right,0px)
}
@supports (-webkit-touch-callout:none){
  html{height:-webkit-fill-available}
  body{
    min-height:-webkit-fill-available!important;
    height:auto!important;
    display:block!important;
    align-items:stretch!important;
    justify-content:flex-start!important
  }
}
@media (hover:none) and (pointer:coarse){
  html{height:auto}
  body{
    min-height:100dvh!important;
    height:auto!important;
    display:block!important;
    align-items:stretch!important;
    justify-content:flex-start!important
  }
}
button,.btn-add,.btn,.btn-reset,.btn-remove,[role="button"],
input[type="button"],input[type="submit"],.task,.item,.med,.show,.tile,.day,.pill,.tab,.chip,.filters button,.tabs button,.chips button{
  min-height:44px;
  touch-action:manipulation;
  -webkit-tap-highlight-color:transparent;
  cursor:pointer;
  -webkit-user-select:none;
  user-select:none
}
input:not([type="button"]):not([type="submit"]),select,textarea{
  font-size:16px!important;
  touch-action:manipulation;
  max-width:100%
}
h1,h2,h3,h4,p,span,label,li,.title,.sub,.count,.num,.ring-text{
  overflow-wrap:break-word;
  word-break:break-word;
  max-width:100%
}
.card,.container,main,section,form,.hero,.progress-box{
  max-width:100%!important;
  width:100%;
  overflow-x:hidden
}
img,svg,video{max-width:100%;height:auto}
.list,.items,.timeline,.bars,.legend,.colWant,.colWatch,.colDone,.weekAll,.events{
  -webkit-overflow-scrolling:touch!important;
  overflow-y:auto!important;
  overflow-x:hidden!important
}
#vibe-homescreen-guide,#vibe-ios-hint,#vibe-save-hint,#vibe-save-style{
  display:none!important;
  pointer-events:none!important;
  visibility:hidden!important;
  height:0!important;
  overflow:hidden!important
}
</style>`;

/** Init для standalone/PWA: скролл, оверлеи, Android + iOS. */
const VIBE_STANDALONE_BOOT = `<script id="vibe-standalone-boot">
(function(){
  var standalone=window.navigator.standalone===true||window.matchMedia("(display-mode: standalone)").matches;
  var ua=navigator.userAgent;
  var ios=/iPhone|iPad|iPod/i.test(ua);
  var android=/Android/i.test(ua);
  var mobile=ios||android;
  function stripOverlays(){
    ["vibe-homescreen-guide","vibe-ios-hint","vibe-save-hint"].forEach(function(id){
      var el=document.getElementById(id);if(el)el.remove();
    });
    var style=document.getElementById("vibe-save-style");if(style)style.remove();
  }
  function fixScrollRegions(){
    var sel=".list,.items,.timeline,.bars,.legend,.colWant,.colWatch,.colDone,.weekAll,.events,.show-list,.med-list";
    document.querySelectorAll(sel).forEach(function(el){
      el.style.webkitOverflowScrolling="touch";
      el.style.overflowScrolling="touch";
      var cs=getComputedStyle(el);
      if((cs.overflowY==="auto"||cs.overflowY==="scroll"||cs.maxHeight!=="none")&&el.scrollHeight>el.clientHeight+2){
        el.style.overflowY="auto";
        el.style.touchAction="pan-y";
      }
    });
  }
  function boot(){
    if(standalone)stripOverlays();
    fixScrollRegions();
    if(mobile){
      document.documentElement.style.height="auto";
      document.body.style.minHeight=ios?"-webkit-fill-available":"100dvh";
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
  else boot();
  window.addEventListener("load",fixScrollRegions);
})();
</script>`;

const PWA_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%237c3aed' width='100' height='100' rx='22'/%3E%3Ctext y='.9em' x='50%25' text-anchor='middle' font-size='52'%3E✨%3C/text%3E%3C/svg%3E";

const ANDROID_PWA_META = `<meta name="theme-color" content="#7c3aed">
<link rel="manifest" href="data:application/manifest+json,${encodeURIComponent(
  JSON.stringify({
    name: "Моё приложение",
    short_name: "Приложение",
    display: "standalone",
    start_url: ".",
    scope: ".",
    background_color: "#0b0b12",
    theme_color: "#7c3aed",
    icons: [
      {
        src: PWA_ICON,
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  }),
)}">`;

/** Ранний init: file:// + поздний DOMContentLoaded + localStorage. */
const VIBE_HEAD_INIT = `<script id="vibe-head-init">
(function(){
  var add=document.addEventListener.bind(document);
  document.addEventListener=function(type,fn,opts){
    if(type==="DOMContentLoaded"&&(document.readyState==="interactive"||document.readyState==="complete")){
      setTimeout(fn,0);
      return;
    }
    return add(type,fn,opts);
  };
  var mem={};
  function memStore(){
    return{
      getItem:function(k){return Object.prototype.hasOwnProperty.call(mem,k)?mem[k]:null},
      setItem:function(k,v){mem[k]=String(v)},
      removeItem:function(k){delete mem[k]},
      clear:function(){mem={}},
      key:function(i){return Object.keys(mem)[i]||null},
      get length(){return Object.keys(mem).length}
    };
  }
  function lsWorks(){
    try{
      var k="__vibe_ls__";
      localStorage.setItem(k,"1");
      var ok=localStorage.getItem(k)==="1";
      localStorage.removeItem(k);
      return ok;
    }catch(e){return false}
  }
  if(!lsWorks()){
    try{window.localStorage=memStore()}catch(e){}
  }
})();
</script>`;

const IOS_OPEN_HINT = `<div id="vibe-ios-hint" style="position:fixed;top:0;left:0;right:0;z-index:2147483646;padding:10px 12px max(10px,env(safe-area-inset-top));background:rgba(15,15,25,.94);color:#fff;font-family:system-ui,sans-serif;font-size:12px;line-height:1.45;box-shadow:0 4px 24px rgba(0,0,0,.35)">
<strong style="display:block;margin-bottom:4px">📱 iPhone</strong>
Файл из «Файлов» нельзя добавить на экран Домой. Используйте кнопку <strong>«На экран Домой»</strong> на сайте Vibe Tools — или откройте файл через Safari (⋯ → Открыть в Safari).
<button type="button" onclick="this.parentElement.remove()" style="display:block;width:100%;margin-top:8px;padding:10px;border:none;border-radius:10px;background:#7c3aed;color:#fff;font-weight:600;font-size:13px">Понятно</button>
</div>
<script id="vibe-ios-hint-script">
(function(){
  var el=document.getElementById("vibe-ios-hint");
  if(!el)return;
  if(!/iPhone|iPad|iPod/i.test(navigator.userAgent))el.remove();
  else setTimeout(function(){if(el.parentElement)el.remove()},12000);
})();
</script>`;

const SAVE_BAR = `<style id="vibe-save-style">body{padding-bottom:120px!important}</style>
<div id="vibe-save-hint" style="position:fixed;bottom:0;left:0;right:0;padding:12px 12px max(12px,env(safe-area-inset-bottom));background:rgba(15,15,25,.96);color:#fff;font-family:system-ui,sans-serif;z-index:2147483647;box-shadow:0 -8px 32px rgba(0,0,0,.45);backdrop-filter:blur(8px)">
<button type="button" onclick="vibeSaveFile()" style="display:block;width:100%;padding:14px 16px;border:none;border-radius:14px;background:linear-gradient(90deg,#7c3aed,#d946ef);color:#fff;font-weight:700;font-size:16px;cursor:pointer">💾 Сохранить на телефон</button>
<p style="margin:10px 0 0;font-size:12px;line-height:1.45;text-align:center;opacity:.85">iPhone: «Сохранить в Файлы» → потом Файлы → ⋯ → <strong>Открыть в Safari</strong></p>
</div>
<script id="vibe-save-script">
async function vibeSaveFile(){
  var raw="<!DOCTYPE html>"+document.documentElement.outerHTML;
  var clean=raw
    .replace(/<style id="vibe-save-style"[\\s\\S]*?<\\/style>/i,"")
    .replace(/<div id="vibe-ios-hint"[\\s\\S]*?<\\/div>/i,"")
    .replace(/<script id="vibe-ios-hint-script"[\\s\\S]*?<\\/script>/i,"")
    .replace(/<div id="vibe-save-hint"[\\s\\S]*?<\\/div>/i,"")
    .replace(/<script id="vibe-save-script"[\\s\\S]*?<\\/script>/i,"");
  try{
    var file=new File([clean],"moe-prilozhenie.html",{type:"text/html;charset=utf-8"});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      await navigator.share({files:[file],title:"Моё приложение"});
      return;
    }
  }catch(e){if(e&&e.name==="AbortError")return}
  alert("iPhone: «Поделиться» → «Сохранить в Файлы», затем откройте через Safari.");
}
</script>`;

function injectHeadInit(html: string): string {
  if (html.includes("vibe-head-init")) return html;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n${VIBE_HEAD_INIT}`);
  }
  return `${VIBE_HEAD_INIT}\n${html}`;
}

function injectMobileMeta(html: string): string {
  let result = html;

  if (!/<meta[^>]+charset/i.test(result)) {
    result = result.replace(
      /<head([^>]*)>/i,
      '<head$1>\n<meta charset="UTF-8">',
    );
  }

  if (!/<meta[^>]+name=["']viewport["']/i.test(result)) {
    result = result.replace(
      /<head([^>]*)>/i,
      '<head$1>\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    );
  } else {
    result = result.replace(
      /<meta[^>]+name=["']viewport["'][^>]*>/i,
      '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    );
  }

  if (!result.includes("apple-mobile-web-app-capable")) {
    result = result.replace(
      /<\/head>/i,
      `<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" href="${PWA_ICON}">
</head>`,
    );
  }

  if (!result.includes('name="theme-color"')) {
    result = result.replace(/<\/head>/i, `${ANDROID_PWA_META}\n</head>`);
  }

  if (result.includes("vibe-mobile-fix")) {
    result = result.replace(
      /<style id="vibe-mobile-fix">[\s\S]*?<\/style>/i,
      MOBILE_FIX_STYLE.trim(),
    );
  } else {
    result = result.replace(/<\/head>/i, `${MOBILE_FIX_STYLE}\n</head>`);
  }

  if (result.includes("vibe-standalone-boot")) {
    result = result.replace(
      /<script id="vibe-standalone-boot">[\s\S]*?<\/script>/i,
      VIBE_STANDALONE_BOOT.trim(),
    );
  } else {
    result = result.replace(/<\/body>/i, `${VIBE_STANDALONE_BOOT}\n</body>`);
  }

  return result;
}

/** Готовит HTML для «На экран Домой» и /api/view — чистое приложение без оверлеев. */
export function prepareHtmlForStandalone(html: string): string {
  return injectHeadInit(injectMobileMeta(stripVibeOverlays(html)));
}

/** Убирает подсказки Vibe Tools из уже сохранённого HTML. */
function stripVibeOverlays(html: string): string {
  return html
    .replace(/<div id="vibe-homescreen-guide"[\s\S]*?<\/div>\s*/i, "")
    .replace(/<script id="vibe-homescreen-guide-script"[\s\S]*?<\/script>\s*/i, "")
    .replace(/<div id="vibe-ios-hint"[\s\S]*?<\/div>\s*/i, "")
    .replace(/<script id="vibe-ios-hint-script"[\s\S]*?<\/script>\s*/i, "")
    .replace(/<style id="vibe-save-style"[\s\S]*?<\/style>\s*/i, "")
    .replace(/<div id="vibe-save-hint"[\s\S]*?<\/div>\s*/i, "")
    .replace(/<script id="vibe-save-script"[\s\S]*?<\/script>\s*/i, "");
}

/** Повторно накладывает актуальные фиксы при отдаче с сервера. */
export function ensureStandaloneRuntime(html: string): string {
  return prepareHtmlForStandalone(html);
}

export function slugifyFilename(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0430-\u044f\u0451-]/gi, "")
    .slice(0, 40);
  return slug || "moe-prilozhenie";
}

/** Готовит HTML к превью в iframe. */
export function prepareHtmlForPreview(html: string): string {
  return injectHeadInit(injectMobileMeta(html));
}

/** Готовит HTML для сохранения в «Файлы» (iOS file://). */
export function prepareHtmlForExport(html: string): string {
  let result = injectHeadInit(injectMobileMeta(html));

  if (!result.includes("vibe-ios-hint")) {
    result = result.replace(/<body([^>]*)>/i, `<body$1>\n${IOS_OPEN_HINT}`);
  }

  return result;
}

export function injectMobileSaveBar(html: string): string {
  const prepared = prepareHtmlForExport(html);
  if (prepared.includes("vibe-save-hint")) return prepared;
  return prepared.replace(/<\/body>/i, `${SAVE_BAR}\n</body>`);
}

export type SaveHtmlResult = "shared" | "download" | "opened";

function isIos(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Сохранить HTML на устройство: Share API → скачивание → открыть с панелью сохранения. */
export async function saveHtmlToDevice(
  html: string,
  title: string,
): Promise<SaveHtmlResult> {
  const prepared = prepareHtmlForExport(html);
  const filename = `${slugifyFilename(title)}.html`;
  const file = new File([prepared], filename, {
    type: "text/html;charset=utf-8",
  });

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      const canShareFiles =
        !navigator.canShare || navigator.canShare({ files: [file] });
      if (canShareFiles) {
        await navigator.share({
          files: [file],
          title: title || "Моё приложение",
          text: isIos()
            ? "Файл — только просмотр в Safari. Иконку на экран добавьте кнопкой «Иконка на экране»."
            : isAndroidDevice()
              ? "Файл HTML. Для иконки на главном экране используйте «Иконка на экране»."
              : undefined,
        });
        return "shared";
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return "shared";
      }
    }
  }

  const isMobile = isMobileDevice();
  if (isMobile) {
    const opened = await openAppInBrowser(html);
    if (opened) return "opened";
    openHtmlInNewTab(html, { includeSaveBar: true });
    return "opened";
  }

  const blob = new Blob([prepared], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return "download";
}

export function openHtmlInNewTab(
  html: string,
  opts?: { includeSaveBar?: boolean },
): void {
  void (async () => {
    if (isMobileDevice() || isTelegramWebView()) {
      const withBar = opts?.includeSaveBar;
      const target = withBar ? injectMobileSaveBar(html) : html;
      const opened = await openAppInBrowser(target);
      if (opened) return;
    }

    const prepared = opts?.includeSaveBar
      ? injectMobileSaveBar(html)
      : prepareHtmlForExport(html);
    const blob = new Blob([prepared], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) {
      window.location.assign(url);
    }
    window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
  })();
}
