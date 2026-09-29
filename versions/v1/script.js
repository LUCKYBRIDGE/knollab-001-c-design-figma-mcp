const drinks = [
  { id: 'americano', name: '아메리카노', price: 3500, color: '#b56f3a', temps: ['hot', 'ice'] },
  { id: 'latte', name: '카페라떼', price: 4200, color: '#c69a6a', temps: ['hot', 'ice'] },
  { id: 'vanilla', name: '바닐라 라떼', price: 4700, color: '#d9b777', temps: ['hot', 'ice'] },
  { id: 'green-tea', name: '녹차 라떼', price: 4500, color: '#7fa36b', temps: ['hot', 'ice'] },
  { id: 'iced-tea', name: '아이스티', price: 3800, color: '#d48a58', temps: ['ice'] },
  { id: 'chocolate', name: '초콜릿', price: 4500, color: '#8b5e4d', temps: ['hot', 'ice'] }
];

const optionSteps = [
  { key: 'temp', title: '따뜻하게 드릴까요, 차갑게 드릴까요?', short: '온도' },
  { key: 'size', title: '어떤 크기로 드릴까요?', short: '크기' },
  { key: 'place', title: '어디에서 마실까요?', short: '마실 곳' }
];

const state = {
  stage: 'start',
  drinkId: null,
  temp: null,
  size: null,
  place: null,
  optionStep: 0,
  announcement: ''
};

const app = document.querySelector('#app');
const liveRegion = document.querySelector('#live-region');

const money = value => `${value.toLocaleString('ko-KR')}원`;
const drink = () => drinks.find(item => item.id === state.drinkId) || null;
const totalPrice = () => (drink()?.price || 0) + (state.size === 'large' ? 500 : 0);
const tempLabel = value => value === 'hot' ? '따뜻하게 (HOT)' : '차갑게 (ICE)';
const sizeLabel = value => value === 'large' ? '라지' : '레귤러';
const placeLabel = value => value === 'takeout' ? '가지고 갈게요' : '매장에서 마실게요';

function announce(message) {
  state.announcement = message;
  liveRegion.textContent = '';
  requestAnimationFrame(() => { liveRegion.textContent = message; });
}

function resetState() {
  state.stage = 'start';
  state.drinkId = null;
  state.temp = null;
  state.size = null;
  state.place = null;
  state.optionStep = 0;
  state.announcement = '';
}

function progressMarkup(current) {
  const labels = ['음료', '옵션', '확인', '완료'];
  return `<nav class="progress" aria-label="주문 진행 단계">
    ${labels.map((label, index) => {
      const number = index + 1;
      const status = number < current ? 'complete' : number === current ? 'current' : 'upcoming';
      const marker = status === 'complete' ? '✓' : number;
      const stateText = status === 'current' ? ', 현재 단계' : status === 'complete' ? ', 완료' : '';
      return `<div class="progress-step ${status}" aria-label="${number}단계 ${label}${stateText}">
        <span class="step-circle" aria-hidden="true">${marker}</span><span>${label}</span>
      </div>`;
    }).join('')}
  </nav>`;
}

function summaryMarkup({ compact = false } = {}) {
  const item = drink();
  if (!item) return '';
  const rows = [];
  if (state.temp) rows.push(['온도', tempLabel(state.temp)]);
  if (state.size) rows.push(['크기', sizeLabel(state.size)]);
  if (state.place) rows.push(['마실 곳', placeLabel(state.place)]);
  return `<aside class="screen-card summary-panel" aria-label="현재 선택 내용">
    <h2>내가 고른 것</h2>
    <div class="summary-drink">
      <span class="mini-drink-dot" style="--drink-color:${item.color}" aria-hidden="true"></span>
      <div><strong>${item.name}</strong><br><span>${money(totalPrice())}</span></div>
    </div>
    ${rows.length ? `<ul class="summary-list">${rows.map(([key, value]) => `<li><span>${key}</span><strong>${value}</strong></li>`).join('')}</ul>` : `<p class="lead">옵션을 하나씩 골라 주세요.</p>`}
    ${compact ? '' : `<button class="link-button" type="button" data-action="change-drink">음료 바꾸기</button>`}
  </aside>`;
}

