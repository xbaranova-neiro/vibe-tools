export const waterAltHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Гидратация</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:linear-gradient(160deg,#0c4a6e,#0369a1);min-height:100vh;padding:24px 16px;color:#fff;display:flex;align-items:center;justify-content:center}
.card{max-width:380px;width:100%;text-align:center}
h1{font-size:1.5rem;margin-bottom:20px}
.ring-wrap{position:relative;width:200px;height:200px;margin:0 auto 24px}
.ring-wrap svg{transform:rotate(-90deg);filter:drop-shadow(0 0 20px rgba(34,211,238,.4))}
.ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring-num{font-size:3rem;font-weight:800;line-height:1}
.ring-lbl{font-size:.85rem;opacity:.8;margin-top:4px}
.streak{display:inline-block;background:rgba(255,255,255,.15);border-radius:99px;padding:8px 16px;font-weight:600;margin-bottom:20px;font-size:.9rem}
.actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
button{padding:16px;border:none;border-radius:16px;font-size:1rem;font-weight:700;cursor:pointer;transition:transform .15s}
button:active{transform:scale(.96)}
.btn-add{background:#22d3ee;color:#0c4a6e}
.btn-remove{background:rgba(255,255,255,.18);color:#fff}
.btn-reset{grid-column:span 2;background:rgba(239,68,68,.75);color:#fff;padding:12px}
.celebrate{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);z-index:99;flex-direction:column}
.celebrate.show{display:flex}
.celebrate-text{font-size:2.2rem;font-weight:800;animation:bounce 1s infinite}
@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
.confetti{position:fixed;font-size:1.8rem;animation:fall 2s forwards;pointer-events:none}
@keyframes fall{0%{transform:translateY(-20px);opacity:1}100%{transform:translateY(100vh) rotate(540deg);opacity:0}}
</style>
</head>
<body>
<div class="card">
<h1>💦 Гидратация</h1>
<div class="streak">🔥 <span id="streak">0</span> дней подряд</div>
<div class="ring-wrap">
<svg width="200" height="200"><circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="14"/><circle id="ring" cx="100" cy="100" r="88" fill="none" stroke="#22d3ee" stroke-width="14" stroke-linecap="round" stroke-dasharray="553" stroke-dashoffset="553" style="transition:stroke-dashoffset .6s cubic-bezier(.34,1.56,.64,1)"/></svg>
<div class="ring-center"><div class="ring-num" id="count">0</div><div class="ring-lbl">из 8 стаканов</div></div>
</div>
<div class="actions">
<button class="btn-add" id="addBtn">+ 💧</button>
<button class="btn-remove" id="remBtn">−</button>
<button class="btn-reset" id="resetBtn">🌅 Новый день</button>
</div>
</div>
<div class="celebrate" id="celebrate"><div class="celebrate-text">🎉 Цель!</div></div>
<script>
const GOAL=8,KEY='vibe-water';
function today(){return new Date().toISOString().slice(0,10)}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function ensureToday(d){const t=today();if(d.date===t)return d;let streak=d.streak||0;if(d.date&&d.count>=GOAL)streak++;else if(d.date)streak=0;return {date:t,count:0,streak}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function confetti(){['💧','✨','🎉'].forEach((e,i)=>{setTimeout(()=>{const el=document.createElement('div');el.className='confetti';el.textContent=e;el.style.left=Math.random()*100+'vw';document.body.appendChild(el);setTimeout(()=>el.remove(),2000)},i*90)})}
let celebrated=false;
function render(){
  let d=ensureToday(load());save(d);
  const c=d.count||0;
  document.getElementById('count').textContent=c;
  document.getElementById('streak').textContent=d.streak||0;
  const circ=2*Math.PI*88;
  document.getElementById('ring').style.strokeDashoffset=circ-(c/GOAL)*circ;
  const cel=document.getElementById('celebrate');
  if(c>=GOAL&&!celebrated){celebrated=true;cel.classList.add('show');confetti();setTimeout(()=>cel.classList.remove('show'),2500)}
  if(c<GOAL)celebrated=false;
}
document.addEventListener('DOMContentLoaded',()=>{
  render();
  document.getElementById('addBtn').addEventListener('click',()=>{let d=ensureToday(load());d.count=Math.min(GOAL,(d.count||0)+1);save(d);render()});
  document.getElementById('remBtn').addEventListener('click',()=>{let d=ensureToday(load());d.count=Math.max(0,(d.count||0)-1);save(d);render()});
  document.getElementById('resetBtn').addEventListener('click',()=>{let d=ensureToday(load());d.count=0;save(d);render()});
});
</script>
</body>
</html>`;
