const SHARED_POLISH = `
body{position:relative;overflow-x:hidden}
body::after{content:'';position:fixed;inset:-20%;pointer-events:none;z-index:0;background:radial-gradient(circle at 80% 10%,color-mix(in srgb,var(--vibe-accent-light,#fff) 12%,transparent) 0,transparent 45%),radial-gradient(circle at 10% 90%,color-mix(in srgb,var(--vibe-highlight,#fff) 10%,transparent) 0,transparent 40%);animation:auroraDrift 14s ease-in-out infinite alternate}
@keyframes auroraDrift{0%{transform:translate(0,0) scale(1)}100%{transform:translate(2%,-2%) scale(1.05)}}
.card{animation:cardIn .65s cubic-bezier(.34,1.56,.64,1) both;position:relative;z-index:1;box-shadow:0 24px 64px rgba(0,0,0,.28)!important;border:1px solid rgba(255,255,255,.14)!important}
@keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:none}}
h1{animation:titleIn .8s ease-out both;text-shadow:0 2px 24px rgba(0,0,0,.25)}
@keyframes titleIn{from{opacity:0;letter-spacing:.08em}to{opacity:1;letter-spacing:normal}}
.btn-add,.btn,.btn-reset,button.btn-add{transition:transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,filter .2s!important}
.btn-add:hover,.btn:hover:not(.btn-reset){transform:translateY(-2px) scale(1.02)!important;filter:brightness(1.08)}
.btn-add:active,.btn:active{transform:scale(.94)!important}
input,select{transition:box-shadow .2s,transform .15s!important}
input:focus,select:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--vibe-accent,#6366f1) 45%,transparent)!important;transform:scale(1.01)}
.num-pop{animation:numPop .45s cubic-bezier(.34,1.56,.64,1)!important}
@keyframes numPop{0%{transform:scale(.85);opacity:.6}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
.item,.task,.ev,.row,.slot,.day-block .ev{transition:transform .22s,box-shadow .22s,background .22s!important}
.item:hover,.task:hover,.ev:hover,.row:hover:not(.bought){transform:translateX(4px)!important;box-shadow:-4px 4px 16px rgba(0,0,0,.15)!important}
.balance,.daily,.stat,.next,.today-banner,.progress-box,.streak,.hero-num{transition:transform .3s,box-shadow .3s!important}
.bar-fill,.progress-fill,.glass-fill,.bar-seg{position:relative;overflow:hidden}
.bar-fill::after,.progress-fill::after,.glass-fill::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:shine 2.5s infinite;transform:translateX(-100%)}
@keyframes shine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
.ripple{position:fixed;border-radius:50%;background:rgba(255,255,255,.35);transform:scale(0);animation:rippleOut .6s ease-out forwards;pointer-events:none;z-index:9999}
@keyframes rippleOut{to{transform:scale(4);opacity:0}}
`;

