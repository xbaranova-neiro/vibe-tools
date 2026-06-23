import {
  isIosDevice,
  openAppInBrowser,
} from "@/lib/html-payload";
import { isTelegramWebView } from "@/lib/telegram-env";

const MOBILE_FIX_STYLE = `<style id="vibe-mobile-fix">
button,.btn-add,.btn,.btn-reset,input[type="button"],input[type="submit"]{
  min-height:44px;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer
}
input,select,textarea{font-size:16px!important}
body{-webkit-overflow-scrolling:touch;overflow-x:hidden}
</style>`;

/** Ранний init: iOS file:// + поздний DOMContentLoaded + localStorage. */
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
  }

  if (!result.includes("apple-mobile-web-app-capable")) {
    result = result.replace(
      /<\/head>/i,
      '<meta name="apple-mobile-web-app-capable" content="yes">\n</head>',
    );
  }

  if (!result.includes("vibe-mobile-fix")) {
    result = result.replace(/<\/head>/i, `${MOBILE_FIX_STYLE}\n</head>`);
  }

  return result;
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

/** Готовит HTML для сохранения на телефон (iOS file://). */
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
            ? "После сохранения: Файлы → ⋯ → Открыть в Safari"
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

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile || isIosDevice()) {
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
    if (isIosDevice() || isTelegramWebView()) {
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
