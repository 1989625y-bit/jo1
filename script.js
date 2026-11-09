/* ═══════════════════════════════════════════════════════
   嚴幼喬個人網站 — script.js
═══════════════════════════════════════════════════════ */

/* ── 導覽列：捲動後加深背景 & 手機選單 ── */
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(26,21,16,0.98)'
    : 'rgba(26,21,16,0.92)';
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// 點選連結後關閉手機選單
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── 平滑捲動：導覽連結 ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Scroll Fade-in（用 IntersectionObserver） ── */
const fadeElements = document.querySelectorAll(
  '.skill-card, .work-card, .goal-block, .plan-item, .timeline-item, .tag, .contact-item'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeElements.forEach(el => fadeObserver.observe(el));

/* ── 技能進度條動畫（進入視窗時才跑） ── */
const skillBars = document.querySelectorAll('.skill-fill');

const barObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

skillBars.forEach(bar => barObserver.observe(bar));

/* ── 作品集 Tab 切換 ── */
const tabBtns  = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = 'tab-' + btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(targetId).classList.add('active');
  });
});

/* ── 動畫影格播放器 ── */
function initFrameViewers() {
  document.querySelectorAll('.frame-viewer').forEach(viewer => {
    const dataEl   = viewer.querySelector('.frame-data');
    if (!dataEl) return;

    let frames = [];
    try {
      frames = JSON.parse(dataEl.dataset.frames);
    } catch (e) { return; }

    if (frames.length === 0) return;

    const imgEl     = viewer.querySelector('.frame-img');
    const placeholder = viewer.querySelector('.frame-placeholder');
    const counterEl = viewer.querySelector('.frame-counter');
    const prevBtn   = viewer.querySelector('.frame-btn.prev');
    const nextBtn   = viewer.querySelector('.frame-btn.next');

    let current = 0;

    function updateFrame(index) {
      current = (index + frames.length) % frames.length;

      const src = frames[current];
      imgEl.src = src;
      imgEl.alt = `第 ${current + 1} 格`;

      // 嘗試載入，成功則隱藏佔位符
      imgEl.onload  = () => { imgEl.style.display = 'block'; if(placeholder) placeholder.style.opacity='0'; };
      imgEl.onerror = () => { imgEl.style.display = 'none';  if(placeholder) placeholder.style.opacity='1'; };

      if (counterEl) {
        counterEl.textContent = `${current + 1} / ${frames.length}`;
      }
    }

    prevBtn.addEventListener('click', () => updateFrame(current - 1));
    nextBtn.addEventListener('click', () => updateFrame(current + 1));

    // 初始化
    updateFrame(0);
  });
}

initFrameViewers();

/* ── 表單送出（示範，無實際寄送） ── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-btn');
    const orig = btn.textContent;
    btn.textContent = '✦ 已收到（示範模式）';
    btn.style.background = 'var(--accent-gold)';
    btn.style.color = 'var(--bg-dark)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 2500);
  });
}

/* ── 導覽列：Active 連結高亮（捲動偵測） ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--accent-gold)'
            : '';
        });
      }
    });
  },
  {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  }
);

sections.forEach(s => sectionObserver.observe(s));
