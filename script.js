// Ton-Schalter (standardmäßig aus)
const btn = document.getElementById('soundBtn'), txt = document.getElementById('soundTxt'), aria = document.getElementById('aria');
let on = false;
btn.addEventListener('click', () => {
    on = !on; btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on);
    txt.textContent = on ? 'Klang an' : 'Klang aus';
    try { if (on) { aria.volume = 0.35; aria.play().catch(() => { }); } else { aria.pause(); } } catch (e) { }
});