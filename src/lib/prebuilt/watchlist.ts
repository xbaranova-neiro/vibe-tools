export const watchlistHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Фильмы и сериалы</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(160deg,#1e1b4b,#312e81);min-height:100vh;padding:22px 16px;color:#fff}
.card{max-width:440px;margin:0 auto}
h1{text-align:center;font-size:1.45rem;margin-bottom:16px}
.tabs{display:flex;gap:6px;margin-bottom:16px}
.tabs button{flex:1;padding:10px 6px;border:none;border-radius:12px;font-size:.78rem;font-weight:600;cursor:pointer;background:rgba(255,255,255,.1);color:#fff;transition:all .2s}
.tabs button.active{background:linear-gradient(135deg,#6366f1,#a78bfa);color:#fff;box-shadow:0 4px 16px rgba(99,102,241,.4)}
.tabs button .cnt{display:block;font-size:.65rem;opacity:.8;margin-top:2px}
.show{display:flex;gap:12px;padding:14px;background:rgba(255,255,255,.08);border-radius:16px;margin-bottom:10px;cursor:pointer;transition:all .25s;align-items:center}
.show:hover{transform:translateX(4px);background:rgba(255,255,255,.12)}
.show.done{opacity:.45}
.poster{width:48px;height:64px;border-radius:10px;background:linear-gradient(145deg,rgba(255,255,255,.15),rgba(255,255,255,.05));display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,.2)}
.show-info{flex:1;min-width:0}
.show-info .title{font-weight:700;font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.show-info .meta{font-size:.75rem;opacity:.65;margin-top:4px}
.show-actions{display:flex;flex-direction:column;gap:4px}
.show-actions button{background:rgba(255,255,255,.12);border:none;color:#fff;width:28px;height:28px;border-radius:8px;cursor:pointer;font-size:.75rem}
.show-actions button:hover{background:rgba(255,255,255,.25)}
.form{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
input,select{padding:11px;border-radius:12px;border:none;font-size:.95rem}
input{flex:1;min-width:120px}
select{background:#fff}
.btn{width:100%;padding:12px;background:#6366f1;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;margin-bottom:8px}
.empty{text-align:center;padding:32px 16px;opacity:.5;font-size:.9rem}
.win{position:fixed;inset:0;background:rgba(0,0,0,.7);display:none;align-items:center;justify-content:center;z-index:99;padding:20px}
.win.show{display:flex}
.win-box{background:linear-gradient(145deg,#312e81,#1e1b4b);border-radius:20px;padding:28px;text-align:center;max-width:300px;animation:pop .4s}
.win-box .emoji{font-size:3rem}
.win-box h2{margin-top:12px;font-size:1.3rem}
@keyframes pop{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
</style>
</head>
<body>
<div class="card">
<h1>🎬 Фильмы и сериалы</h1>
<div class="tabs">
<button class="active" data-s="want">📋 Хочу<span class="cnt" id="cntWant">0</span></button>
<button data-s="watching">▶️ Смотрю<span class="cnt" id="cntWatch">0</span></button>
<button data-s="done">✅ Готово<span class="cnt" id="cntDone">0</span></button>
</div>
<div id="list"></div>
<div class="form">
<input id="title" placeholder="Название…">
<select id="type"><option value="film:🎬">🎬 Фильм</option><option value="series:📺">📺 Сериал</option></select>
</div>
<button class="btn" id="addBtn">+ В список</button>
</div>
<div class="win" id="win"><div class="win-box"><div class="emoji">🍿</div><h2 id="winTitle">Добавлено!</h2><p style="opacity:.7;margin-top:8px;font-size:.9rem">Приятного просмотра</p></div></div>
<script>
const KEY='vibe-watch';let tab='want';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function move(i,to){
  const d=load();d[i].status=to;save(d);render();
  if(to==='watching'){document.getElementById('winTitle').textContent='▶️ '+d[i].title;document.getElementById('win').classList.add('show');setTimeout(()=>document.getElementById('win').classList.remove('show'),2000)}
  if(to==='done'){document.getElementById('winTitle').textContent='✅ '+d[i].title;document.getElementById('win').classList.add('show');setTimeout(()=>document.getElementById('win').classList.remove('show'),2000)}
}
function render(){
  const d=load();
  document.getElementById('cntWant').textContent=d.filter(x=>x.status==='want').length;
  document.getElementById('cntWatch').textContent=d.filter(x=>x.status==='watching').length;
  document.getElementById('cntDone').textContent=d.filter(x=>x.status==='done').length;
  const items=d.filter(x=>x.status===tab);
  const labels={want:'📋 В списке «хочу посмотреть»',watching:'▶️ Сейчас смотрите',done:'✅ Просмотрено'};
  document.getElementById('list').innerHTML=items.length?items.map((s,i)=>{
    const idx=d.indexOf(s);
    const next=tab==='want'?'watching':tab==='watching'?'done':'want';
    const nextLbl=tab==='want'?'▶':tab==='watching'?'✓':'↩';
    return '<div class="show'+(tab==='done'?' done':'')+'" data-i="'+idx+'"><div class="poster">'+s.emoji+'</div><div class="show-info"><div class="title">'+s.title+'</div><div class="meta">'+(s.kind==='series'?'📺 Сериал':'🎬 Фильм')+'</div></div><div class="show-actions"><button data-i="'+idx+'" data-m="'+next+'" title="Дальше">'+nextLbl+'</button><button class="del" data-i="'+idx+'">×</button></div></div>';
  }).join(''):'<div class="empty">'+labels[tab]+'<br><small style="opacity:.7">Добавьте ниже</small></div>';
  document.querySelectorAll('.show').forEach(el=>el.addEventListener('click',e=>{
    if(e.target.closest('button'))return;
    const idx=+el.dataset.i;move(idx,tab==='want'?'watching':tab==='watching'?'done':'done');
  }));
  document.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();move(+b.dataset.i,b.dataset.m)}));
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const d=load();d.splice(+b.dataset.i,1);save(d);render()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
    tab=b.dataset.s;document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('active',x===b));render();
  }));
  document.getElementById('addBtn').addEventListener('click',()=>{
    const title=document.getElementById('title').value.trim();if(!title)return;
    const [kind,emoji]=document.getElementById('type').value.split(':');
    const d=load();d.push({title,emoji,kind,status:'want'});save(d);
    document.getElementById('title').value='';tab='want';
    document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('active',x.dataset.s==='want'));
    render();
  });
  document.getElementById('title').addEventListener('keypress',e=>{if(e.key==='Enter')document.getElementById('addBtn').click()});
});
</script>
</body>
</html>`;
