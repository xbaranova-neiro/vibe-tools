export const pillsAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Таблетки</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(180deg,#312e81,#4c1d95);min-height:100vh;padding:22px 16px;color:#fff}
.card{max-width:420px;margin:0 auto}
h1{text-align:center;font-size:1.5rem;margin-bottom:4px}
.sub{text-align:center;opacity:.8;font-size:.85rem;margin-bottom:14px}
.alert{text-align:center;padding:12px 14px;border-radius:14px;margin-bottom:16px;font-weight:600;font-size:.9rem}
.alert.ok{background:rgba(167,139,250,.22);color:#e9d5ff}
.alert.warn{background:rgba(251,191,36,.22);color:#fde68a}
.bottle-wrap{text-align:center;margin-bottom:18px}
.bottle{width:110px;height:150px;margin:0 auto;border:3px solid rgba(255,255,255,.35);border-radius:18px 18px 28px 28px;position:relative;overflow:hidden;background:rgba(255,255,255,.08)}
.bottle-cap{position:absolute;top:-2px;left:50%;transform:translateX(-50%);width:46px;height:16px;background:rgba(255,255,255,.25);border-radius:6px 6px 0 0}
.bottle-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(0deg,var(--vibe-bg2,#6366f1),var(--vibe-accent,#a78bfa));transition:height .6s cubic-bezier(.34,1.56,.64,1);height:0}
.bottle-pct{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:800;z-index:1;text-shadow:0 2px 8px rgba(0,0,0,.35)}
.dose-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.dose{padding:12px;border-radius:16px;background:rgba(255,255,255,.1);cursor:pointer;border:2px solid transparent;text-align:center;transition:all .25s}
.dose.done{background:rgba(74,222,128,.18);border-color:rgba(74,222,128,.35);opacity:.85}
.dose-emoji{font-size:1.4rem}
.dose-title{font-weight:700;margin-top:4px;font-size:.85rem}
.dose-count{font-size:.75rem;opacity:.75;margin-top:2px}
.section{margin-bottom:14px}
.section-hdr{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.7;margin-bottom:8px}
.med{display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,255,255,.08);border-radius:14px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.med.taken{opacity:.55;background:rgba(74,222,128,.12)}
.med-emoji{font-size:1.5rem;line-height:1}
.med-info{flex:1;min-width:0}
.med-info .name{font-weight:600;font-size:.95rem}
.med-info .hint{font-size:.72rem;opacity:.6;margin-top:2px}
.med-check{width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:.85rem;flex-shrink:0}
.med.taken .med-check{background:var(--vibe-accent,#a78bfa);border-color:var(--vibe-accent,#a78bfa);color:#1e1b4b}
.med .del{background:none;border:none;color:#fca5a5;font-size:1.1rem;cursor:pointer;padding:4px 6px;flex-shrink:0}
.form{display:flex;flex-direction:column;gap:8px;margin-top:14px}
.form-row{display:flex;gap:8px;flex-wrap:wrap}
input,select{padding:11px 12px;border-radius:12px;border:none;font-size:.95rem}
input{flex:1;min-width:120px}
select{background:#fff;color:#1e1b4b}
.btn-add{width:100%;padding:14px;border:none;border-radius:14px;background:var(--vibe-accent,#a78bfa);color:#1e1b4b;font-weight:700;font-size:1rem;cursor:pointer}
.celebrate{text-align:center;padding:12px;border-radius:14px;background:rgba(74,222,128,.15);color:#86efac;font-weight:700;display:none;margin-bottom:12px}
.celebrate.show{display:block}
</style>
</head>
<body>
<div class="card" id="card">
<h1>💊 Таблетки</h1>
<p class="sub">Бутылочка наполняется по мере приёма</p>
<div class="alert ok" id="alert">➕ Добавьте первый витамин</div>
<div class="celebrate" id="celebrate">🎉 Все витамины на сегодня!</div>
<div class="bottle-wrap">
<div class="bottle"><div class="bottle-cap"></div><div class="bottle-fill" id="fill"></div><div class="bottle-pct" id="pct">0%</div></div>
</div>
<div class="dose-row">
<div class="dose" id="doseM" data-action="take-morning"><div class="dose-emoji">🌅</div><div class="dose-title">Утро</div><div class="dose-count" id="cntM">0 / 0</div></div>
<div class="dose" id="doseE" data-action="take-evening"><div class="dose-emoji">🌙</div><div class="dose-title">Вечер</div><div class="dose-count" id="cntE">0 / 0</div></div>
</div>
<div class="section"><div class="section-hdr">🌅 Утро</div><div id="morning"></div></div>
<div class="section"><div class="section-hdr">🌙 Вечер</div><div id="evening"></div></div>
<div class="form">
<div class="form-row">
<input id="name" type="text" placeholder="Название (Омега-3…)">
<select id="when"><option value="both">🌅+🌙 Утро и вечер</option><option value="morning">🌅 Только утро</option><option value="evening">🌙 Только вечер</option></select>
</div>
<div class="form-row">
<select id="emoji"><option value="💊">💊 Таблетка</option><option value="☀️">☀️ D3</option><option value="🐟">🐟 Омега</option><option value="🍊">🍊 Витамин C</option></select>
<button type="button" class="btn-add" id="addBtn">+ Добавить витамин</button>
</div>
</div>
</div>
<script>
const KEY='vibe-pills';
function today(){return new Date().toISOString().slice(0,10)}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{"date":"","meds":[]}')}catch{return {date:'',meds:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function ensureToday(d){if(d.date===today())return d;return {date:today(),meds:(d.meds||[]).map(function(m){return Object.assign({},m,{m:false,e:false})})}}
function slots(m){if(m.when==='morning')return ['morning'];if(m.when==='evening')return ['evening'];return ['morning','evening']}
function totalDoses(meds){return meds.reduce(function(a,m){return a+slots(m).length},0)}
function takenDoses(meds){return meds.reduce(function(a,m){return a+(m.m?1:0)+(m.e?1:0)},0)}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function render(){
  var d=ensureToday(load());save(d);
  var meds=d.meds||[];
  var total=totalDoses(meds),taken=takenDoses(meds);
  var pct=total?Math.round(taken/total*100):0;
  document.getElementById('fill').style.height=pct+'%';
  document.getElementById('pct').textContent=pct+'%';
  var mTotal=0,mDone=0,eTotal=0,eDone=0;
  meds.forEach(function(m){
    if(slots(m).includes('morning')){mTotal++;if(m.m)mDone++}
    if(slots(m).includes('evening')){eTotal++;if(m.e)eDone++}
  });
  document.getElementById('cntM').textContent=mDone+' / '+mTotal;
  document.getElementById('cntE').textContent=eDone+' / '+eTotal;
  document.getElementById('doseM').classList.toggle('done',mTotal>0&&mDone===mTotal);
  document.getElementById('doseE').classList.toggle('done',eTotal>0&&eDone===eTotal);
  document.getElementById('celebrate').classList.toggle('show',total>0&&taken===total);
  var hour=new Date().getHours(),alert=document.getElementById('alert');
  var pendM=meds.filter(function(m){return slots(m).includes('morning')&&!m.m});
  var pendE=meds.filter(function(m){return slots(m).includes('evening')&&!m.e});
  if(!meds.length){alert.className='alert ok';alert.textContent='➕ Добавьте первый витамин'}
  else if(total>0&&taken===total){alert.className='alert ok';alert.textContent='✅ Всё принято сегодня!'}
  else if(hour>=20&&pendE.length){alert.className='alert warn';alert.textContent='⚠️ Вечер: '+pendE.map(function(m){return m.name}).join(', ')}
  else if(hour>=12&&pendM.length){alert.className='alert warn';alert.textContent='⚠️ Утро: '+pendM.map(function(m){return m.name}).join(', ')}
  else{alert.className='alert ok';alert.textContent='Осталось '+(total-taken)+' приёма'}
  function row(m,i,slot){
    var taken=slot==='morning'?m.m:m.e;
    return '<div class="med'+(taken?' taken':'')+'" data-i="'+i+'" data-slot="'+slot+'"><span class="med-emoji">'+m.emoji+'</span><div class="med-info"><div class="name">'+esc(m.name)+'</div><div class="hint">'+(taken?'Принято ✓':'Нажмите, когда выпьете')+'</div></div><div class="med-check">'+(taken?'✓':'')+'</div><button type="button" class="del" data-i="'+i+'">×</button></div>';
  }
  document.getElementById('morning').innerHTML=meds.map(function(m,i){return slots(m).includes('morning')?row(m,i,'morning'):''}).join('')||'<p style="opacity:.45;font-size:.85rem;padding:6px 0">Нет утренних</p>';
  document.getElementById('evening').innerHTML=meds.map(function(m,i){return slots(m).includes('evening')?row(m,i,'evening'):''}).join('')||'<p style="opacity:.45;font-size:.85rem;padding:6px 0">Нет вечерних</p>';
}
function bindCard(){
  var card=document.getElementById('card');
  if(!card||card.dataset.bound)return;
  card.dataset.bound='1';
  card.addEventListener('click',function(e){
    var t=e.target;
    if(t.id==='addBtn'||t.closest('#addBtn')){
      var name=document.getElementById('name').value.trim();
      if(!name)return;
      var d=ensureToday(load());
      d.meds.push({name:name,emoji:document.getElementById('emoji').value,when:document.getElementById('when').value,m:false,e:false});
      save(d);document.getElementById('name').value='';render();return;
    }
    if(t.classList.contains('del')){
      e.stopPropagation();
      var d=ensureToday(load());d.meds.splice(+t.dataset.i,1);save(d);render();return;
    }
    var med=t.closest('.med');
    if(med&&!t.classList.contains('del')){
      var d=ensureToday(load());var m=d.meds[+med.dataset.i];
      if(med.dataset.slot==='morning')m.m=!m.m;else m.e=!m.e;
      save(d);render();return;
    }
    var dose=t.closest('[data-action]');
    if(dose){
      var d=ensureToday(load());
      if(dose.dataset.action==='take-morning')d.meds.forEach(function(m){if(slots(m).includes('morning'))m.m=true});
      if(dose.dataset.action==='take-evening')d.meds.forEach(function(m){if(slots(m).includes('evening'))m.e=true});
      save(d);render();
    }
  });
  document.getElementById('name').addEventListener('keydown',function(e){
    if(e.key==='Enter')document.getElementById('addBtn').click();
  });
}
function init(){render();bindCard()}
if(typeof vibeBoot==='function')vibeBoot(init);else document.addEventListener('DOMContentLoaded',init);
</script>
</body>
</html>`;
