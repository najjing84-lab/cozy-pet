// 동물 그림: 귀여운 2D, 머리가 큰 2등신 전신 그림을 SVG로 그립니다.
// 동물마다 아래 ART 표에 색과 귀, 꼬리, 특징만 적으면 같은 그림체로 그려져요.
// 나중에 진짜 그림 파일이 생기면 config.js 동물에 image: 'images/dog.png' 를 넣으면 그 그림이 우선합니다.
(() => {
  'use strict';

  const LINE = '#4a3326';
  const O = `stroke="${LINE}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;

  const ART = {
    dog:      { body: '#f3d3a4', belly: '#fff3df', ears: 'floppy', earColor: '#a8714a', tail: 'curl', muzzle: '#fff3df', spot: '#c98d5c' },
    cat:      { body: '#ffc46b', belly: '#fff1d6', ears: 'pointy', inner: '#ffb3b3', tail: 'long', muzzle: '#fff1d6', whiskers: true, stripes: '#e99a3a' },
    otter:    { body: '#a97a55', belly: '#e9cfae', ears: 'small', tail: 'flat', muzzle: '#f1dcc0', whiskers: true },
    penguin:  { body: '#3d4a5c', belly: '#ffffff', ears: 'none', tail: 'none', face: '#ffffff', beak: '#ffa94d', feet: '#ffa94d', flippers: true },
    panda:    { body: '#ffffff', belly: '#ffffff', ears: 'round', earColor: '#33302e', tail: 'stub', muzzle: '#ffffff', patches: '#33302e', limbs: '#33302e' },
    fox:      { body: '#ff9a4d', belly: '#fff6ea', ears: 'pointy', inner: '#fff1e0', earTip: '#5a3a2a', tail: 'fluffy', muzzle: '#fff6ea', limbs: '#5a3a2a' },
    tiger:    { body: '#ffb347', belly: '#fff6e6', ears: 'round', inner: '#fff6e6', tail: 'long', muzzle: '#fff6e6', stripes: '#4a3326', whiskers: true },
    elephant: { body: '#b8c4d6', belly: '#d3dbe7', ears: 'elephant', inner: '#f4c6d0', tail: 'thin', trunk: true },
    trex:     { body: '#7ccf7a', belly: '#e6f7c8', ears: 'none', tail: 'dino', muzzle: '#a6e19a', spikes: '#3e9e5a', arms: 'tiny' },
    triceratops: { body: '#7fb6e8', belly: '#e2f0fb', ears: 'none', tail: 'dino', frill: '#f4a6c0', horns: '#fff4d6', muzzle: '#a7cdf0' },
    unicorn:  { body: '#ffffff', belly: '#ffffff', ears: 'pointy', inner: '#ffd1e8', tail: 'rainbow', muzzle: '#fff0f6', horn: '#ffd84d', mane: true },
    phoenix:  { body: '#ff6b5a', belly: '#ffc46b', ears: 'none', tail: 'flame', beak: '#ffd84d', feet: '#ffb347', crest: true, wings: '#ff9a4d' },
  };

  function ears(a) {
    const c = a.earColor || a.body;
    const inner = a.inner || '#ffc1c1';
    switch (a.ears) {
      case 'floppy':
        return `<ellipse cx="30" cy="52" rx="11" ry="20" transform="rotate(18 30 52)" fill="${c}" ${O}/>` +
               `<ellipse cx="90" cy="52" rx="11" ry="20" transform="rotate(-18 90 52)" fill="${c}" ${O}/>`;
      case 'pointy': {
        const tip = a.earTip ? `<path d="M37 16 L40 6 L47 13 Z" fill="${a.earTip}"/><path d="M83 16 L80 6 L73 13 Z" fill="${a.earTip}"/>` : '';
        return `<path d="M30 34 L38 6 L58 24 Z" fill="${c}" ${O}/><path d="M90 34 L82 6 L62 24 Z" fill="${c}" ${O}/>` +
               `<path d="M37 28 L40 15 L50 24 Z" fill="${inner}"/><path d="M83 28 L80 15 L70 24 Z" fill="${inner}"/>` + tip;
      }
      case 'round':
        return `<circle cx="34" cy="24" r="11" fill="${c}" ${O}/><circle cx="86" cy="24" r="11" fill="${c}" ${O}/>` +
               (a.inner ? `<circle cx="34" cy="25" r="5.5" fill="${a.inner}"/><circle cx="86" cy="25" r="5.5" fill="${a.inner}"/>` : '');
      case 'small':
        return `<circle cx="33" cy="30" r="7" fill="${c}" ${O}/><circle cx="87" cy="30" r="7" fill="${c}" ${O}/>`;
      case 'elephant':
        return `<ellipse cx="25" cy="50" rx="20" ry="24" fill="${c}" ${O}/><ellipse cx="95" cy="50" rx="20" ry="24" fill="${c}" ${O}/>` +
               `<ellipse cx="27" cy="51" rx="12" ry="16" fill="${inner}"/><ellipse cx="93" cy="51" rx="12" ry="16" fill="${inner}"/>`;
      default:
        return '';
    }
  }

  function tail(a) {
    switch (a.tail) {
      case 'curl':
        return `<path d="M80 98 Q100 96 96 80 Q94 74 89 78" fill="none" stroke="${LINE}" stroke-width="9" stroke-linecap="round"/>` +
               `<path d="M80 98 Q100 96 96 80 Q94 74 89 78" fill="none" stroke="${a.body}" stroke-width="5" stroke-linecap="round"/>`;
      case 'long':
        return `<path d="M80 104 Q106 102 102 80" fill="none" stroke="${LINE}" stroke-width="9" stroke-linecap="round"/>` +
               `<path d="M80 104 Q106 102 102 80" fill="none" stroke="${a.body}" stroke-width="5" stroke-linecap="round"/>` +
               (a.stripes ? `<path d="M98 92 L104 94 M101 84 L107 84" stroke="${a.stripes}" stroke-width="2.4" stroke-linecap="round"/>` : '');
      case 'fluffy':
        return `<ellipse cx="94" cy="92" rx="12" ry="20" transform="rotate(40 94 92)" fill="${a.body}" ${O}/>` +
               `<ellipse cx="103" cy="80" rx="6" ry="8" transform="rotate(40 103 80)" fill="#fff6ea"/>`;
      case 'flat':
        return `<ellipse cx="90" cy="108" rx="16" ry="6" transform="rotate(-15 90 108)" fill="${a.body}" ${O}/>`;
      case 'stub':
        return `<circle cx="84" cy="104" r="6" fill="${a.body}" ${O}/>`;
      case 'thin':
        return `<path d="M82 102 Q94 104 96 96" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;
      case 'dino':
        return `<path d="M76 96 Q104 98 114 116 Q96 116 78 112 Z" fill="${a.body}" ${O}/>`;
      case 'rainbow':
        return ['#ff9aa2', '#ffd27f', '#9be3a6', '#8ecbff', '#c9a6ff'].map((c, i) =>
          `<ellipse cx="${88 + i * 3}" cy="${88 + i * 5}" rx="8" ry="6" transform="rotate(30 ${88 + i * 3} ${88 + i * 5})" fill="${c}" stroke="${LINE}" stroke-width="1.6"/>`).join('');
      case 'flame':
        return `<path d="M78 100 Q100 92 112 72 Q104 96 116 100 Q102 104 112 118 Q94 110 78 110 Z" fill="#ffb347" ${O}/>` +
               `<path d="M84 104 Q98 100 104 90 Q100 102 106 108 Q96 106 84 108 Z" fill="#ffe08a"/>`;
      default:
        return '';
    }
  }

  function body(a) {
    let s = '';
    // 몸통과 배
    s += `<ellipse cx="60" cy="96" rx="27" ry="23" fill="${a.body}" ${O}/>`;
    s += `<ellipse cx="60" cy="100" rx="16" ry="14" fill="${a.belly}"/>`;
    if (a.stripes && a.ears !== 'pointy') {
      s += `<path d="M36 92 L44 94 M35 101 L43 101 M84 92 L76 94 M85 101 L77 101" stroke="${a.stripes}" stroke-width="2.6" stroke-linecap="round"/>`;
    }
    // 앞발
    const limb = a.limbs || a.body;
    if (a.flippers) {
      s += `<ellipse cx="35" cy="96" rx="6" ry="13" transform="rotate(20 35 96)" fill="${a.body}" ${O}/>`;
      s += `<ellipse cx="85" cy="96" rx="6" ry="13" transform="rotate(-20 85 96)" fill="${a.body}" ${O}/>`;
    } else if (a.wings) {
      s += `<path d="M36 86 Q20 92 26 108 Q34 104 40 104 Z" fill="${a.wings}" ${O}/>`;
      s += `<path d="M84 86 Q100 92 94 108 Q86 104 80 104 Z" fill="${a.wings}" ${O}/>`;
    } else if (a.arms === 'tiny') {
      s += `<ellipse cx="46" cy="90" rx="5" ry="3.5" fill="${a.body}" ${O}/><ellipse cx="74" cy="90" rx="5" ry="3.5" fill="${a.body}" ${O}/>`;
    } else {
      s += `<ellipse cx="47" cy="106" rx="7" ry="8" fill="${limb}" ${O}/><ellipse cx="73" cy="106" rx="7" ry="8" fill="${limb}" ${O}/>`;
    }
    // 뒷발
    const foot = a.feet || limb;
    s += `<ellipse cx="44" cy="117" rx="10" ry="6" fill="${foot}" ${O}/><ellipse cx="76" cy="117" rx="10" ry="6" fill="${foot}" ${O}/>`;
    return s;
  }

  function head(a) {
    let s = '';
    if (a.frill) {
      s += `<path d="M18 52 Q20 8 60 6 Q100 8 102 52 Z" fill="${a.frill}" ${O}/>`;
      s += [26, 42, 60, 78, 94].map((x, i) => `<circle cx="${x}" cy="${[30, 16, 11, 16, 30][i]}" r="3" fill="#fff4d6"/>`).join('');
    }
    if (a.mane) {
      s += ['#ff9aa2', '#ffd27f', '#9be3a6', '#8ecbff', '#c9a6ff'].map((c, i) =>
        `<circle cx="${38 - i * 2}" cy="${26 + i * 11}" r="10" fill="${c}" stroke="${LINE}" stroke-width="1.6"/>`).join('');
    }
    if (a.spikes) {
      s += `<path d="M78 22 L88 14 L88 28 Z M86 34 L98 30 L94 42 Z M90 48 L102 48 L94 58 Z" fill="${a.spikes}" ${O}/>`;
    }
    if (a.crest) {
      s += `<path d="M52 22 Q48 4 58 2 Q56 12 60 18 Q62 4 72 6 Q64 14 66 22 Z" fill="#ffb347" ${O}/>`;
    }
    if (a.ears === 'elephant' || a.ears === 'floppy') {
      // 머리 뒤로 들어가는 귀는 머리보다 먼저
      if (a.ears === 'elephant') s += ears(a);
    } else {
      s += ears(a);
    }
    s += `<ellipse cx="60" cy="50" rx="33" ry="30" fill="${a.body}" ${O}/>`;
    if (a.ears === 'floppy') s += ears(a);
    if (a.face) s += `<path d="M34 54 Q34 30 50 32 Q60 36 70 32 Q86 30 86 54 Q86 76 60 76 Q34 76 34 54 Z" fill="${a.face}"/>`;
    if (a.spot) s += `<ellipse cx="74" cy="40" rx="9" ry="7" fill="${a.spot}"/>`;
    if (a.stripes) s += `<path d="M60 21 L60 30 M50 22 L52 29 M70 22 L68 29 M28 48 L35 49 M92 48 L85 49" stroke="${a.stripes}" stroke-width="2.6" stroke-linecap="round"/>`;
    if (a.patches) s += `<ellipse cx="46" cy="52" rx="8" ry="10" transform="rotate(25 46 52)" fill="${a.patches}"/><ellipse cx="74" cy="52" rx="8" ry="10" transform="rotate(-25 74 52)" fill="${a.patches}"/>`;
    if (a.muzzle) s += `<ellipse cx="60" cy="64" rx="13" ry="9" fill="${a.muzzle}"/>`;
    // 눈 (깜빡일 때 class="eye"만 납작해짐)
    for (const x of [47, 73]) {
      s += '<g class="eye">';
      if (a.patches) s += `<circle cx="${x}" cy="52" r="5" fill="#ffffff"/>`;
      s += `<ellipse cx="${x}" cy="52" rx="${a.patches ? 3.2 : 4.4}" ry="${a.patches ? 3.6 : 5.4}" fill="#2b1d14"/>`;
      s += `<circle cx="${x + 1.6}" cy="50" r="1.6" fill="#ffffff"/></g>`;
    }
    // 볼터치
    s += `<ellipse cx="38" cy="63" rx="5.5" ry="3.2" fill="#ff8fa3" opacity=".55"/><ellipse cx="82" cy="63" rx="5.5" ry="3.2" fill="#ff8fa3" opacity=".55"/>`;
    // 코, 입, 부리, 코
    if (a.beak) {
      s += `<path d="M53 60 L67 60 L60 69 Z" fill="${a.beak}" ${O}/>`;
    } else if (a.trunk) {
      s += `<path d="M60 58 Q60 78 52 82 Q48 84 48 80" fill="none" stroke="${LINE}" stroke-width="12" stroke-linecap="round"/>`;
      s += `<path d="M60 58 Q60 78 52 82 Q48 84 48 80" fill="none" stroke="${a.body}" stroke-width="7.5" stroke-linecap="round"/>`;
    } else {
      s += `<ellipse cx="60" cy="60" rx="3.6" ry="2.6" fill="${LINE}"/>`;
      s += `<path d="M55 64 Q57.5 67.5 60 64 Q62.5 67.5 65 64" fill="none" stroke="${LINE}" stroke-width="1.8" stroke-linecap="round"/>`;
    }
    if (a.whiskers) s += `<path d="M28 60 L38 61 M28 66 L38 65 M92 60 L82 61 M92 66 L82 65" stroke="${LINE}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
    if (a.horn) s += `<path d="M54 24 L60 -2 L66 24 Z" fill="${a.horn}" ${O}/><path d="M57 16 L63 14 M58 9 L62 8" stroke="${LINE}" stroke-width="1.4"/>`;
    if (a.horns) {
      s += `<path d="M42 28 L40 10 L50 26 Z M78 28 L80 10 L70 26 Z" fill="${a.horns}" ${O}/>`;
      s += `<path d="M55 36 L60 22 L65 36 Z" fill="${a.horns}" ${O}/>`;
    }
    return s;
  }

  // 동물 하나를 SVG 문자열로
  function drawAnimal(id) {
    const a = ART[id];
    if (!a) return null;
    return `<svg class="art" viewBox="0 -8 120 134" xmlns="http://www.w3.org/2000/svg">` +
      `<g class="tail">${tail(a)}</g><g class="torso">${body(a)}</g><g class="head">${head(a)}</g></svg>`;
  }

  window.ANIMAL_ART = { drawAnimal, has: (id) => !!ART[id] };
})();
