export const tasksAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Фокус дня</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(135deg,#134e4a,#115e59);min-height:100vh;padding:22px 16px;color:#fff}
.card{max-width:420px;margin:0 auto}
h1{font-size:1.45rem;margin-bottom:16px}
.progress-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
.progress-head .pct{font-size:2rem;font-weight:800;color:var(--vibe-accent-light,#5eead4)}
.progress-head .lbl{font-size:.85rem;opacity:.75}
.progress-track{height:16px;background:rgba(0,0,0,.25);border-radius:99px;overflow:hidden;margin-bottom:6px}
.progress-fill{height:100%;background:linear-gradient(90deg,#2dd4bf,#5eead4);border-radius:99px;width:0;transition:width .5s cubic-bezier(.34,1.56,.64,1)}
.progress-sub{font-size:.8rem;opacity:.65;margin-bottom:20px;text-align:right}
.form{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:12px;border-radius:12px;border:none;font-size:1rem}
button{padding:12px 18px;border:none;border-radius:12px;font-weight:600;cursor:pointer}
.btn-add{background:#2dd4bf;color:#134e4a}
.chips{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
.chips button{padding:6px 12px;border:none;border-radius:99px;font-size:.8rem;cursor:pointer;background:rgba(255,255,255,.12);color:#fff}
.chips button.active{background:#2dd4bf;color:#134e4a;font-weight:600}
.task{display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.1);cursor:pointer;transition:opacity .3s}
.task:last-child{border-bottom:none}
.task.done{opacity:.45}
.task-check{width:22px;height:22px;border-radius:6px;border:2px solid #2dd4bf;display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0;margin-top:2px}
.task.done .task-check{background:#2dd4bf;color:#134e4a}
.task-body{flex:1}
.task-body .text{font-size:1rem;line-height:1.35}
.task.done .text{text-decoration:line-through}
.task .del{opacity:.4;background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;padding:4px}
.win{position:fixed;inset:0;background:rgba(0,0,0,.65);display:none;align-items:center;justify-content:center;z-index:99;flex-direction:column}
.win.show{display:flex}
.win h2{font-size:2rem}
</style>
</head>
<body>
<div class="card">
<h1>🎯 Фокус дня</h1>
<div class="progress-head"><span class="lbl">Прогресс</span><span class="pct" id="pct">0%</span></div>
<div class="progress-track"><div class="progress-fill" id="bar"></div></div>
<p class="progress-sub" id="sub">0 из 0 задач</p>
<div class="form"><input id="inp" placeholder="Что сделать?"><button class="btn-add" id="addBtn">+</button></div>
<div class="chips"><button class="active" data-f="all">Все</button><button data-f="active">Активные</button><button data-f="done">Готовые</button></div>
<div id="list"></div>
</div>
<div class="win" id="win"><h2>🎊 Всё!</h2><p>Идеальный день</p></div>
<script>
const KEY='vibe-tasks';let filter='all';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(t){localStorage.setItem(KEY,JSON.stringify(t))}
function render(){
  const tasks=load();const done=tasks.filter(t=>t.done).length;const pct=tasks.length?Math.round(done/tasks.length*100):0;
  document.getElementById('pct').textContent=pct+'%';
  document.getElementById('bar').style.width=pct+'%';
  document.getElementById('sub').textContent=done+' из '+tasks.length+' задач';
  const filtered=tasks.filter(t=>filter==='all'||(filter==='done'?t.done:!t.done));
  document.getElementById('list').innerHTML=filtered.map((t,i)=>{const idx=tasks.indexOf(t);return '<div class="task'+(t.done?' done':'')+'" data-i="'+idx+'"><div class="task-check">'+(t.done?'✓':'')+'</div><div class="task-body"><div class="text">'+t.text+'</div></div><button class="del" data-i="'+idx+'">×</button></div>'}).join('')||'<p style="opacity:.5;text-align:center;padding:24px">Пусто — добавьте задачу</p>';
  if(tasks.length&&done===tasks.length){document.getElementById('win').classList.add('show');setTimeout(()=>document.getElementById('win').classList.remove('show'),2500)}
  document.querySelectorAll('.task').forEach(el=>el.addEventListener('click',e=>{if(e.target.classList.contains('del'))return;const t=load();t[+el.dataset.i].done=!t[+el.dataset.i].done;save(t);render()}));
  document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const t=load();t.splice(+b.dataset.i,1);save(t);render()}));
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('addBtn').addEventListener('click',()=>{const v=document.getElementById('inp').value.trim();if(!v)return;const t=load();t.push({text:v,done:false});save(t);document.getElementById('inp').value='';render()});
  document.getElementById('inp').addEventListener('keypress',e=>{if(e.key==='Enter')document.getElementById('addBtn').click()});
  document.querySelectorAll('.chips button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.chips button').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.f;render()}));
});
</script>
</body>
</html>`;
