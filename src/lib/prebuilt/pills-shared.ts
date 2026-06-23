/** Общий runtime для шаблонов pills / pills-alt — работает в iframe-превью. */
export const pillsRuntimeScript = `<script>
(function(){
  var KEY='vibe-pills';
  function today(){return new Date().toISOString().slice(0,10)}
  function load(){
    try{return JSON.parse(localStorage.getItem(KEY)||'{"date":"","meds":[],"streak":0}')}
    catch(e){return {date:'',meds:[],streak:0}}
  }
  function save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
  function ensureToday(d){
    if(d.date===today())return d;
    var meds=(d.meds||[]).map(function(m){return {name:m.name,emoji:m.emoji,when:m.when,m:false,e:false}});
    var streak=d.streak||0;
    var total=0,taken=0;
    (d.meds||[]).forEach(function(m){
      var s=slots(m);
      total+=s.length;
      if(s.indexOf('morning')>=0&&m.m)taken++;
      if(s.indexOf('evening')>=0&&m.e)taken++;
    });
    if(d.date&&total>0&&taken===total)streak++;
    else if(d.date)streak=0;
    return {date:today(),meds:meds,streak:streak};
  }
  function slots(m){
    if(m.when==='morning')return ['morning'];
    if(m.when==='evening')return ['evening'];
    return ['morning','evening'];
  }
  function totalDoses(meds){return meds.reduce(function(a,m){return a+slots(m).length},0)}
  function takenDoses(meds){return meds.reduce(function(a,m){return a+(m.m?1:0)+(m.e?1:0)},0)}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
  function node(t){while(t&&t.nodeType!==1)t=t.parentNode;return t}
  function addMed(){
    var nameEl=document.getElementById('name');
    var name=nameEl?nameEl.value.trim():'';
    if(!name){
      if(nameEl){nameEl.classList.add('shake');nameEl.focus();setTimeout(function(){nameEl.classList.remove('shake')},400)}
      return;
    }
    var d=ensureToday(load());
    d.meds.push({
      name:name,
      emoji:(document.getElementById('emoji')||{}).value||'💊',
      when:(document.getElementById('when')||{}).value||'both',
      m:false,e:false
    });
    save(d);
    nameEl.value='';
    render();
  }
  function render(){
    var d=ensureToday(load());save(d);
    var meds=d.meds||[];
    var total=totalDoses(meds),taken=takenDoses(meds);
    var pct=total?Math.round(taken/total*100):0;
    if(window.__pillsRenderUI)window.__pillsRenderUI({meds:meds,total:total,taken:taken,pct:pct,streak:d.streak||0});
    var hour=new Date().getHours(),alertEl=document.getElementById('alert');
    if(alertEl){
      var pendM=meds.filter(function(m){return slots(m).indexOf('morning')>=0&&!m.m});
      var pendE=meds.filter(function(m){return slots(m).indexOf('evening')>=0&&!m.e});
      if(!meds.length){alertEl.className='alert ok';alertEl.textContent='➕ Добавьте первый витамин'}
      else if(total>0&&taken===total){alertEl.className='alert ok';alertEl.textContent='✅ Всё принято сегодня!'}
      else if(hour>=20&&pendE.length){alertEl.className='alert warn';alertEl.textContent='⚠️ Вечер: '+pendE.map(function(m){return m.name}).join(', ')}
      else if(hour>=12&&pendM.length){alertEl.className='alert warn';alertEl.textContent='⚠️ Утро: '+pendM.map(function(m){return m.name}).join(', ')}
      else{alertEl.className='alert ok';alertEl.textContent='Осталось '+(total-taken)+' из '+total}
    }
    function row(m,i,slot){
      var ok=slot==='morning'?m.m:m.e;
      return '<div class="med'+(ok?' taken':'')+'" data-i="'+i+'" data-slot="'+slot+'" role="button" tabindex="0">'+
        '<span class="med-emoji">'+m.emoji+'</span>'+
        '<div class="med-info"><div class="name">'+esc(m.name)+'</div><div class="hint">'+(ok?'Принято ✓':'Нажмите — выпили')+'</div></div>'+
        '<div class="med-check" aria-hidden="true">'+(ok?'✓':'')+'</div>'+
        '<button type="button" class="del" data-i="'+i+'" aria-label="Удалить">×</button></div>';
    }
    var mEl=document.getElementById('morning');
    var eEl=document.getElementById('evening');
    if(mEl)mEl.innerHTML=meds.map(function(m,i){return slots(m).indexOf('morning')>=0?row(m,i,'morning'):''}).join('')||'<p class="empty">Нет утренних</p>';
    if(eEl)eEl.innerHTML=meds.map(function(m,i){return slots(m).indexOf('evening')>=0?row(m,i,'evening'):''}).join('')||'<p class="empty">Нет вечерних</p>';
    var streakEl=document.getElementById('sigStreak');
    if(streakEl)streakEl.textContent='🔥 '+(d.streak||0)+' '+((d.streak||0)===1?'день':'дней')+' подряд';
  }
  function onListClick(e){
    var t=node(e.target);if(!t)return;
    if(t.classList.contains('del')){
      e.preventDefault();e.stopPropagation();
      var d=ensureToday(load());d.meds.splice(+t.getAttribute('data-i'),1);save(d);render();return;
    }
    var med=t.closest?t.closest('.med'):null;
    if(!med||t.classList.contains('del'))return;
    var d=ensureToday(load());var m=d.meds[+med.getAttribute('data-i')];
    if(!m)return;
    if(med.getAttribute('data-slot')==='morning')m.m=!m.m;else m.e=!m.e;
    save(d);render();
  }
  function takeSlot(slot){
    var d=ensureToday(load());
    d.meds.forEach(function(m){
      if(slots(m).indexOf(slot)>=0){
        if(slot==='morning')m.m=true;else m.e=true;
      }
    });
    save(d);render();
  }
  function bind(){
    if(document.body.dataset.pillsBound)return;
    document.body.dataset.pillsBound='1';
    var form=document.getElementById('addForm');
    if(form)form.addEventListener('submit',function(e){e.preventDefault();addMed()});
    var addBtn=document.getElementById('addBtn');
    if(addBtn)addBtn.addEventListener('click',function(e){e.preventDefault();addMed()});
    var nameEl=document.getElementById('name');
    if(nameEl)nameEl.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addMed()}});
    ['morning','evening'].forEach(function(id){
      var el=document.getElementById(id);
      if(el)el.addEventListener('click',onListClick);
    });
    var doseM=document.getElementById('doseM');
    var doseE=document.getElementById('doseE');
    if(doseM)doseM.addEventListener('click',function(){takeSlot('morning')});
    if(doseE)doseE.addEventListener('click',function(){takeSlot('evening')});
  }
  function boot(){render();bind();var n=document.getElementById('name');if(n)n.focus()}
  if(typeof vibeBoot==='function')vibeBoot(boot);
  else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
</script>`;
