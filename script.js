const head =  document.getElementById('head');
console.log(header.offsetHeight);
document.getElementById('bach').style.paddingTop = `${header.offsetHeight - 20}px`

const btn = document.getElementById('soundBtn'), txt = document.getElementById('soundTxt'), aria = document.getElementById('aria');
let on = false;
if (btn) {
    btn.addEventListener('click', () => {
        on = !on; btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on);
        txt.textContent = on ? 'Klang an' : 'Klang aus';
        try { if (on) { aria.volume = 0.35; aria.play().catch(() => { }); } else { aria.pause(); } } catch (e) { }
    });
}

const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
const headRight = document.getElementsByClassName('head-right')[0]

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
        headRight.classList.toggle('menu-active');
        navMenu.classList.toggle('active');
        console.log(navMenu);
        hamburgerBtn.setAttribute('aria-expanded', hamburgerBtn.classList.contains('active'));
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    const dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}