function renderStart() {
  return `<section class="start-screen" aria-labelledby="page-title">
    <div class="screen-card start-panel">
      <div>
        <p class="eyebrow">실제 카페처럼 연습해요</p>
        <h1 id="page-title" tabindex="-1">카페에서 음료 주문을 연습해 볼까요?</h1>
        <p class="lead">음료를 고르고, 옵션을 선택하고, 주문 내용을 확인해요. 잘못 골라도 언제든 바꿀 수 있어요.</p>
        <div class="start-actions">
          <button class="btn btn-primary btn-wide" type="button" data-action="start">연습 시작하기</button>
          <span class="start-tip">한 번에 하나씩 천천히 진행해요.</span>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="cup hero-cup" style="--drink-color: var(--color-action-primary)"></div>
      </div>
    </div>
  </section>`;
}

function renderDrink() {
  const selected = drink();
  return `${progressMarkup(1)}
    <section class="screen-card main-card" aria-labelledby="page-title">
      <div class="screen-head">
        <p class="eyebrow">1단계 · 음료</p>
        <h1 id="page-title" tabindex="-1">어떤 음료를 마실까요?</h1>
        <p class="lead">마시고 싶은 음료 하나를 눌러 주세요.</p>
        <p class="feedback-line">${selected ? `${selected.name}를 골랐어요.` : '음료를 하나 고르면 다음으로 갈 수 있어요.'}</p>
      </div>
      <div class="drink-grid" role="group" aria-label="음료 메뉴">
        ${drinks.map(item => {
          const isSelected = item.id === state.drinkId;
          return `<button class="drink-card ${isSelected ? 'selected' : ''}" type="button" data-action="select-drink" data-id="${item.id}" aria-pressed="${isSelected}" style="--drink-color:${item.color}">
            ${isSelected ? '<span class="selected-badge">✓ 선택됨</span>' : ''}
            <span class="drink-visual" aria-hidden="true"><span class="cup"></span></span>
            <span class="drink-name">${item.name}</span>
            <span class="drink-price">${money(item.price)}</span>
          </button>`;
        }).join('')}
      </div>
    </section>
    <div class="action-bar">
      <div class="action-summary">${selected ? `<strong>${selected.name}</strong><span>선택한 음료</span>` : `<strong>아직 고르지 않았어요</strong><span>위에서 음료 하나를 눌러 주세요</span>`}</div>
      <div class="action-buttons"><button class="btn btn-primary btn-wide" type="button" data-action="drink-next" ${selected ? '' : 'disabled'}>다음으로</button></div>
    </div>`;
}

function tempChoices(item) {
  if (item.temps.length === 1) {
    return `<div class="option-list"><button class="option-choice selected" type="button" data-action="select-option" data-key="temp" data-value="ice" aria-pressed="true">차갑게 (ICE)<span class="option-note">이 음료는 차갑게 주문해요.</span></button></div>`;
  }
  return `<div class="option-list">
    ${[['hot','따뜻하게 (HOT)','따뜻한 음료로 주문해요.'],['ice','차갑게 (ICE)','얼음이 들어간 음료로 주문해요.']].map(([value,label,note]) => `<button class="option-choice ${state.temp === value ? 'selected' : ''}" type="button" data-action="select-option" data-key="temp" data-value="${value}" aria-pressed="${state.temp === value}">${label}<span class="option-note">${note}</span></button>`).join('')}
  </div>`;
}

function sizeChoices() {
  return `<div class="option-list">
    ${[['regular','레귤러','기본 크기'],['large','라지','조금 더 큰 크기 · +500원']].map(([value,label,note]) => `<button class="option-choice ${state.size === value ? 'selected' : ''}" type="button" data-action="select-option" data-key="size" data-value="${value}" aria-pressed="${state.size === value}">${label}<span class="option-note">${note}</span></button>`).join('')}
  </div>`;
}

function placeChoices() {
  return `<div class="option-list">
    ${[['dinein','매장에서 마실게요','카페 안에서 마셔요.'],['takeout','가지고 갈게요','포장해서 가져가요.']].map(([value,label,note]) => `<button class="option-choice ${state.place === value ? 'selected' : ''}" type="button" data-action="select-option" data-key="place" data-value="${value}" aria-pressed="${state.place === value}">${label}<span class="option-note">${note}</span></button>`).join('')}
  </div>`;
}

