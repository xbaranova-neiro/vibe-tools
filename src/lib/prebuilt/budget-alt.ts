export const budgetAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Мои финансы</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(180deg,#0f172a,#1e293b);min-height:100vh;padding:20px 16px;color:#fff}
.card{max-width:440px;margin:0 auto}
h1{font-size:1.6rem;margin-bottom:4px}
.sub{opacity:.75;font-size:.85rem;margin-bottom:20px}
.stat-row{display:flex;gap:10px;margin-bottom:20px}
.stat{flex:1;text-align:center;padding:14px 8px;border-radius:16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}
.stat .n{font-size:1.35rem;font-weight:800;color:var(--vibe-accent-light,#a5b4fc)}
.stat .l{font-size:.7rem;opacity:.7;margin-top:2px}
.bars{background:rgba(255,255,255,.06);border-radius:16px;padding:16px;margin-bottom:16px}
.bars h3{font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;opacity:.6;margin-bottom:12px}
.bar-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:.8rem}
.bar-row:last-child{margin-bottom:0}
.bar-label{width:72px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bar-track{flex:1;height:10px;background:rgba(0,0,0,.25);border-radius:99px;overflow:hidden}
.bar-seg{height:100%;border-radius:99px;transition:width .5s cubic-bezier(.34,1.56,.64,1);width:0}
.bar-amt{width:56px;text-align:right;opacity:.85;font-size:.75rem}
.bars-empty{text-align:center;padding:8px 4px;line-height:1.45;opacity:.7}
.bars-empty strong{display:block;font-size:.9rem;opacity:1;margin-bottom:6px;color:rgba(255,255,255,.9)}
.bars-empty p{font-size:.82rem;margin:0}
.form{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
input,select{padding:10px 12px;border-radius:10px;border:none;font-size:.95rem}
input{flex:1;min-width:80px}
select{background:#fff}
.btn-add{padding:10px 18px;background:#6366f1;color:#fff;border:none;border-radius:10px;font-weight:600;cursor:pointer;width:100%}
.list{max-height:180px;overflow-y:auto}
.item{display:flex;align-items:center;gap:10px;padding:11px 12px;background:rgba(255,255,255,.05);border-radius:10px;margin-bottom:6px}
.item.inc{border-left:3px solid #4ade80}
.item.exp{border-left:3px solid #f87171}
.item span{flex:1;font-size:.9rem}
.item small{opacity:.7;font-size:.8rem}
.del{background:none;border:none;color:#f87171;cursor:pointer;font-size:1.1rem}
</style>
</head>
<body>
<div class="card">
<h1>💳 Мои финансы</h1>
<p class="sub">Доходы и расходы — на одном экране</p>
<div class="stat-row">
<div class="stat"><div class="n" id="left">0 ₽</div><div class="l">Остаток</div></div>
<div class="stat"><div class="n" id="daily">0 ₽</div><div class="l">На сегодня</div></div>
<div class="stat"><div class="n" id="saved">0%</div><div class="l">Сбережено</div></div>
</div>
<div class="bars"><h3>Расходы по категориям</h3><div id="bars"></div></div>
<div class="form">
<input type="number" id="amount" placeholder="Сумма">
<select id="cat"><option value="exp:🛒:Продукты">🛒 Продукты</option><option value="exp:🏠:Жильё">🏠 Жильё</option><option value="exp:🚗:Транспорт">🚗 Транспорт</option><option value="exp:🎬:Развлечения">🎬 Развлечения</option><option value="inc:💵:Доход">💵 Доход</option></select>
<button class="btn-add" id="addBtn">Добавить операцию</button>
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
  document.getElementById('saved').textContent=Math.max(0,Math.round((1-exp/Math.max(inc,1))*100))+'%';
  const max=Math.max(...Object.values(cats),1);
  document.getElementById('bars').innerHTML=Object.entries(cats).map(([k,v])=>'<div class="bar-row"><div class="bar-label">'+k+'</div><div class="bar-track"><div class="bar-seg" style="width:'+(v/max*100)+'%;background:'+COLORS[k]+'"></div></div><div class="bar-amt">'+v.toLocaleString('ru')+'</div></div>').join('')||'<div class="bars-empty"><strong>📊 Расходы по категориям</strong><p>Добавьте операцию ниже — появятся полоски по категориям</p></div>';
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
