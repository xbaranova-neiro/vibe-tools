export const kidsHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Кружки ребёнка</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(135deg,#831843,#be185d);min-height:100vh;padding:20px 12px;color:#fff}
.card{max-width:480px;margin:0 auto}
h1{text-align:center;font-size:1.4rem;margin-bottom:12px}
.next{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#78350f;border-radius:16px;padding:16px;margin-bottom:16px;text-align:center;box-shadow:0 8px 24px rgba(251,191,36,.3);animation:pulse 2s infinite}
.next .title{font-weight:800;font-size:1.1rem}
.next .timer{font-size:1.6rem;font-weight:800;margin-top:4px}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
.view-tabs{display:flex;gap:8px;margin-bottom:10px}
.view-tabs button{flex:1;padding:8px;border:none;border-radius:10px;font-size:.85rem;font-weight:600;cursor:pointer;background:rgba(255,255,255,.12);color:#fff;transition:all .2s}
.view-tabs button.active{background:#fbbf24;color:#78350f}
.week{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px}
.day{text-align:center;padding:8px 4px;border-radius:12px;background:rgba(255,255,255,.1);font-size:.7rem;cursor:pointer;border:2px solid transparent;transition:all .2s}
.day:hover{background:rgba(255,255,255,.18)}
.day.today{box-shadow:0 0 12px rgba(251,191,36,.35)}
.day.selected{background:rgba(251,191,36,.45);font-weight:800;border-color:rgba(251,191,36,.6)}
.day-name{opacity:.7;margin-bottom:4px}
.day-count{font-size:.65rem;font-weight:700;min-height:1em;opacity:.85}
.day-label{font-size:.85rem;font-weight:700;margin-bottom:10px;opacity:.9}
.form{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
input,select{padding:10px;border-radius:10px;border:none;font-size:.9rem}
input#name,select#type{grid-column:span 2}
input#time{grid-column:span 1}
select#dayPick{grid-column:span 1;background:#fff}
.btn{padding:10px 14px;background:#fbbf24;color:#78350f;border:none;border-radius:10px;font-weight:700;cursor:pointer;width:100%;grid-column:span 2}
.events{min-height:80px}
.week-all{display:none}
.week-all.show{display:block}
.day-block{margin-bottom:14px}
.day-block-hdr{font-size:.8rem;font-weight:700;opacity:.75;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center}
.day-block-hdr .add-day{font-size:.75rem;background:rgba(255,255,255,.15);border:none;color:#fff;padding:4px 8px;border-radius:8px;cursor:pointer}
.day-block.today-block .day-block-hdr{color:#fde68a}
.ev{padding:10px;border-radius:10px;margin-bottom:6px;font-size:.85rem;display:flex;align-items:center;gap:8px;animation:slide .3s}
@keyframes slide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
.ev.art{background:rgba(167,139,250,.3);border-left:3px solid #a78bfa}
.ev.sport{background:rgba(74,222,128,.3);border-left:3px solid #4ade80}
.ev.music{background:rgba(96,165,250,.3);border-left:3px solid #60a5fa}
.ev.study{background:rgba(251,191,36,.3);border-left:3px solid #fbbf24}
.ev .del{margin-left:auto;background:none;border:none;color:#fff;cursor:pointer;font-size:1.1rem;opacity:.7}
</style>
</head>
<body>
<div class="card">
<h1>🎨 Кружки ребёнка</h1>
<div class="next" id="next"><div class="title">Загрузка…</div><div class="timer" id="timer"></div></div>
<div class="view-tabs"><button type="button" class="active" data-view="day">📆 День</button><button type="button" data-view="week">📅 Вся неделя</button></div>
<div class="week" id="week"></div>
<p class="day-label" id="dayLabel">Расписание на сегодня</p>
<div class="events" id="events"></div>
<div class="week-all" id="weekAll"></div>
<div class="form">
<input id="name" placeholder="Название кружка">
<input id="time" type="time" value="16:00">
<select id="dayPick"></select>
<select id="type"><option value="art:🎨">🎨 Творчество</option><option value="sport:⚽">⚽ Спорт</option><option value="music:🎵">🎵 Музыка</option><option value="study:📚">📚 Учёба</option></select>
<button class="btn" id="addBtn">+ Добавить в расписание</button>
</div>
</div>
<script>
const KEY='vibe-kids';
const DAYS=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
const WEEK_ORDER=[1,2,3,4,5,6,0];
let selectedDay=new Date().getDay();
let viewMode='day';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function dayName(d,short){return short?DAYS[d]:(d===1?'Понедельник':d===2?'Вторник':d===3?'Среда':d===4?'Четверг':d===5?'Пятница':d===6?'Суббота':'Воскресенье')}
function countDay(d){return load().filter(i=>i.day===d).length}
function initDayPick(){
  const sel=document.getElementById('dayPick');
  sel.innerHTML=WEEK_ORDER.map(d=>'<option value="'+d+'">'+dayName(d)+'</option>').join('');
  sel.value=selectedDay;
}
function renderWeek(){
  const today=new Date().getDay();
  document.getElementById('week').innerHTML=WEEK_ORDER.map(d=>{
    const n=countDay(d);
    return '<div class="day'+(d===today?' today':'')+(d===selectedDay&&viewMode==='day'?' selected':'')+'" data-day="'+d+'"><div class="day-name">'+DAYS[d]+'</div><div class="day-count">'+(n?n+' 🎯':'')+'</div></div>';
  }).join('');
  document.querySelectorAll('.day').forEach(el=>el.addEventListener('click',()=>{
    selectedDay=+el.dataset.day;
    document.getElementById('dayPick').value=selectedDay;
    if(viewMode==='week')viewMode='day';
    document.querySelectorAll('.view-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view==='day'));
    render();
  }));
}
function nextClass(){
  const now=new Date();const dow=now.getDay();const items=load().filter(i=>i.day===dow).sort((a,b)=>a.time.localeCompare(b.time));
  const el=document.getElementById('next');const tm=document.getElementById('timer');
  let found=null;
  for(const i of items){const [h,m]=i.time.split(':').map(Number);const t=new Date(now);t.setHours(h,m,0,0);if(t>now){found={item:i,at:t};break}}
  if(!found&&items.length){el.querySelector('.title').textContent='🌴 На сегодня всё!';tm.textContent='Отдыхаем';return}
  if(!found){el.querySelector('.title').textContent='🌴 Сегодня выходной';tm.textContent='Нет занятий';return}
  el.querySelector('.title').textContent=found.item.emoji+' '+found.item.name+' в '+found.item.time;
  function tick(){const diff=found.at-new Date();if(diff<=0){render();return}const h=Math.floor(diff/3600000);const m=Math.floor((diff%3600000)/60000);tm.textContent='через '+h+' ч '+m+' мин'}
  tick();if(window._tick)clearInterval(window._tick);window._tick=setInterval(tick,30000);
}
function evHtml(i,idx){return '<div class="ev '+i.type+'">'+i.emoji+' <b>'+i.time+'</b> '+i.name+' <button class="del" data-i="'+idx+'">×</button></div>'}
function bindDel(){document.querySelectorAll('.ev .del,.day-block .del').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const d=load();d.splice(+b.dataset.i,1);save(d);render()}))}
function renderDayView(){
  const all=load();const items=all.filter(i=>i.day===selectedDay).sort((a,b)=>a.time.localeCompare(b.time));
  const today=new Date().getDay();
  document.getElementById('dayLabel').textContent='Расписание на '+dayName(selectedDay).toLowerCase()+(selectedDay===today?' (сегодня)':'');
  document.getElementById('events').style.display='block';
  document.getElementById('weekAll').classList.remove('show');
  document.getElementById('events').innerHTML=items.map(i=>evHtml(i,all.indexOf(i))).join('')||'<p style="opacity:.5;text-align:center;padding:20px">Нет занятий — добавьте ниже</p>';
  bindDel();
}
function renderWeekView(){
  const all=load();const today=new Date().getDay();
  document.getElementById('dayLabel').textContent='Расписание на всю неделю';
  document.getElementById('events').style.display='none';
  const box=document.getElementById('weekAll');
  box.classList.add('show');
  let html='';
  WEEK_ORDER.forEach(d=>{
    const items=all.filter(i=>i.day===d).sort((a,b)=>a.time.localeCompare(b.time));
    html+='<div class="day-block'+(d===today?' today-block':'')+'"><div class="day-block-hdr"><span>'+dayName(d)+(d===today?' · сегодня':'')+' ('+items.length+')</span><button type="button" class="add-day" data-day="'+d+'">+ добавить</button></div>';
    html+=items.length?items.map(i=>evHtml(i,all.indexOf(i))).join(''):'<p style="opacity:.45;font-size:.85rem;padding:4px 0 8px">Свободный день</p>';
    html+='</div>';
  });
  box.innerHTML=html;
  box.querySelectorAll('.add-day').forEach(b=>b.addEventListener('click',()=>{
    selectedDay=+b.dataset.day;
    document.getElementById('dayPick').value=selectedDay;
    viewMode='day';
    document.querySelectorAll('.view-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.view==='day'));
    render();
    document.getElementById('name').focus();
  }));
  bindDel();
}
function render(){
  renderWeek();nextClass();
  if(viewMode==='week')renderWeekView();else renderDayView();
}
document.addEventListener('DOMContentLoaded',()=>{
  initDayPick();
  render();
  document.getElementById('dayPick').addEventListener('change',e=>{selectedDay=+e.target.value;render()});
  document.querySelectorAll('.view-tabs button').forEach(b=>b.addEventListener('click',()=>{
    viewMode=b.dataset.view;
    document.querySelectorAll('.view-tabs button').forEach(x=>x.classList.toggle('active',x===b));
    render();
  }));
  document.getElementById('addBtn').addEventListener('click',()=>{
    const name=document.getElementById('name').value.trim();if(!name)return;
    const [type,emoji]=document.getElementById('type').value.split(':');
    const day=+document.getElementById('dayPick').value;
    const d=load();d.push({day,name,time:document.getElementById('time').value,type,emoji});save(d);
    selectedDay=day;
    document.getElementById('name').value='';
    render();
  });
});
</script>
</body>
</html>`;