function currentOptionValue() {
  return state[optionSteps[state.optionStep].key];
}

function renderOptions() {
  const item = drink();
  const step = optionSteps[state.optionStep];
  let choices = '';
  if (step.key === 'temp') choices = tempChoices(item);
  if (step.key === 'size') choices = sizeChoices();
  if (step.key === 'place') choices = placeChoices();
  const nextLabel = state.optionStep === optionSteps.length - 1 ? '주문 확인하기' : '다음으로';
  return `${progressMarkup(2)}
    <div class="option-layout">
      <section class="screen-card option-card" aria-labelledby="page-title">
        <span class="option-substep">옵션 ${state.optionStep + 1} / ${optionSteps.length}</span>
        <p class="eyebrow">2단계 · 옵션</p>
        <h1 id="page-title" tabindex="-1">${step.title}</h1>
        <p class="lead">하나를 눌러 주세요. 선택한 내용은 다시 바꿀 수 있어요.</p>
        ${choices}
        <div class="action-bar">
          <div class="action-summary"><strong>${currentOptionValue() ? '선택했어요' : '하나를 골라 주세요'}</strong><span>${step.short} 선택</span></div>
          <div class="action-buttons">
            <button class="btn btn-secondary" type="button" data-action="option-back">이전으로</button>
            <button class="btn btn-primary btn-wide" type="button" data-action="option-next" ${currentOptionValue() ? '' : 'disabled'}>${nextLabel}</button>
          </div>
        </div>
      </section>
      ${summaryMarkup()}
    </div>`;
}

function orderSentence() {
  const item = drink();
  if (!item || !state.temp || !state.size || !state.place) return '';
  const temp = state.temp === 'ice' ? '아이스' : '따뜻한';
  const place = state.place === 'takeout' ? '가지고 갈게요' : '매장에서 마실게요';
  return `${temp} ${item.name} ${sizeLabel(state.size)} 사이즈, ${place}.`;
}

function renderReview() {
  const item = drink();
  return `${progressMarkup(3)}
    <div class="review-layout">
      <section class="screen-card review-card" aria-labelledby="page-title">
        <p class="eyebrow">3단계 · 확인</p>
        <h1 id="page-title" tabindex="-1">주문할 내용이 맞나요?</h1>
        <p class="lead">천천히 보고, 다르면 바꿔 주세요.</p>
        <div class="order-item">
          <span class="mini-drink-dot" style="--drink-color:${item.color}" aria-hidden="true"></span>
          <div class="order-main"><strong>${item.name}</strong><span>음료 1잔</span></div>
          <span class="order-price">${money(totalPrice())}</span>
        </div>
        <div class="review-options">
          <div class="review-option"><span>온도</span><strong>${tempLabel(state.temp)}</strong></div>
          <div class="review-option"><span>크기</span><strong>${sizeLabel(state.size)}</strong></div>
          <div class="review-option"><span>마실 곳</span><strong>${placeLabel(state.place)}</strong></div>
        </div>
        <div class="practice-sentence">
          <span class="label">직원에게 이렇게 말해 볼 수 있어요</span>
          <p>“${orderSentence()}”</p>
        </div>
        <div class="edit-row">
          <button class="btn btn-tertiary" type="button" data-action="change-drink">음료 바꾸기</button>
          <button class="btn btn-tertiary" type="button" data-action="change-options">옵션 바꾸기</button>
        </div>
      </section>
      <aside class="screen-card total-panel" aria-label="주문 합계">
        <div class="total-line"><span>총 금액</span><strong>${money(totalPrice())}</strong></div>
        <button class="btn btn-primary" type="button" data-action="complete-order">이대로 주문할게요</button>
        <button class="link-button" type="button" data-action="review-back">이전으로</button>
      </aside>
    </div>`;
}

