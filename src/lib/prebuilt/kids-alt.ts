export const kidsAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Расписание</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(145deg,#581c87,#be185d);min-height:100vh;padding:20px 14px;color:#fff}
.card{max-width:460px;margin:0 auto}
h1{text-align:center;font-size:1.45rem;margin-bottom:16px}
.today-banner{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#78350f;border-radius:20px;padding:18px;margin-bottom:16px;text-align:center}
.today-banner .day-name{font-size:.8rem;font-weight:600;opacity:.85}
.today-banner .countdown{font-size:1.75rem;font-weight:800;margin-top:4px}
.today-banner .event-name{font-size:1rem;font-weight:700;margin-top:6px}
.view-tabs{display:flex;gap:8px;margin-bottom:10px}
.view-tabs button{flex:1;padding:8px;border:none;border-radius:12px;font-size:.85rem;font-weight:600;cursor:pointer;background:rgba(255,255,255,.12);color:#fff}
.view-tabs button.active{background:#fbbf24;color:#78350f}
.pills{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:12px;scrollbar-width:none}
.pills::-webkit-scrollbar{display:none}
.pill{flex-shrink:0;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.1);font-size:.8rem;text-align:center;min-width:48px;cursor:pointer;border:2px solid transparent;transition:all .2s}
.pill.today-pill{box-shadow:0 0 16px rgba(251,191,36,.35)}
.pill.selected-pill{background:rgba(251,191,36,.45);font-weight:800;border-color:rgba(251,191,36,.55)}
.pill .dn{opacity:.7;font-size:.65rem;margin-bottom:2px}
.pill .cnt{font-size:.65rem;font-weight:700;margin-top:2px}
.section-title{font-size:.85rem;font-weight:700;margin-bottom:10px;opacity:.85}
.timeline{min-height:60px}
.week-all{display:none}
.week-all.show{display:block}
.wday{margin-bottom:16px}
.wday-hdr{font-size:.78rem;font-weight:700;opacity:.7;margin-bottom:8px;display:flex;justify-content:space-between}
.wday-hdr button{font-size:.7rem;background:rgba(255,255,255,.15);border:none;color:#fff;padding:4px 8px;border-radius:8px;cursor:pointer}
.slot{display:flex;gap:12px;margin-bottom:12px;animation:pop .35s ease-out}
@keyframes pop{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
.slot-time{font-size:.85rem;font-weight:800;width:48px;padding-top:12px;opacity:.9}
.slot-card{flex:1;background:rgba(255,255,255,.12);border-radius:16px;padding:14px 16px;border-left:4px solid var(--vibe-accent,#fbbf24);display:flex;align-items:center;gap:10px}
.slot-card .emoji{font-size:1.6rem}
.slot-card .name{font-weight:600;flex:1}
.slot-card .del{background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;font-size:1.2rem}
.form{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.12)}
input,select{padding:10px;border-radius:12px;border:none;font-size:.9rem}
input#name,select#type{grid-column:span 2}
select#dayPick{grid-column:span 2;background:#fff}
.btn{grid-column:span 2;padding:12px;background:#fbbf24;color:#78350f;border:none;border-radius:12px;font-weight:700;cursor:pointer}
</style>
</head>
<body>
<div class="card">
<h1>⭐ Занятия малыша</h1>
<div class="today-banner" id="banner"><div class="day-name" id="dayLabelTop">Сегодня</div><div class="countdown" id="timer">—</div><div class="event-name" id="nextName">Добавьте занятие</div></div>
<div class="view-tabs"><button type="button" class="active" data-view="day">📆 День</button><button type="button" data-view="week">📅 Неделя</button></div>
<div class="pills" id="pills"></div>
<p class="section-title" id="sectionTitle">Занятия в выбранный день</p>
<div class="timeline" id="timeline"></div>
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
const KEY='vibe-kids';const DAYS=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];const WEEK_ORDER=[1,2,3,4,5,6,0];
let selectedDay=new Date().getDay();let viewMode='day';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function dayName(d){return d===1?'Понедельник':d===2?'Вторник':d===3?'Среда':d===4?'Четверг':d===5?'Пятница':d===6?'Суббота':'Воскресенье'}
function countDay(d){return load().filter(i=>i.day===d).length}
function initDayPick(){
  const sel=document.getElementById('dayPick');
  sel.innerHTML=WEEK_ORDER.map(d=>'<option value="'+d+'">'+dayName(d)+'</option>').join('');
  sel.value=selectedDay;
}
function renderPills(){
  const today=new Date().getDay();
  document.getElementById('pills').innerHTML=WEEK_ORDER.map(d=>'<div class="pill'+(d===today?' today-pill':'')+(d===selectedDay&&viewMode==='day'?' selected-pill':'')+'" data-day="'+d+'"><div class="dn">'+DAYS[d]+'</div><div class="cnt">'+(countDay(d)||'—')+'</div></div>').join('');
  document.querySelectorAll('.pill').forEach(p=>p.addEventListener('click',()=>{
    selectedDay=+p.dataset.day;
    document.getElementById('dayPick').value=selectedDay;
    if(viewMode==='week')viewMode='day';
    document.querySelectorAll('.view-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view==='day'));
    render();
  }));
}
function nextEvent(){
  const now=new Date();const dow=now.getDay();const items=load().filter(i=>i.day===dow).sort((a,b)=>a.time.localeCompare(b.time));
  document.getElementById('dayLabelTop').textContent='Сегодня, '+DAYS[dow];
  let found=null;
  for(const i of items){const [h,m]=i.time.split(':').map(Number);const t=new Date(now);t.setHours(h,m,0,0);if(t>now){found={item:i,at:t};break}}
  const nm=document.getElementById('nextName');const tm=document.getElementById('timer');
  if(!found&&items.length){nm.textContent='🌴 На сегодня всё!';tm.textContent='Отдых';return}
  if(!found){nm.textContent='Нет занятий';tm.textContent='—';return}
  nm.textContent=found.item.emoji+' '+found.item.name;
  function tick(){const diff=found.at-new Date();if(diff<=0){render();return}const h=Math.floor(diff/3600000);const m=Math.floor((diff%3600000)/60000);tm.textContent='через '+h+'ч '+m+'м'}
  tick();if(window._tick)clearInterval(window._tick);window._tick=setInterval(tick,30000);
}
function slotHtml(i,idx){return '<div class="slot"><div class="slot-time">'+i.time+'</div><div class="slot-card '+i.type+'"><span class="emoji">'+i.emoji+'</span><span class="name">'+i.name+'</span><button class="del" data-i="'+idx+'">×</button></div></div>'}
function bindDel(){document.querySelectorAll('.del').forEach(b=>b.addEventListener('click',()=>{const d=load();d.splice(+b.dataset.i,1);save(d);render()}))}
function renderDay(){
  const all=load();const items=all.filter(i=>i.day===selectedDay).sort((a,b)=>a.time.localeCompare(b.time));
  const today=new Date().getDay();
  document.getElementById('sectionTitle').textContent=dayName(selectedDay)+(selectedDay===today?' · сегодня':'');
  document.getElementById('timeline').style.display='block';
  document.getElementById('weekAll').classList.remove('show');
  document.getElementById('timeline').innerHTML=items.map(i=>slotHtml(i,all.indexOf(i))).join('')||'<p style="opacity:.5;text-align:center;padding:24px">Пусто — добавьте занятие</p>';
  bindDel();
}
function renderWeekAll(){
  const all=load();const today=new Date().getDay();
  document.getElementById('sectionTitle').textContent='Вся неделя — '+all.length+' занятий';
  document.getElementById('timeline').style.display='none';
  const box=document.getElementById('weekAll');box.classList.add('show');
  box.innerHTML=WEEK_ORDER.map(d=>{
    const items=all.filter(i=>i.day===d).sort((a,b)=>a.time.localeCompare(b.time));
    return '<div class="wday"><div class="wday-hdr"><span>'+dayName(d)+(d===today?' ★':'')+' · '+items.length+'</span><button type="button" data-day="'+d+'">+</button></div>'+(items.length?items.map(i=>slotHtml(i,all.indexOf(i))).join(''):'<p style="opacity:.45;font-size:.85rem;padding:4px 0">Свободно</p>')+'</div>';
  }).join('');
  box.querySelectorAll('.wday-hdr button').forEach(b=>b.addEventListener('click',()=>{
    selectedDay=+b.dataset.day;document.getElementById('dayPick').value=selectedDay;viewMode='day';
    document.querySelectorAll('.view-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.view==='day'));
    render();document.getElementById('name').focus();
  }));
  bindDel();
}
function render(){renderPills();nextEvent();if(viewMode==='week')renderWeekAll();else renderDay();}
document.addEventListener('DOMContentLoaded',()=>{
  initDayPick();render();
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
    selectedDay=day;document.getElementById('name').value='';render();
  });
});
</script>
</body>
</html>`;
