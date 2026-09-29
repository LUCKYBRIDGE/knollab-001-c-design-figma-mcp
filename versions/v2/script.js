const drinks = [
  { id: 'americano', name: '아메리카노', price: 3500, color: '#b56f3a', temps: ['hot', 'ice'] },
  { id: 'latte', name: '카페라떼', price: 4200, color: '#c69a6a', temps: ['hot', 'ice'] },
  { id: 'vanilla', name: '바닐라 라떼', price: 4700, color: '#d9b777', temps: ['hot', 'ice'] },
  { id: 'green-tea', name: '녹차 라떼', price: 4500, color: '#7fa36b', temps: ['hot', 'ice'] },
  { id: 'iced-tea', name: '아이스티', price: 3800, color: '#d48a58', temps: ['ice'] },
  { id: 'chocolate', name: '초콜릿', price: 4500, color: '#8b5e4d', temps: ['hot', 'ice'] }
];

const optionSteps = [
  { key: 'temp', title: '따뜻하게 마실까요, 차갑게 마실까요?', short: '온도' },
  { key: 'size', title: '어떤 크기로 주문할까요?', short: '크기' }
];

const state = {
  stage: 'start',
  drinkId: null,
  temp: null,
  size: null,
  place: null,
  optionStep: 0
};

const app = document.querySelector('#app');
const liveRegion = document.querySelector('#live-region');

const money = value => `${value.toLocaleString('ko-KR')}원`;
const drink = () => drinks.find(item => item.id === state.drinkId) || null;
const totalPrice = () => (drink()?.price || 0) + (state.size === 'large' ? 500 : 0);
const tempLabel = value => value === 'hot' ? '따뜻하게 (HOT)' : '차갑게 (ICE)';
const sizeLabel = value => value === 'large' ? '라지' : '레귤러';
const placeLabel = value => value === 'takeout' ? '포장해서 가져가기' : '매장에서 마시기';

function announce(message) {
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
}