const TEMPLATE_POLISH: Record<string, string> = {
  custom: `
.streak,.progress-box,.stat{border-radius:12px!important}
.progress-box,.streak{background:rgba(255,255,255,.12)!important;padding:10px 14px!important;margin-bottom:14px!important}
.sub{opacity:.85!important;font-size:.9rem!important;text-align:center!important;margin-bottom:18px!important}
.list .item,.task,.row{border-radius:12px!important;background:rgba(255,255,255,.08)!important;padding:12px 14px!important;margin-bottom:8px!important;border:1px solid rgba(255,255,255,.1)!important}
#list,#items,.tasks{display:flex;flex-direction:column;gap:8px}
.bar,.progress-bar{height:12px!important;background:rgba(0,0,0,.22)!important;border-radius:99px!important;overflow:hidden!important;margin:12px 0!important}
`,
  budget: `
.chart:not(.empty){animation:chartSpin .8s cubic-bezier(.34,1.56,.64,1) both}
@keyframes chartSpin{from{transform:rotate(-90deg) scale(.5);opacity:0}to{transform:none;opacity:1}}
.chart.empty{border-color:color-mix(in srgb,var(--vibe-accent,#6366f1) 40%,transparent)!important}
.balance .num,.daily .num,.stat .n{font-variant-numeric:tabular-nums}
.msg{animation:msgIn .5s ease-out both}
@keyframes msgIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:none}}
`,
  habits: `
.glass.filled{animation:glassPop .45s cubic-bezier(.34,1.56,.64,1)}
@keyframes glassPop{0%{transform:scale(.8)}70%{transform:scale(1.12)}100%{transform:scale(1.05)}}
.count{font-size:1.25rem!important;text-shadow:0 0 20px var(--vibe-glow)}
.streak{animation:streakGlow 3s ease-in-out infinite}
@keyframes streakGlow{0%,100%{box-shadow:0 0 0 rgba(251,191,36,0)}50%{box-shadow:0 0 20px color-mix(in srgb,var(--vibe-accent,#fbbf24) 40%,transparent)}}
.ring-wrap svg{filter:drop-shadow(0 0 24px var(--vibe-glow))!important}
`,
  tasks: `
.ring-text{transition:transform .4s cubic-bezier(.34,1.56,.64,1)!important}
.task.done .task-check{animation:checkPop .4s cubic-bezier(.34,1.56,.64,1)}
@keyframes checkPop{0%{transform:scale(0) rotate(-45deg)}100%{transform:scale(1) rotate(0)}}
.task:not(.done):hover .task-check{box-shadow:0 0 12px var(--vibe-glow)}
.win.show{background:rgba(0,0,0,.75)!important;backdrop-filter:blur(8px)}
`,
  kids: `
.next,.today-banner{animation:bannerPulse 3s ease-in-out infinite}
@keyframes bannerPulse{0%,100%{box-shadow:0 8px 24px rgba(251,191,36,.25)}50%{box-shadow:0 12px 36px rgba(251,191,36,.45)}}
.day,.pill{cursor:pointer;transition:transform .2s,box-shadow .2s!important}
.day:hover,.pill:hover{transform:translateY(-2px)!important}
.ev,.slot-card{animation:evIn .4s ease-out both}
@keyframes evIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
`,
  shopping: `
.item-emoji,.row .emoji{transition:transform .3s cubic-bezier(.34,1.56,.64,1)!important}
.item:hover .item-emoji,.row:hover .emoji{transform:scale(1.2) rotate(-8deg)!important}
.progress-fill,.done-msg.show{animation:shopCelebrate .6s ease-out}
@keyframes shopCelebrate{0%{transform:scaleX(.3)}70%{transform:scaleX(1.05)}100%{transform:scaleX(1)}}
.item.bought,.row.bought{animation:itemDone .4s ease-out}
@keyframes itemDone{from{opacity:1;transform:translateX(0)}to{opacity:.4;transform:translateX(8px)}}
`,
  pills: `
.alert.warn{animation:alertPulse 2s ease-in-out infinite}
@keyframes alertPulse{0%,100%{box-shadow:0 0 0 transparent}50%{box-shadow:0 0 24px color-mix(in srgb,var(--vibe-accent,#fbbf24) 35%,transparent)}}
.med.taken .med-check{animation:checkPop .4s cubic-bezier(.34,1.56,.64,1)}
.med-check{transition:all .3s!important}
.bottle-fill{transition:height .6s cubic-bezier(.34,1.56,.64,1)!important}
.celebrate.show{animation:pop .5s ease-out}
`,
  watchlist: `
.show{animation:showIn .4s ease-out both}
@keyframes showIn{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}
.poster{transition:transform .3s cubic-bezier(.34,1.56,.64,1)!important}
.show:hover .poster{transform:scale(1.08) rotate(-3deg)!important}
.tabs button.active{animation:tabPop .35s ease-out}
@keyframes tabPop{0%{transform:scale(.95)}70%{transform:scale(1.05)}100%{transform:scale(1)}}
.tile{animation:showIn .35s ease-out both}
`,
};

const POLISH_SCRIPT = `<script data-vibe-polish>
(function(){
  function ripple(x,y){
    var r=document.createElement('div');r.className='ripple';
    r.style.cssText='left:'+(x-20)+'px;top:'+(y-20)+'px;width:40px;height:40px';
    document.body.appendChild(r);setTimeout(function(){r.remove()},650);
  }
  function popNums(){
    document.querySelectorAll('.num,#left,#daily,#saved,#count,#pct,.ring-num,.hero-num .big,.stat .n,.progress-head .pct').forEach(function(el){
      el.classList.remove('num-pop');void el.offsetWidth;el.classList.add('num-pop');
    });
  }
  document.addEventListener('click',function(e){
    var t=e.target.closest('.btn-add,.btn,#addBtn,.item,.task,.row,.ev,.med,.show,.tile');
    if(t)ripple(e.clientX,e.clientY);
  });
  document.addEventListener('DOMContentLoaded',function(){
    popNums();
    var obs=new MutationObserver(function(){popNums()});
    ['list','events','timeline','weekAll','cats','items','bars','legend','morning','evening','colWant','colWatch','colDone'].forEach(function(id){
      var el=document.getElementById(id);if(el)obs.observe(el,{childList:true,subtree:true,characterData:true});
    });
    document.querySelectorAll('#left,#daily,#count,#pct,#progText').forEach(function(el){
      if(el)obs.observe(el,{characterData:true,childList:true,subtree:true});
    });
  });
})();
</script>`;

export function visualPolishCss(templateId: string): string {
  return (SHARED_POLISH + (TEMPLATE_POLISH[templateId] ?? "")).replace(
    /\s+/g,
    " ",
  );
}

export function applyVisualPolish(html: string, templateId: string): string {
  let result = html.replace(
    /<style data-vibe-polish>[\s\S]*?<\/style>/,
    "",
  );
  result = result.replace(
    /<script data-vibe-polish>[\s\S]*?<\/script>/,
    "",
  );

  const block = `<style data-vibe-polish>${visualPolishCss(templateId)}</style>`;

  if (result.includes("</head>")) {
    result = result.replace("</head>", `${block}</head>`);
  } else {
    result = block + result;
  }

  result = result.replace("</body>", `${POLISH_SCRIPT}</body>`);
  return result;
}
