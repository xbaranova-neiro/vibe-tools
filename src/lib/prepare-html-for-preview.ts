
const MOBILE_FIX_STYLE = `<style id="vibe-mobile-fix">
*,*::before,*::after{box-sizing:border-box}
html{
  -webkit-text-size-adjust:100%;
  -webkit-tap-highlight-color:transparent
}
body{
  overflow-x:hidden;
  position:relative
}
button,.btn-add,.btn,.btn-reset,.btn-remove,[role="button"],
input[type="button"],input[type="submit"],.task,.item,.med,.show,.tile,.day,.pill,.tab,.chip,.filters button,.tabs button,.chips button{
  touch-action:manipulation;
  -webkit-tap-highlight-color:transparent;
  cursor:pointer
}
img,svg,video{max-width:100%;height:auto}
#vibe-homescreen-guide,#vibe-ios-hint,#vibe-save-hint,#vibe-save-style{
  display:none!important;
  pointer-events:none!important;
  visibility:hidden!important;
  height:0!important;
  overflow:hidden!important
}
@media (max-width:640px),(hover:none) and (pointer:coarse){
  html{
    height:100%;
    overflow-y:auto;
    -webkit-overflow-scrolling:touch
  }
  body{
    min-height:100%;
    min-height:100dvh;
    min-height:-webkit-fill-available;
    overflow-y:auto!important;
    -webkit-overflow-scrolling:touch;
    overscroll-behavior-y:auto;
    padding-top:env(safe-area-inset-top,0px);
    padding-bottom:env(safe-area-inset-bottom,0px);
    padding-left:env(safe-area-inset-left,0px);
    padding-right:env(safe-area-inset-right,0px);
    display:block!important;
    align-items:stretch!important;
    justify-content:flex-start!important;
    height:auto!important
  }
  button,.btn-add,.btn,.btn-reset,.btn-remove,[role="button"],
  input[type="button"],input[type="submit"],.task,.item,.med,.show,.tile,.day,.pill,.tab,.chip,.filters button,.tabs button,.chips button{
    min-height:44px;
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
  .list,.items,.timeline,.bars,.legend,.colWant,.colWatch,.colDone,.weekAll,.events{
    -webkit-overflow-scrolling:touch!important;
    overflow-y:auto!important;
    overflow-x:hidden!important
  }
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
    var narrow=window.matchMedia("(max-width:640px),(hover:none) and (pointer:coarse)").matches;
    if(mobile&&narrow){
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
    if(type==="DOMContentLoaded"&&document.readyState!=="loading"){
      setTimeout(fn,0);
      return;
    }
    return add(type,fn,opts);
  };
  window.vibeBoot=function(fn){
    if(document.readyState==="loading"){
      document.addEventListener("DOMContentLoaded",fn,{once:true});
    }else{
      fn();
    }
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

/** Готовит HTML для /api/view и Telegram-превью — без старых оверлеев. */
export function prepareHtmlForStandalone(html: string): string {
  return injectHeadInit(injectMobileMeta(stripVibeOverlays(html)));
}

/** Убирает старые оверлеи из сохранённого HTML. */
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

/** Готовит HTML к превью в iframe. */
export function prepareHtmlForPreview(html: string, appId?: string): string {
  let result = injectHeadInit(injectMobileMeta(html));
  if (appId) {
    result = injectAppStorageScope(result, appId);
  }
  return result;
}

function injectAppStorageScope(html: string, appId: string): string {
  const scope = `<script id="vibe-app-scope">
(function(){
  var id=${JSON.stringify(appId)};
  var prefix="vibe-app-"+id+"-";
  var store=window.localStorage;
  var wrap={
    getItem:function(k){return store.getItem(prefix+k)},
    setItem:function(k,v){store.setItem(prefix+k,String(v))},
    removeItem:function(k){store.removeItem(prefix+k)},
    clear:function(){
      for(var i=store.length-1;i>=0;i--){
        var key=store.key(i);
        if(key&&key.indexOf(prefix)===0)store.removeItem(key);
      }
    },
    key:function(i){
      var keys=[];
      for(var j=0;j<store.length;j++){
        var k=store.key(j);
        if(k&&k.indexOf(prefix)===0)keys.push(k.slice(prefix.length));
      }
      return keys[i]||null;
    },
    get length(){
      var n=0;
      for(var j=0;j<store.length;j++){
        var k=store.key(j);
        if(k&&k.indexOf(prefix)===0)n++;
      }
      return n;
    }
  };
  try{window.localStorage=wrap}catch(e){}
})();
</script>`;
  if (html.includes('id="vibe-head-init"')) {
    return html.replace(
      /<script id="vibe-head-init">[\s\S]*?<\/script>/i,
      (m) => `${m}\n${scope}`,
    );
  }
  return html.replace(/<head([^>]*)>/i, `<head$1>\n${scope}`);
}
