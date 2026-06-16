'use strict';

// ── SCROLL PROGRESS ──────────────────
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  if (scrollBar) scrollBar.style.width = pct + '%';
});

// ── CURSOR GLOW ──────────────────────
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let glowX = mouseX, glowY = mouseY;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
(function animGlow() {
  glowX += (mouseX - glowX) * 0.08; glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) { cursorGlow.style.left = glowX + 'px'; cursorGlow.style.top = glowY + 'px'; }
  requestAnimationFrame(animGlow);
})();

// ── STARFIELD ────────────────────────
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); createStars(240); });

function createStars(n) {
  stars = [];
  for (let i = 0; i < n; i++) {
    const size = Math.random() * 2.4;
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size, speed: Math.random() * 0.3 + 0.03,
      opacity: Math.random() * 0.8 + 0.1,
      twinkle: Math.random() * 0.025 + 0.004,
      offset: Math.random() * Math.PI * 2,
      color: Math.random() < 0.12 ? '#D4AF37' : Math.random() < 0.2 ? '#5F87FF' : Math.random() < 0.1 ? '#8B5CF6' : '#ffffff'
    });
  }
}
createStars(240);

let t = 0;
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); t += 0.016;
  stars.forEach(s => {
    const tw = Math.sin(t * s.twinkle * 60 + s.offset);
    const alpha = s.opacity * (0.55 + 0.45 * tw);
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = s.color;
    ctx.shadowBlur = s.size > 1.5 ? 7 : 2; ctx.shadowColor = s.color;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size * (0.88 + 0.12 * tw), 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
    s.y -= s.speed * 0.06;
    if (s.y < -2) { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ── MAGIC SPARKS ─────────────────────
const pContainer = document.getElementById('magicParticles');
const colors = ['#D4AF37','#F7E7A9','#5F87FF','#8B5CF6','#ffffff'];
function createSpark() {
  const el = document.createElement('div');
  el.className = 'spark';
  const size = Math.random() * 3 + 1;
  const dur = Math.random() * 8 + 4;
  const c = colors[Math.floor(Math.random() * colors.length)];
  el.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;background:${c};box-shadow:0 0 ${size*3}px ${c};animation-duration:${dur}s;animation-delay:${Math.random()*dur}s;`;
  pContainer.appendChild(el);
}
for (let i = 0; i < 50; i++) createSpark();

// ── NAVBAR ───────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightNav(); revealEls();
}, { passive: true });

function highlightNav() {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 220) cur = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  const sp = navToggle.querySelectorAll('span');
  if (open) { sp[0].style.transform='rotate(45deg) translate(5px,5px)'; sp[1].style.opacity='0'; sp[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
  else { sp.forEach(s => { s.style.transform=''; s.style.opacity=''; }); }
});
navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  navToggle.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
}));

// ── REVEAL ───────────────────────────
function revealEls() {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 70)
      setTimeout(() => el.classList.add('visible'), i * 55);
  });
}
revealEls();

const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      e.target.querySelectorAll('.reveal').forEach((el, i) =>
        setTimeout(() => el.classList.add('visible'), i * 65)
      );
  });
}, { threshold: 0.07 });
sections.forEach(s => secObs.observe(s));

// ── STAT COUNTERS ────────────────────
const heroObs = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const dec = el.dataset.decimal === 'true';
    let cur = 0; const step = target / 60;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = dec ? cur.toFixed(2) : Math.floor(cur) + suffix;
    }, 22);
  });
  heroObs.disconnect();
}, { threshold: 0.3 });
const heroEl = document.getElementById('hero');
if (heroEl) heroObs.observe(heroEl);

// ── TYPEWRITER ───────────────────────
(function typewriter() {
  const el = document.getElementById('heroRole');
  if (!el) return;
  const roles = [
    'Full Stack Developer',
    'Java Developer',
    'UI/UX Designer',
    'AI Enthusiast',
    'Generative AI Explorer',
    'Cybersecurity Learner'
  ];
  let ri = 0, ci = 0, del = false;
  function tick() {
    const cur = roles[ri];
    if (del) { el.textContent = cur.slice(0, --ci); if (ci===0){del=false;ri=(ri+1)%roles.length;setTimeout(tick,350);return;} }
    else { el.textContent = cur.slice(0,++ci); if(ci===cur.length){del=true;setTimeout(tick,2600);return;} }
    setTimeout(tick, del ? 30 : 68);
  }
  setTimeout(tick, 1200);
})();

// ── PORTRAIT TILT ────────────────────
const portraitFrame = document.getElementById('portraitFrame');
const portraitWrapper = document.getElementById('portraitWrapper');
if (portraitWrapper) {
  portraitWrapper.addEventListener('mousemove', e => {
    const r = portraitWrapper.getBoundingClientRect();
    const rx = ((e.clientY - r.top - r.height/2) / r.height) * 18;
    const ry = ((e.clientX - r.left - r.width/2) / r.width) * -18;
    if (portraitFrame) portraitFrame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  portraitWrapper.addEventListener('mouseleave', () => {
    if (portraitFrame) portraitFrame.style.transform = '';
  });
}

// ── THE LIVING GRIMOIRE ───────────────
(function initGrimoire() {
  const wrapper = document.getElementById('grimoireWrapper');
  const grimoire = document.getElementById('grimoire3d');
  const goParticles = document.getElementById('goParticles');
  const gpContainer = document.getElementById('grimoireParticles');
  if (!grimoire) return;

  // Ambient grimoire particles (escaping from book)
  function createGrimoireParticle() {
    if (!gpContainer) return;
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const c = Math.random() < 0.6 ? '#D4AF37' : '#F7E7A9';
    const startX = 70 + Math.random() * 20;
    p.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;border-radius:50%;
      background:${c};box-shadow:0 0 ${size*2}px ${c};
      left:${startX}px;bottom:${Math.random()*60}px;
      opacity:0;pointer-events:none;
      animation:gpFly ${Math.random()*3+2}s ease-out forwards;
    `;
    gpContainer.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }
  // Inject keyframe
  const kf = document.createElement('style');
  kf.textContent = `
    @keyframes gpFly {
      0%   { opacity:0; transform:translateY(0) translateX(0) scale(0.5); }
      20%  { opacity:1; transform:translateY(-20px) translateX(${Math.random()*30-15}px) scale(1); }
      100% { opacity:0; transform:translateY(-120px) translateX(${Math.random()*60-30}px) scale(0.2); }
    }
    @keyframes pSpark {
      0%{opacity:0;transform:translateY(0) scale(0)}
      20%{opacity:1;transform:translateY(-18px) scale(1)}
      100%{opacity:0;transform:translateY(-90px) scale(0.2)}
    }
    @keyframes goSpark {
      0%{opacity:0;transform:scale(0) rotate(0deg)}
      50%{opacity:1;transform:scale(1) rotate(180deg)}
      100%{opacity:0;transform:translateY(-60px) scale(0.3) rotate(360deg)}
    }
  `;
  document.head.appendChild(kf);

  setInterval(createGrimoireParticle, 400);

  // Open book particles
  grimoire.addEventListener('mouseenter', () => {
    if (!goParticles) return;
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        const size = Math.random()*5+2;
        const c = Math.random()<.5?'#D4AF37':'#F7E7A9';
        p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${c};box-shadow:0 0 ${size*2}px ${c};left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:0;animation:goSpark ${Math.random()*1.5+1}s ease-out forwards;pointer-events:none;`;
        goParticles.appendChild(p);
        setTimeout(()=>p.remove(),2500);
      }, i * 80);
    }
  });

  // Mouse reactive levitation
  document.addEventListener('mousemove', e => {
    if (!grimoire) return;
    const r = grimoire.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - cy) / window.innerHeight;
    if (!grimoire.matches(':hover')) {
      grimoire.style.transform = `rotateX(${-dy*8+5}deg) rotateY(${dx*12-8}deg)`;
    }
  });
})();

// ── CARD TILT ────────────────────────
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height/2) / r.height) * 12;
      const ry = ((e.clientX - r.left - r.width/2) / r.width) * -12;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
      card.style.boxShadow = `${-ry/3}px ${rx/3}px 28px rgba(212,175,55,0.2)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform=''; card.style.boxShadow=''; });
  });
}
initTilt();

