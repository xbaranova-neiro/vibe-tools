export const budgetHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Семейный бюджет</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(135deg,#1e1b4b,#312e81);min-height:100vh;padding:20px 16px;color:#fff}
.card{max-width:440px;margin:0 auto}
h1{text-align:center;font-size:1.5rem;margin-bottom:20px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.balance{background:rgba(255,255,255,.1);border-radius:20px;padding:20px;text-align:center;border:1px solid rgba(255,255,255,.15)}
.balance .num{font-size:2rem;font-weight:800;color:#a5b4fc}
.balance .lbl{font-size:.8rem;opacity:.7;margin-top:4px}
.daily{background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:20px;padding:20px;text-align:center;box-shadow:0 8px 32px rgba(99,102,241,.4)}
.daily .num{font-size:2rem;font-weight:800}
.daily .lbl{font-size:.8rem;opacity:.9;margin-top:4px}
.chart-wrap{display:flex;align-items:center;gap:16px;background:rgba(255,255,255,.08);border-radius:20px;padding:16px;margin-bottom:16px}
.chart{width:100px;height:100px;border-radius:50%;flex-shrink:0;transition:background .5s;position:relative;display:flex;align-items:center;justify-content:center}
.chart.empty{background:transparent!important;border:3px dashed rgba(255,255,255,.25)}
.chart.empty .chart-hint{font-size:1.6rem;line-height:1;text-align:center;opacity:.85}
.legend{flex:1;font-size:.85rem}
.legend-item{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.legend-empty{opacity:.65;line-height:1.45}
.legend-empty strong{display:block;font-size:.9rem;opacity:1;margin-bottom:4px;color:rgba(255,255,255,.9)}
.legend-hint{font-size:.78rem;opacity:.55;margin-top:6px}
.dot{width:10px;height:10px;border-radius:50%}
.form{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
input,select{padding:10px 12px;border-radius:10px;border:none;font-size:.95rem}
input{flex:1;min-width:80px}
select{background:#fff}
.btn-add{padding:10px 16px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer}
.list{max-height:200px;overflow-y:auto}
.item{display:flex;align-items:center;gap:10px;padding:12px;background:rgba(255,255,255,.06);border-radius:12px;margin-bottom:8px;animation:slideIn .3s}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
.item.inc{border-left:3px solid #4ade80}
.item.exp{border-left:3px solid #f87171}
.item span{flex:1}
.item small{opacity:.7}
.del{background:none;border:none;color:#f87171;cursor:pointer;font-size:1.2rem;padding:4px}
.msg{text-align:center;padding:12px;border-radius:12px;margin-bottom:12px;font-weight:600;transition:all .3s}
.msg.ok{background:rgba(74,222,128,.2);color:#4ade80}
.msg.warn{background:rgba(248,113,113,.2);color:#fca5a5}
</style>
</head>
<body>
<div class="card">
<h1>💰 Семейный бюджет</h1>
<div class="msg ok" id="msg">✨ Всё под контролем</div>
<div class="hero">
<div class="balance"><div class="num" id="left">0 ₽</div><div class="lbl">Остаток</div></div>
<div class="daily"><div class="num" id="daily">0 ₽</div><div class="lbl">Можно сегодня</div></div>
</div>
<div class="chart-wrap">
<div class="chart empty" id="chart"><span class="chart-hint" id="chartHint">📊</span></div>
<div class="legend" id="legend"></div>
</div>
<div class="form">
<input type="number" id="amount" placeholder="Сумма">
<select id="cat"><option value="exp:🛒:Продукты">🛒 Продукты</option><option value="exp:🏠:Жильё">🏠 Жильё</option><option value="exp:🚗:Транспорт">🚗 Транспорт</option><option value="exp:🎬:Развлечения">🎬 Развлечения</option><option value="inc:💵:Доход">💵 Доход</option></select>
<button class="btn-add" id="addBtn">+</button>
</div>
<div class="list" id="list"></div>
</div>
<script>
const KEY='vibe-budget';
const COLORS={'Продукты':'#f87171','Жильё':'#fb923c','Транспорт':'#fbbf24','Развлечения':'#a78bfa','Доход':'#4ade80'};
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{"items":[]}')}catch{return {items:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function daysLeft(){const n=new Date();return new Date(n.getFullYear(),n.getMonth()+1,0).getDate()-n.getDate()+1}
function render(){
  const d=load();let inc=0,exp=0,cats={};
  d.items.forEach(i=>{if(i.type==='inc')inc+=i.amount;else{exp+=i.amount;cats[i.cat]=(cats[i.cat]||0)+i.amount}});
  const left=inc-exp;
  document.getElementById('left').textContent=left.toLocaleString('ru')+' ₽';
  document.getElementById('daily').textContent=Math.max(0,Math.floor(left/daysLeft())).toLocaleString('ru')+' ₽';
  const msg=document.getElementById('msg');
  if(left<0){msg.className='msg warn';msg.textContent='⚠️ Перерасход — пора экономить'}
  else{msg.className='msg ok';msg.textContent='✨ Всё под контролем — '+Math.round((1-exp/Math.max(inc,1))*100)+'% сбережено'}
  const total=Object.values(cats).reduce((a,b)=>a+b,0)||1;
  const chartEl=document.getElementById('chart');
  const hintEl=document.getElementById('chartHint');
  if(Object.keys(cats).length){
    chartEl.classList.remove('empty');
    if(hintEl)hintEl.textContent='';
    let grad='conic-gradient(';let acc=0;
    Object.entries(cats).forEach(([k,v],i)=>{const pct=v/total*360;grad+=COLORS[k]+' '+acc+'deg '+(acc+pct)+'deg'+(i<Object.keys(cats).length-1?',':'');acc+=pct});
    grad+=')';
    chartEl.style.background=grad;
    document.getElementById('legend').innerHTML=Object.entries(cats).map(([k,v])=>'<div class="legend-item"><div class="dot" style="background:'+COLORS[k]+'"></div>'+k+': '+v.toLocaleString('ru')+' ₽</div>').join('');
  }else{
    chartEl.classList.add('empty');
    chartEl.style.background='';
    if(hintEl)hintEl.textContent='📊';
    document.getElementById('legend').innerHTML='<div class="legend-empty"><strong>Диаграмма расходов</strong>Пока пусто — добавьте первую операцию ниже, и круг покажет, куда уходят деньги</div><div class="legend-hint">🛒 продукты · 🏠 жильё · 🚗 транспорт…</div>';
  }
  document.getElementById('list').innerHTML=d.items.slice().reverse().map((i,idx)=>{const realIdx=d.items.length-1-idx;return '<div class="item '+(i.type==='inc'?'inc':'exp')+'"><span>'+i.emoji+' '+i.cat+'</span><small>'+(i.type==='inc'?'+':'−')+i.amount.toLocaleString('ru')+' ₽</small><button class="del" data-i="'+realIdx+'">×</button></div>'}).join('');
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',()=>{d.items.splice(+b.dataset.i,1);save(d);render()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('addBtn').addEventListener('click',()=>{
    const amt=+document.getElementById('amount').value;if(!amt)return;
    const [type,emoji,cat]=document.getElementById('cat').value.split(':');
    const d=load();d.items.push({type,emoji,cat,amount:amt});save(d);
    document.getElementById('amount').value='';render();
  });
});
</script>
</body>
</html>`;
