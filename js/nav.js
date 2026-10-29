(function(){
  const nav=document.getElementById('nav'); if(!nav) return;
  const lang=()=>localStorage.getItem('qarlygash-lang')==='ru'?'ru':'kk';
  const cur=new URLSearchParams(location.search).get('p');
  const href=i=>i.href||('page.html?p='+i.slug);
  let menu=null;
  const root=document.documentElement, hdr=nav.parentElement;
  function fit(){
    if(window.innerWidth<1280){root.classList.add('nav-burger');return}
    root.classList.remove('nav-burger');
    const kids=[...nav.children].filter(e=>e.offsetParent);
    const top=kids.length?kids[0].offsetTop:0;
    const wrapped=kids.some(e=>Math.abs(e.offsetTop-top)>4);
    const over=nav.scrollWidth>nav.clientWidth+1||hdr.scrollWidth>hdr.clientWidth+1;
    if(wrapped||over) root.classList.add('nav-burger');
  }
  window.QNAVFIT=fit;
  let rt; window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(fit,80)});
  window.addEventListener('load',fit);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
  function render(){
    if(!menu) return; const L=lang();
    nav.innerHTML=menu.items.map((it,n)=>{
      if(!it.children) return `<a href="${href(it)}"${n===0&&it.href==='./'?' class="nav-home"':''}${it.slug===cur?' aria-current="page"':''}>${it[L]}</a>`;
      const active=it.children.some(c=>c.slug===cur);
      return `<div class="dd${active?' is-active':''}"><button type="button" class="dd-btn" aria-expanded="false">${it[L]}<span class="caret" aria-hidden="true">▾</span></button><div class="dd-menu">${it.children.map(c=>`<a href="${href(c)}"${c.slug===cur?' aria-current="page"':''}>${c[L]}</a>`).join('')}</div></div>`;
    }).join('');
    fit();
    nav.querySelectorAll('.dd-btn').forEach(b=>b.addEventListener('click',e=>{
      e.stopPropagation(); const d=b.parentElement; const o=!d.classList.contains('open');
      nav.querySelectorAll('.dd.open').forEach(x=>{x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')});
      if(o){d.classList.add('open');b.setAttribute('aria-expanded','true')}
    }));
  }
  document.addEventListener('click',e=>{if(!nav.contains(e.target)) nav.querySelectorAll('.dd.open').forEach(x=>x.classList.remove('open'))});
  document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>{render();document.dispatchEvent(new Event('qlang'))},0)));
  fetch('data/menu.json?v=6').then(r=>r.json()).then(m=>{menu=m;window.QMENU=m;render();document.dispatchEvent(new Event('qmenu'))});
})();
