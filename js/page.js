(function(){
  const root=document.getElementById('page'); const slug=new URLSearchParams(location.search).get('p')||'akparat';
  const lang=()=>localStorage.getItem('qarlygash-lang')==='ru'?'ru':'kk';
  const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const tr=v=>v&&typeof v==='object'?(v[lang()]||v.kk||''):(v||'');
  const MON={'қаңтар':'января','ақпан':'февраля','наурыз':'марта','сәуір':'апреля','мамыр':'мая','маусым':'июня','шілде':'июля','тамыз':'августа','қыркүйек':'сентября','қазан':'октября','қараша':'ноября','желтоқсан':'декабря'};
  const dt=d=>lang()==='ru'?String(d).replace(/[а-яәғқңөұүһі]+/gi,m=>MON[m.toLowerCase()]||m):d;
  const PH={kk:'Жақын арада жарияланады',ru:'Скоро будет опубликовано'};
  const LBL={kk:{files:'Құжаттар',more:'Толығырақ',less:'Жасыру',src:'Мәтін бастапқы тілде (қазақша) берілген.'},ru:{files:'Документы',more:'Подробнее',less:'Свернуть',src:'Текст опубликован на языке оригинала (казахский).'}};
  let data=null;
  function para(t){return esc(t).split(/\n+/).map(x=>'<p>'+x+'</p>').join('')}
  function item(it,i){
    const L=lang(),txt=tr(it.text),long=txt.length>700;
    const imgs=(it.images||[]).map(s=>`<button type="button" class="gallery-item" data-full="${esc(s)}"><img src="${esc(s)}" loading="lazy" alt=""></button>`).join('');
    const files=(it.files||[]).map(f=>`<li><a href="${esc(f.url)}" target="_blank" rel="noopener">📄 ${esc(tr(f.name)||f.url.split('/').pop())}</a></li>`).join('');
    return `<article class="post">${it.date?`<p class="post-date">${esc(dt(it.date))}</p>`:''}<h3>${esc(tr(it.title))}</h3>
    ${txt?`<div class="post-text${long?' clamp':''}">${para(txt)}</div>${long?`<button class="btn btn-ghost more" type="button">${LBL[L].more}</button>`:''}`:''}
    ${files?`<ul class="file-list">${files}</ul>`:''}${imgs?`<div class="gallery gallery-dense">${imgs}</div>`:''}</article>`;
  }
  function render(){
    if(!data) return; const L=lang();
    document.title=tr(data.title)+(L==='ru'?' — детский сад «Карлыгаш»':' — «Қарлығаш» балалар бақшасы');
    let h=`<h1>${esc(tr(data.title))}</h1>`;
    if(data.intro) h+=`<div class="intro">${para(tr(data.intro))}</div>`;
    if(data.html) h+=`<div class="rich">${tr(data.html)}</div>`;
    const items=data.items||[];
    if(items.length){ if(L==='ru'&&!data.ruReady) h+=`<p class="note">${LBL.ru.src}</p>`; h+=items.map(item).join(''); }
    else if(!data.html) h+=`<div class="placeholder-box"><span aria-hidden="true">🕊️</span><p>${PH[L]}</p></div>`;
    root.innerHTML=h;
    root.querySelectorAll('.more').forEach(b=>b.addEventListener('click',()=>{const t=b.previousElementSibling;t.classList.toggle('clamp');b.textContent=t.classList.contains('clamp')?LBL[lang()].more:LBL[lang()].less}));
  }
  document.addEventListener('qlang',render);
  fetch('data/pages/'+encodeURIComponent(slug)+'.json?v=10').then(r=>{if(!r.ok) throw 0; return r.json()}).then(d=>{data=d;render()}).catch(()=>{data={title:{kk:'Бет табылмады',ru:'Страница не найдена'}};render()});
})();
