import { pillsRuntimeScript } from "./pills-shared";

export const pillsAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Таблетки</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;background:linear-gradient(180deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%);min-height:100vh;padding:20px 16px 28px;color:#fff}
.card{max-width:420px;margin:0 auto}
.hero{text-align:center;margin-bottom:12px}
.hero h1{font-size:1.55rem;font-weight:800}
.hero .sub{margin-top:4px;font-size:.85rem;opacity:.75}
.alert{text-align:center;padding:11px 14px;border-radius:14px;margin-bottom:14px;font-weight:600;font-size:.88rem}
.alert.ok{background:rgba(167,139,250,.2);color:#e9d5ff;border:1px solid rgba(167,139,250,.25)}
.alert.warn{background:rgba(251,191,36,.2);color:#fde68a;border:1px solid rgba(251,191,36,.28)}
.bottle-wrap{text-align:center;margin:6px 0 16px}
.bottle{width:118px;height:162px;margin:0 auto;border:3px solid rgba(255,255,255,.3);border-radius:22px 22px 32px 32px;position:relative;overflow:hidden;background:rgba(255,255,255,.06);box-shadow:inset 0 -8px 24px rgba(0,0,0,.15),0 12px 32px rgba(0,0,0,.2)}
.bottle-cap{position:absolute;top:-3px;left:50%;transform:translateX(-50%);width:52px;height:18px;background:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.15));border-radius:8px 8px 0 0;z-index:2}
.bottle-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(0deg,var(--vibe-bg2,#6366f1),var(--vibe-accent,#a78bfa));transition:height .65s cubic-bezier(.34,1.56,.64,1);height:0}
.bottle-shine{position:absolute;top:12%;left:14%;width:18%;height:55%;background:rgba(255,255,255,.12);border-radius:99px;z-index:1;pointer-events:none}
.bottle-pct{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.85rem;font-weight:800;z-index:2;text-shadow:0 2px 12px rgba(0,0,0,.4)}
.dose-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.dose{padding:14px 10px;border-radius:16px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.08);cursor:pointer;text-align:center;transition:all .25s}
.dose:active{transform:scale(.97)}
.dose.done{background:rgba(74,222,128,.16);border-color:rgba(74,222,128,.35)}
.dose-emoji{font-size:1.5rem}
.dose-title{font-weight:700;margin-top:5px;font-size:.82rem}
.dose-count{font-size:.72rem;opacity:.7;margin-top:3px}
.dose-hint{font-size:.62rem;opacity:.45;margin-top:4px}
.section{margin-bottom:14px}
.section-hdr{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.65;margin-bottom:8px}
.med{display:flex;align-items:center;gap:10px;padding:12px 13px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.06);border-radius:99px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.med:active{transform:scale(.98)}
.med.taken{opacity:.58;background:rgba(74,222,128,.1)}
.med-emoji{font-size:1.45rem;line-height:1;flex-shrink:0}
.med-info{flex:1;min-width:0}
.med-info .name{font-weight:600;font-size:.92rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.med-info .hint{font-size:.7rem;opacity:.55;margin-top:1px}
.med-check{width:32px;height:32px;border-radius:50%;border:2px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:700;flex-shrink:0}
.med.taken .med-check{background:var(--vibe-accent,#a78bfa);border-color:var(--vibe-accent,#a78bfa);color:#1e1b4b}
.med .del{background:none;border:none;color:#fca5a5;font-size:1.15rem;cursor:pointer;padding:4px 8px;flex-shrink:0}
.empty{opacity:.4;font-size:.82rem;padding:6px 0}
.add-box{margin-top:14px;padding:14px;border-radius:18px;background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.08)}
.add-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.55;margin-bottom:10px}
#addForm{display:flex;flex-direction:column;gap:8px}
.form-row{display:flex;gap:8px;flex-wrap:wrap}
input,select{padding:12px 13px;border-radius:12px;border:none;font-size:.95rem;font-family:inherit}
input{flex:1;min-width:0;width:100%}
input.shake{animation:shake .35s ease}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
select{background:#fff;color:#1e1b4b;flex:1;min-width:110px}
.btn-add{width:100%;padding:14px;border:none;border-radius:14px;background:var(--vibe-accent,#a78bfa);color:var(--vibe-accent-text,#1e1b4b);font-weight:800;font-size:1rem;cursor:pointer;box-shadow:0 8px 28px rgba(167,139,250,.3)}
.celebrate{text-align:center;padding:12px;border-radius:14px;background:rgba(74,222,128,.14);color:#86efac;font-weight:700;display:none;margin-bottom:12px}
.celebrate.show{display:block;animation:pop .45s ease-out}
@keyframes pop{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
</style>
</head>
<body>
<div class="card">
<div class="hero">
<h1>💊 Здоровье</h1>
<p class="sub">Бутылочка наполняется по мере приёма</p>
</div>
<div class="alert ok" id="alert">➕ Добавьте первый витамин</div>
<div class="celebrate" id="celebrate">🎉 Все витамины на сегодня!</div>
<div class="bottle-wrap">
<div class="bottle">
<div class="bottle-cap"></div>
<div class="bottle-fill" id="fill"></div>
<div class="bottle-shine"></div>
<div class="bottle-pct" id="pct">0%</div>
</div>
</div>
<div class="dose-row">
<div class="dose" id="doseM" role="button" tabindex="0">
<div class="dose-emoji">🌅</div>
<div class="dose-title">Утро</div>
<div class="dose-count" id="cntM">0 / 0</div>
<div class="dose-hint">отметить все</div>
</div>
<div class="dose" id="doseE" role="button" tabindex="0">
<div class="dose-emoji">🌙</div>
<div class="dose-title">Вечер</div>
<div class="dose-count" id="cntE">0 / 0</div>
<div class="dose-hint">отметить все</div>
</div>
</div>
<div class="section"><div class="section-hdr">🌅 Утро</div><div id="morning"></div></div>
<div class="section"><div class="section-hdr">🌙 Вечер</div><div id="evening"></div></div>
<div class="add-box">
<div class="add-label">Новый витамин</div>
<form id="addForm">
<input id="name" type="text" placeholder="Омега-3, D3, магний…" autocomplete="off">
<div class="form-row">
<select id="when"><option value="both">🌅+🌙 Утро и вечер</option><option value="morning">🌅 Только утро</option><option value="evening">🌙 Только вечер</option></select>
<select id="emoji"><option value="💊">💊 Таблетка</option><option value="☀️">☀️ D3</option><option value="🐟">🐟 Омега</option><option value="🍊">🍊 Витамин C</option><option value="🧬">🧬 Магний</option></select>
</div>
<button type="submit" class="btn-add" id="addBtn">+ Добавить витамин</button>
</form>
</div>
</div>
<script>
window.__pillsRenderUI=function(s){
  var fill=document.getElementById('fill');if(fill)fill.style.height=s.pct+'%';
  var pct=document.getElementById('pct');if(pct)pct.textContent=s.pct+'%';
  var mT=0,mD=0,eT=0,eD=0;
  s.meds.forEach(function(m){
    var sl=m.when==='morning'?['morning']:m.when==='evening'?['evening']:['morning','evening'];
    if(sl.indexOf('morning')>=0){mT++;if(m.m)mD++}
    if(sl.indexOf('evening')>=0){eT++;if(m.e)eD++}
  });
  var cm=document.getElementById('cntM');if(cm)cm.textContent=mD+' / '+mT;
  var ce=document.getElementById('cntE');if(ce)ce.textContent=eD+' / '+eT;
  var dm=document.getElementById('doseM');if(dm)dm.classList.toggle('done',mT>0&&mD===mT);
  var de=document.getElementById('doseE');if(de)de.classList.toggle('done',eT>0&&eD===eT);
  var cel=document.getElementById('celebrate');
  if(cel)cel.classList.toggle('show',s.total>0&&s.taken===s.total);
};
</script>
${pillsRuntimeScript}
</body>
</html>`;
