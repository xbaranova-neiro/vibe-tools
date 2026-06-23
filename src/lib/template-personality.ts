export type DomainFlavor = {
  id: string;
  label: string;
  css: string;
  decor: string;
  bodyClass: string;
};

const FLAVORS: Record<string, DomainFlavor[]> = {
  budget: [
    {
      id: "wallet",
      label: "кошелёк",
      bodyClass: "persona-wallet",
      decor: `<div class="sig-wallet" aria-hidden="true"><div class="sig-chip"></div><div class="sig-wallet-brand">VIBE PAY</div></div>`,
      css: `
.persona-wallet .card{padding-top:8px}
.sig-wallet{margin:0 auto 18px;max-width:320px;height:72px;border-radius:16px;background:linear-gradient(125deg,rgba(255,255,255,.22),rgba(255,255,255,.06));border:1px solid rgba(255,255,255,.25);position:relative;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.25)}
.sig-wallet::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:walletShine 4s infinite}
.sig-chip{position:absolute;left:18px;top:22px;width:36px;height:28px;border-radius:6px;background:linear-gradient(135deg,#fcd34d,#f59e0b);opacity:.9}
.sig-wallet-brand{position:absolute;right:18px;bottom:14px;font-size:.7rem;font-weight:800;letter-spacing:.15em;opacity:.75}
@keyframes walletShine{0%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
.persona-wallet .gauge-wrap{margin-bottom:16px;text-align:center}
.persona-wallet .gauge-arc{filter:drop-shadow(0 0 12px var(--vibe-glow))}
.persona-wallet .gauge-label{font-size:.75rem;opacity:.7;margin-top:4px}
.persona-wallet .item.inc{animation:coinIn .45s ease-out}
@keyframes coinIn{0%{transform:translateY(-8px) scale(.9);opacity:0}100%{transform:none;opacity:1}}
`,
    },
    {
      id: "ledger",
      label: "бухгалтерия",
      bodyClass: "persona-ledger",
      decor: `<div class="sig-ledger-head" aria-hidden="true"><span>📒 Журнал операций</span><span id="sigMonth"></span></div>`,
      css: `
.persona-ledger .card{border:2px dashed rgba(255,255,255,.2)!important;background:rgba(0,0,0,.15)!important}
.sig-ledger-head{display:flex;justify-content:space-between;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;opacity:.65;margin-bottom:14px;padding-bottom:8px;border-bottom:1px dotted rgba(255,255,255,.25)}
.persona-ledger h1{font-family:Georgia,serif!important;font-weight:700!important}
.persona-ledger .balance .num,.persona-ledger .daily .num,.persona-ledger .stat .n{font-family:ui-monospace,monospace!important;letter-spacing:-.02em}
.persona-ledger .item{font-family:ui-monospace,monospace!important;font-size:.82rem!important;border-bottom:1px dotted rgba(255,255,255,.15)!important;border-radius:0!important;background:transparent!important}
.persona-ledger .item small{font-weight:700}
`,
    },
    {
      id: "piggy",
      label: "копилка",
      bodyClass: "persona-piggy",
      decor: `<div class="sig-piggy" id="sigPiggy" aria-hidden="true">🐷</div>`,
      css: `
.sig-piggy{font-size:3.5rem;text-align:center;margin-bottom:8px;transition:transform .4s cubic-bezier(.34,1.56,.64,1);filter:drop-shadow(0 8px 16px rgba(0,0,0,.2))}
.sig-piggy.happy{animation:piggyHop .6s ease-out}
@keyframes piggyHop{0%,100%{transform:scale(1) rotate(0)}30%{transform:scale(1.15) rotate(-8deg)}60%{transform:scale(1.1) rotate(8deg)}}
.persona-piggy .hero{border-radius:24px!important;overflow:hidden}
.persona-piggy .daily{position:relative}
.persona-piggy .daily::before{content:'✨';position:absolute;top:8px;right:12px;font-size:1rem;opacity:.8}
.persona-piggy .msg{border-radius:99px!important}
`,
    },
  ],
  habits: [
    {
      id: "ocean",
      label: "океан",
      bodyClass: "persona-ocean",
      decor: `<div class="sig-waves" aria-hidden="true"><div class="wave w1"></div><div class="wave w2"></div></div>`,
      css: `
.sig-waves{position:fixed;bottom:0;left:0;right:0;height:80px;pointer-events:none;z-index:0;overflow:hidden}
.sig-waves .wave{position:absolute;bottom:0;left:-10%;width:120%;height:60px;background:rgba(255,255,255,.08);border-radius:50% 50% 0 0;animation:waveMove 6s ease-in-out infinite}
.sig-waves .w2{opacity:.5;height:45px;animation-delay:-3s;animation-duration:8s}
@keyframes waveMove{0%,100%{transform:translateX(0) scaleY(1)}50%{transform:translateX(-3%) scaleY(1.08)}}
.persona-ocean .glass.filled .glass-fill{animation:waterSlosh .5s ease-out}
@keyframes waterSlosh{0%{transform:scaleY(.7)}50%{transform:scaleY(1.05)}100%{transform:scaleY(1)}}
.persona-ocean .btn-add:active{animation:splash .3s}
@keyframes splash{0%{box-shadow:0 0 0 0 rgba(255,255,255,.5)}100%{box-shadow:0 0 0 20px transparent}}
`,
    },
    {
      id: "bottle",
      label: "бутылка",
      bodyClass: "persona-bottle",
      decor: "",
      css: `
.persona-bottle .count{font-size:1.3rem!important}
.persona-bottle .streak{border-radius:99px!important;border:1px solid rgba(255,255,255,.2)}
.persona-bottle .glasses .glass{border-radius:2px 2px 12px 12px!important;border-width:3px!important}
.persona-bottle .card{border-radius:28px 28px 8px 8px!important}
`,
    },
    {
      id: "rain",
      label: "дождь",
      bodyClass: "persona-rain",
      decor: `<div class="sig-rain" aria-hidden="true"></div>`,
      css: `
.sig-rain{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px);background-size:2px 16px;animation:rainFall 1.2s linear infinite;opacity:.4}
@keyframes rainFall{0%{background-position:0 0}100%{background-position:0 16px}}
.persona-rain .bar-fill{box-shadow:0 0 16px var(--vibe-glow)!important}
.persona-rain .celebrate-text{text-shadow:0 0 30px rgba(255,255,255,.6)}
`,
    },
  ],
  tasks: [
    {
      id: "sticky",
      label: "стикеры",
      bodyClass: "persona-sticky",
      decor: `<div class="sig-board-pin" aria-hidden="true">📌</div>`,
      css: `
.persona-sticky{background-image:radial-gradient(rgba(0,0,0,.08) 1px,transparent 1px)!important;background-size:8px 8px!important}
.sig-board-pin{position:absolute;top:12px;right:16px;font-size:1.4rem;transform:rotate(12deg);opacity:.7}
.persona-sticky .card{position:relative;background:rgba(255,255,255,.08)!important;border:2px solid rgba(255,255,255,.12)!important}
.persona-sticky .task{background:linear-gradient(145deg,#fef08a,#fde047)!important;color:#422006!important;border-radius:4px!important;box-shadow:2px 3px 8px rgba(0,0,0,.2)!important;transform:rotate(var(--rot,-1deg))!important}
.persona-sticky .task:nth-child(even){--rot:1.5deg;background:linear-gradient(145deg,#bfdbfe,#93c5fd)!important;color:#1e3a5f!important}
.persona-sticky .task:nth-child(3n){--rot:-2deg;background:linear-gradient(145deg,#fbcfe8,#f9a8d4)!important;color:#831843!important}
.persona-sticky .task.done{opacity:.55!important;transform:rotate(0)!important}
.persona-sticky .task-check{border-color:#422006!important}
.persona-sticky .task.done .task-check{background:#422006!important;color:#fef08a!important}
.persona-sticky .task .del{color:#422006!important}
.persona-sticky h1{font-family:Comic Sans MS,cursive,sans-serif!important}
`,
    },
    {
      id: "focus",
      label: "фокус",
      bodyClass: "persona-focus",
      decor: `<div class="sig-focus-ring" aria-hidden="true"></div>`,
      css: `
.sig-focus-ring{position:fixed;inset:20%;border:2px solid rgba(255,255,255,.06);border-radius:50%;pointer-events:none;animation:focusPulse 3s ease-in-out infinite}
@keyframes focusPulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.6;transform:scale(1.02)}}
.persona-focus .ring-wrap,.persona-focus .progress-head .pct{text-shadow:0 0 20px var(--vibe-glow)}
.persona-focus .task{border-left:4px solid var(--vibe-accent)!important}
`,
    },
    {
      id: "game",
      label: "игра",
      bodyClass: "persona-game",
      decor: `<div class="sig-xp" id="sigXp">⭐ XP: <span id="xpVal">0</span></div>`,
      css: `
.sig-xp{text-align:center;font-weight:800;font-size:.9rem;margin-bottom:12px;padding:8px;background:rgba(255,255,255,.1);border-radius:12px}
.persona-game .task-check{border-radius:8px!important;background:rgba(255,255,255,.1)!important}
.persona-game .task.done .task-check{background:gold!important;color:#422006!important;border-color:gold!important;animation:xpPop .4s}
@keyframes xpPop{0%{transform:scale(.5)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
.persona-game .win h2{font-family:Comic Sans MS,cursive,sans-serif!important}
`,
    },
  ],
  kids: [
    {
      id: "playground",
      label: "площадка",
      bodyClass: "persona-playground",
      decor: `<div class="sig-stars" aria-hidden="true">⭐✨🌈✨⭐</div><div class="sig-mascot" id="sigMascot">Привет! 👋</div>`,
      css: `
.sig-stars{text-align:center;font-size:1.2rem;letter-spacing:.3em;margin-bottom:10px;animation:starTwinkle 2s ease-in-out infinite}
@keyframes starTwinkle{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
.sig-mascot{text-align:center;background:rgba(255,255,255,.15);border-radius:20px;padding:10px 16px;margin-bottom:14px;font-weight:700;font-size:.95rem;border:2px dashed rgba(255,255,255,.3)}
.persona-playground h1{font-family:Comic Sans MS,cursive,sans-serif!important;font-size:1.6rem!important}
.persona-playground .ev{border-radius:20px!important;transform:rotate(var(--ev-rot,0deg));transition:transform .2s}
.persona-playground .ev:nth-child(odd){--ev-rot:-1deg}
.persona-playground .ev:nth-child(even){--ev-rot:1deg}
.persona-playground .ev:hover{transform:rotate(0) scale(1.02)!important}
.persona-playground .btn,.persona-playground .next{border-radius:99px!important}
.persona-playground .day{border-radius:50%!important;aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center}
`,
    },
    {
      id: "schedule",
      label: "расписание",
      bodyClass: "persona-schedule",
      decor: `<div class="sig-rainbow-bar" aria-hidden="true"></div>`,
      css: `
.sig-rainbow-bar{height:6px;border-radius:99px;margin-bottom:16px;background:linear-gradient(90deg,#f87171,#fbbf24,#4ade80,#60a5fa,#a78bfa,#f472b6)}
.persona-schedule .next{animation:none!important;border:3px solid rgba(255,255,255,.3)!important}
.persona-schedule .slot-card{border-radius:24px!important}
.persona-schedule .pill{border-radius:99px!important}
`,
    },
    {
      id: "adventure",
      label: "приключение",
      bodyClass: "persona-adventure",
      decor: `<div class="sig-map" aria-hidden="true">🗺️ Сегодняшний маршрут</div>`,
      css: `
.sig-map{text-align:center;font-size:.85rem;font-weight:700;opacity:.8;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em}
.persona-adventure .timeline{position:relative;padding-left:8px}
.persona-adventure .timeline::before{content:'';position:absolute;left:28px;top:0;bottom:0;width:3px;background:linear-gradient(var(--vibe-accent),var(--vibe-accent-light));border-radius:99px;opacity:.5}
.persona-adventure .slot-time{color:var(--vibe-accent-light)!important;font-size:1rem!important}
`,
    },
  ],
  shopping: [
    {
      id: "cart",
      label: "тележка",
      bodyClass: "persona-cart",
      decor: `<div class="sig-cart" id="sigCart" aria-hidden="true">🛒 <span id="cartCount">0</span></div>`,
      css: `
.sig-cart{position:fixed;bottom:24px;right:20px;width:64px;height:64px;border-radius:50%;background:var(--vibe-accent);color:var(--vibe-accent-text);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;box-shadow:0 8px 32px var(--vibe-glow);z-index:50;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.sig-cart.bump{animation:cartBump .5s}
@keyframes cartBump{0%,100%{transform:scale(1)}40%{transform:scale(1.2) rotate(-5deg)}70%{transform:scale(1.1) rotate(3deg)}}
.persona-cart .item-emoji{font-size:2.2rem!important;transition:transform .2s}
.persona-cart .item:active .item-emoji{transform:scale(1.2)}
`,
    },
    {
      id: "receipt",
      label: "чек",
      bodyClass: "persona-receipt",
      decor: `<div class="sig-receipt-top" aria-hidden="true"></div>`,
      css: `
.sig-receipt-top{height:12px;margin:-8px -8px 16px;background:repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(255,255,255,.15) 8px,rgba(255,255,255,.15) 16px);mask:linear-gradient(#000,#000);-webkit-mask:linear-gradient(#000,#000)}
.persona-receipt .card{background:#fafafa!important;color:#1f2937!important;border-radius:4px 4px 12px 12px!important;box-shadow:0 20px 60px rgba(0,0,0,.3)!important}
.persona-receipt h1,.persona-receipt .sub{color:#1f2937!important}
.persona-receipt .item,.persona-receipt .row{background:#fff!important;color:#374151!important;border:1px dashed #d1d5db!important}
.persona-receipt .progress-box{background:#f3f4f6!important;color:#374151!important}
.persona-receipt .btn-add,.persona-receipt .btn{background:var(--vibe-accent)!important}
`,
    },
    {
      id: "market",
      label: "рынок",
      bodyClass: "persona-market",
      decor: `<div class="sig-aisle" id="sigAisle">🏬 Проход: <span id="aisleName">Овощи</span></div>`,
      css: `
.sig-aisle{text-align:center;font-size:.85rem;font-weight:600;padding:10px;margin-bottom:14px;background:rgba(255,255,255,.12);border-radius:12px;border-left:4px solid var(--vibe-accent)}
.persona-market .cat-title{font-size:1rem!important;text-transform:uppercase;letter-spacing:.04em}
.persona-market .tag{font-size:.85rem!important;padding:8px 14px!important}
.persona-market .hero-num .big{font-size:4rem!important}
`,
    },
  ],
  pills: [
    {
      id: "pharmacy",
      label: "аптека",
      bodyClass: "persona-pharmacy",
      decor: `<div class="sig-cross" aria-hidden="true">➕</div>`,
      css: `
.sig-cross{position:absolute;top:12px;right:16px;font-size:1.2rem;opacity:.4;font-weight:300}
.persona-pharmacy .med{border-left:3px solid var(--vibe-accent)!important}
.persona-pharmacy .alert.warn{border-radius:12px!important}
`,
    },
    {
      id: "wellness",
      label: "wellness",
      bodyClass: "persona-wellness",
      decor: "",
      css: `
.persona-wellness h1{font-family:Georgia,serif!important}
.persona-wellness .section-hdr{letter-spacing:.1em!important}
.persona-wellness .med{border-radius:99px!important}
`,
    },
    {
      id: "streak",
      label: "серия",
      bodyClass: "persona-streak",
      decor: `<div class="sig-streak" id="sigStreak">🔥 0 дней</div>`,
      css: `
.sig-streak{text-align:center;font-weight:800;font-size:.9rem;padding:8px;margin-bottom:12px;background:rgba(251,191,36,.15);border-radius:99px}
.persona-streak .celebrate.show{animation:pop .5s}
`,
    },
  ],
  watchlist: [
    {
      id: "cinema",
      label: "кинотеатр",
      bodyClass: "persona-cinema",
      decor: `<div class="sig-curtain" aria-hidden="true"></div>`,
      css: `
.sig-curtain{height:8px;margin:-4px 0 14px;background:repeating-linear-gradient(90deg,#ef4444,#ef4444 12px,#991b1b 12px,#991b1b 24px);border-radius:99px;opacity:.8}
.persona-cinema .poster{box-shadow:0 8px 24px rgba(0,0,0,.4)!important;border:2px solid rgba(255,255,255,.1)}
.persona-cinema .tabs button.active{transform:scale(1.05)}
`,
    },
    {
      id: "neon",
      label: "неон",
      bodyClass: "persona-neon-cinema",
      decor: "",
      css: `
.persona-neon-cinema .show{background:rgba(0,0,0,.3)!important;border:1px solid rgba(255,255,255,.08)!important}
.persona-neon-cinema .poster{box-shadow:0 0 20px var(--vibe-glow)!important}
.persona-neon-cinema h1{text-shadow:0 0 30px var(--vibe-glow)!important}
`,
    },
    {
      id: "popcorn",
      label: "попкorn",
      bodyClass: "persona-popcorn",
      decor: `<div class="sig-popcorn" aria-hidden="true">🍿</div>`,
      css: `
.sig-popcorn{font-size:2.5rem;text-align:center;margin-bottom:8px;animation:floaty 3s ease-in-out infinite}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.persona-popcorn .win-box{border:2px solid rgba(251,191,36,.4)!important}
`,
    },
  ],
};

