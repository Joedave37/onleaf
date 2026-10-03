(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var PAGES = [
    { id: 'home', href: 'index.html', label: '홈' },
    { id: 'about', href: 'about.html', label: '사업 소개' },
    { id: 'app', href: 'app.html', label: '앱·보상' },
    { id: 'cases', href: 'cases.html', label: '모범 사례' },
    { id: 'contact', href: 'contact.html', label: '운영 안내' }
  ];

  var BRAND =
    '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">' +
    '<rect width="32" height="32" rx="9" fill="currentColor"/>' +
    '<path d="M9 22c0-8 5-13 14-13 0 9-5 14-13 14l-1-1z" fill="#c8f169"/>' +
    '<path d="M10 22c3-4 6-7 10-9" stroke="#0f3d33" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
    '</svg>' +
    '<span class="brand-text"><span class="brand-name">해남 ESG 탄소 감축 시범사업</span>' +
    '<span class="brand-sub">HAENAM ESG PILOT</span></span>';

  // 헤더와 푸터는 모든 페이지가 공유하므로 여기서 한 번만 정의한다.
  function renderChrome() {
    var current = document.body.getAttribute('data-page');

    var links = PAGES.filter(function (p) { return p.id !== 'home'; }).map(function (p) {
      return '<a href="' + p.href + '"' + (p.id === current ? ' aria-current="page"' : '') + '>' + p.label + '</a>';
    }).join('');

    var header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML =
      '<div class="container header-inner">' +
      '<a class="brand" href="index.html" aria-label="홈으로">' + BRAND + '</a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="메뉴 열기">' +
      '<span></span><span></span><span></span></button>' +
      '<nav class="site-nav" id="site-nav" aria-label="주요 메뉴">' + links +
      '<a class="btn btn-primary btn-small" href="app.html#demo">앱 체험하기</a></nav>' +
      '</div>';
    document.body.insertBefore(header, document.body.firstChild);

    var skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main';
    skip.textContent = '본문으로 건너뛰기';
    document.body.insertBefore(skip, header);

    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="container footer-grid">' +
      '<div class="footer-about"><a class="brand" href="index.html">' + BRAND + '</a>' +
      '<p>일상의 탄소 감축 실천을 앱으로 기록하고 Algorand 기반 디지털 자산으로 보상해, 지역에 ESG 생태계를 만드는 시범사업입니다.</p></div>' +
      '<div><h3>바로가기</h3><ul class="footer-links">' +
      PAGES.map(function (p) { return '<li><a href="' + p.href + '">' + p.label + '</a></li>'; }).join('') +
      '</ul></div>' +
      '<div><h3>운영 정보</h3><dl class="footer-info">' +
      '<div><dt>대표자</dt><dd>신승중</dd></div>' +
      '<div><dt>사업장</dt><dd>충청남도 천안시 서북구 입장면 새터길 63</dd></div>' +
      '<div><dt>시범 지역</dt><dd>전라남도 해남군 (예정)</dd></div>' +
      '</dl></div>' +
      '</div>' +
      '<div class="container footer-bottom">' +
      '<p>본 사업은 준비 단계이며, 일정과 보상 방식 등 세부 내용은 변경될 수 있습니다. 사진은 이해를 돕기 위한 자료 사진(Unsplash)입니다.</p>' +
      '<p>최종 수정일 2026년 10월 3일</p>' +
      '</div>';
    document.body.appendChild(footer);

    var toTop = document.createElement('button');
    toTop.className = 'to-top';
    toTop.type = 'button';
    toTop.setAttribute('aria-label', '맨 위로');
    toTop.textContent = '↑';
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.body.appendChild(toTop);

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var toggle = header.querySelector('.nav-toggle');
    var nav = header.querySelector('.site-nav');
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
  }

  // 탭: [data-tabs] 안의 [data-tab] 버튼이 같은 이름의 [data-panel]을 보여 준다.
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
      var buttons = root.querySelectorAll('[data-tab]');
      var panels = root.querySelectorAll('[data-panel]');
      function select(name) {
        buttons.forEach(function (b) {
          b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === name));
        });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== name;
        });
      }
      buttons.forEach(function (b) {
        b.addEventListener('click', function () { select(b.getAttribute('data-tab')); });
      });
      select(buttons[0].getAttribute('data-tab'));
    });
  }

  // 필터 칩: [data-filter] 안의 칩이 [data-filter-target] 목록의 [data-cat] 항목을 걸러 낸다.
  function initFilters() {
    document.querySelectorAll('[data-filter]').forEach(function (root) {
      var list = document.querySelector(root.getAttribute('data-filter'));
      var chips = root.querySelectorAll('.chip');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var cat = chip.getAttribute('data-cat');
          chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
          list.querySelectorAll('[data-cat]').forEach(function (item) {
            item.hidden = cat !== 'all' && item.getAttribute('data-cat').split(' ').indexOf(cat) === -1;
          });
        });
      });
    });
  }

  // 숫자 카운트업
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function run(el) {
      var target = Number(el.getAttribute('data-count'));
      if (reduce) { el.textContent = target.toLocaleString('ko-KR'); return; }
      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / 1200, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toLocaleString('ko-KR');
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if (!('IntersectionObserver' in window)) { counters.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  }

  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach(function (el) { io.observe(el); });
  }

  // 앱 체험: 실제 인증이나 지급은 일어나지 않는 화면 흐름 시연이다.
  function initDemo() {
    var body = document.getElementById('demo-body');
    if (!body) return;
    var steps = document.querySelectorAll('#demo-steps li');
    var ACTIVITIES = [
      { icon: '🚌', name: '대중교통 이용' },
      { icon: '🥬', name: '지역 농산물 구매' },
      { icon: '♻️', name: '재활용 분리배출' },
      { icon: '🥤', name: '다회용기 사용' },
      { icon: '🚲', name: '자전거·도보 이동' },
      { icon: '🔌', name: '에너지 절약' }
    ];
    var log = [];
    var chosen = null;

    function setStep(n) {
      steps.forEach(function (li, i) {
        li.classList.toggle('is-active', i === n);
        li.classList.toggle('is-done', i < n);
      });
    }

    function showChoose() {
      setStep(0);
      var html = '<p>오늘 실천한 활동을 골라 보세요.</p><div class="demo-options">' +
        ACTIVITIES.map(function (a, i) {
          return '<button class="demo-option" type="button" data-i="' + i + '"><span>' + a.icon + '</span>' + a.name + '</button>';
        }).join('') + '</div>';
      if (log.length) {
        html += '<ul class="demo-log">' + log.map(function (a) {
          return '<li>' + a.icon + ' ' + a.name + '<b>보상 완료</b></li>';
        }).join('') + '</ul>';
      }
      body.innerHTML = html;
    }

    function showUpload() {
      setStep(1);
      body.innerHTML =
        '<div class="demo-card"><span class="big">' + chosen.icon + '</span><b>' + chosen.name + '</b>' +
        '<small>인증 자료를 올려 주세요</small></div>' +
        '<div class="demo-upload">📷 영수증 또는 활동 사진<br>(체험에서는 올리지 않아도 됩니다)</div>' +
        '<button class="btn btn-primary" type="button" data-act="submit">인증 요청하기</button>' +
        '<button class="btn btn-ghost" type="button" data-act="back">다른 활동 고르기</button>';
    }

    function showChecking() {
      setStep(2);
      body.innerHTML =
        '<div class="spinner"></div>' +
        '<div class="demo-card"><b>활동을 확인하고 있습니다</b><small>확인된 활동만 보상 대상이 됩니다</small></div>';
      setTimeout(showReward, 1600);
    }

    function showReward() {
      setStep(3);
      log.unshift(chosen);
      if (log.length > 3) log.pop();
      body.innerHTML =
        '<div class="demo-success">✓</div>' +
        '<div class="demo-card"><b>승인 완료 · 보상 지급</b>' +
        '<small>Algorand 기반 디지털 자산이 지갑으로 지급됩니다.<br>지급 수량과 기준은 아직 정해지지 않았습니다.</small></div>' +
        '<button class="btn btn-primary" type="button" data-act="again">다른 활동 해 보기</button>';
    }

    body.addEventListener('click', function (e) {
      var option = e.target.closest('.demo-option');
      if (option) { chosen = ACTIVITIES[Number(option.getAttribute('data-i'))]; showUpload(); return; }
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-act');
      if (act === 'submit') showChecking();
      else showChoose();
    });

    showChoose();
  }

  // 모범 사례. 수치와 사실은 sources에 적은 자료에서 확인한 것만 적는다.
  var CASES = [
    {
      cat: 'public', catLabel: '정부·지자체', icon: '🏛️', tone: 'tone-a',
      title: '탄소중립포인트 녹색생활 실천',
      org: '정부 · 한국환경공단 운영',
      summary: '전자영수증 발급, 텀블러·다회용컵 이용 등 일상 속 실천에 포인트를 지급하는 전국 단위 제도입니다.',
      key: '208만 명', keyNote: '참여자 (2025년 12월 보도 기준)',
      facts: [
        '전자영수증 발급, 텀블러·다회용컵 이용, 다회용기 이용, 고품질 재활용품 배출 등의 실천 항목에 인센티브를 지급합니다.',
        '2026년에 실천 항목이 12개에서 17개로 늘었습니다.',
        '참여자 1인당 연간 지급 상한은 7만 원입니다.'
      ],
      lesson: '항목과 단가를 명확히 공개하고 전용 앱으로 참여하게 한 것이 대규모 참여의 바탕이 되었습니다.',
      sources: [
        { label: '헤럴드경제 (2025. 12.)', url: 'https://www.heraldk.com/article/2025120917560453539' },
        { label: '농촌진흥청 웹진', url: 'https://rda.go.kr/webzine/2023/10/sub3-2.html' }
      ]
    },
    {
      cat: 'public', catLabel: '정부·지자체', icon: '🌊', tone: 'tone-c',
      title: '전남형 탄소중립포인트 「탄소모아 탄탄e」',
      org: '전라남도',
      summary: '생활 속 탄소 저감 활동을 인증하면 포인트를 쌓아 지역화폐로 바꿔 쓰는 전남의 플랫폼입니다.',
      key: '22개 시군', keyNote: '전남 전역에서 2026년 6월 시범 운영',
      facts: [
        '걷기, 대중교통 이용, 자전거 이용, 다회용 컵 사용, 로컬푸드 구매, 환경캠페인 참여를 인정합니다.',
        '적립한 포인트는 지역화폐로 전환해 사용하며, 연간 최대 20만 원의 혜택을 받을 수 있습니다.',
        '2027년부터 확대 운영할 계획이라고 보도되었습니다.'
      ],
      lesson: '해남군이 속한 전남에 이미 운영 중인 제도가 있습니다. 본 시범사업은 이 제도와 겹치지 않는 역할과 연계 방안을 분명히 해야 합니다.',
      sources: [
        { label: '서울신문 (2026. 6. 21.)', url: 'https://m.go.seoul.co.kr/news/2026/06/21/20260621500034' }
      ]
    },
    {
      cat: 'public', catLabel: '정부·지자체', icon: '🏙️', tone: 'tone-b',
      title: '경기도 기후행동 기회소득',
      org: '경기도',
      summary: '탄소 발자국을 줄이는 활동을 전용 앱으로 인증하면 지역화폐로 보상하는 정책입니다.',
      key: '200만 명', keyNote: '앱 가입자 (2026년 6월 보도 기준)',
      facts: [
        '2024년 7월 앱을 출시했고, 출시 2년 만에 가입자가 200만 명을 넘었습니다.',
        '다회용기 사용, 걷기·자전거·대중교통 이용 등 16개 활동을 인정하며, 1인당 연간 최대 6만 원을 지급합니다.',
        '2025년 한 해 310억 6,000만 원을 지급했고, OECD 공공부문 혁신사례집에 실렸습니다.',
        '2026년 7월에는 보상 지급이 중단되었다는 보도가 있었습니다.'
      ],
      lesson: '참여가 늘수록 보상 재원 부담도 커집니다. 예산에만 의존하지 않는 지속 가능한 보상 구조가 필요합니다.',
      sources: [
        { label: '서울신문 (2026. 6. 23.)', url: 'https://m.go.seoul.co.kr/news/2026/06/23/20260623019007' },
        { label: '헤럴드경제 (2026. 3.)', url: 'https://www.heraldk.com/article/2026031715291434633' },
        { label: '다음 뉴스 (2026. 7. 23.)', url: 'https://v.daum.net/v/20260723060441674' }
      ]
    },
    {
      cat: 'token', catLabel: '블록체인·토큰', icon: '💳', tone: 'tone-d',
      title: '고양시 탄소지움카드',
      org: '고양시 · KT',
      summary: '시민의 탄소중립 실천에 포인트를 지원하는 사업으로, 플랫폼을 블록체인 기반으로 구축했습니다.',
      key: '블록체인 기반', keyNote: '탄소지움 디지털 통합 플랫폼',
      facts: [
        '시민의 탄소중립 실천을 유도하고 포인트를 지원하는 것이 목적입니다.',
        'KT가 탄소지움 디지털 통합 플랫폼을 블록체인 기반으로 구축해 보안성을 높였다고 보도되었습니다.'
      ],
      lesson: '지자체 사업에서도 실천 기록의 신뢰성을 위해 블록체인을 도입한 선례가 있습니다.',
      sources: [
        { label: '뉴스토마토', url: 'https://newstomato.com/ReadNews.aspx?no=1127202' }
      ]
    },
    {
      cat: 'token', catLabel: '블록체인·토큰', icon: '🎮', tone: 'tone-b',
      title: 'HOOXI 앱 × W Green Pay',
      org: 'W재단',
      summary: '온실가스 감축 미션을 수행하면 블록체인 토큰으로 보상하는 앱입니다. 암호화폐 보상 방식의 국내 선례입니다.',
      key: '토큰 보상', keyNote: 'W Green Pay(WGP)로 리워드 지급',
      facts: [
        '온실가스 감축 미션 보상 플랫폼으로, 3개월의 오픈베타를 거쳐 정식 서비스를 시작했습니다.',
        '미션 포인트 적립 기준 상위 20%에게 WGP를 차등 지급했습니다.',
        '받은 WGP는 앱 안의 쇼핑몰에서 상품 구매에 쓰거나, 거래소 지갑으로 옮길 수 있었습니다.'
      ],
      lesson: '토큰 보상은 받은 뒤 어디에 쓸 수 있는지가 핵심입니다. 사용처를 함께 설계해야 합니다.',
      sources: [
        { label: '블록미디어', url: 'https://www.blockmedia.co.kr/archives/78234' },
        { label: 'UNFCCC 소개 글', url: 'https://unfccc.int/node/184273' }
      ]
    },
    {
      cat: 'algorand', catLabel: 'Algorand 기반', icon: '🌐', tone: 'tone-c',
      title: 'Algorand × ClimateTrade',
      org: 'Algorand · ClimateTrade',
      summary: '블록체인 네트워크의 탄소 발자국을 온체인에 기록하고, 그만큼의 탄소 크레딧을 자산으로 잠그는 구조를 발표했습니다.',
      key: '2021년 4월', keyNote: '탄소 네거티브 네트워크 계획 발표',
      facts: [
        'Algorand는 탄소 배출 투명성 기업 ClimateTrade와 협력한다고 발표했습니다.',
        '지속가능성 오라클이 네트워크의 탄소 발자국을 일정 블록 단위로 온체인에 공증합니다.',
        '그에 상응하는 탄소 크레딧을 Algorand 표준 자산(ASA)으로 만들어 그린 트레저리에 잠급니다.'
      ],
      lesson: 'Algorand에서는 탄소 크레딧을 표준 자산(ASA)으로 발행하고 관리한 선례가 있습니다.',
      sources: [
        { label: 'Business Wire (2021. 4. 22.)', url: 'https://www.businesswire.com/news/home/20210422005075/en/Algorand-Pledges-to-be-the-Greenest-Blockchain-with-a-Carbon-Negative-Network-Now-and-in-the-Future' }
      ]
    },
    {
      cat: 'algorand', catLabel: 'Algorand 기반', icon: '🏠', tone: 'tone-a',
      title: 'Ureca: 가정 단위 탄소 크레딧',
      org: 'Ureca (싱가포르)',
      summary: 'IoT와 기계학습, Algorand 블록체인을 결합해 가정의 감축량을 측정·검증하고 탄소 크레딧으로 만듭니다.',
      key: '디지털 MRV', keyNote: '측정·보고·검증의 자동화',
      facts: [
        '가정과 중소 사업자가 청정에너지로 전환하고 감축분을 탄소 크레딧으로 만들 수 있게 합니다.',
        '첫 적용 사례는 몽골 울란바토르의 5개 가구로, 석탄 난방을 청정에너지로 바꿨습니다.',
        'Algorand의 빠른 처리 속도와 낮은 수수료가 채택 이유로 소개되었습니다.'
      ],
      lesson: '개인의 감축 실적을 신뢰할 수 있게 하려면 측정과 검증(MRV) 절차가 보상 설계보다 먼저입니다.',
      sources: [
        { label: 'Algorand 사례 연구 (2024. 11.)', url: 'https://algorand.co/case-studies/ureca-can' }
      ]
    },
    {
      cat: 'algorand token', catLabel: 'Algorand 기반', icon: '🌾', tone: 'tone-d',
      title: 'PAM-TALK: 지역 농업과 ESG 보상',
      org: '국내 선행 구현 사례',
      summary: '지역 농업과 ESG 미션을 블록체인 보상으로 연결하는 플랫폼으로, 보상 토큰을 Algorand 메인넷에 발행했습니다.',
      key: '메인넷 발행', keyNote: 'PAM-POINT (자산 ID 3330375002)',
      facts: [
        '보상 토큰 PAM-POINT(PAMP)가 2025년 11월 Algorand 메인넷에 발행되었습니다.',
        '총 발행량은 1,000만 PAMP이며, 누구나 탐색기에서 확인할 수 있습니다.',
        '탄소 감축 활동 인증, 위원회 검증, 디지털 쿠폰, 로컬푸드 마켓을 하나의 플랫폼으로 구성했습니다.'
      ],
      lesson: '국내에서도 Algorand 메인넷에 보상 자산을 발행한 선행 구현이 있어, 본 시범사업의 기술적 출발점이 됩니다.',
      sources: [
        { label: 'PAM-TALK', url: 'https://pam-talk.vercel.app/' },
        { label: 'Algorand 탐색기 (자산 정보)', url: 'https://allo.info/asset/3330375002' }
      ]
    }
  ];

  function initCases() {
    var grid = document.getElementById('case-grid');
    if (!grid) return;
    var modal = document.getElementById('case-modal');

    grid.innerHTML = CASES.map(function (c, i) {
      return '<button class="case reveal" type="button" data-cat="' + c.cat + '" data-i="' + i + '">' +
        '<span class="case-top"><span class="case-icon ' + c.tone + '">' + c.icon + '</span>' +
        '<span class="case-cat">' + c.catLabel + '</span></span>' +
        '<h3>' + c.title + '</h3>' +
        '<span class="case-org">' + c.org + '</span>' +
        '<span class="case-summary">' + c.summary + '</span>' +
        '<span class="case-key">' + c.key + '<small>' + c.keyNote + '</small></span>' +
        '<span class="case-more">자세히 보기 →</span>' +
        '</button>';
    }).join('');

    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.case');
      if (!card) return;
      var c = CASES[Number(card.getAttribute('data-i'))];
      modal.innerHTML =
        '<button class="modal-close" type="button" aria-label="닫기">×</button>' +
        '<div class="modal-head"><span class="case-cat">' + c.catLabel + '</span>' +
        '<h3>' + c.title + '</h3><p>' + c.org + '</p></div>' +
        '<div class="modal-body">' +
        '<h4>개요</h4><p>' + c.summary + '</p>' +
        '<h4>확인된 사실</h4><ul>' + c.facts.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
        '<h4>본 사업에 주는 시사점</h4><p>' + c.lesson + '</p>' +
        '<h4>출처</h4><ul class="sources">' + c.sources.map(function (s) {
          return '<li><a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + '</a></li>';
        }).join('') + '</ul>' +
        '</div>';
      modal.showModal();
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.modal-close')) modal.close();
    });
  }

  renderChrome();
  initCases();
  initTabs();
  initFilters();
  initCounters();
  initDemo();
  initReveal();
})();
