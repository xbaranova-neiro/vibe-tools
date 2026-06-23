import { pillsRuntimeScript } from "./pills-shared";

export const pillsHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Витамины</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;background:linear-gradient(160deg,#0f766e 0%,#134e4a 45%,#042f2e 100%);min-height:100vh;padding:20px 16px 28px;color:#fff}
.card{max-width:420px;margin:0 auto;position:relative}
.hero{text-align:center;margin-bottom:16px}
.hero h1{font-size:1.55rem;font-weight:800;letter-spacing:-.02em}
.hero .sub{margin-top:4px;font-size:.85rem;opacity:.75}
.ring-wrap{display:flex;justify-content:center;margin:8px 0 18px}
.ring-box{position:relative;width:132px;height:132px}
.ring-box svg{transform:rotate(-90deg);width:132px;height:132px}
.ring-bg{fill:none;stroke:rgba(255,255,255,.12);stroke-width:10}
.ring-fg{fill:none;stroke:url(#ringGrad);stroke-width:10;stroke-linecap:round;stroke-dasharray:326.7;stroke-dashoffset:326.7;transition:stroke-dashoffset .65s cubic-bezier(.34,1.56,.64,1)}
.ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring-pct{font-size:1.75rem;font-weight:800;line-height:1}
.ring-sub{font-size:.72rem;opacity:.65;margin-top:2px}
.alert{text-align:center;padding:11px 14px;border-radius:14px;margin-bottom:14px;font-weight:600;font-size:.88rem;transition:all .25s}
.alert.ok{background:rgba(45,212,191,.18);color:#99f6e4;border:1px solid rgba(45,212,191,.25)}
.alert.warn{background:rgba(251,191,36,.18);color:#fde68a;border:1px solid rgba(251,191,36,.3)}
.section{margin-bottom:16px}
.section-hdr{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.65;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.med{display:flex;align-items:center;gap:12px;padding:13px 14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.06);border-radius:16px;margin-bottom:8px;cursor:pointer;transition:transform .15s,background .2s,opacity .2s}
.med:active{transform:scale(.98)}
.med.taken{opacity:.62;background:rgba(45,212,191,.12);border-color:rgba(45,212,191,.2)}
.med-emoji{font-size:1.65rem;line-height:1;flex-shrink:0}
.med-info{flex:1;min-width:0}
.med-info .name{font-weight:600;font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.med-info .hint{font-size:.72rem;opacity:.55;margin-top:2px}
.med-check{width:34px;height:34px;border-radius:50%;border:2px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;flex-shrink:0;transition:all .25s}
.med.taken .med-check{background:var(--vibe-accent,#2dd4bf);border-color:var(--vibe-accent,#2dd4bf);color:#042f2e}
.med .del{background:rgba(0,0,0,.15);border:none;border-radius:10px;color:#fca5a5;font-size:1rem;cursor:pointer;padding:6px 10px;flex-shrink:0;line-height:1}
.empty{opacity:.4;font-size:.82rem;padding:6px 0}
.add-box{margin-top:18px;padding:14px;border-radius:18px;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.08)}
.add-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.55;margin-bottom:10px}
#addForm{display:flex;flex-direction:column;gap:8px}
.form-row{display:flex;gap:8px;flex-wrap:wrap}
input,select{padding:12px 13px;border-radius:12px;border:none;font-size:.95rem;font-family:inherit}
input{flex:1;min-width:0;width:100%}
input.shake{animation:shake .35s ease}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
select{background:#fff;color:#134e4a;flex:1;min-width:120px}
.btn-add{width:100%;padding:14px;border:none;border-radius:14px;background:var(--vibe-accent,#2dd4bf);color:var(--vibe-accent-text,#042f2e);font-weight:800;font-size:1rem;cursor:pointer;box-shadow:0 8px 24px rgba(45,212,191,.25)}
.btn-add:active{transform:scale(.98)}
.celebrate{text-align:center;padding:12px;border-radius:14px;background:rgba(45,212,191,.15);color:#99f6e4;font-weight:700;display:none;margin-bottom:12px}
.celebrate.show{display:block;animation:pop .45s ease-out}
@keyframes pop{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
</style>
</head>
<body>
<div class="card">
<div class="hero">
<h1>💊 Витамины</h1>
<p class="sub">Утро и вечер — ничего не забыть</p>
</div>
<div class="alert ok" id="alert">➕ Добавьте первый витамин</div>
<div class="celebrate" id="celebrate">🎉 Все витамины на сегодня!</div>
<div class="ring-wrap">
<div class="ring-box">
<svg viewBox="0 0 120 120" aria-hidden="true">
<defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--vibe-accent,#2dd4bf)"/><stop offset="100%" stop-color="var(--vibe-accent-light,#5eead4)"/></linearGradient></defs>
<circle class="ring-bg" cx="60" cy="60" r="52"/>
<circle class="ring-fg" id="ringFg" cx="60" cy="60" r="52"/>
</svg>
<div class="ring-center">
<div class="ring-pct" id="ringPct">0%</div>
<div class="ring-sub" id="ringSub">0 / 0</div>
</div>
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
<select id="emoji"><option value="💊">💊 Таблетка</option><option value="☀️">☀️ D3</option><option value="🐟">🐟 Омега</option><option value="🍊">🍊 Витамин C</option><option value="🧪">🧪 Другое</option></select>
</div>
<button type="submit" class="btn-add" id="addBtn">+ Добавить витамин</button>
</form>
</div>
</div>
<script>
window.__pillsRenderUI=function(s){
  var circ=326.7;
  var off=circ-(s.pct/100)*circ;
  var fg=document.getElementById('ringFg');
  if(fg)fg.style.strokeDashoffset=off;
  var rp=document.getElementById('ringPct');if(rp)rp.textContent=s.pct+'%';
  var rs=document.getElementById('ringSub');if(rs)rs.textContent=s.taken+' / '+s.total;
  var cel=document.getElementById('celebrate');
  if(cel)cel.classList.toggle('show',s.total>0&&s.taken===s.total);
};
</script>
${pillsRuntimeScript}
</body>
</html>`;