const GAUGE_HTML = `<div class="gauge-wrap"><svg class="gauge-arc" width="180" height="100" viewBox="0 0 180 100"><path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="12" stroke-linecap="round"/><path id="gaugeArc" d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="var(--vibe-accent,#6366f1)" stroke-width="12" stroke-linecap="round" stroke-dasharray="220" stroke-dashoffset="220" style="transition:stroke-dashoffset .6s ease-out"/></svg><div class="gauge-label">Лимит на сегодня: <b id="gaugePct">0%</b></div></div>`;

const FLAVOR_SCRIPT = `
<script data-vibe-personality>
(function(){
  function bump(sel,cls){var el=document.querySelector(sel);if(el){el.classList.add(cls);setTimeout(function(){el.classList.remove(cls)},600)}}
  function setText(id,t){var el=document.getElementById(id);if(el)el.textContent=t}
  document.addEventListener('DOMContentLoaded',function(){
    var m=document.getElementById('sigMonth');
    if(m){var d=new Date();m.textContent=d.toLocaleDateString('ru',{month:'long',year:'numeric'})}
    var add=document.getElementById('addBtn');
    if(add&&document.body.classList.contains('persona-piggy')){
      add.addEventListener('click',function(){var p=document.getElementById('sigPiggy');if(p)p.classList.add('happy');setTimeout(function(){if(p)p.classList.remove('happy')},700)});
    }
    if(document.body.classList.contains('persona-game')){
      function updXp(){try{var t=JSON.parse(localStorage.getItem('vibe-tasks')||'[]');setText('xpVal',t.filter(function(x){return x.done}).length*10+'');}catch(e){}}
      updXp();
      document.addEventListener('click',function(e){if(e.target.closest('.task,.task-check,#addBtn,.del,.chips button'))setTimeout(updXp,80)});
    }
    if(document.body.classList.contains('persona-cart')){
      function updCart(){
        var items=JSON.parse(localStorage.getItem('vibe-shop')||'[]');
        var left=items.filter(function(i){return!i.bought}).length;
        setText('cartCount',left);
      }
      updCart();
      var obs=new MutationObserver(updCart);
      var list=document.getElementById('cats')||document.getElementById('items');
      if(list)obs.observe(list,{childList:true,subtree:true});
      document.addEventListener('click',function(e){
        if(e.target.closest('.item,.row,.btn-add,#addBtn')){bump('#sigCart','bump');updCart()}
      });
    }
    if(document.body.classList.contains('persona-market')){
      document.querySelectorAll('.tag').forEach(function(t){
        t.addEventListener('click',function(){setText('aisleName',t.dataset.c||t.textContent.trim())});
      });
    }
    if(document.body.classList.contains('persona-playground')){
      var phrases=['Ура! 🎉','Супер! ⭐','Молодец! 💪','Круто! 🚀'];
      var m=document.getElementById('sigMascot');
      if(m&&document.getElementById('addBtn'))document.getElementById('addBtn').addEventListener('click',function(){
        m.textContent=phrases[Math.floor(Math.random()*phrases.length)];
      });
    }
    if(document.body.classList.contains('persona-wallet')){
      function updGauge(){
        var daily=document.getElementById('daily');var arc=document.getElementById('gaugeArc');var pct=document.getElementById('gaugePct');
        if(!daily||!arc)return;
        var txt=daily.textContent.replace(/[^\\d]/g,'')||'0';
        var n=+txt;var max=Math.max(n,5000);
        var p=Math.min(100,Math.round(n/max*100));
        arc.style.strokeDashoffset=220-(p/100*220);
        if(pct)pct.textContent=p+'%';
      }
      updGauge();setInterval(updGauge,800);
      if(add)add.addEventListener('click',function(){setTimeout(updGauge,100)});
    }
  });
})();
</script>`;

