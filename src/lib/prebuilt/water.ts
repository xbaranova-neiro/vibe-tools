export const waterHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Трекер воды</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;background:linear-gradient(165deg,#0c4a6e 0%,#0369a1 45%,#0ea5e9 100%);min-height:100dvh;padding:20px 16px 28px;color:#fff;position:relative;overflow-x:hidden}
.bg-waves{position:fixed;bottom:0;left:0;right:0;height:90px;pointer-events:none;z-index:0;overflow:hidden}
.bg-waves .wave{position:absolute;bottom:0;left:-10%;width:120%;height:64px;background:rgba(255,255,255,.09);border-radius:50% 50% 0 0;animation:waveMove 7s ease-in-out infinite}
.bg-waves .w2{opacity:.55;height:48px;animation-delay:-3.5s;animation-duration:9s}
@keyframes waveMove{0%,100%{transform:translateX(0) scaleY(1)}50%{transform:translateX(-4%) scaleY(1.1)}}
.card{max-width:420px;margin:0 auto;position:relative;z-index:1;background:rgba(255,255,255,.11);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:28px;padding:24px 18px 22px;border:1px solid rgba(255,255,255,.2);box-shadow:0 24px 64px rgba(0,0,0,.28)}
.hero{text-align:center;margin-bottom:14px}
.hero h1{font-size:1.55rem;font-weight:800;letter-spacing:-.02em}
.hero .sub{margin-top:4px;font-size:.85rem;opacity:.78}
.streak{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.18);border-radius:99px;padding:8px 16px;font-weight:700;font-size:.88rem;margin:0 auto 16px}
.streak span{font-size:1.15rem;color:#fde68a}
.hero-water{text-align:center;margin-bottom:16px}
.big-count{display:flex;align-items:baseline;justify-content:center;gap:4px;line-height:1}
.big-count #bigCount{font-size:3.2rem;font-weight:800;font-variant-numeric:tabular-nums;text-shadow:0 4px 24px rgba(56,189,248,.45);transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.big-sep,.big-goal{font-size:1.4rem;font-weight:700;opacity:.45}
.big-lbl{font-size:.82rem;opacity:.72;margin-top:6px;letter-spacing:.04em}
.bar{height:10px;background:rgba(0,0,0,.22);border-radius:99px;overflow:hidden;margin-bottom:6px}
.bar-fill{height:100%;background:linear-gradient(90deg,#22d3ee,#a5f3fc);border-radius:99px;transition:width .55s cubic-bezier(.34,1.56,.64,1);width:0;position:relative;overflow:hidden}
.count{text-align:center;font-size:.88rem;font-weight:600;opacity:.85;margin-bottom:18px}
.glasses{display:grid;grid-template-columns:repeat(4,1fr);gap:12px 10px;max-width:340px;margin:0 auto 22px;padding:18px 14px;background:rgba(0,0,0,.14);border-radius:22px;border:1px solid rgba(255,255,255,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.glass{position:relative;display:flex;flex-direction:column;align-items:center;padding-top:14px;transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.glass-num{position:absolute;top:0;font-size:.62rem;font-weight:800;opacity:.45;letter-spacing:.02em}
.glass-body{width:100%;aspect-ratio:5/7;max-width:58px;position:relative;border:2.5px solid rgba(255,255,255,.42);border-radius:8px 8px 16px 16px;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.04));overflow:hidden;box-shadow:inset 0 -6px 16px rgba(0,0,0,.12),0 6px 16px rgba(0,0,0,.12);transition:border-color .35s,box-shadow .35s,transform .35s}
.glass-body::before{content:'';position:absolute;top:10%;left:14%;width:20%;height:45%;background:rgba(255,255,255,.18);border-radius:99px;z-index:4;pointer-events:none}
.glass-fill{position:absolute;bottom:0;left:0;right:0;height:0;background:linear-gradient(0deg,#0284c7 0%,#38bdf8 55%,#7dd3fc 100%);transition:height .55s cubic-bezier(.34,1.56,.64,1);z-index:1}
.glass-wave{position:absolute;top:-5px;left:-15%;width:130%;height:10px;background:rgba(186,230,253,.9);border-radius:50%;opacity:.9;z-index:2;display:none;animation:glassWave 2.4s ease-in-out infinite}
@keyframes glassWave{0%,100%{transform:translateX(0) scaleY(1)}50%{transform:translateX(3%) scaleY(1.15)}}
.bubble{position:absolute;width:5px;height:5px;background:rgba(255,255,255,.55);border-radius:50%;bottom:18%;z-index:3;display:none;animation:bubbleUp 2.2s ease-in infinite}
.bubble:nth-child(3){left:22%;animation-delay:0s}
.bubble:nth-child(4){left:58%;animation-delay:.7s;width:4px;height:4px}
.bubble:nth-child(5){left:40%;animation-delay:1.3s;width:3px;height:3px}
@keyframes bubbleUp{0%{transform:translateY(0) scale(1);opacity:.7}100%{transform:translateY(-28px) scale(.4);opacity:0}}
.glass.filled .glass-body{border-color:rgba(165,243,252,.88);box-shadow:0 0 18px rgba(56,189,248,.42),inset 0 -4px 12px rgba(0,0,0,.08);transform:scale(1.06)}
.glass.filled .glass-wave{display:block}
.glass.filled .bubble{display:block}
.glass.just-filled{animation:glassPop .5s cubic-bezier(.34,1.56,.64,1)}
@keyframes glassPop{0%{transform:scale(.85)}60%{transform:scale(1.12)}100%{transform:scale(1.06)}}
.btns{display:flex;gap:10px;margin-bottom:10px}
button{flex:1;padding:15px;border:none;border-radius:16px;font-size:1rem;font-weight:700;cursor:pointer;transition:transform .15s,box-shadow .2s;font-family:inherit}
button:active{transform:scale(.96)}
.btn-add{background:linear-gradient(135deg,#22d3ee,#38bdf8);color:#0c4a6e;box-shadow:0 8px 28px rgba(34,211,238,.38)}
.btn-remove{background:rgba(255,255,255,.16);color:#fff;border:1px solid rgba(255,255,255,.12)}
.btn-reset{width:100%;background:rgba(239,68,68,.78);color:#fff;margin-top:2px;padding:13px}
.celebrate{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);z-index:99;flex-direction:column;animation:fadeIn .3s}
.celebrate.show{display:flex}
.celebrate-text{font-size:2.4rem;font-weight:800;text-align:center;line-height:1.25;animation:bounce 1s infinite;text-shadow:0 0 40px rgba(56,189,248,.6)}
.confetti{position:fixed;font-size:1.8rem;animation:fall 2.2s forwards;pointer-events:none;z-index:100}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes fall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
</style>
</head>
<body>
<div class="bg-waves" aria-hidden="true"><div class="wave w1"></div><div class="wave w2"></div></div>
<div class="card">
<div class="hero">
<h1>💧 Трекер воды</h1>
<p class="sub">Пей и побеждай!</p>
</div>
<div style="text-align:center"><div class="streak">🔥 Серия: <span id="streak">0</span> дн.</div></div>
<div class="hero-water">
<div class="big-count"><span id="bigCount">0</span><span class="big-sep">/</span><span class="big-goal">8</span></div>
<div class="big-lbl">стаканов сегодня</div>
</div>
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
function initGlasses(){
  const g=document.getElementById('glasses');
  g.innerHTML='';
  for(let i=0;i<GOAL;i++){
    const el=document.createElement('div');
    el.className='glass';
    el.innerHTML='<span class="glass-num">'+(i+1)+'</span><div class="glass-body"><div class="glass-fill"><div class="glass-wave"></div></div><div class="bubble"></div><div class="bubble"></div><div class="bubble"></div></div>';
    g.appendChild(el);
  }
}
function confetti(){const em=['💧','✨','🎉','⭐','💦'];for(let i=0;i<14;i++){setTimeout(()=>{const e=document.createElement('div');e.className='confetti';e.textContent=em[i%em.length];e.style.left=Math.random()*100+'vw';e.style.top='-20px';document.body.appendChild(e);setTimeout(()=>e.remove(),2200)},i*70)}}
let celebrated=false,prevCount=0;
function render(){
  let d=ensureToday(load());save(d);
  const c=d.count||0;
  document.getElementById('count').textContent=c+' из '+GOAL+' стаканов';
  document.getElementById('bigCount').textContent=c;
  document.getElementById('barFill').style.width=(c/GOAL*100)+'%';
  document.getElementById('streak').textContent=d.streak||0;
  document.querySelectorAll('.glass').forEach((g,i)=>{
    const filled=i<c;
    const wasFilled=g.classList.contains('filled');
    g.classList.toggle('filled',filled);
    g.querySelector('.glass-fill').style.height=filled?'88%':'0';
    if(filled&&!wasFilled&&c>prevCount){g.classList.add('just-filled');setTimeout(()=>g.classList.remove('just-filled'),500)}
  });
  prevCount=c;
  const cel=document.getElementById('celebrate');
  if(c>=GOAL&&!celebrated){celebrated=true;cel.classList.add('show');confetti();setTimeout(()=>cel.classList.remove('show'),2800)}
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
