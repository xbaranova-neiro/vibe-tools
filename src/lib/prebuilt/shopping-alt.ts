export const shoppingAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>В магазин</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(200deg,#14532d,#166534);min-height:100vh;padding:22px 16px;color:#fff}
.card{max-width:400px;margin:0 auto}
h1{font-size:1.5rem;margin-bottom:4px}
.sub{font-size:.85rem;opacity:.75;margin-bottom:18px}
.hero-num{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px}
.hero-num .big{font-size:3.5rem;font-weight:800;line-height:1;color:var(--vibe-accent-light,#86efac)}
.hero-num .sep{font-size:2rem;opacity:.4}
.hero-num .small{font-size:1.5rem;opacity:.7}
.quick-add{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:14px;border-radius:14px;border:none;font-size:1rem}
.btn-add{width:52px;height:52px;border:none;border-radius:14px;background:#4ade80;color:#14532d;font-size:1.5rem;font-weight:700;cursor:pointer;flex-shrink:0}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.tag{padding:6px 12px;border-radius:99px;font-size:.75rem;background:rgba(255,255,255,.12);cursor:pointer;border:1px solid transparent;transition:all .2s}
.tag:hover,.tag.sel{background:rgba(74,222,128,.25);border-color:#4ade80}
.items{display:flex;flex-direction:column;gap:8px}
.row{display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(255,255,255,.08);border-radius:16px;cursor:pointer;transition:all .25s}
.row.bought{opacity:.35;transform:scale(.98)}
.row .emoji{font-size:2rem;line-height:1}
.row .info{flex:1}
.row .info .name{font-weight:600;font-size:1.05rem}
.row .info .cat{font-size:.75rem;opacity:.6;margin-top:2px}
.row .check{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:.85rem}
.row.bought .check{background:#4ade80;border-color:#4ade80;color:#14532d}
.row .del{background:none;border:none;color:#fca5a5;font-size:1.1rem;cursor:pointer;padding:4px}
.done-banner{text-align:center;padding:16px;background:rgba(74,222,128,.2);border-radius:16px;margin-bottom:12px;font-weight:700;display:none}
.done-banner.show{display:block;animation:pop .4s}
@keyframes pop{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
.footer{text-align:center;margin-top:16px}
.footer button{background:rgba(255,255,255,.12);border:none;color:#fff;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:.85rem}
</style>
</head>
<body>
<div class="card">
<h1>🛍️ В магазин</h1>
<p class="sub">Быстрый список без лишнего</p>
<div class="hero-num"><span class="big" id="left">0</span><span class="sep">/</span><span class="small" id="total">0</span></div>
<div class="done-banner" id="done">✅ Всё куплено!</div>
<div class="quick-add"><input id="inp" placeholder="Добавить…"><button class="btn-add" id="addBtn">+</button></div>
<div class="tags" id="tags"><span class="tag sel" data-e="🥕" data-c="Овощи">🥕</span><span class="tag" data-e="🥛" data-c="Молочное">🥛</span><span class="tag" data-e="🍞" data-c="Хлеб">🍞</span><span class="tag" data-e="🧴" data-c="Бытовое">🧴</span><span class="tag" data-e="📦" data-c="Другое">📦</span></div>
<div class="items" id="items"></div>
<div class="footer"><button id="clearBtn">🗑 Убрать купленное</button></div>
</div>
<script>
const KEY='vibe-shop';let selEmoji='🥕',selCat='Овощи';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function render(){
  const items=load();const left=items.filter(i=>!i.bought).length;
  document.getElementById('left').textContent=left;
  document.getElementById('total').textContent=items.length;
  document.getElementById('done').classList.toggle('show',items.length>0&&left===0);
  const sorted=[...items.filter(i=>!i.bought),...items.filter(i=>i.bought)];
  document.getElementById('items').innerHTML=sorted.map(i=>{const idx=items.indexOf(i);return '<div class="row'+(i.bought?' bought':'')+'" data-i="'+idx+'"><span class="emoji">'+i.emoji+'</span><div class="info"><div class="name">'+i.name+'</div><div class="cat">'+i.cat+'</div></div><div class="check">'+(i.bought?'✓':'')+'</div><button class="del" data-i="'+idx+'">×</button></div>'}).join('')||'<p style="opacity:.5;text-align:center;padding:32px">Список пуст</p>';
  document.querySelectorAll('.row').forEach(el=>el.addEventListener('click',e=>{if(e.target.classList.contains('del'))return;const d=load();d[+el.dataset.i].bought=!d[+el.dataset.i].bought;save(d);render()}));
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const d=load();d.splice(+b.dataset.i,1);save(d);render()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.querySelectorAll('.tag').forEach(t=>t.addEventListener('click',()=>{document.querySelectorAll('.tag').forEach(x=>x.classList.remove('sel'));t.classList.add('sel');selEmoji=t.dataset.e;selCat=t.dataset.c}));
  document.getElementById('addBtn').addEventListener('click',()=>{const name=document.getElementById('inp').value.trim();if(!name)return;const d=load();d.push({name,emoji:selEmoji,cat:selCat,bought:false});save(d);document.getElementById('inp').value='';render()});
  document.getElementById('inp').addEventListener('keypress',e=>{if(e.key==='Enter')document.getElementById('addBtn').click()});
  document.getElementById('clearBtn').addEventListener('click',()=>{save(load().filter(i=>!i.bought));render()});
});
</script>
</body>
</html>`;