// ── PORTRAIT PARTICLES ────────────────
const pp = document.getElementById('portraitParticles');
if (pp) {
  setInterval(() => {
    const p = document.createElement('div');
    const size = Math.random()*4+2;
    const c = Math.random()<.5?'#D4AF37':'#5F87FF';
    p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${c};box-shadow:0 0 ${size*2}px ${c};left:${Math.random()*100}%;bottom:0;opacity:0;animation:pSpark ${Math.random()*2+1.5}s ease-out forwards;pointer-events:none;`;
    pp.appendChild(p);
    setTimeout(()=>p.remove(),3500);
  }, 280);
}

// ── CHIBI SHARON ANIMATIONS ───────────
(function initChibi() {
  const chibis = document.querySelectorAll('.chibi-sharon');
  const chibiAnimations = [
    { name: 'chibiWalk', css: '0%,100%{transform:translateX(0)}25%{transform:translateX(3px)}75%{transform:translateX(-3px)}' },
    { name: 'chibiJump', css: '0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}' },
    { name: 'chibiNod', css: '0%,100%{transform:rotate(0)}50%{transform:rotate(-8deg)}' },
  ];

  // Inject chibi keyframes
  const ckf = document.createElement('style');
  chibiAnimations.forEach(a => { ckf.textContent += `@keyframes ${a.name}{${a.css}}`; });
  document.head.appendChild(ckf);

  // Random animation cycling for each chibi
  chibis.forEach((c, idx) => {
    const img = c.querySelector('img');
    if (!img) return;
    let aIdx = 0;
    const aNames = ['chibiFloat','chibiJump','chibiNod','chibiWalk'];
    setInterval(() => {
      aIdx = (aIdx + 1) % aNames.length;
      img.style.animation = `${aNames[aIdx]} ${1.5 + Math.random()}s ease-in-out infinite`;
    }, 3000 + idx * 800);
  });

  // Chibi click interaction
  chibis.forEach(c => {
    const messages = ['✨ Hello! I\'m Sharon!','📚 Keep exploring!','🚀 Let\'s build something!','🎨 Design is my magic!','☕ Need Java? I got you!','🤖 AI is my new spell!'];
    let msgIdx = 0;
    c.addEventListener('click', () => {
      const bubble = c.querySelector('.chibi-bubble');
      if (!bubble) return;
      bubble.textContent = messages[msgIdx++ % messages.length];
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0)';
      setTimeout(() => { bubble.style.opacity = '0'; }, 2200);
    });
  });
})();

// ── CURSOR TRAIL ─────────────────────
(function trail() {
  const MAX = 8; const dots = [];
  for (let i = 0; i < MAX; i++) {
    const d = document.createElement('div');
    const s = (MAX - i) * 2;
    d.style.cssText = `position:fixed;border-radius:50%;width:${s}px;height:${s}px;background:rgba(212,175,55,${0.48-i*0.05});pointer-events:none;z-index:9998;mix-blend-mode:screen;transition:none;`;
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }
  document.addEventListener('mousemove', e => {
    dots[0].x = e.clientX; dots[0].y = e.clientY;
    dots[0].el.style.left = (e.clientX - dots[0].el.offsetWidth/2)+'px';
    dots[0].el.style.top  = (e.clientY - dots[0].el.offsetHeight/2)+'px';
    for (let i=1;i<dots.length;i++) {
      dots[i].x += (dots[i-1].x - dots[i].x) * 0.4;
      dots[i].y += (dots[i-1].y - dots[i].y) * 0.4;
      dots[i].el.style.left = (dots[i].x - dots[i].el.offsetWidth/2)+'px';
      dots[i].el.style.top  = (dots[i].y - dots[i].el.offsetHeight/2)+'px';
    }
  });
})();

// ── SECTION PARALLAX ─────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.section-header').forEach((h, i) => {
    const offset = (h.getBoundingClientRect().top + scrollY - window.innerHeight/2) * 0.02;
    h.style.transform = `translateY(${offset}px)`;
  });
}, { passive: true });

// ── SKILL CARDS EQUAL HEIGHT ──────────
function equalizeSkillCards() {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;
  cards.forEach(c => c.style.minHeight = 'auto');
  let max = 0;
  cards.forEach(c => { if (c.offsetHeight > max) max = c.offsetHeight; });
  cards.forEach(c => c.style.minHeight = max + 'px');
}
window.addEventListener('load', equalizeSkillCards);
window.addEventListener('resize', equalizeSkillCards);

// ── INIT ─────────────────────────────
window.addEventListener('load', () => {
  revealEls();
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  });
});

if (!sessionStorage.getItem('grimoireOpened')) {

  welcomeScroll.style.display = 'flex';

  enterLibrary.addEventListener(
    'click',
    () => {

      sessionStorage.setItem(
        'grimoireOpened',
        'true'
      );

      welcomeScroll.style.opacity = '0';

      setTimeout(() => {
        welcomeScroll.remove();
      }, 800);
    }
  );

} else {
  welcomeScroll.remove();
}
const enterBtn = document.getElementById("enterLibrary");
const welcome = document.getElementById("welcomeScroll");

enterBtn.addEventListener("click", () => {
  welcome.style.opacity = "0";
  welcome.style.transition = "opacity .8s ease";

  setTimeout(() => {
    welcome.style.display = "none";
  }, 800);
});