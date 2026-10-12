// 게임 설정 파일: 이름, 동물, 확률, 가격처럼 자주 바꿀 값은 모두 여기에 있어요.
// 이 파일만 고치면 게임에 바로 반영됩니다.
window.GAME_CONFIG = {
  // 게임 이름
  name: '나만의 야생동물',

  // 플레이어를 부르는 말 (플레이어 역할: 동물들의 주인)
  playerTitle: '주인님',

  // 처음 시작할 때 주는 코인과 동물
  startCoins: 200,
  starterAnimal: 'dog',

  // 알 가격과 천장(이 횟수 동안 영웅 이상이 안 나오면 다음 알은 영웅 이상 확정)
  eggPrice: 100,
  pityCount: 50,
  pityMinTier: 'hero',

  // 둥지: 알을 사면 둥지에 들어가고, 시간이 지나야 깰 수 있어요.
  nestSlots: 2,
  hatchSpeed: 1,  // 1이면 정상 속도. 테스트할 때 60으로 하면 60배 빨라져요.

  // 하루 한 번 무료 알, 연속 출석 보상
  dailyEgg: true,
  streakDays: 7,          // 이 날수만큼 연속이면 보너스 알
  streakMinTier: 'rare',  // 보너스 알의 최소 등급

  // 성장 단계: 친밀도가 min 이상이면 해당 단계, scale은 크기 배율
  growth: [
    { id: 'baby',  name: '아기',   min: 0,   scale: 0.75 },
    { id: 'child', name: '어린이', min: 30,  scale: 0.95 },
    { id: 'adult', name: '어른',   min: 100, scale: 1.15 },
  ],

  // 코인 얻기
  petCoins: 2,          // 쓰다듬기 한 번
  petCooldownMs: 1200,  // 같은 동물을 다시 쓰다듬어 코인을 받기까지
  feedCoins: 5,         // 밥 줄 때 동물 한 마리당
  feedCooldownMs: 30000,
  giftEveryMs: 15000,   // 동물이 선물(코인)을 물어오는 간격
  giftCoins: [10, 25],  // 선물 코인 최소, 최대
  offlineCoinsPerMin: 2,  // 게임을 닫아둔 동안 동물 한 마리가 모으는 코인(분당)
  offlineMaxMin: 480,     // 최대 8시간까지만 쌓임

  // 등급: 확률(%) 합계는 100, taps는 알을 깨는 데 필요한 탭 수, dupCoins는 중복일 때 돌려주는 코인
  tiers: [
    { id: 'common',    name: '흔함', rate: 50,  color: '#ffffff', glow: '#d9d4c7', hatchMin: 5, taps: 4,  dupCoins: 30 },
    { id: 'uncommon',  name: '보통', rate: 28,  color: '#ffe3a8', glow: '#e8b85c', hatchMin: 30, taps: 5,  dupCoins: 40 },
    { id: 'rare',      name: '희귀', rate: 14,  color: '#9fd3ff', glow: '#3a9bff', hatchMin: 120, taps: 6,  dupCoins: 60 },
    { id: 'hero',      name: '영웅', rate: 6,   color: '#c9a6ff', glow: '#8a4dff', hatchMin: 240, taps: 8,  dupCoins: 90 },
    { id: 'legend',    name: '전설', rate: 1.8, color: '#ffd84d', glow: '#ff9d00', hatchMin: 360, taps: 10, dupCoins: 150 },
    { id: 'myth',      name: '신화', rate: 0.2, color: '#ffb3e6', glow: 'rainbow', hatchMin: 480, taps: 12, dupCoins: 300 },
  ],

  // MVP 동물 12종 (등급마다 2종). 그림은 임시로 이모지를 씁니다.
  // 나중에 그림 파일이 생기면 emoji 대신 image: 'images/dog.png' 를 넣으면 됩니다.
  animals: [
    { id: 'dog',       name: '강아지',       emoji: '🐶', tier: 'common' },
    { id: 'cat',       name: '고양이',       emoji: '🐱', tier: 'common' },
    { id: 'otter',     name: '수달',         emoji: '🦦', tier: 'uncommon' },
    { id: 'penguin',   name: '펭귄',         emoji: '🐧', tier: 'uncommon' },
    { id: 'panda',     name: '판다',         emoji: '🐼', tier: 'rare' },
    { id: 'fox',       name: '여우',         emoji: '🦊', tier: 'rare' },
    { id: 'tiger',     name: '호랑이',       emoji: '🐯', tier: 'hero' },
    { id: 'elephant',  name: '코끼리',       emoji: '🐘', tier: 'hero' },
    { id: 'trex',      name: '티라노',       emoji: '🦖', tier: 'legend' },
    { id: 'triceratops', name: '트리케라톱스', emoji: '🦕', tier: 'legend' },
    { id: 'unicorn',   name: '유니콘',       emoji: '🦄', tier: 'myth' },
    { id: 'phoenix',   name: '봉황',         emoji: '🐦‍🔥', tier: 'myth' },
  ],
};