export function pickDomainFlavor(templateId: string | null): DomainFlavor | null {
  if (!templateId) return null;
  const pool = FLAVORS[templateId];
  if (!pool?.length) return null;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function applyDomainPersonality(
  html: string,
  templateId: string | null,
  flavor: DomainFlavor | null,
): string {
  if (!templateId || !flavor) return html;

  let result = html.replace(
    /<style data-vibe-personality>[\s\S]*?<\/style>/,
    "",
  );
  result = result.replace(
    /<script data-vibe-personality>[\s\S]*?<\/script>/,
    "",
  );
  result = result.replace(/\sdata-vibe-flavor="[^"]*"/g, "");

  result = result.replace(/<body([^>]*)>/i, (_match, attrs: string) => {
    let a = attrs ?? "";
    a = a.replace(/\spersona-[\w-]+/g, "");
    a = a.replace(/\sdata-vibe-flavor="[^"]*"/g, "");
    const classMatch = a.match(/class="([^"]*)"/);
    if (classMatch) {
      const merged = `${classMatch[1].trim()} ${flavor.bodyClass}`.trim();
      a = a.replace(/class="[^"]*"/, `class="${merged}"`);
    } else {
      a = `${a} class="${flavor.bodyClass}"`.trim();
    }
    return `<body ${a} data-vibe-flavor="${flavor.id}">`;
  });

  if (templateId === "budget" && flavor.id === "wallet") {
    if (result.includes('<div class="chart-wrap">')) {
      result = result.replace(
        '<div class="chart-wrap">',
        `${GAUGE_HTML}<div class="chart-wrap">`,
      );
    } else if (result.includes('<div class="bars">')) {
      result = result.replace(
        '<div class="bars">',
        `${GAUGE_HTML}<div class="bars">`,
      );
    }
  }

  const styleBlock = `<style data-vibe-personality>${flavor.css}</style>`;

  if (flavor.decor) {
    result = result.replace(
      /<div class="card">/,
      `${flavor.decor}<div class="card">`,
    );
  }

  if (result.includes("</head>")) {
    result = result.replace("</head>", `${styleBlock}</head>`);
  } else {
    result = styleBlock + result;
  }

  result = result.replace("</body>", `${FLAVOR_SCRIPT}</body>`);
  return result;
}

export function flavorToPrompt(
  templateId: string | null,
  flavor: DomainFlavor | null,
): string {
  if (!templateId || !flavor) return "";
  const hints: Record<string, string> = {
    budget: "Финансовая изюминка: ощущение реального денежного приложения — цифры, кошелёк, учёт, gauge «можно потратить»",
    habits: "Изюминка воды: жидкость, волны, стаканы/бутылка, ощущение свежести и гидратации",
    tasks: "Изюминка продуктивности: стикеры, XP, фокус — не generic todo, а характерный инструмент",
    kids: "Изюминка детского расписания: игриво, ярко, стикеры, mascot, радуга — как app для родителей",
    shopping: "Изюминка покупок: тележка, чек, проходы магазина — ощущение похода в супермаркет",
    pills: "Изюминка здоровья: таблетки, утро/вечер, заботливые напоминания — не generic checklist",
    watchlist: "Изюминка кино: постеры, статусы просмотра, popcorn — как streaming app",
  };
  return `${hints[templateId] ?? ""}\nСтиль сборки: «${flavor.label}» — UI должен чувствоваться именно так, не как универсальная карточка.`;
}
