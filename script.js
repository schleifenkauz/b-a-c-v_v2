// Schlüssel exakt "zeichnen": Pfadlänge messen, dann Strich freigeben
  const clef = document.getElementById('clef');
  const hero = document.querySelector('.hero');
  if (clef){
    const L = clef.getTotalLength();
    clef.style.strokeDasharray = L;
    clef.style.strokeDashoffset = L;
    clef.style.transition = 'stroke-dashoffset 2.1s cubic-bezier(.4,.5,.3,1)';
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = ()=>{ hero.classList.add('anim'); if(clef && !reduce) requestAnimationFrame(()=>{clef.style.strokeDashoffset=0;}); else if(clef){clef.style.strokeDashoffset=0;} };
  const io = new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting){start();io.disconnect();}});},{threshold:.25});
  io.observe(hero);

  // Ton-Schalter (standardmäßig aus)
  const btn=document.getElementById('soundBtn'), txt=document.getElementById('soundTxt'), aria=document.getElementById('aria');
  let on=false;
  btn.addEventListener('click',()=>{
    on=!on; btn.classList.toggle('on',on); btn.setAttribute('aria-pressed',on);
    txt.textContent = on ? 'Klang an' : 'Klang aus';
    try{ if(on){ aria.volume=0.35; aria.play().catch(()=>{}); } else { aria.pause(); } }catch(e){}
  });