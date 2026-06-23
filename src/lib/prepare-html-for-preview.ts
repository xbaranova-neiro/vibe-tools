const MOBILE_FIX_STYLE = `<style id="vibe-mobile-fix">
button,.btn-add,.btn,.btn-reset,input[type="button"],input[type="submit"]{
  min-height:44px;touch-action:manipulation;-webkit-tap-highlight-color:transparent
}
input,select,textarea{font-size:16px!important}
body{-webkit-overflow-scrolling:touch;overflow-x:hidden}
</style>`;

const STORAGE_SHIM = `<script id="vibe-storage-shim">
(function(){
  try{
    var k="__vibe_test__";
    localStorage.setItem(k,"1");
    localStorage.removeItem(k);
  }catch(e){
    var mem={};
    window.localStorage={
      getItem:function(key){return Object.prototype.hasOwnProperty.call(mem,key)?mem[key]:null},
      setItem:function(key,val){mem[key]=String(val)},
      removeItem:function(key){delete mem[key]},
      clear:function(){mem={}},
      key:function(i){return Object.keys(mem)[i]||null},
      get length(){return Object.keys(mem).length}
    };
  }
})();
</script>`;

const SAVE_BAR = `<style id="vibe-save-style">body{padding-bottom:96px!important}</style>
<div id="vibe-save-hint" style="position:fixed;bottom:0;left:0;right:0;padding:12px 12px max(12px,env(safe-area-inset-bottom));background:rgba(15,15,25,.96);color:#fff;font-family:system-ui,sans-serif;z-index:2147483647;box-shadow:0 -8px 32px rgba(0,0,0,.45);backdrop-filter:blur(8px)">
<button type="button" onclick="vibeSaveFile()" style="display:block;width:100%;padding:14px 16px;border:none;border-radius:14px;background:linear-gradient(90deg,#7c3aed,#d946ef);color:#fff;font-weight:700;font-size:16px;cursor:pointer">💾 Сохранить на телефон</button>
<p style="margin:10px 0 0;font-size:12px;line-height:1.4;text-align:center;opacity:.75">«Сохранить в Файлы» или «На экран Домой»</p>
</div>
<script id="vibe-save-script">
async function vibeSaveFile(){
  var raw='<!DOCTYPE html>'+document.documentElement.outerHTML;
  var clean=raw
    .replace(/<style id="vibe-save-style"[\\s\\S]*?<\\/style>/i,'')
    .replace(/<div id="vibe-save-hint"[\\s\\S]*?<\\/div>/i,'')
    .replace(/<script id="vibe-save-script"[\\s\\S]*?<\\/script>/i,'');
  try{
    var file=new File([clean],'moe-prilozhenie.html',{type:'text/html;charset=utf-8'});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      await navigator.share({files:[file],title:'Моё приложение'});
      return;
    }
  }catch(e){if(e&&e.name==='AbortError')return}
  alert('Safari: «Поделиться» → «Сохранить в Файлы». Android: «Загрузки».');
}
</script>`;

export function slugifyFilename(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0430-\u044f\u0451-]/gi, "")
    .slice(0, 40);
  return slug || "moe-prilozhenie";
}

/** Готовит HTML к превью в iframe и на мобильном Safari. */
export function prepareHtmlForPreview(html: string): string {
  let result = html;

  if (!/<meta[^>]+name=["']viewport["']/i.test(result)) {
    result = result.replace(
      /<head([^>]*)>/i,
      '<head$1>\n<meta name="viewport" content="width=device-width, initial-scale=1">',
    );
  }

  if (!result.includes("vibe-mobile-fix")) {
    result = result.replace(/<\/head>/i, `${MOBILE_FIX_STYLE}\n</head>`);
  }

  if (!result.includes("vibe-storage-shim")) {
    result = result.replace(/<script/i, `${STORAGE_SHIM}\n<script`);
    if (!result.includes("vibe-storage-shim")) {
      result = result.replace(/<\/body>/i, `${STORAGE_SHIM}\n</body>`);
    }
  }

  return result;
}

export function injectMobileSaveBar(html: string): string {
  const prepared = prepareHtmlForPreview(html);
  if (prepared.includes("vibe-save-hint")) return prepared;
  return prepared.replace(/<\/body>/i, `${SAVE_BAR}\n</body>`);
}

export type SaveHtmlResult = "shared" | "download" | "opened";

/** Сохранить HTML на устройство: Share API → скачивание → открыть с панелью сохранения. */
export async function saveHtmlToDevice(
  html: string,
  title: string,
): Promise<SaveHtmlResult> {
  const prepared = prepareHtmlForPreview(html);
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
  if (isMobile) {
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
  const prepared = opts?.includeSaveBar
    ? injectMobileSaveBar(html)
    : prepareHtmlForPreview(html);
  const blob = new Blob([prepared], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) {
    window.location.assign(url);
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
}
