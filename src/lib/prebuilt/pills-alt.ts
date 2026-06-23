export const pillsAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Таблетки</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(180deg,#312e81,#4c1d95);min-height:100vh;padding:22px 16px;color:#fff}
.card{max-width:400px;margin:0 auto;text-align:center}
h1{font-size:1.45rem;margin-bottom:4px}
.sub{opacity:.75;font-size:.85rem;margin-bottom:16px}
.alert{padding:12px;border-radius:99px;font-weight:600;font-size:.85rem;margin-bottom:20px}
.alert.ok{background:rgba(167,139,250,.25);color:#e9d5ff}
.alert.warn{background:rgba(251,191,36,.25);color:#fde68a;animation:wobble 2s infinite}
@keyframes wobble{0%,100%{transform:rotate(0)}25%{transform:rotate(-1deg)}75%{transform:rotate(1deg)}}
.bottle{width:120px;height:160px;margin:0 auto 20px;border:3px solid rgba(255,255,255,.35);border-radius:20px 20px 32px 32px;position:relative;overflow:hidden;background:rgba(255,255,255,.08)}
.bottle-cap{position:absolute;top:0;left:50%;transform:translateX(-50%);width:50px;height:18px;background:rgba(255,255,255,.25);border-radius:6px 6px 0 0;margin-top:-3px}
.bottle-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(0deg,var(--vibe-bg2,#6366f1),var(--vibe-accent,#a78bfa));transition:height .6s cubic-bezier(.34,1.56,.64,1);height:0}
.bottle-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;z-index:1;text-shadow:0 2px 8px rgba(0,0,0,.3)}
.dose-row{display:flex;gap:8px;justify-content:center;margin-bottom:20px;flex-wrap:wrap}
.dose{flex:1;min-width:140px;padding:14px;border-radius:16px;background:rgba(255,255,255,.1);cursor:pointer;border:2px solid transparent;transition:all .25s}
.dose.done{background:rgba(74,222,128,.2);border-color:rgba(74,222,128,.4);opacity:.7}
.dose-emoji{font-size:1.5rem}
.dose-title{font-weight:700;margin-top:4px;font-size:.9rem}
.dose-count{font-size:.75rem;opacity:.7;margin-top:2px}
.list{text-align:left;margin-bottom:14px}
.pill-item{display:flex;align-items:center;gap:10px;padding:11px 12px;background:rgba(255,255,255,.06);border-radius:12px;margin-bottom:6px;font-size:.9rem}
.pill-item .del{margin-left:auto;background:none;border:none;color:#fca5a5;cursor:pointer}
.form{display:flex;gap:8px;margin-bottom:10px}
input{flex:1;padding:11px;border-radius:12px;border:none}
.btn{width:100%;padding:12px;border:none;border-radius:12px;background:#a78bfa;color:#1e1b4b;font-weight:700;cursor:pointer}
</style>
</head>
<body>
<div class="card">
<h1>💊 Таблетки</h1>
<p class="sub">Бутылочка наполняется по мере приёма</p>
<div class="alert ok" id="alert">—</div>
<div class="bottle"><div class="bottle-cap"></div><div class="bottle-fill" id="fill"></div><div class="bottle-label" id="pct">0%</div></div>
<div class="dose-row">
<div class="dose" id="doseM"><div class="dose-emoji">🌅</div><div class="dose-title">Утро</div><div class="dose-count" id="cntM">0 / 0</div></div>
<div class="dose" id="doseE"><div class="dose-emoji">🌙</div><div class="dose-title">Вечер</div><div class="dose-count" id="cntE">0 / 0</div></div>
</div>
<div class="list" id="list"></div>
<div class="form"><input id="name" placeholder="Название"><button class="btn" id="addBtn">+</button></div>
</div>
<script>
const KEY='vibe-pills';
function today(){return new Date().toISOString().slice(0,10)}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{"date":"","meds":[]}')}catch{return {date:'',meds:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function ensureToday(d){if(d.date===today())return d;return {date:today(),meds:(d.meds||[]).map(m=>({...m,m:false,e:false}))}}
function slots(m){return m.when==='morning'?['m']:m.when==='evening'?['e']:['m','e']}
function render(){
  let d=ensureToday(load());save(d);
  const meds=d.meds||[];
  const total=meds.reduce((a,m)=>a+slots(m).length,0);
  const taken=meds.reduce((a,m)=>a+(m.m?1:0)+(m.e?1:0),0);
  const pct=total?Math.round(taken/total*100):0;
  document.getElementById('fill').style.height=pct+'%';
  document.getElementById('pct').textContent=pct+'%';
  const mTotal=meds.filter(m=>m.when!=='evening').length;const mDone=meds.filter(m=>m.when!=='evening'&&m.m).length;
  const eTotal=meds.filter(m=>m.when!=='morning').length;const eDone=meds.filter(m=>m.when!=='morning'&&m.e).length;
  document.getElementById('cntM').textContent=mDone+' / '+mTotal;
  document.getElementById('cntE').textContent=eDone+' / '+eTotal;
  document.getElementById('doseM').classList.toggle('done',mTotal>0&&mDone===mTotal);
  document.getElementById('doseE').classList.toggle('done',eTotal>0&&eDone===eTotal);
  const hour=new Date().getHours();const alert=document.getElementById('alert');
  const pendM=meds.filter(m=>m.when!=='evening'&&!m.m);const pendE=meds.filter(m=>m.when!=='morning'&&!m.e);
  if(!meds.length)alert.textContent='Добавьте витамин';alert.className='alert ok';
  else if(total&&taken===total){alert.textContent='✅ Всё принято!';alert.className='alert ok'}
  else if(hour>=20&&pendE.length){alert.textContent='⚠️ Забыли вечер: '+pendE.map(m=>m.name).join(', ');alert.className='alert warn'}
  else if(hour>=12&&pendM.length){alert.textContent='⚠️ Забыли утро: '+pendM.map(m=>m.name).join(', ');alert.className='alert warn'}
  else{alert.textContent='Осталось '+(total-taken)+' приёма';alert.className='alert ok'}
  document.getElementById('list').innerHTML=meds.map((m,i)=>'<div class="pill-item">'+m.emoji+' '+m.name+' <small style="opacity:.6">'+(m.when==='both'?'утро+вечер':m.when==='morning'?'утро':'вечер')+'</small><button class="del" data-i="'+i+'">×</button></div>').join('')||'<p style="opacity:.5;text-align:center;font-size:.85rem">Список пуст</p>';
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',()=>{const d=ensureToday(load());d.meds.splice(+b.dataset.i,1);save(d);render()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('doseM').addEventListener('click',()=>{const d=ensureToday(load());d.meds.forEach(m=>{if(m.when!=='evening')m.m=true});save(d);render()});
  document.getElementById('doseE').addEventListener('click',()=>{const d=ensureToday(load());d.meds.forEach(m=>{if(m.when!=='morning')m.e=true});save(d);render()});
  document.getElementById('addBtn').addEventListener('click',()=>{
    const name=document.getElementById('name').value.trim();if(!name)return;
    const d=ensureToday(load());d.meds.push({name,emoji:'💊',when:'both',m:false,e:false});save(d);
    document.getElementById('name').value='';render();
  });
});
</script>
</body>
</html>`;
