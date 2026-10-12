(() => {
  'use strict';

  const C = window.GAME_CONFIG;
  const SAVE_KEY = 'cozy-pet-save-v1';
  const $ = (sel) => document.querySelector(sel);

  const tierById = Object.fromEntries(C.tiers.map((t) => [t.id, t]));
  const tierIndex = Object.fromEntries(C.tiers.map((t, i) => [t.id, i]));
  const animalById = Object.fromEntries(C.animals.map((a) => [a.id, a]));

  // ---------- 저장 ----------
  function newState() {
    const owned = {};
    if (C.starterAnimal) owned[C.starterAnimal] = { count: 1, affinity: 0 };
    return { coins: C.startCoins, owned, sincePity: 0, eggsOpened: 0, lastSeen: Date.now(), lastFeed: 0, nest: [], dailyDay: '', streak: 0 };
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) return Object.assign(newState(), JSON.parse(raw));
    } catch (e) { /* 저장소를 못 쓰면 새로 시작 */ }
    return null;
  }

  function save() {
    state.lastSeen = Date.now();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* 무시 */ }
  }

  const saved = load();
  const state = saved || newState();
  // 설정에서 빠진 동물은 무시
  for (const id of Object.keys(state.owned)) if (!animalById[id]) delete state.owned[id];

  // ---------- 화면 기본 ----------
  $('#title').textContent = C.name;
  document.title = C.name;

  function renderCoins(bump) {
    $('#coin-count').textContent = state.coins.toLocaleString();
    if (bump) {
      const el = $('#coins');
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    }
  }

  function addCoins(n) {
    state.coins += n;
    renderCoins(true);
    save();
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 2400);
  }

  function floatAt(parent, x, y, text, cls) {
    const el = document.createElement('div');
    el.className = cls;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    parent.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  function animalFace(a) {
    return a.image ? `<img src="${a.image}" alt="${a.name}" style="width:1em;height:1em;object-fit:contain">` : a.emoji;
  }

  // ---------- 방과 동물 ----------
  const room = $('#room');
  const pets = new Map(); // id -> { el, lastPetCoin, rubDist }

  function roomBox() { return room.getBoundingClientRect(); }

  function randomSpot() {
    const b = roomBox();
    // 방 아래쪽(바닥) 위주로 돌아다님
    return { x: 50 + Math.random() * (b.width - 100), y: b.height * (0.5 + Math.random() * 0.38) };
  }

  function stageOf(id) {
    const aff = (state.owned[id] && state.owned[id].affinity) || 0;
    let st = C.growth[0];
    for (const g of C.growth) if (aff >= g.min) st = g;
    return st;
  }

  function applyStage(pet, id) {
    const st = stageOf(id);
    pet.el.style.fontSize = `${64 * st.scale}px`;
    if (pet.stage && pet.stage !== st.id) {
      toast(`${animalById[id].name}이(가) ${st.name}로 자랐어요!`);
      playAnim(pet.el, 'happy');
    }
    pet.stage = st.id;
  }

  function placeAnimal(id) {
    const a = animalById[id];
    const el = document.createElement('div');
    el.className = 'animal';
    el.innerHTML = `<span class="body">${animalFace(a)}</span>`;
    const p = randomSpot();
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
    el.dataset.id = id;
    room.appendChild(el);
    const pet = { el, lastPetCoin: 0, rubDist: 0, x: p.x, y: p.y };
    pets.set(id, pet);
    bindPetting(pet, id);
    applyStage(pet, id);
    return pet;
  }

  function renderRoom() {
    for (const id of Object.keys(state.owned)) if (!pets.has(id)) placeAnimal(id);
    // 깊이 순서: 아래에 있는 동물이 앞으로
    for (const p of pets.values()) p.el.style.zIndex = Math.round(p.y);
  }

  function wander() {
    for (const p of pets.values()) {
      if (p.busy || Math.random() < 0.4) continue;
      const to = randomSpot();
      p.el.classList.toggle('flip', to.x > p.x);
      p.x = to.x; p.y = to.y;
      p.el.style.left = `${to.x}px`;
      p.el.style.top = `${to.y}px`;
      p.el.style.zIndex = Math.round(to.y);
    }
  }
  setInterval(wander, 3500);

  function playAnim(el, cls) {
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 1000);
  }

  function petAnimal(pet, id) {
    const b = roomBox();
    const r = pet.el.getBoundingClientRect();
    const cx = r.left - b.left + r.width / 2 + (Math.random() * 30 - 15);
    const cy = r.top - b.top;
    floatAt(room, cx, cy, ['💗', '💕', '💖'][Math.floor(Math.random() * 3)], 'heart');
    playAnim(pet.el, 'happy');
    const o = state.owned[id];
    o.affinity = (o.affinity || 0) + 1;
    applyStage(pet, id);
    const now = Date.now();
    if (now - pet.lastPetCoin > C.petCooldownMs) {
      pet.lastPetCoin = now;
      floatAt(room, cx + 20, cy + 10, `+${C.petCoins}`, 'float-text');
      addCoins(C.petCoins);
    } else {
      save();
    }
  }

  // 쓰다듬기: 동물을 문지르거나 톡 치면 됨
  function bindPetting(pet, id) {
    let last = null;
    let moved = 0;
    pet.el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      last = { x: e.clientX, y: e.clientY };
      moved = 0;
      pet.busy = true;
      // 문지르는 동안은 그 자리에 멈춤
      const r = pet.el.getBoundingClientRect(); const b = roomBox();
      pet.el.style.transition = 'none';
      pet.el.style.left = `${r.left - b.left + r.width / 2}px`;
      pet.el.style.top = `${r.top - b.top + r.height / 2}px`;
    });
    pet.el.addEventListener('pointermove', (e) => {
      if (!last) return;
      const d = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      moved += d;
      pet.rubDist += d;
      if (pet.rubDist > 45) { pet.rubDist = 0; petAnimal(pet, id); }
    });
    const end = () => {
      if (!last) return;
      if (moved < 10) petAnimal(pet, id);
      last = null;
      setTimeout(() => {
        const r = pet.el.getBoundingClientRect(); const b = roomBox();
        pet.x = r.left - b.left + r.width / 2; pet.y = r.top - b.top + r.height / 2;
        pet.el.style.transition = '';
        pet.busy = false;
      }, 600);
    };
    pet.el.addEventListener('pointerup', end);
    pet.el.addEventListener('pointercancel', end);
  }

  // ---------- 선물 ----------
  function dropGift() {
    if (document.hidden || !$('#egg-screen').classList.contains('hidden')) return;
    if (room.querySelectorAll('.gift').length >= 3 || pets.size === 0) return;
    const list = [...pets.values()];
    const p = list[Math.floor(Math.random() * list.length)];
    const [lo, hi] = C.giftCoins;
    const amount = lo + Math.floor(Math.random() * (hi - lo + 1));
    const el = document.createElement('div');
    el.className = 'gift';
    el.textContent = amount >= (lo + hi) / 2 ? '🎁' : '🪙';
    el.style.left = `${p.x + (Math.random() * 60 - 30)}px`;
    el.style.top = `${Math.min(p.y + 30, roomBox().height - 30)}px`;
    el.style.zIndex = 1000;
    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const x = parseFloat(el.style.left), y = parseFloat(el.style.top);
      el.remove();
      floatAt(room, x, y - 20, `+${amount}`, 'float-text');
      addCoins(amount);
    });
    room.appendChild(el);
  }
  setInterval(dropGift, C.giftEveryMs);

  // ---------- 밥 주기 ----------
  const feedBtn = $('#btn-feed');
  function updateFeedBtn() {
    const left = C.feedCooldownMs - (Date.now() - state.lastFeed);
    const label = feedBtn.querySelector('.label');
    if (left > 0) {
      feedBtn.disabled = true;
      label.textContent = `${Math.ceil(left / 1000)}초`;
    } else {
      feedBtn.disabled = false;
      label.textContent = '밥 주기';
    }
  }
  setInterval(updateFeedBtn, 500);

  feedBtn.addEventListener('click', () => {
    if (Date.now() - state.lastFeed < C.feedCooldownMs) return;
    state.lastFeed = Date.now();
    let total = 0;
    const b = roomBox();
    for (const p of pets.values()) {
      playAnim(p.el, 'eat');
      const r = p.el.getBoundingClientRect();
      floatAt(room, r.left - b.left + r.width / 2, r.top - b.top, '🍖', 'heart');
      total += C.feedCoins;
    }
    setTimeout(() => toast(`냠냠! 코인 +${total}`), 400);
    addCoins(total);
    updateFeedBtn();
  });

  // ---------- 알 뽑기 ----------
  function rollTier(forceMin) {
    let minIdx = state.sincePity + 1 >= C.pityCount ? tierIndex[C.pityMinTier] : 0;
    if (forceMin) minIdx = Math.max(minIdx, tierIndex[forceMin]);
    const pool = C.tiers.filter((t, i) => i >= minIdx);
    const sum = pool.reduce((s, t) => s + t.rate, 0);
    let r = Math.random() * sum;
    for (const t of pool) { if ((r -= t.rate) < 0) return t; }
    return pool[pool.length - 1];
  }

  function rollAnimal(tier) {
    const list = C.animals.filter((a) => a.tier === tier.id);
    return list[Math.floor(Math.random() * list.length)];
  }

  const eggScreen = $('#egg-screen');
  const egg = $('#egg');
  let hatch = null;

  // 금 가는 모양 (위에서 아래로 지그재그)
  const CRACK = 'M10 52 L28 44 L38 56 L52 40 L64 54 L76 42 L90 50';
  $('#egg-cracks').innerHTML =
    `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path id="crack-path" d="${CRACK}" pathLength="100" fill="none" stroke="#5a3e2b" stroke-width="2.4" stroke-linejoin="round" stroke-dasharray="100" stroke-dashoffset="100"/></svg>`;
  const crackPath = $('#crack-path');

  // ---------- 둥지 ----------
  const nestEl = $('#nest');
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const yesterday = () => { const d = new Date(Date.now() - 864e5); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const dailyReady = () => C.dailyEgg && state.dailyDay !== today();
  const fmtLeft = (ms) => {
    const m = Math.ceil(ms / 60000);
    return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${Math.max(m, 1)}분`;
  };

  function addToNest(minTier) {
    const tier = rollTier(minTier);
    const animal = rollAnimal(tier);
    // 결과는 바로 저장해서 새로고침으로 다시 뽑을 수 없게 함
    state.sincePity = tierIndex[tier.id] >= tierIndex[C.pityMinTier] ? 0 : state.sincePity + 1;
    state.nest.push({ tier: tier.id, animal: animal.id, readyAt: Date.now() + tier.hatchMin * 60000 / C.hatchSpeed });
    save();
    renderNest();
  }

  function renderNest() {
    const now = Date.now();
    nestEl.innerHTML = '';
    state.nest.forEach((e, i) => {
      const t = tierById[e.tier];
      const left = e.readyAt - now;
      const d = document.createElement('button');
      d.className = `nest-egg${left <= 0 ? ' ready' : ''}`;
      d.style.setProperty('--egg', t.glow === 'rainbow' ? '#ffb3e6' : t.color);
      d.innerHTML = `<span>🥚</span><small>${left <= 0 ? '깨기!' : fmtLeft(left)}</small>`;
      d.addEventListener('click', () => {
        if (e.readyAt - Date.now() > 0) toast(`${fmtLeft(e.readyAt - Date.now())} 뒤에 깨어나요. 다녀오면 나와 있을 거예요!`);
        else hatchFromNest(i);
      });
      nestEl.appendChild(d);
    });
    for (let i = state.nest.length; i < C.nestSlots; i++) {
      const d = document.createElement('div');
      d.className = 'nest-empty';
      d.textContent = '빈 둥지';
      nestEl.appendChild(d);
    }
    const label = $('#egg-label');
    if (dailyReady()) label.textContent = '무료 알!';
    else label.textContent = `알 ${C.eggPrice}`;
    $('#btn-egg').classList.toggle('free', dailyReady());
    $('#btn-egg').classList.toggle('poor', !dailyReady() && state.coins < C.eggPrice);
  }
  setInterval(renderNest, 15000);

  $('#btn-egg').addEventListener('click', () => {
    if (state.nest.length >= C.nestSlots) {
      toast('둥지가 가득 찼어요. 알이 깨어나면 다시 뽑아요!');
      return;
    }
    if (dailyReady()) {
      state.streak = state.dailyDay === yesterday() ? state.streak + 1 : 1;
      state.dailyDay = today();
      const bonus = state.streak >= C.streakDays;
      if (bonus) state.streak = 0;
      addToNest(bonus ? C.streakMinTier : null);
      toast(bonus
        ? `${C.streakDays}일 연속 출석! 특별한 알이에요`
        : `오늘의 무료 알! 연속 ${state.streak}일째 (${C.streakDays}일이면 보너스)`);
      return;
    }
    if (state.coins < C.eggPrice) {
      toast(`코인이 ${C.eggPrice - state.coins}개 더 필요해요. 동물을 쓰다듬어 보세요!`);
      return;
    }
    state.coins -= C.eggPrice;
    renderCoins(true);
    addToNest(null);
    toast('알을 둥지에 넣었어요. 곧 깨어날 거예요!');
  });

  function hatchFromNest(i) {
    const e = state.nest[i];
    const tier = tierById[e.tier];
    const animal = animalById[e.animal];
    state.nest.splice(i, 1);
    state.eggsOpened += 1;
    const isNew = !state.owned[animal.id];
    if (isNew) state.owned[animal.id] = { count: 1, affinity: 0 };
    else {
      state.owned[animal.id].count += 1;
      state.owned[animal.id].affinity += 10;
      state.coins += tier.dupCoins;
    }
    save();
    renderNest();
    hatch = { tier, animal, isNew, taps: 0 };
    openEgg(tier);
  }

  function openEgg(tier) {
    egg.className = '';
    egg.style.setProperty('--egg', tier.color);
    egg.style.setProperty('--glow', tier.glow === 'rainbow' ? 'transparent' : tier.glow);
    if (tier.id === 'uncommon') egg.classList.add('spots');
    if (tier.id === 'myth') egg.classList.add('rainbow', 'rainbow-glow');
    if (tierIndex[tier.id] >= tierIndex.legend) egg.classList.add('rumble');
    crackPath.setAttribute('stroke-dashoffset', '100');
    $('#egg-wrap').classList.remove('hidden');
    $('#egg-hint').classList.remove('hidden');
    $('#reveal').classList.add('hidden');
    eggScreen.classList.remove('hidden');
  }

  egg.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!hatch || hatch.done) return;
    hatch.taps += 1;
    const progress = hatch.taps / hatch.tier.taps;
    crackPath.setAttribute('stroke-dashoffset', String(100 - progress * 100));
    if (!egg.classList.contains('rumble')) playAnim(egg, 'tap');
    if (navigator.vibrate) navigator.vibrate(15);
    if (hatch.taps >= hatch.tier.taps) {
      hatch.done = true;
      if (tierIndex[hatch.tier.id] >= tierIndex.legend) playAnim(eggScreen, 'quake');
      setTimeout(showReveal, 350);
    }
  });

  function showReveal() {
    const { tier, animal, isNew } = hatch;
    $('#egg-wrap').classList.add('hidden');
    $('#egg-hint').classList.add('hidden');
    const tierColor = tier.glow === 'rainbow' ? '#ff6fb5' : tier.glow;
    const rv = $('#reveal');
    rv.style.setProperty('--tier-color', tierColor);
    rv.style.setProperty('--burst', tier.glow === 'rainbow' ? '#ffd6f0' : tier.color);
    $('#reveal-animal').innerHTML = animalFace(animal);
    $('#reveal-tier').textContent = tier.name;
    $('#reveal-name').textContent = animal.name;
    $('#reveal-note').textContent = isNew
      ? '새 친구가 생겼어요!'
      : `또 만났네요! 친밀도 업, 코인 +${tier.dupCoins}`;
    rv.classList.remove('hidden');
    if (navigator.vibrate) navigator.vibrate(tierIndex[tier.id] >= tierIndex.hero ? [60, 40, 120] : 40);
  }

  $('#reveal-ok').addEventListener('click', () => {
    eggScreen.classList.add('hidden');
    const { animal } = hatch;
    hatch = null;
    renderRoom();
    renderCoins(true);
    const p = pets.get(animal.id);
    if (p) { applyStage(p, animal.id); playAnim(p.el, 'happy'); }
  });

  // ---------- 도감 ----------
  function renderDex() {
    const grid = $('#dex-grid');
    grid.innerHTML = '';
    let have = 0;
    for (const a of C.animals) {
      const o = state.owned[a.id];
      const t = tierById[a.tier];
      if (o) have += 1;
      const card = document.createElement('div');
      card.className = `dex-card${o ? '' : ' locked'}`;
      card.style.setProperty('--tier-color', t.glow === 'rainbow' ? '#ff9ad5' : t.glow);
      card.innerHTML =
        `<div class="emoji">${animalFace(a)}</div>` +
        `<div class="name">${o ? a.name : '???'}</div>` +
        `<div class="meta">${t.name}${o ? ` · ${stageOf(a.id).name} 💗${o.affinity}` : ''}</div>`;
      grid.appendChild(card);
    }
    $('#dex-progress').textContent = `${have} / ${C.animals.length}`;
  }

  $('#btn-dex').addEventListener('click', () => { renderDex(); $('#dex-screen').classList.remove('hidden'); });
  $('#dex-close').addEventListener('click', () => $('#dex-screen').classList.add('hidden'));
  $('#dex-screen').addEventListener('click', (e) => { if (e.target.id === 'dex-screen') e.target.classList.add('hidden'); });

  // ---------- 시작 ----------
  function welcomeBack() {
    if (!saved) {
      setTimeout(() => toast(`${C.playerTitle}, 반가워요! 저를 쓰다듬어 주세요`), 600);
      return;
    }
    const mins = Math.min((Date.now() - state.lastSeen) / 60000, C.offlineMaxMin);
    const gift = Math.floor(mins * C.offlineCoinsPerMin * Object.keys(state.owned).length);
    if (gift > 0) {
      state.coins += gift;
      setTimeout(() => toast(`${C.playerTitle}, 보고 싶었어요! 선물 코인 +${gift}`), 600);
    }
  }

  welcomeBack();
  renderCoins();
  renderNest();
  updateFeedBtn();
  // 방 크기가 정해진 뒤에 동물 배치
  requestAnimationFrame(() => { renderRoom(); save(); });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) save();
    else { welcomeBack(); renderCoins(true); renderNest(); save(); }
  });
  window.addEventListener('pagehide', save);
})();
