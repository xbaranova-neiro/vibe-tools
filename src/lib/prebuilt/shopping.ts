export const shoppingHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Список покупок</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(160deg,#14532d,#15803d);min-height:100vh;padding:24px 16px;color:#fff}
.card{max-width:420px;margin:0 auto}
h1{text-align:center;margin-bottom:16px;font-size:1.5rem}
.progress-box{background:rgba(255,255,255,.12);border-radius:16px;padding:16px;margin-bottom:16px}
.progress-label{display:flex;justify-content:space-between;font-size:.9rem;margin-bottom:8px}
.progress-bar{height:14px;background:rgba(0,0,0,.2);border-radius:99px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,#4ade80,#86efac);border-radius:99px;transition:width .5s cubic-bezier(.34,1.56,.64,1);width:0}
.done-msg{text-align:center;font-size:1.2rem;font-weight:800;margin-top:10px;display:none;animation:bounce .5s}
.done-msg.show{display:block}
@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
.form{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
input,select{padding:12px;border-radius:12px;border:none;font-size:.95rem}
input{flex:1;min-width:100px}
.btn{width:100%;padding:12px;background:#4ade80;color:#14532d;border:none;border-radius:12px;font-weight:700;cursor:pointer;margin-bottom:16px}
.cat{margin-bottom:16px}
.cat-title{font-size:.85rem;opacity:.8;margin-bottom:8px;font-weight:600}
.item{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(255,255,255,.08);border-radius:12px;margin-bottom:6px;transition:all .3s;cursor:pointer}
.item.bought{opacity:.4;text-decoration:line-through;transform:scale(.98)}
.item-emoji{font-size:1.8rem;line-height:1}
.item span{flex:1;font-size:1rem}
.item .del{background:none;border:none;color:#fca5a5;font-size:1.2rem;cursor:pointer;padding:4px}
.clear{text-align:center;margin-top:12px}
.clear button{background:rgba(255,255,255,.15);border:none;color:#fff;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:.85rem}
</style>
</head>
<body>
<div class="card">
<h1>🛒 Список покупок</h1>
<div class="progress-box">
<div class="progress-label"><span>🛍️ Поход в магазин</span><span id="progText">0 / 0</span></div>
<div class="progress-bar"><div class="progress-fill" id="progFill"></div></div>
<div class="done-msg" id="doneMsg">🛍️ Всё в сумке!</div>
</div>
<div class="form">
<input id="inp" placeholder="Что купить?">
<select id="cat"><option value="🥕:Овощи">🥕 Овощи</option><option value="🥛:Молочное">🥛 Молочное</option><option value="🍞:Хлеб">🍞 Хлеб</option><option value="🧴:Бытовое">🧴 Бытовое</option><option value="📦:Другое">📦 Другое</option></select>
</div>
<button class="btn" id="addBtn">+ Добавить</button>
<div id="cats"></div>
<div class="clear"><button id="clearBtn">🗑 Очистить купленное</button></div>
</div>
<script>
const KEY='vibe-shop';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function render(){
  const items=load();const bought=items.filter(i=>i.bought).length;const total=items.length;
  const pct=total?Math.round(bought/total*100):0;
  document.getElementById('progText').textContent=bought+' / '+total;
  document.getElementById('progFill').style.width=pct+'%';
  document.getElementById('doneMsg').classList.toggle('show',total>0&&bought===total);
  const groups={};items.filter(i=>!i.bought).forEach(i=>{if(!groups[i.cat])groups[i.cat]=[];groups[i.cat].push(i)});
  const boughtItems=items.filter(i=>i.bought);
  let html='';
  Object.entries(groups).forEach(([cat,list])=>{
    html+='<div class="cat"><div class="cat-title">'+cat+'</div>';
    list.forEach(i=>{const idx=items.indexOf(i);html+='<div class="item" data-i="'+idx+'"><div class="item-emoji">'+i.emoji+'</div><span>'+i.name+'</span><button class="del" data-i="'+idx+'">×</button></div>'});
    html+='</div>';
  });
  if(boughtItems.length){html+='<div class="cat"><div class="cat-title">✅ Куплено</div>';boughtItems.forEach(i=>{const idx=items.indexOf(i);html+='<div class="item bought" data-i="'+idx+'"><div class="item-emoji">'+i.emoji+'</div><span>'+i.name+'</span><button class="del" data-i="'+idx+'">×</button></div>'});html+='</div>'}
  document.getElementById('cats').innerHTML=html||'<p style="opacity:.5;text-align:center">Список пуст</p>';
  document.querySelectorAll('.item').forEach(el=>el.addEventListener('click',e=>{if(e.target.classList.contains('del'))return;const d=load();d[+el.dataset.i].bought=!d[+el.dataset.i].bought;save(d);render()}));
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const d=load();d.splice(+b.dataset.i,1);save(d);render()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('addBtn').addEventListener('click',()=>{
    const name=document.getElementById('inp').value.trim();if(!name)return;
    const [emoji,cat]=document.getElementById('cat').value.split(':');
    const d=load();d.push({name,emoji,cat,bought:false});save(d);
    document.getElementById('inp').value='';render();
  });
  document.getElementById('inp').addEventListener('keypress',e=>{if(e.key==='Enter')document.getElementById('addBtn').click()});
  document.getElementById('clearBtn').addEventListener('click',()=>{save(load().filter(i=>!i.bought));render()});
});
</script>
</body>
</html>`;
