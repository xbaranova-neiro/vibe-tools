export const tasksHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Дела на сегодня</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(160deg,#134e4a,#0f766e);min-height:100vh;padding:24px 16px;color:#fff}
.card{max-width:420px;margin:0 auto}
h1{text-align:center;margin-bottom:20px;font-size:1.5rem}
.ring-wrap{display:flex;justify-content:center;margin-bottom:20px;position:relative}
.ring-wrap svg{transform:rotate(-90deg);filter:drop-shadow(0 0 12px rgba(45,212,191,.5))}
.ring-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.8rem;font-weight:800}
.form{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:12px;border-radius:12px;border:none;font-size:1rem}
button{padding:12px 16px;border:none;border-radius:12px;font-weight:600;cursor:pointer}
.btn-add{background:#2dd4bf;color:#134e4a}
.filters{display:flex;gap:8px;margin-bottom:12px}
.filters button{flex:1;background:rgba(255,255,255,.15);color:#fff;font-size:.85rem;padding:8px}
.filters button.active{background:#2dd4bf;color:#134e4a}
.task{display:flex;align-items:center;gap:12px;padding:14px;background:rgba(255,255,255,.1);border-radius:14px;margin-bottom:8px;transition:all .3s;cursor:pointer}
.task.done{opacity:.5;text-decoration:line-through;transform:scale(.98)}
.task-check{width:24px;height:24px;border-radius:50%;border:2px solid #2dd4bf;display:flex;align-items:center;justify-content:center;font-size:.8rem}
.task.done .task-check{background:#2dd4bf;color:#134e4a}
.task span{flex:1}
.task .del{opacity:.5;background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer}
.win{position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;z-index:99;flex-direction:column}
.win.show{display:flex;animation:pop .4s}
.win h2{font-size:2rem;margin-bottom:8px}
@keyframes pop{0%{transform:scale(.5);opacity:0}100%{transform:scale(1);opacity:1}}
.particle{position:fixed;font-size:1.5rem;animation:fly 2s forwards;pointer-events:none}
@keyframes fly{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(80vh) rotate(360deg)}}
</style>
</head>
<body>
<div class="card">
<h1>✅ Дела на сегодня</h1>
<div class="ring-wrap">
<svg width="120" height="120"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="10"/><circle id="ring" cx="60" cy="60" r="52" fill="none" stroke="#2dd4bf" stroke-width="10" stroke-linecap="round" stroke-dasharray="327" stroke-dashoffset="327" style="transition:stroke-dashoffset .6s cubic-bezier(.34,1.56,.64,1)"/></svg>
<div class="ring-text" id="pct">0%</div>
</div>
<div class="form"><input id="inp" placeholder="Новая задача…"><button class="btn-add" id="addBtn">+</button></div>
<div class="filters"><button class="active" data-f="all">Все</button><button data-f="active">Активные</button><button data-f="done">Готовые</button></div>
<div id="list"></div>
</div>
<div class="win" id="win"><h2>🎊 Всё сделано!</h2><p>Вы молодец!</p></div>
<script>
const KEY='vibe-tasks';let filter='all';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(t){localStorage.setItem(KEY,JSON.stringify(t))}
function particles(){['⭐','✨','🎉','💫','🌟'].forEach((e,i)=>{setTimeout(()=>{const p=document.createElement('div');p.className='particle';p.textContent=e;p.style.left=Math.random()*90+5+'vw';p.style.top='10px';document.body.appendChild(p);setTimeout(()=>p.remove(),2000)},i*100)})}
function render(){
  const tasks=load();const done=tasks.filter(t=>t.done).length;const pct=tasks.length?Math.round(done/tasks.length*100):0;
  document.getElementById('pct').textContent=pct+'%';
  const circ=2*Math.PI*52;
  document.getElementById('ring').style.strokeDashoffset=circ-(pct/100)*circ;
  const filtered=tasks.filter(t=>filter==='all'||(filter==='done'?t.done:!t.done));
  document.getElementById('list').innerHTML=filtered.map((t,i)=>{const idx=tasks.indexOf(t);return '<div class="task'+(t.done?' done':'')+'" data-i="'+idx+'"><div class="task-check">'+(t.done?'✓':'')+'</div><span>'+t.text+'</span><button class="del" data-i="'+idx+'">×</button></div>'}).join('')||'<p style="opacity:.5;text-align:center">Добавьте задачу</p>';
  if(tasks.length&&done===tasks.length){document.getElementById('win').classList.add('show');particles();setTimeout(()=>document.getElementById('win').classList.remove('show'),3000)}
  document.querySelectorAll('.task').forEach(el=>el.addEventListener('click',e=>{if(e.target.classList.contains('del'))return;const t=load();t[+el.dataset.i].done=!t[+el.dataset.i].done;save(t);render()}));
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const t=load();t.splice(+b.dataset.i,1);save(t);render()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('addBtn').addEventListener('click',()=>{const v=document.getElementById('inp').value.trim();if(!v)return;const t=load();t.push({text:v,done:false});save(t);document.getElementById('inp').value='';render()});
  document.getElementById('inp').addEventListener('keypress',e=>{if(e.key==='Enter')document.getElementById('addBtn').click()});
  document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.f;render()}));
});
</script>
</body>
</html>`;
