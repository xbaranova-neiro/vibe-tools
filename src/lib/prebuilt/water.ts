export const waterHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Трекер воды</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(160deg,#0c4a6e,#0284c7 50%,#38bdf8);min-height:100vh;padding:24px 16px;color:#fff}
.card{max-width:420px;margin:0 auto;background:rgba(255,255,255,.12);backdrop-filter:blur(12px);border-radius:24px;padding:28px 20px;border:1px solid rgba(255,255,255,.2);box-shadow:0 20px 60px rgba(0,0,0,.25)}
h1{text-align:center;font-size:1.6rem;margin-bottom:4px}
.sub{text-align:center;opacity:.85;font-size:.9rem;margin-bottom:20px}
.streak{text-align:center;background:rgba(255,255,255,.15);border-radius:12px;padding:8px;margin-bottom:16px;font-weight:600}
.streak span{font-size:1.2rem}
.bar{height:12px;background:rgba(0,0,0,.2);border-radius:99px;overflow:hidden;margin-bottom:8px}
.bar-fill{height:100%;background:linear-gradient(90deg,#22d3ee,#a5f3fc);border-radius:99px;transition:width .4s cubic-bezier(.34,1.56,.64,1);width:0}
.count{text-align:center;font-size:1.1rem;font-weight:700;margin-bottom:20px}
.glasses{display:flex;gap:6px;justify-content:center;margin-bottom:24px;flex-wrap:wrap}
.glass{width:36px;height:48px;border:2px solid rgba(255,255,255,.6);border-radius:4px 4px 10px 10px;position:relative;overflow:hidden;background:rgba(255,255,255,.1);transition:transform .3s,box-shadow .3s}
.glass.filled{border-color:#a5f3fc;box-shadow:0 0 12px rgba(165,243,252,.5);transform:scale(1.05)}
.glass-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(0deg,#0284c7,#38bdf8);transition:height .4s cubic-bezier(.34,1.56,.64,1);height:0}
.btns{display:flex;gap:10px;margin-bottom:12px}
button{flex:1;padding:14px;border:none;border-radius:14px;font-size:1rem;font-weight:600;cursor:pointer;transition:transform .15s,box-shadow .15s}
button:active{transform:scale(.96)}
.btn-add{background:#22d3ee;color:#0c4a6e;box-shadow:0 4px 20px rgba(34,211,238,.4)}
.btn-remove{background:rgba(255,255,255,.2);color:#fff}
.btn-reset{width:100%;background:rgba(239,68,68,.8);color:#fff;margin-top:4px}
.celebrate{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);z-index:99;flex-direction:column;animation:fadeIn .3s}
.celebrate.show{display:flex}
.celebrate-text{font-size:2.5rem;font-weight:800;text-align:center;animation:bounce 1s infinite}
.confetti{position:fixed;font-size:2rem;animation:fall 2s forwards;pointer-events:none}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes fall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
</style>
</head>
<body>
<div class="card">
<h1>💧 Трекер воды</h1>
<p class="sub">Пей и побеждай!</p>
<div class="streak">🔥 Серия: <span id="streak">0</span> дн.</div>
<div class="bar"><div class="bar-fill" id="barFill"></div></div>
<p class="count" id="count">0 из 8 стаканов</p>
<div class="glasses" id="glasses"></div>
<div class="btns">
<button class="btn-add" id="addBtn">+ Стакан</button>
<button class="btn-remove" id="remBtn">− Стакан</button>
</div>
<button class="btn-reset" id="resetBtn">🌅 Новый день</button>
</div>
<div class="celebrate" id="celebrate"><div class="celebrate-text">🎉<br>Цель дня!</div></div>
<script>
const GOAL=8,KEY='vibe-water';
function today(){return new Date().toISOString().slice(0,10)}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function ensureToday(d){const t=today();if(d.date===t)return d;let streak=d.streak||0;if(d.date&&d.count>=GOAL)streak++;else if(d.date)streak=0;return {date:t,count:0,streak}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function initGlasses(){const g=document.getElementById('glasses');g.innerHTML='';for(let i=0;i<GOAL;i++){const el=document.createElement('div');el.className='glass';el.innerHTML='<div class="glass-fill"></div>';g.appendChild(el)}}
function confetti(){const em=['💧','✨','🎉','⭐','💦'];for(let i=0;i<12;i++){setTimeout(()=>{const e=document.createElement('div');e.className='confetti';e.textContent=em[i%em.length];e.style.left=Math.random()*100+'vw';e.style.top='-20px';document.body.appendChild(e);setTimeout(()=>e.remove(),2000)},i*80)}}
let celebrated=false;
function render(){
  let d=ensureToday(load());save(d);
  const c=d.count||0;
  document.getElementById('count').textContent=c+' из '+GOAL+' стаканов';
  document.getElementById('barFill').style.width=(c/GOAL*100)+'%';
  document.getElementById('streak').textContent=d.streak||0;
  document.querySelectorAll('.glass').forEach((g,i)=>{
    const filled=i<c;g.classList.toggle('filled',filled);g.querySelector('.glass-fill').style.height=filled?'85%':'0';
  });
  const cel=document.getElementById('celebrate');
  if(c>=GOAL&&!celebrated){celebrated=true;cel.classList.add('show');confetti();setTimeout(()=>cel.classList.remove('show'),2500)}
  if(c<GOAL)celebrated=false;
}
document.addEventListener('DOMContentLoaded',()=>{
  initGlasses();render();
  document.getElementById('addBtn').addEventListener('click',()=>{let d=ensureToday(load());d.count=Math.min(GOAL,(d.count||0)+1);save(d);render()});
  document.getElementById('remBtn').addEventListener('click',()=>{let d=ensureToday(load());d.count=Math.max(0,(d.count||0)-1);save(d);render()});
  document.getElementById('resetBtn').addEventListener('click',()=>{let d=ensureToday(load());d.count=0;save(d);render()});
});
</script>
</body>
</html>`;