function progressMarkup(current) {
  const labels = ['음료', '추가 선택', '매장·포장', '확인', '완료'];
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

function taskCue(text) {
  return `<div class="task-cue"><span aria-hidden="true">→</span><strong>${text}</strong></div>`;
}

function summaryMarkup(nextText = '') {
  const item = drink();
  if (!item) return '';
  const rows = [
    ['온도', state.temp ? tempLabel(state.temp) : '아직 선택하지 않았어요'],
    ['크기', state.size ? sizeLabel(state.size) : '아직 선택하지 않았어요'],
    ['매장·포장', state.place ? placeLabel(state.place) : '아직 선택하지 않았어요']
  ];
  return `<aside class="screen-card summary-panel" aria-label="현재 주문 내용">
    <div class="summary-title-row">
      <h2>현재 주문</h2>
      <span class="summary-count">1잔</span>
    </div>
    <div class="summary-drink">
      <span class="mini-drink-dot" style="--drink-color:${item.color}" aria-hidden="true"></span>
      <div><strong>${item.name}</strong><br><span>${money(totalPrice())}</span></div>
    </div>
    <ul class="summary-list">
      ${rows.map(([key, value]) => `<li class="${value.startsWith('아직') ? 'pending' : ''}"><span>${key}</span><strong>${value}</strong></li>`).join('')}
    </ul>
    ${nextText ? `<p class="summary-next"><span>다음</span><strong>${nextText}</strong></p>` : ''}
  </aside>`;
}

function renderStart() {
  return `<section class="start-screen" aria-labelledby="page-title">
    <div class="screen-card start-panel">
      <div>
        <p class="eyebrow">실제 카페처럼 한 단계씩</p>
        <h1 id="page-title" tabindex="-1">카페 주문을 연습해 볼까요?</h1>
        <p class="lead">고르고, 확인하고, 필요하면 바로 바꿀 수 있어요.</p>
        <ol class="start-route" aria-label="연습 순서">
          <li><strong>1</strong><span>음료 고르기</span></li>
          <li><strong>2</strong><span>온도·크기 고르기</span></li>
          <li><strong>3</strong><span>매장·포장 고르기</span></li>
          <li><strong>4</strong><span>확인하고 주문하기</span></li>
        </ol>
        <div class="start-actions">
          <button class="btn btn-primary btn-wide" type="button" data-action="start">연습 시작하기</button>
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
        <p class="eyebrow">1단계 · 음료 선택</p>
        <h1 id="page-title" tabindex="-1">어떤 음료를 마실까요?</h1>
        <p class="lead">마시고 싶은 음료 하나를 눌러 주세요.</p>
        ${taskCue(selected ? `${selected.name}를 골랐어요. 아래의 ‘다음으로’ 버튼을 눌러요.` : '음료 하나를 골라요.')}
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
    return `<div class="option-list">
      <button class="option-choice selected" type="button" data-action="select-option" data-key="temp" data-value="ice" aria-pressed="true">
        차갑게 (ICE)<span class="option-note">이 음료는 차갑게 주문해요.</span>
      </button>
    </div>`;
  }
  return `<div class="option-list">
    ${[
      ['hot', '따뜻하게 (HOT)', '따뜻한 음료로 주문해요.'],
      ['ice', '차갑게 (ICE)', '얼음이 들어간 음료로 주문해요.']
    ].map(([value, label, note]) => `<button class="option-choice ${state.temp === value ? 'selected' : ''}" type="button" data-action="select-option" data-key="temp" data-value="${value}" aria-pressed="${state.temp === value}">
      ${label}<span class="option-note">${note}</span>
    </button>`).join('')}
  </div>`;
}

function sizeChoices() {
  return `<div class="option-list">
    ${[
      ['regular', '레귤러', '기본 크기'],
      ['large', '라지', '조금 더 큰 크기 · +500원']
    ].map(([value, label, note]) => `<button class="option-choice ${state.size === value ? 'selected' : ''}" type="button" data-action="select-option" data-key="size" data-value="${value}" aria-pressed="${state.size === value}">
      ${label}<span class="option-note">${note}</span>
    </button>`).join('')}
  </div>`;
}

function currentOptionValue() {
  return state[optionSteps[state.optionStep].key];
}

function renderOptions() {
  const item = drink();
  const step = optionSteps[state.optionStep];
  const choices = step.key === 'temp' ? tempChoices(item) : sizeChoices();
  const nextLabel = state.optionStep === optionSteps.length - 1 ? '매장·포장 고르기' : '다음으로';
  return `${progressMarkup(2)}
    <div class="option-layout">
      <section class="screen-card option-card" aria-labelledby="page-title">
        <span class="option-substep">추가 선택 ${state.optionStep + 1} / ${optionSteps.length}</span>
        <p class="eyebrow">2단계 · 추가 선택</p>
        <h1 id="page-title" tabindex="-1">${step.title}</h1>
        <p class="lead">하나를 눌러 주세요. 고른 뒤에도 다시 바꿀 수 있어요.</p>
        ${choices}
        ${taskCue(currentOptionValue() ? `${step.short}를 골랐어요. 다음으로 가도 돼요.` : `${step.short}를 하나 골라요.`)}
        <div class="action-bar">
          <div class="action-summary"><strong>${currentOptionValue() ? '선택했어요' : '하나를 골라 주세요'}</strong><span>${step.short} 선택</span></div>
          <div class="action-buttons">
            <button class="btn btn-secondary" type="button" data-action="option-back">이전으로</button>
            <button class="btn btn-primary btn-wide" type="button" data-action="option-next" ${currentOptionValue() ? '' : 'disabled'}>${nextLabel}</button>
          </div>
        </div>
      </section>
      ${summaryMarkup(state.optionStep === 0 ? '크기 고르기' : '매장·포장 고르기')}
    </div>`;
}

function renderPlace() {
  return `${progressMarkup(3)}
    <div class="option-layout">
      <section class="screen-card option-card" aria-labelledby="page-title">
        <p class="eyebrow">3단계 · 매장·포장</p>
        <h1 id="page-title" tabindex="-1">어디에서 마실까요?</h1>
        <p class="lead">실제 카페처럼 매장에서 마실지, 포장할지 골라요.</p>
        <div class="option-list place-list" role="group" aria-label="매장 또는 포장 선택">
          ${[
            ['dinein', '매장에서 마실게요', '카페 안에서 마셔요.'],
            ['takeout', '포장해서 가져갈게요', '음료를 가지고 나가요.']
          ].map(([value, label, note]) => `<button class="option-choice ${state.place === value ? 'selected' : ''}" type="button" data-action="select-place" data-value="${value}" aria-pressed="${state.place === value}">
            ${label}<span class="option-note">${note}</span>
          </button>`).join('')}
        </div>
        ${taskCue(state.place ? `${placeLabel(state.place)}를 골랐어요. 주문 내용을 확인해요.` : '매장 또는 포장 중 하나를 골라요.')}
        <div class="action-bar">
          <div class="action-summary"><strong>${state.place ? '선택했어요' : '하나를 골라 주세요'}</strong><span>매장·포장 선택</span></div>
          <div class="action-buttons">
            <button class="btn btn-secondary" type="button" data-action="place-back">이전으로</button>
            <button class="btn btn-primary btn-wide" type="button" data-action="place-next" ${state.place ? '' : 'disabled'}>주문 확인하기</button>
          </div>
        </div>
      </section>
      ${summaryMarkup('주문 내용 확인하기')}
    </div>`;
}

function orderSentence() {
  const item = drink();
  if (!item || !state.temp || !state.size || !state.place) return '';
  const temp = state.temp === 'ice' ? '아이스' : '따뜻한';
  const place = state.place === 'takeout' ? '포장해 주세요' : '매장에서 마실게요';
  return `${temp} ${item.name} ${sizeLabel(state.size)} 사이즈로 주세요. ${place}.`;
}

function canReview() {
  return Boolean(drink() && state.temp && state.size && state.place);
}

function reviewDetail(label, value, key) {
  return `<div class="review-detail-row">
    <div><span>${label}</span><strong>${value}</strong></div>
    <button class="small-edit" type="button" data-action="edit-field" data-key="${key}" aria-label="${label} 바꾸기">바꾸기</button>
  </div>`;
}

function renderReview() {
  const item = drink();
  return `${progressMarkup(4)}
    <div class="review-layout">
      <section class="screen-card review-card" aria-labelledby="page-title">
        <p class="eyebrow">4단계 · 주문 확인</p>
        <h1 id="page-title" tabindex="-1">주문할 내용이 맞나요?</h1>
        <p class="lead">다르면 옆의 ‘바꾸기’를 눌러 바로 고칠 수 있어요.</p>
        <div class="order-item">
          <span class="mini-drink-dot" style="--drink-color:${item.color}" aria-hidden="true"></span>
          <div class="order-main"><strong>${item.name}</strong><span>음료 1잔</span></div>
          <button class="small-edit" type="button" data-action="edit-field" data-key="drink" aria-label="음료 바꾸기">바꾸기</button>
        </div>
        <div class="review-detail-list" aria-label="주문 세부 내용">
          ${reviewDetail('온도', tempLabel(state.temp), 'temp')}
          ${reviewDetail('크기', sizeLabel(state.size), 'size')}
          ${reviewDetail('매장·포장', placeLabel(state.place), 'place')}
        </div>
        <div class="practice-sentence">
          <span class="label">직원에게 이렇게 말해 볼 수 있어요</span>
          <p>“${orderSentence()}”</p>
        </div>
        ${taskCue('모두 맞으면 ‘이대로 주문할게요’를 눌러요.')}
      </section>
      <aside class="screen-card total-panel" aria-label="주문 합계">
        <span class="total-kicker">최종 확인</span>
        <div class="total-line"><span>총 금액</span><strong>${money(totalPrice())}</strong></div>
        <button class="btn btn-primary" type="button" data-action="complete-order">이대로 주문할게요</button>
        <button class="btn btn-secondary" type="button" data-action="review-back">이전으로</button>
      </aside>
    </div>`;
}

function renderComplete() {
  const item = drink();
  return `${progressMarkup(5)}
    <section class="complete-screen" aria-labelledby="page-title">
      <div class="screen-card complete-card">
        <div class="complete-check" aria-hidden="true">✓</div>
        <p class="eyebrow">5단계 · 완료</p>
        <h1 id="page-title" tabindex="-1">주문 연습을 마쳤어요!</h1>
        <p class="lead">주문이 완료되었어요. 내가 주문한 내용을 다시 볼 수 있어요.</p>
        <div class="complete-order">
          <strong>${item.name} · ${sizeLabel(state.size)}</strong>
          <span>${tempLabel(state.temp)} · ${placeLabel(state.place)}</span>
          <span>${money(totalPrice())}</span>
        </div>
        <div class="practice-sentence">
          <span class="label">내가 연습한 주문 문장</span>
          <p>“${orderSentence()}”</p>
        </div>
        <div class="complete-actions">
          <button class="btn btn-primary btn-wide" type="button" data-action="restart">새 주문 연습하기</button>
        </div>
      </div>
    </section>`;
}

function render({ focusTitle = true, focusSelector = null } = {}) {
  if (state.stage === 'start') app.innerHTML = renderStart();
  if (state.stage === 'drink') app.innerHTML = renderDrink();
  if (state.stage === 'options') app.innerHTML = renderOptions();
  if (state.stage === 'place') app.innerHTML = renderPlace();
  if (state.stage === 'review') app.innerHTML = renderReview();
  if (state.stage === 'complete') app.innerHTML = renderComplete();

  requestAnimationFrame(() => {
    if (focusSelector) {
      app.querySelector(focusSelector)?.focus();
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
  if (!nextDrink.temps.includes(state.temp)) {
    state.temp = nextDrink.temps.length === 1 ? nextDrink.temps[0] : null;
  }
  announce(`${nextDrink.name}를 선택했습니다.`);
  render({ focusTitle: false, focusSelector: `[data-action="select-drink"][data-id="${id}"]` });
}

function setOption(key, value) {
  if (!['temp', 'size'].includes(key)) return;
  if (key === 'temp' && !drink()?.temps.includes(value)) return;
  state[key] = value;
  const readable = key === 'temp' ? tempLabel(value) : sizeLabel(value);
  announce(`${readable}를 선택했습니다.`);
  render({ focusTitle: false, focusSelector: `[data-action="select-option"][data-key="${key}"][data-value="${value}"]` });
}

function setPlace(value) {
  if (!['dinein', 'takeout'].includes(value)) return;
  state.place = value;
  announce(`${placeLabel(value)}를 선택했습니다.`);
  render({ focusTitle: false, focusSelector: `[data-action="select-place"][data-value="${value}"]` });
}

function goToEditField(key) {
  if (key === 'drink') state.stage = 'drink';
  if (key === 'temp') { state.stage = 'options'; state.optionStep = 0; }
  if (key === 'size') { state.stage = 'options'; state.optionStep = 1; }
  if (key === 'place') state.stage = 'place';
  announce(`${key === 'drink' ? '음료' : key === 'temp' ? '온도' : key === 'size' ? '크기' : '매장·포장'}를 다시 선택할 수 있습니다.`);
  render();
}

app.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'start') return startPractice();
  if (action === 'select-drink') return chooseDrink(button.dataset.id);

  if (action === 'drink-next' && state.drinkId) {
    state.stage = 'options';
    state.optionStep = 0;
    const item = drink();
    if (item.temps.length === 1) state.temp = item.temps[0];
    announce('온도와 크기를 고르는 2단계입니다.');
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
      announce('크기를 고르는 단계입니다.');
    } else {
      state.stage = 'place';
      announce('매장 또는 포장을 고르는 3단계입니다.');
    }
    return render();
  }

  if (action === 'select-place') return setPlace(button.dataset.value);

  if (action === 'place-back') {
    state.stage = 'options';
    state.optionStep = 1;
    announce('크기 선택으로 돌아갑니다.');
    return render();
  }

  if (action === 'place-next' && state.place) {
    state.stage = 'review';
    announce('주문 내용을 확인하는 4단계입니다.');
    return render();
  }

  if (action === 'edit-field') return goToEditField(button.dataset.key);

  if (action === 'review-back') {
    state.stage = 'place';
    announce('매장 또는 포장 선택으로 돌아갑니다.');
    return render();
  }

  if (action === 'complete-order' && canReview()) {
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

render();
