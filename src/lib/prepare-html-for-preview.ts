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
    result = result.replace(
      /<script/i,
      `${STORAGE_SHIM}\n<script`,
    );
    if (!result.includes("vibe-storage-shim")) {
      result = result.replace(/<\/body>/i, `${STORAGE_SHIM}\n</body>`);
    }
  }

  return result;
}

export function openHtmlInNewTab(html: string): void {
  const prepared = prepareHtmlForPreview(html);
  const blob = new Blob([prepared], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) {
    window.location.assign(url);
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
