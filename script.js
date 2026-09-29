(() => {
  'use strict';

  const drinks = [
    {
      id: 'americano',
      name: '아메리카노',
      description: '깔끔한 커피',
      price: 3000,
      color: '#654532',
      accent: '#40291f',
      allowedTemps: ['hot', 'ice']
    },
    {
      id: 'latte',
      name: '카페라떼',
      description: '우유가 들어간 부드러운 커피',
      price: 3800,
      color: '#c99f72',
      accent: '#8c6545',
      allowedTemps: ['hot', 'ice']
    },
    {
      id: 'choco',
      name: '초코라떼',
      description: '달콤한 초코 음료',
      price: 4000,
      color: '#8a5b3e',
      accent: '#5f3b28',
      allowedTemps: ['hot', 'ice']
    },
    {
      id: 'yuja',
      name: '유자차',
      description: '상큼한 유자 향의 차',
      price: 4000,
      color: '#e7b449',
      accent: '#c17b23',
      allowedTemps: ['hot', 'ice']
    },
    {
      id: 'peachTea',
      name: '복숭아 아이스티',
      description: '시원하고 달콤한 복숭아 차',
      price: 3500,
      color: '#e9a078',
      accent: '#bd6f4e',
      allowedTemps: ['ice']
    },
    {
      id: 'strawberrySmoothie',
      name: '딸기 스무디',
      description: '딸기를 갈아 만든 차가운 음료',
      price: 4500,
      color: '#dc6f83',
      accent: '#ad415a',
      allowedTemps: ['ice']
    }
  ];

  const progressSteps = [
    { id: 1, label: '음료', detail: '마실 것을 고른다' },
    { id: 2, label: '옵션', detail: '온도와 크기를 고른다' },
    { id: 3, label: '확인', detail: '주문 내용을 확인한다' },
    { id: 4, label: '결제', detail: '결제 방법을 고른다' }
  ];

  const state = {
    step: 0,
    drinkId: null,
    temperature: null,
    size: null,
    quantity: 1,
    payment: null,
    completedOrderNumber: null
  };

  const screen = document.getElementById('screen');
  const progressRegion = document.getElementById('progressRegion');
  const progressList = document.getElementById('progressList');
  const orderSummary = document.getElementById('orderSummary');
  const practiceLayout = document.getElementById('practiceLayout');
  const restartTopButton = document.getElementById('restartTopButton');
  const liveRegion = document.getElementById('liveRegion');

  function money(value) {
    return `${value.toLocaleString('ko-KR')}원`;
  }

  function getDrink() {
    return drinks.find((drink) => drink.id === state.drinkId) || null;
  }

  function getSizePrice() {
    return state.size === 'large' ? 500 : 0;
  }

  function getTotal() {
    const drink = getDrink();
    if (!drink) return 0;
    return (drink.price + getSizePrice()) * state.quantity;
  }

  function temperatureLabel(value = state.temperature) {
    return value === 'hot' ? '따뜻하게' : value === 'ice' ? '차갑게' : '아직 선택하지 않음';
  }

  function sizeLabel(value = state.size) {
    return value === 'regular' ? '레귤러' : value === 'large' ? '라지' : '아직 선택하지 않음';
  }

  function paymentLabel(value = state.payment) {
    return value === 'card' ? '카드' : value === 'cash' ? '현금' : '아직 선택하지 않음';
  }

  function announce(message) {
    liveRegion.textContent = '';
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 30);
  }

  function drinkVisual(drink, small = false) {
    const isSmoothie = drink.id === 'strawberrySmoothie';
    const extra = drink.id === 'yuja'
      ? '<circle cx="50" cy="63" r="6" fill="#ffe47d" opacity=".95"/><circle cx="71" cy="77" r="5" fill="#ffe47d" opacity=".9"/>'
      : isSmoothie
        ? '<circle cx="50" cy="66" r="5" fill="#ffd7de" opacity=".9"/><circle cx="67" cy="78" r="4" fill="#ffd7de" opacity=".85"/>'
        : '';
    const straw = isSmoothie ? '<path d="M70 26 76 5" stroke="#2f5f4f" stroke-width="5" stroke-linecap="round"/>' : '';
    return `
      <svg viewBox="0 0 120 130" aria-hidden="true" focusable="false" class="${small ? 'is-small' : ''}">
        <ellipse cx="60" cy="112" rx="38" ry="8" fill="#1f2a25" opacity=".09"/>
        ${straw}
        <path d="M29 34h62l-7 72a8 8 0 0 1-8 7H44a8 8 0 0 1-8-7L29 34Z" fill="#f9fbfa" stroke="#c8d1cc" stroke-width="3"/>
        <path d="M35 53h50l-5 48a5 5 0 0 1-5 5H45a5 5 0 0 1-5-5L35 53Z" fill="${drink.color}"/>
        <rect x="27" y="29" width="66" height="12" rx="6" fill="#ffffff" stroke="#c8d1cc" stroke-width="3"/>
        <path d="M42 58c7-6 15 5 23-1 8-6 13 1 18 0" fill="none" stroke="${drink.accent}" stroke-width="3" opacity=".5" stroke-linecap="round"/>
        ${extra}
      </svg>`;
  }

  function cafeIllustration() {
    return `
      <svg viewBox="0 0 320 300" aria-hidden="true" focusable="false">
        <rect x="28" y="44" width="264" height="196" rx="28" fill="#ffffff"/>
        <path d="M54 97h212" stroke="#c7d7cf" stroke-width="7" stroke-linecap="round"/>
        <rect x="62" y="118" width="196" height="90" rx="20" fill="#f8f0e4"/>
        <path d="M92 208v28M228 208v28" stroke="#8a6f5f" stroke-width="8" stroke-linecap="round"/>
        <g transform="translate(119 82)">
          <path d="M8 34h70l-7 83a9 9 0 0 1-9 8H25a9 9 0 0 1-9-8L8 34Z" fill="#f8fbf9" stroke="#b9c8c0" stroke-width="4"/>
          <path d="M15 58h56l-5 52a5 5 0 0 1-5 5H26a5 5 0 0 1-5-5L15 58Z" fill="#c99f72"/>
          <rect x="5" y="28" width="76" height="13" rx="6.5" fill="#fff" stroke="#b9c8c0" stroke-width="4"/>
        </g>
        <circle cx="74" cy="74" r="17" fill="#e6f0eb"/>
        <path d="M66 75l6 6 12-14" fill="none" stroke="#2f5f4f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  function iconCheck() {
    return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function renderProgress() {
    const activeStep = Math.min(Math.max(state.step, 1), 4);
    progressList.innerHTML = progressSteps.map((item) => {
      const done = state.step > item.id;
      const current = state.step === item.id;
      return `
        <li class="progress-item ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}" ${current ? 'aria-current="step"' : ''}>
          <span class="progress-index" aria-hidden="true">${done ? '✓' : item.id}</span>
          <span class="progress-copy">
            <strong>${item.label}</strong>
            <span>${item.detail}</span>
          </span>
          <span class="sr-only">${current ? '현재 단계' : done ? '완료한 단계' : activeStep < item.id ? '아직 하지 않은 단계' : ''}</span>
        </li>`;
    }).join('');
  }

  function renderSummary() {
    const drink = getDrink();
    if (!drink || state.step === 0 || state.step === 5) {
      orderSummary.classList.add('is-hidden');
      practiceLayout.classList.remove('practice-layout--with-summary');
      practiceLayout.classList.add('practice-layout--single');
      return;
    }

    practiceLayout.classList.remove('practice-layout--single');
    practiceLayout.classList.add('practice-layout--with-summary');
    orderSummary.classList.remove('is-hidden');
    orderSummary.innerHTML = `
      <h2>내 주문</h2>
      <div class="summary-drink">
        <div class="summary-mini-visual">${drinkVisual(drink, true)}</div>
        <div>
          <strong>${drink.name}</strong>
          <span>${money(drink.price)}</span>
        </div>
      </div>
      <dl class="summary-list">
        <div class="summary-row"><dt>온도</dt><dd>${temperatureLabel()}</dd></div>
        <div class="summary-row"><dt>크기</dt><dd>${sizeLabel()}</dd></div>
        <div class="summary-row"><dt>수량</dt><dd>${state.quantity}잔</dd></div>
        ${state.payment ? `<div class="summary-row"><dt>결제</dt><dd>${paymentLabel()}</dd></div>` : ''}
      </dl>
      <div class="summary-total">
        <span>예상 금액</span>
        <strong>${money(getTotal())}</strong>
      </div>`;
  }

  function renderChrome() {
    const inFlow = state.step >= 1 && state.step <= 4;
    progressRegion.classList.toggle('is-hidden', !inFlow);
    restartTopButton.classList.toggle('is-hidden', state.step === 0);
    if (inFlow) renderProgress();
    renderSummary();
  }

  function renderStart() {
    screen.innerHTML = `
      <div class="start-view">
        <div class="start-hero">
          <div>
            <p class="eyebrow">실제 카페처럼 차근차근</p>
            <h2 class="screen-title">내가 마실 음료를 골라<br>주문까지 연습한다.</h2>
            <p class="screen-lead">잘못 골라도 다시 바꿀 수 있다. 화면에 보이는 순서대로 하나씩 선택하면 된다.</p>
            <div class="start-actions">
              <button class="primary-button" type="button" data-action="start">연습 시작하기</button>
            </div>
          </div>
          <div class="start-illustration">${cafeIllustration()}</div>
        </div>
        <div class="quick-guide" aria-label="연습 순서 안내">
          <div class="guide-item"><span class="guide-number">1</span><span><strong>고른다</strong><span>마시고 싶은 음료를 선택한다.</span></span></div>
          <div class="guide-item"><span class="guide-number">2</span><span><strong>확인한다</strong><span>온도·크기와 주문 문장을 확인한다.</span></span></div>
          <div class="guide-item"><span class="guide-number">3</span><span><strong>결제한다</strong><span>카드나 현금을 골라 주문을 마친다.</span></span></div>
        </div>
      </div>`;
  }

  function renderDrinkStep() {
    screen.innerHTML = `
      <div>
        <p class="eyebrow">1단계 · 음료 고르기</p>
        <h2 class="screen-title">어떤 음료를 마실까?</h2>
        <p class="screen-lead">마시고 싶은 음료를 하나 누른다.</p>

        <div class="menu-grid" role="group" aria-label="음료 메뉴">
          ${drinks.map((drink) => {
            const selected = state.drinkId === drink.id;
            return `
              <button class="menu-card ${selected ? 'is-selected' : ''}" type="button" data-drink="${drink.id}" aria-pressed="${selected}">
                ${selected ? `<span class="selection-badge">${iconCheck()} 선택함</span>` : ''}
                <span class="drink-visual">${drinkVisual(drink)}</span>
                <span class="menu-name">${drink.name}</span>
                <span class="menu-desc">${drink.description}</span>
                <span class="menu-price">${money(drink.price)}</span>
              </button>`;
          }).join('')}
        </div>

        <div class="feedback-strip" ${state.drinkId ? '' : 'hidden'}>
          ${iconCheck()} <span>${getDrink() ? `${getDrink().name}을(를) 선택했다.` : ''}</span>
        </div>

        <div class="screen-actions">
          <p class="action-hint">${state.drinkId ? '선택한 음료가 맞으면 다음으로 간다.' : '음료를 하나 선택하면 다음으로 갈 수 있다.'}</p>
          <div class="screen-actions__right">
            <button class="primary-button" type="button" data-action="next-options" ${state.drinkId ? '' : 'disabled'}>다음: 옵션 고르기</button>
          </div>
        </div>
      </div>`;
  }

  function renderOptionStep() {
    const drink = getDrink();
    const canChooseTemp = drink.allowedTemps.length > 1;
    screen.innerHTML = `
      <div>
        <p class="eyebrow">2단계 · 옵션 고르기</p>
        <h2 class="screen-title">어떻게 마실까?</h2>
        <p class="screen-lead">온도와 크기를 고르고, 몇 잔 주문할지 정한다.</p>

        <section class="option-section" aria-labelledby="temperature-title">
          <div class="option-title-row">
            <h3 id="temperature-title">1. 온도</h3>
            <p>${canChooseTemp ? '하나를 선택한다.' : '이 음료는 차갑게 제공된다.'}</p>
          </div>
          <div class="option-grid" role="group" aria-label="온도 선택">
            ${drink.allowedTemps.includes('hot') ? optionButton('temperature', 'hot', '따뜻하게', 'HOT', '따뜻한 음료로 주문한다.', state.temperature === 'hot') : ''}
            ${drink.allowedTemps.includes('ice') ? optionButton('temperature', 'ice', '차갑게', 'ICE', '얼음이 들어간 차가운 음료로 주문한다.', state.temperature === 'ice') : ''}
          </div>
        </section>

        <section class="option-section" aria-labelledby="size-title">
          <div class="option-title-row"><h3 id="size-title">2. 크기</h3><p>하나를 선택한다.</p></div>
          <div class="option-grid" role="group" aria-label="크기 선택">
            ${optionButton('size', 'regular', '레귤러', 'R', '기본 크기', state.size === 'regular')}
            ${optionButton('size', 'large', '라지', 'L', '더 큰 크기 · 500원 추가', state.size === 'large')}
          </div>
        </section>

        <section class="option-section" aria-labelledby="quantity-title">
          <div class="option-title-row"><h3 id="quantity-title">3. 수량</h3><p>1잔부터 5잔까지 가능하다.</p></div>
          <div class="quantity-box">
            <div class="quantity-copy"><strong>몇 잔 주문할까?</strong><span>필요한 수량만큼 더하거나 뺀다.</span></div>
            <div class="stepper" aria-label="수량 조절">
              <button class="stepper-button" type="button" data-action="decrease-qty" aria-label="수량 1잔 줄이기" ${state.quantity <= 1 ? 'disabled' : ''}>−</button>
              <output class="quantity-value" aria-live="polite">${state.quantity}</output>
              <button class="stepper-button" type="button" data-action="increase-qty" aria-label="수량 1잔 늘리기" ${state.quantity >= 5 ? 'disabled' : ''}>+</button>
            </div>
          </div>
        </section>

        <div class="screen-actions">
          <button class="secondary-button" type="button" data-action="back-drinks">이전: 음료 고르기</button>
          <div class="screen-actions__right">
            <button class="primary-button" type="button" data-action="next-review" ${state.temperature && state.size ? '' : 'disabled'}>다음: 주문 확인</button>
          </div>
        </div>
      </div>`;
  }

  function optionButton(group, value, label, icon, description, selected) {
    return `
      <button class="option-button ${selected ? 'is-selected' : ''}" type="button" data-option-group="${group}" data-option-value="${value}" aria-pressed="${selected}">
        <span class="option-copy"><strong>${label}</strong><span>${description}</span></span>
        <span class="option-icon" aria-hidden="true">${selected ? '✓' : icon}</span>
      </button>`;
  }

  function buildOrderSentence() {
    const drink = getDrink();
    if (!drink) return '';
    const temp = state.temperature === 'ice'
      ? (drink.allowedTemps.length === 1 ? '' : '아이스 ')
      : '따뜻한 ';
    const size = state.size === 'large' ? '라지 사이즈 ' : '레귤러 사이즈 ';
    const quantity = state.quantity === 1 ? '한 잔' : `${state.quantity}잔`;
    return `${temp}${drink.name} ${size}${quantity} 주세요.`;
  }

  function renderReviewStep() {
    const drink = getDrink();
    screen.innerHTML = `
      <div>
        <p class="eyebrow">3단계 · 주문 확인</p>
        <h2 class="screen-title">이대로 주문할까?</h2>
        <p class="screen-lead">선택한 내용을 보고, 바꾸고 싶은 것이 있으면 수정한다.</p>

        <div class="review-panel" aria-label="주문 상세 내용">
          <div class="review-row"><span class="review-label">음료</span><span class="review-value">${drink.name}</span><button class="edit-button" type="button" data-action="edit-drink">음료 수정</button></div>
          <div class="review-row"><span class="review-label">온도</span><span class="review-value">${temperatureLabel()}</span><button class="edit-button" type="button" data-action="edit-options">옵션 수정</button></div>
          <div class="review-row"><span class="review-label">크기</span><span class="review-value">${sizeLabel()}</span><button class="edit-button" type="button" data-action="edit-options">옵션 수정</button></div>
          <div class="review-row"><span class="review-label">수량</span><span class="review-value">${state.quantity}잔</span><button class="edit-button" type="button" data-action="edit-options">수량 수정</button></div>
          <div class="review-row"><span class="review-label">합계</span><span class="review-value">${money(getTotal())}</span><span aria-hidden="true"></span></div>
        </div>

        <div class="speak-card">
          <p class="speak-label">카페에서 이렇게 말해 본다</p>
          <p class="speak-sentence">“${buildOrderSentence()}”</p>
          <div class="speak-actions" id="orderSpeechAction"></div>
        </div>

        <div class="screen-actions">
          <button class="secondary-button" type="button" data-action="back-options">이전: 옵션 고르기</button>
          <div class="screen-actions__right"><button class="primary-button" type="button" data-action="next-payment">주문하기</button></div>
        </div>
      </div>`;
    addSpeechButton('orderSpeechAction', buildOrderSentence());
  }

  function paymentIcon(type) {
    if (type === 'card') {
      return '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="10" width="38" height="28" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M6 18h36" stroke="currentColor" stroke-width="4"/><path d="M12 31h10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
    }
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="9" width="36" height="30" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M10 14c3 0 5-2 5-5M38 34c-3 0-5 2-5 5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }

  function renderPaymentStep() {
    screen.innerHTML = `
      <div>
        <p class="eyebrow">4단계 · 결제하기</p>
        <h2 class="screen-title">어떻게 계산할까?</h2>
        <p class="screen-lead">카드나 현금 중 하나를 고른다.</p>

        <div class="payment-grid" role="group" aria-label="결제 방법 선택">
          ${paymentCard('card', '카드', '카드를 단말기에 대거나 꽂아서 결제한다.')}
          ${paymentCard('cash', '현금', '지폐나 동전을 직원에게 건넨다.')}
        </div>

        ${state.payment ? `<div class="speak-card"><p class="speak-label">결제할 때 이렇게 말해 본다</p><p class="speak-sentence">“${paymentLabel()}로 계산할게요.”</p><div class="speak-actions" id="paymentSpeechAction"></div></div>` : ''}

        <div class="screen-actions">
          <button class="secondary-button" type="button" data-action="back-review">이전: 주문 확인</button>
          <div class="screen-actions__right"><button class="primary-button" type="button" data-action="complete-order" ${state.payment ? '' : 'disabled'}>결제하고 주문 완료</button></div>
        </div>
      </div>`;
    if (state.payment) addSpeechButton('paymentSpeechAction', `${paymentLabel()}로 계산할게요.`);
  }

  function paymentCard(value, label, description) {
    const selected = state.payment === value;
    return `
      <button class="payment-card ${selected ? 'is-selected' : ''}" type="button" data-payment="${value}" aria-pressed="${selected}">
        <span class="payment-icon">${paymentIcon(value)}</span>
        <strong>${label}${selected ? ' · 선택함' : ''}</strong>
        <span>${description}</span>
      </button>`;
  }

  function renderComplete() {
    const drink = getDrink();
    screen.innerHTML = `
      <div class="complete-view">
        <div class="complete-mark" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" stroke-width="5"/><path d="m19 32 9 9 18-20" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <p class="eyebrow">주문 완료</p>
        <h2 class="screen-title">주문을 끝까지 잘 마쳤다.</h2>
        <p class="screen-lead">이제 실제 카페에서는 영수증이나 주문 번호를 확인하고 음료가 나올 때까지 기다리면 된다.</p>

        <div class="receipt-card" aria-label="완료한 주문 내용">
          <div class="receipt-row"><span>주문 번호</span><strong>${state.completedOrderNumber}</strong></div>
          <div class="receipt-row"><span>음료</span><strong>${drink.name} · ${state.quantity}잔</strong></div>
          <div class="receipt-row"><span>옵션</span><strong>${temperatureLabel()} · ${sizeLabel()}</strong></div>
          <div class="receipt-row"><span>결제</span><strong>${paymentLabel()}</strong></div>
          <div class="receipt-row"><span>결제 금액</span><strong>${money(getTotal())}</strong></div>
        </div>

        <div class="complete-actions">
          <button class="primary-button" type="button" data-action="restart">다시 연습하기</button>
        </div>
      </div>`;
  }

  function addSpeechButton(containerId, text) {
    const container = document.getElementById(containerId);
    if (!container || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'listen-button';
    button.textContent = '문장 듣기';
    button.addEventListener('click', () => speak(text, button));
    container.appendChild(button);
  }

  function speak(text, button) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.88;
    const original = button.textContent;
    button.textContent = '듣는 중…';
    button.disabled = true;
    utterance.onend = () => {
      button.textContent = original;
      button.disabled = false;
    };
    utterance.onerror = () => {
      button.textContent = original;
      button.disabled = false;
      announce('문장 듣기를 사용할 수 없다. 화면의 문장을 보고 말해 본다.');
    };
    window.speechSynthesis.speak(utterance);
  }

  function render({ focusHeading = false } = {}) {
    renderChrome();
    if (state.step === 0) renderStart();
    if (state.step === 1) renderDrinkStep();
    if (state.step === 2) renderOptionStep();
    if (state.step === 3) renderReviewStep();
    if (state.step === 4) renderPaymentStep();
    if (state.step === 5) renderComplete();
    renderSummary();

    if (focusHeading) {
      window.requestAnimationFrame(() => {
        const heading = screen.querySelector('.screen-title');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
        }
      });
    }
  }

  function resetAll() {
    state.step = 0;
    state.drinkId = null;
    state.temperature = null;
    state.size = null;
    state.quantity = 1;
    state.payment = null;
    state.completedOrderNumber = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    render({ focusHeading: true });
    announce('처음 화면으로 돌아왔다.');
  }

  function chooseDrink(drinkId) {
    const nextDrink = drinks.find((drink) => drink.id === drinkId);
    if (!nextDrink) return;
    const changedDrink = state.drinkId && state.drinkId !== drinkId;
    state.drinkId = drinkId;

    if (!nextDrink.allowedTemps.includes(state.temperature)) {
      state.temperature = nextDrink.allowedTemps.length === 1 ? nextDrink.allowedTemps[0] : null;
    }
    if (changedDrink) state.payment = null;
    render();
    announce(`${nextDrink.name}을(를) 선택했다.`);
  }

  function setOption(group, value) {
    if (group === 'temperature') state.temperature = value;
    if (group === 'size') state.size = value;
    render();
    announce(`${group === 'temperature' ? '온도' : '크기'}를 ${group === 'temperature' ? temperatureLabel(value) : sizeLabel(value)}로 선택했다.`);
  }

  function moveTo(step, message) {
    state.step = step;
    render({ focusHeading: true });
    if (message) announce(message);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  screen.addEventListener('click', (event) => {
    const drinkButton = event.target.closest('[data-drink]');
    if (drinkButton) {
      chooseDrink(drinkButton.dataset.drink);
      return;
    }

    const optionButtonEl = event.target.closest('[data-option-group]');
    if (optionButtonEl) {
      setOption(optionButtonEl.dataset.optionGroup, optionButtonEl.dataset.optionValue);
      return;
    }

    const paymentButton = event.target.closest('[data-payment]');
    if (paymentButton) {
      state.payment = paymentButton.dataset.payment;
      render();
      announce(`${paymentLabel()} 결제를 선택했다.`);
      return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;

    switch (actionButton.dataset.action) {
      case 'start':
        moveTo(1, '음료 고르기 단계다. 마시고 싶은 음료를 하나 선택한다.');
        break;
      case 'next-options':
        if (!state.drinkId) return;
        if (!state.size) state.size = 'regular';
        moveTo(2, '옵션 고르기 단계다. 온도와 크기를 선택한다.');
        break;
      case 'back-drinks':
      case 'edit-drink':
        moveTo(1, '음료를 다시 선택할 수 있다.');
        break;
      case 'decrease-qty':
        if (state.quantity > 1) {
          state.quantity -= 1;
          render();
          announce(`수량을 ${state.quantity}잔으로 바꿨다.`);
        }
        break;
      case 'increase-qty':
        if (state.quantity < 5) {
          state.quantity += 1;
          render();
          announce(`수량을 ${state.quantity}잔으로 바꿨다.`);
        }
        break;
      case 'next-review':
        if (!state.temperature || !state.size) return;
        moveTo(3, '주문 확인 단계다. 선택한 주문 내용을 확인한다.');
        break;
      case 'back-options':
      case 'edit-options':
        moveTo(2, '옵션을 다시 선택할 수 있다.');
        break;
      case 'next-payment':
        moveTo(4, '결제 단계다. 카드나 현금 중 하나를 선택한다.');
        break;
      case 'back-review':
        moveTo(3, '주문 내용을 다시 확인할 수 있다.');
        break;
      case 'complete-order':
        if (!state.payment) return;
        state.completedOrderNumber = `A${Math.floor(10 + Math.random() * 90)}`;
        moveTo(5, `주문이 완료되었다. 주문 번호는 ${state.completedOrderNumber}이다.`);
        break;
      case 'restart':
        resetAll();
        break;
      default:
        break;
    }
  });

  restartTopButton.addEventListener('click', resetAll);

  render();
})();
