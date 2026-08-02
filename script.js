(() => {
  'use strict';

  /* =========================================================
     CONTAGEM REGRESSIVA — "ANO PASSANDO RÁPIDO"
     Como ela só vai abrir o site no dia do aniversário (07/08),
     uma contagem regressiva real sempre mostraria zero. Em vez
     disso, ao abrir a página, os números "correm" rapidamente
     de um ano inteiro até chegar a zero, dando a sensação de
     ver o ano passando — e terminam exatamente na revelação do
     aniversário. Ajuste ANIM_DAYS ou ANIM_DURATION_MS se quiser
     mudar a duração ou de quantos dias ele parte.
     ========================================================= */
  const ANIM_DAYS = 365;
  const ANIM_DURATION_MS = 4200;

  const cdDays    = document.getElementById('cd-days');
  const cdHours   = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const countdownEl = document.getElementById('countdown');
  const heroSub = document.getElementById('hero-sub');
  const heroBirthday = document.getElementById('hero-birthday');

  function pad(n){ return String(n).padStart(2, '0'); }

  // acelera no início e desacelera suavemente perto do fim
  function easeOutQuart(t){ return 1 - Math.pow(1 - t, 4); }

  function animateCountdown(){
    const totalStartSeconds = ANIM_DAYS * 86400;
    const startTime = performance.now();
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced){
      finishCountdown();
      return;
    }

    function frame(now){
      const elapsed = now - startTime;
      const t = Math.min(elapsed / ANIM_DURATION_MS, 1);
      const remaining = Math.round(totalStartSeconds * (1 - easeOutQuart(t)));

      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      cdDays.textContent = pad(days);
      cdHours.textContent = pad(hours);
      cdMinutes.textContent = pad(minutes);
      cdSeconds.textContent = pad(seconds);

      if (t < 1){
        requestAnimationFrame(frame);
      } else {
        finishCountdown();
      }
    }

    requestAnimationFrame(frame);
  }

  function finishCountdown(){
    countdownEl.hidden = true;
    heroSub.hidden = true;
    heroBirthday.hidden = false;
  }

  animateCountdown();

  /* =========================================================
     SCROLL CUE
     ========================================================= */
  const scrollCue = document.getElementById('scroll-cue');
  if (scrollCue){
    scrollCue.addEventListener('click', () => {
      document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* =========================================================
     JOGO DE CARTAS
     ========================================================= */
  const ICONS = {
    gelato: 'M12 3c-3 0-5 2.2-5 5 0 1 .3 1.9.8 2.6L12 21l4.2-10.4c.5-.7.8-1.6.8-2.6 0-2.8-2-5-5-5z M7.3 9.2h9.4',
    padaria: 'M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8H4z M4 12h16 M8 12v3 M12 12v3 M16 12v3',
    cookie: 'M12 3a9 9 0 1 0 9 9c-1.7 0-3-1.3-3-3-1.7 0-3-1.3-3-3-2 0-3-1-3-3z M9 13.2h.01 M13 15.5h.01 M14.5 10.5h.01',
    cupcake: 'M6 11h12l-1.3 8.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8L6 11z M8 11c0-2.5 1.8-3.8 1-5.5 1.6 0 3 1 3 2.7 0-1.7 1.4-2.7 3-2.7-.8 1.7 1 3 1 5.5',
    chocolate: 'M4 6h16v12H4z M4 6l4 4M8 6l4 4M12 6l4 4M16 6l4 4 M4 14h16',
    trufa: 'M12 21c4-2.5 6-6 6-9.5A6 6 0 0 0 12 5a6 6 0 0 0-6 6.5C6 15 8 18.5 12 21z M9.2 12.5h.01 M14.8 12.5h.01 M12 15.2h.01'
  };

  const CARDS = [
    { id: 'bacio',   name: 'Bacio di Latte', icon: 'gelato',    blurb: 'gelato, pra roubar uma colherada sua' },
    { id: 'bauducco', name: 'Casa Bauducco', icon: 'padaria',   blurb: 'café da tarde e conversa boa' },
    { id: 'chunky',  name: 'Chunky Chunks',  icon: 'cookie',    blurb: 'cookie quentinho, mão na mão' },
    { id: 'damarate', name: 'Damarate',      icon: 'cupcake',   blurb: 'doce raro pra ocasião especial' },
    { id: 'kopen',   name: 'Kopenhagen',     icon: 'chocolate', blurb: 'chocolate fino, à moda antiga' },
    { id: 'cacau',   name: 'Cacau Show',     icon: 'trufa',      blurb: 'trufa na mão, sem pressa nenhuma' },
  ];

  const grid = document.getElementById('card-grid');
  const confirmBox = document.getElementById('game-confirm');
  const confirmText = document.getElementById('game-confirm-text');

  function iconSvg(key){
    return `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
      <path d="${ICONS[key]}"/>
    </svg>`;
  }

  CARDS.forEach((card) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.id = card.id;
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">
          <span class="card-mark">&amp;</span>
        </div>
        <div class="card-face card-front">
          ${iconSvg(card.icon)}
          <span class="card-name">${card.name}</span>
          <span class="card-blurb">${card.blurb}</span>
          <button type="button" class="card-choose" data-choose="${card.id}">escolher</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });

  function showConfirm(card){
    confirmBox.hidden = false;
    confirmText.textContent = `combinado! nosso próximo encontro é na ${card.name} 💙`;
  }

  grid.addEventListener('click', (e) => {
    const chooseBtn = e.target.closest('[data-choose]');
    const cardEl = e.target.closest('.card');
    if (!cardEl) return;

    if (chooseBtn){
      e.stopPropagation();
      document.querySelectorAll('.card.chosen').forEach(c => c.classList.remove('chosen'));
      cardEl.classList.add('chosen');
      const card = CARDS.find(c => c.id === cardEl.dataset.id);
      showConfirm(card);
      try { localStorage.setItem('julia-escolha', card.id); } catch (err) {}
      return;
    }

    cardEl.classList.toggle('flipped');
  });

  // restaura escolha salva, se houver
  try {
    const saved = localStorage.getItem('julia-escolha');
    if (saved){
      const savedEl = grid.querySelector(`.card[data-id="${saved}"]`);
      const savedCard = CARDS.find(c => c.id === saved);
      if (savedEl && savedCard){
        savedEl.classList.add('flipped', 'chosen');
        showConfirm(savedCard);
      }
    }
  } catch (err) {}

  /* =========================================================
     FINALE — CACHORRINHO E BALÕES
     ========================================================= */
  const pup = document.getElementById('pup');
  const finaleHint = document.getElementById('finale-hint');
  const finaleMessage = document.getElementById('finale-message');
  const svgRoot = document.getElementById('balloons');

  function releaseBalloon(num){
    const balloon = svgRoot.querySelector(`.balloon[data-balloon="${num}"]`);
    const string = svgRoot.querySelector(`.balloon-string[data-balloon="${num}"]`);
    if (!balloon || balloon.classList.contains('released')) return;

    const drift = (Math.random() * 40 - 20).toFixed(1) + 'px';
    balloon.style.setProperty('--drift', drift);
    balloon.classList.add('released');
    if (string) string.classList.add('released');

    checkAllReleased();
  }

  function checkAllReleased(){
    const all = svgRoot.querySelectorAll('.balloon');
    const released = svgRoot.querySelectorAll('.balloon.released');
    if (released.length === all.length){
      finaleHint.style.opacity = '0';
      setTimeout(() => {
        finaleMessage.hidden = false;
        finaleMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);
    }
  }

  svgRoot.querySelectorAll('.balloon').forEach((balloon) => {
    const num = balloon.dataset.balloon;
    balloon.addEventListener('click', () => releaseBalloon(num));
    balloon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        releaseBalloon(num);
      }
    });
  });

  function bouncePup(){
    pup.classList.remove('bounce');
    void pup.offsetWidth; // reinicia a animação
    pup.classList.add('bounce');
  }

  function releaseAll(){
    bouncePup();
    svgRoot.querySelectorAll('.balloon').forEach((b, i) => {
      setTimeout(() => releaseBalloon(b.dataset.balloon), i * 120);
    });
  }

  pup.addEventListener('click', releaseAll);
  pup.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      releaseAll();
    }
  });

})();
