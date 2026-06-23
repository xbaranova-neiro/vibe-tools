export const pillsHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Витамины</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(145deg,#134e4a,#0f766e);min-height:100vh;padding:22px 16px;color:#fff}
.card{max-width:420px;margin:0 auto}
h1{text-align:center;font-size:1.5rem;margin-bottom:4px}
.sub{text-align:center;opacity:.8;font-size:.85rem;margin-bottom:14px}
.alert{text-align:center;padding:12px 14px;border-radius:14px;margin-bottom:16px;font-weight:600;font-size:.9rem;transition:all .3s}
.alert.ok{background:rgba(74,222,128,.2);color:#86efac;border:1px solid rgba(74,222,128,.3)}
.alert.warn{background:rgba(251,191,36,.2);color:#fde68a;border:1px solid rgba(251,191,36,.35);animation:alertPulse 2s infinite}
@keyframes alertPulse{0%,100%{box-shadow:0 0 0 rgba(251,191,36,0)}50%{box-shadow:0 0 20px rgba(251,191,36,.25)}}
.progress-box{background:rgba(255,255,255,.1);border-radius:16px;padding:14px;margin-bottom:16px}
.progress-label{display:flex;justify-content:space-between;font-size:.85rem;margin-bottom:8px}
.progress-bar{height:12px;background:rgba(0,0,0,.2);border-radius:99px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,#2dd4bf,#5eead4);width:0;border-radius:99px;transition:width .5s cubic-bezier(.34,1.56,.64,1)}
.section{margin-bottom:18px}
.section-hdr{display:flex;align-items:center;gap:8px;font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.75;margin-bottom:10px}
.med{display:flex;align-items:center;gap:12px;padding:14px;background:rgba(255,255,255,.08);border-radius:14px;margin-bottom:8px;cursor:pointer;transition:all .25s}
.med.taken{opacity:.55;background:rgba(74,222,128,.12)}
.med-emoji{font-size:1.8rem;line-height:1}
.med-info{flex:1}
.med-info .name{font-weight:600;font-size:1rem}
.med-info .hint{font-size:.75rem;opacity:.6;margin-top:2px}
.med-check{width:32px;height:32px;border-radius:50%;border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:.9rem;transition:all .3s}
.med.taken .med-check{background:#2dd4bf;border-color:#2dd4bf;color:#134e4a}
.med .del{margin-left:4px;background:none;border:none;color:#fca5a5;font-size:1.1rem;cursor:pointer;padding:4px}
.form{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap}
input,select{padding:11px;border-radius:12px;border:none;font-size:.95rem}
input{flex:1;min-width:100px}
select{background:#fff}
.btn{width:100%;padding:12px;background:#2dd4bf;color:#134e4a;border:none;border-radius:12px;font-weight:700;cursor:pointer}
.celebrate{text-align:center;padding:14px;border-radius:14px;background:rgba(74,222,128,.15);color:#86efac;font-weight:700;display:none;margin-bottom:12px}
.celebrate.show{display:block;animation:pop .4s}
@keyframes pop{0%{transform:scale(.9);opacity:0}100%{transform:scale(1);opacity:1}}
</style>
</head>
<body>
<div class="card">
<h1>💊 Витамины</h1>
<p class="sub">Утро и вечер — ничего не забыть</p>
<div class="alert ok" id="alert">✨ Загрузка…</div>
<div class="progress-box">
<div class="progress-label"><span>Сегодня принято</span><span id="progText">0 / 0</span></div>
<div class="progress-bar"><div class="progress-fill" id="progFill"></div></div>
</div>
<div class="celebrate" id="celebrate">🎉 Все витамины на сегодня!</div>
<div class="section"><div class="section-hdr">🌅 Утро</div><div id="morning"></div></div>
<div class="section"><div class="section-hdr">🌙 Вечер</div><div id="evening"></div></div>
<div class="form">
<input id="name" placeholder="Название (Омега-3…)">
<select id="when"><option value="both">🌅+🌙 Утро и вечер</option><option value="morning">🌅 Только утро</option><option value="evening">🌙 Только вечер</option></select>
<select id="emoji"><option value="💊">💊 Таблетка</option><option value="☀️">☀️ D3</option><option value="🐟">🐟 Омега</option><option value="🍊">🍊 Витамин C</option><option value="🧪">🧪 Другое</option></select>
</div>
<button class="btn" id="addBtn">+ Добавить</button>
</div>
<script>
const KEY='vibe-pills';
function today(){return new Date().toISOString().slice(0,10)}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{"date":"","meds":[]}')}catch{return {date:'',meds:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function ensureToday(d){if(d.date===today())return d;const meds=(d.meds||[]).map(m=>({...m,m:false,e:false}));return {date:today(),meds}}
function slots(m){if(m.when==='morning')return ['morning'];if(m.when==='evening')return ['evening'];return ['morning','evening']}
function totalDoses(meds){return meds.reduce((a,m)=>a+slots(m).length,0)}
function takenDoses(meds){return meds.reduce((a,m)=>a+(m.m?1:0)+(m.e?1:0),0)}
function render(){
  let d=ensureToday(load());save(d);
  const meds=d.meds||[];
  const total=totalDoses(meds);const taken=takenDoses(meds);
  const pct=total?Math.round(taken/total*100):0;
  document.getElementById('progText').textContent=taken+' / '+total;
  document.getElementById('progFill').style.width=pct+'%';
  document.getElementById('celebrate').classList.toggle('show',total>0&&taken===total);
  const hour=new Date().getHours();
  const alert=document.getElementById('alert');
  let pendingM=meds.filter(m=>slots(m).includes('morning')&&!m.m);
  let pendingE=meds.filter(m=>slots(m).includes('evening')&&!m.e);
  if(!meds.length){alert.className='alert ok';alert.textContent='➕ Добавьте первый витамин'}
  else if(total>0&&taken===total){alert.className='alert ok';alert.textContent='✅ Отлично! Всё принято сегодня'}
  else if(hour>=20&&pendingE.length){alert.className='alert warn';alert.textContent='⚠️ Не приняли вечером: '+pendingE.map(m=>m.name).join(', ')}
  else if(hour>=12&&pendingM.length){alert.className='alert warn';alert.textContent='⚠️ Не приняли утром: '+pendingM.map(m=>m.name).join(', ')}
  else if(pendingM.length&&hour<12){alert.className='alert ok';alert.textContent='🌅 Утро: '+pendingM.length+' приём(а) осталось'}
  else if(pendingE.length){alert.className='alert ok';alert.textContent='🌙 Вечер: '+pendingE.length+' приём(а) осталось'}
  else{alert.className='alert ok';alert.textContent='✨ Всё под контролем'}
  function row(m,i,slot){
    const taken=slot==='morning'?m.m:m.e;
    return '<div class="med'+(taken?' taken':'')+'" data-i="'+i+'" data-slot="'+slot+'"><span class="med-emoji">'+m.emoji+'</span><div class="med-info"><div class="name">'+m.name+'</div><div class="hint">'+(taken?'Принято ✓':'Нажмите, когда выпьете')+'</div></div><div class="med-check">'+(taken?'✓':'')+'</div><button class="del" data-i="'+i+'">×</button></div>';
  }
  document.getElementById('morning').innerHTML=meds.map((m,i)=>slots(m).includes('morning')?row(m,i,'morning'):'').join('')||'<p style="opacity:.45;font-size:.85rem;padding:8px 0">Нет утренних</p>';
  document.getElementById('evening').innerHTML=meds.map((m,i)=>slots(m).includes('evening')?row(m,i,'evening'):'').join('')||'<p style="opacity:.45;font-size:.85rem;padding:8px 0">Нет вечерних</p>';
  document.querySelectorAll('.med').forEach(el=>el.addEventListener('click',e=>{
    if(e.target.classList.contains('del'))return;
    const d=ensureToday(load());const m=d.meds[+el.dataset.i];
    if(el.dataset.slot==='morning')m.m=!m.m;else m.e=!m.e;
    save(d);render();
  }));
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const d=ensureToday(load());d.meds.splice(+b.dataset.i,1);save(d);render()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('addBtn').addEventListener('click',()=>{
    const name=document.getElementById('name').value.trim();if(!name)return;
    const d=ensureToday(load());
    d.meds.push({name,emoji:document.getElementById('emoji').value,when:document.getElementById('when').value,m:false,e:false});
    save(d);document.getElementById('name').value='';render();
  });
});
</script>
</body>
</html>`;
