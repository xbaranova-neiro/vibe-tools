export const watchlistAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Кино</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(145deg,#0f172a,#581c87);min-height:100vh;padding:20px 14px;color:#fff}
.card{max-width:460px;margin:0 auto}
h1{font-size:1.4rem;margin-bottom:14px;text-align:center}
.board{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;min-height:320px;margin-bottom:16px}
.col{border-radius:14px;padding:10px 8px;background:rgba(0,0,0,.2);min-height:200px}
.col-hdr{font-size:.65rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;text-align:center;margin-bottom:8px;opacity:.75;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.1)}
.col.want .col-hdr{color:#a5b4fc}
.col.watching .col-hdr{color:#fbbf24}
.col.done .col-hdr{color:#86efac}
.tile{background:rgba(255,255,255,.1);border-radius:12px;padding:10px 8px;margin-bottom:8px;font-size:.75rem;cursor:pointer;transition:transform .2s;text-align:center}
.tile:hover{transform:scale(1.04)}
.tile .em{font-size:1.4rem;display:block;margin-bottom:4px}
.tile .t{font-weight:600;line-height:1.2;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.col-drop{min-height:40px;border:2px dashed rgba(255,255,255,.08);border-radius:10px;margin-top:4px}
.form{display:flex;gap:8px;margin-bottom:10px}
input{flex:1;padding:11px;border-radius:12px;border:none;font-size:.95rem}
.btn{padding:11px 16px;border:none;border-radius:12px;background:#a78bfa;color:#1e1b4b;font-weight:700;cursor:pointer;width:100%}
.stats{display:flex;justify-content:center;gap:16px;font-size:.8rem;opacity:.7;margin-bottom:12px}
</style>
</head>
<body>
<div class="card">
<h1>🍿 Кино-борд</h1>
<div class="stats"><span id="stWant">0 хотим</span><span>·</span><span id="stWatch">0 смотрим</span><span>·</span><span id="stDone">0 готово</span></div>
<div class="board">
<div class="col want" data-status="want"><div class="col-hdr">📋 Хочу</div><div class="col-body" id="colWant"></div></div>
<div class="col watching" data-status="watching"><div class="col-hdr">▶️ Смотрю</div><div class="col-body" id="colWatch"></div></div>
<div class="col done" data-status="done"><div class="col-hdr">✅ Готово</div><div class="col-body" id="colDone"></div></div>
</div>
<div class="form"><input id="title" placeholder="Фильм или сериал…"><button class="btn" id="addBtn">+</button></div>
</div>
<script>
const KEY='vibe-watch';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function tile(s,i){return '<div class="tile" data-i="'+i+'"><span class="em">'+s.emoji+'</span><span class="t">'+s.title+'</span></div>'}
function render(){
  const d=load();
  document.getElementById('stWant').textContent=d.filter(x=>x.status==='want').length+' хотим';
  document.getElementById('stWatch').textContent=d.filter(x=>x.status==='watching').length+' смотрим';
  document.getElementById('stDone').textContent=d.filter(x=>x.status==='done').length+' готово';
  ['want','watching','done'].forEach(st=>{
    const el=document.getElementById('col'+(st==='want'?'Want':st==='watching'?'Watch':'Done'));
    const items=d.map((s,i)=>({s,i})).filter(x=>x.s.status===st);
    el.innerHTML=items.map(x=>tile(x.s,x.i)).join('')||'<div class="col-drop">пусто</div>';
  });
  document.querySelectorAll('.tile').forEach(t=>t.addEventListener('click',()=>{
    const d=load();const i=+t.dataset.i;const order=['want','watching','done'];
    const next=order[(order.indexOf(d[i].status)+1)%3];
    d[i].status=next;save(d);render();
  }));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('addBtn').addEventListener('click',()=>{
    const title=document.getElementById('title').value.trim();if(!title)return;
    const d=load();d.push({title,emoji:Math.random()>.5?'🎬':'📺',kind:'film',status:'want'});save(d);
    document.getElementById('title').value='';render();
  });
  document.getElementById('title').addEventListener('keypress',e=>{if(e.key==='Enter')document.getElementById('addBtn').click()});
});
</script>
</body>
</html>`;
