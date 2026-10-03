(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // 계산기 활동 목록. co2(회당 kg CO₂)는 예시 값이므로 정식 운영 전 공인 배출계수로 교체해야 한다.
  var ACTIVITIES = [
    { id: 'transit', label: '대중교통 이용', co2: 1.5, point: 20, max: 14, initial: 5 },
    { id: 'local', label: '로컬푸드 구매', co2: 0.3, point: 50, max: 7, initial: 2 },
    { id: 'recycle', label: '재활용 분리배출', co2: 0.2, point: 30, max: 7, initial: 3 },
    { id: 'reusable', label: '다회용기 사용', co2: 0.05, point: 10, max: 21, initial: 5 },
    { id: 'bike', label: '자전거·도보 이동', co2: 0.8, point: 20, max: 14, initial: 2 }
  ];
  var WEEKS_PER_MONTH = 4;

  // 헤더 스크롤 상태
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 모바일 메뉴
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setNav(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });

  // 계산기
  var rows = document.getElementById('calc-rows');
  var co2El = document.getElementById('calc-co2');
  var pointEl = document.getElementById('calc-point');

  ACTIVITIES.forEach(function (a) {
    var row = document.createElement('div');
    row.className = 'calc-row';
    row.innerHTML =
      '<label for="calc-' + a.id + '">' + a.label + '</label>' +
      '<output for="calc-' + a.id + '">주 ' + a.initial + '회</output>' +
      '<input type="range" id="calc-' + a.id + '" min="0" max="' + a.max + '" step="1" value="' + a.initial + '">';
    rows.appendChild(row);
  });

  function updateCalc() {
    var co2 = 0;
    var point = 0;
    ACTIVITIES.forEach(function (a) {
      var input = document.getElementById('calc-' + a.id);
      var count = Number(input.value);
      input.previousElementSibling.textContent = '주 ' + count + '회';
      co2 += count * a.co2 * WEEKS_PER_MONTH;
      point += count * a.point * WEEKS_PER_MONTH;
    });
    co2El.textContent = co2.toFixed(1);
    pointEl.textContent = point.toLocaleString('ko-KR');
  }
  rows.addEventListener('input', updateCalc);
  updateCalc();

  // 사전 신청 폼: 아직 전송할 서버가 없으므로 입력 검증과 안내만 한다.
  var form = document.getElementById('join-form');
  var email = document.getElementById('join-email');
  var message = document.getElementById('form-message');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = email.value.trim() !== '' && email.checkValidity();
    email.classList.toggle('is-invalid', !valid);
    message.classList.toggle('is-error', !valid);
    if (!valid) {
      message.textContent = '이메일 주소를 올바르게 입력해 주세요.';
      email.focus();
      return;
    }
    message.textContent = '현재는 시안 페이지라 신청이 실제로 접수되지 않습니다. 서버 연결 후 사용할 수 있습니다.';
  });

  // 스크롤 등장 효과
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { observer.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