function renderComplete() {
  return `${progressMarkup(4)}
    <section class="complete-screen" aria-labelledby="page-title">
      <div class="screen-card complete-card">
        <div class="complete-check" aria-hidden="true">✓</div>
        <p class="eyebrow">4단계 · 완료</p>
        <h1 id="page-title" tabindex="-1">주문 연습을 마쳤어요!</h1>
        <p class="lead">음료를 고르고 주문 내용을 확인하는 과정을 끝까지 해냈어요.</p>
        <div class="practice-sentence">
          <span class="label">내가 연습한 주문 문장</span>
          <p>“${orderSentence()}”</p>
        </div>
        <div class="complete-actions">
          <button class="btn btn-primary btn-wide" type="button" data-action="restart">다시 연습하기</button>
        </div>
      </div>
    </section>`;
}

function render({ focusTitle = true, focusSelector = null } = {}) {
  if (state.stage === 'start') app.innerHTML = renderStart();
  if (state.stage === 'drink') app.innerHTML = renderDrink();
  if (state.stage === 'options') app.innerHTML = renderOptions();
  if (state.stage === 'review') app.innerHTML = renderReview();
  if (state.stage === 'complete') app.innerHTML = renderComplete();

  requestAnimationFrame(() => {
    if (focusSelector) {
      const target = app.querySelector(focusSelector);
      if (target) target.focus();
    } else if (focusTitle) {
      app.querySelector('#page-title')?.focus();
    }
  });
}

function startPractice() {
  state.stage = 'drink';
  announce('음료를 고르는 1단계를 시작합니다.');
  render();
}

function chooseDrink(id) {
  const nextDrink = drinks.find(item => item.id === id);
  if (!nextDrink) return;
  state.drinkId = id;
  if (!nextDrink.temps.includes(state.temp)) state.temp = nextDrink.temps.length === 1 ? nextDrink.temps[0] : null;
  announce(`${nextDrink.name}를 선택했습니다.`);
  render({ focusTitle: false, focusSelector: `[data-action="select-drink"][data-id="${id}"]` });
}

function setOption(key, value) {
  if (!['temp','size','place'].includes(key)) return;
  state[key] = value;
  const readable = key === 'temp' ? tempLabel(value) : key === 'size' ? sizeLabel(value) : placeLabel(value);
  announce(`${readable}를 선택했습니다.`);
  render({ focusTitle: false, focusSelector: `[data-action="select-option"][data-key="${key}"][data-value="${value}"]` });
}

app.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'start') return startPractice();
  if (action === 'select-drink') return chooseDrink(button.dataset.id);
  if (action === 'drink-next' && state.drinkId) {
    state.stage = 'options'; state.optionStep = 0;
    const item = drink();
    if (item.temps.length === 1) state.temp = item.temps[0];
    announce('옵션을 고르는 2단계입니다.');
    return render();
  }
  if (action === 'select-option') return setOption(button.dataset.key, button.dataset.value);
  if (action === 'option-back') {
    if (state.optionStep > 0) state.optionStep -= 1;
    else state.stage = 'drink';
    announce('이전 선택으로 돌아갑니다.');
    return render();
  }
  if (action === 'option-next' && currentOptionValue()) {
    if (state.optionStep < optionSteps.length - 1) {
      state.optionStep += 1;
      announce(`${optionSteps[state.optionStep].short}를 고르는 단계입니다.`);
    } else {
      state.stage = 'review';
      announce('주문 내용을 확인하는 3단계입니다.');
    }
    return render();
  }
  if (action === 'change-drink') {
    state.stage = 'drink';
    announce('음료를 다시 고를 수 있습니다. 이전 옵션은 가능한 범위에서 그대로 남아 있습니다.');
    return render();
  }
  if (action === 'change-options') {
    state.stage = 'options'; state.optionStep = 0;
    announce('옵션을 처음부터 다시 확인하며 바꿀 수 있습니다.');
    return render();
  }
  if (action === 'review-back') {
    state.stage = 'options'; state.optionStep = 2;
    announce('바로 전 옵션으로 돌아갑니다.');
    return render();
  }
  if (action === 'complete-order') {
    state.stage = 'complete';
    announce('주문 연습이 완료되었습니다.');
    return render();
  }
  if (action === 'restart') {
    resetState();
    announce('새 주문 연습을 시작할 수 있습니다.');
    return render();
  }
});

document.querySelector('.brand').addEventListener('click', event => {
  event.preventDefault();
  if (state.stage === 'start') return;
  resetState();
  announce('처음 화면으로 돌아왔습니다.');
  render();
});

render();
