/* ============================================================
   정보와 디지털 문해력 — 학생용 교과서 공용 스크립트
   장대현중고등학교 · 2026학년도 2학기

   하는 일
   1) 읽기 모드 전환 — 스크롤(기본) ↔ 슬라이드
   2) 페이지 번호 자동 매기기 · 진행률 표시
   3) 목차 서랍 열고 닫기
   4) 코드 복사 버튼
   5) 이미지 자리표시자 — assets/img/<ID>.png 가 없으면 안내 상자로 대체
   6) 언어 전환 골격 (지금은 한국어만 사용)
   ============================================================ */
(function () {
  'use strict';

  var pages = [];
  var cur = 0;
  var slideMode = false;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── 1. 페이지 수집과 번호 ───────────────────────────── */
  function collectPages() {
    pages = $$('.page');
    pages.forEach(function (p, i) {
      if (!p.id) p.id = 'p' + (i + 1);
      var n = p.querySelector('.pnum');
      if (!n) {
        n = document.createElement('div');
        n.className = 'pnum';
        p.appendChild(n);
      }
      // 표지에는 번호를 넣지 않는다.
      n.textContent = p.classList.contains('cover') ? '' : (i + 1) + ' / ' + pages.length;
    });
  }

  /* ── 2. 읽기 모드 ────────────────────────────────────── */
  function applyMode() {
    document.body.classList.toggle('mode-slide', slideMode);
    var btn = $('#modeBtn');
    if (btn) {
      btn.setAttribute('aria-pressed', slideMode ? 'true' : 'false');
      btn.innerHTML = slideMode ? '스크롤로 보기' : '한 장씩 보기';
      btn.title = slideMode
        ? '위아래로 이어 읽는 스크롤 모드로 바꿉니다'
        : '한 화면에 한 페이지씩 보는 슬라이드 모드로 바꿉니다 (← → 로 이동)';
    }
    if (slideMode) renderSlide();
    else {
      pages.forEach(function (p) { p.classList.remove('is-off'); });
      updateScrollProgress();
    }
    try { localStorage.setItem('jdh_tb_mode', slideMode ? 'slide' : 'scroll'); } catch (e) {}
  }

  function toggleMode() {
    // 모드를 바꿔도 지금 보던 페이지를 유지한다.
    if (!slideMode) cur = nearestPageInView();
    slideMode = !slideMode;
    applyMode();
    if (!slideMode && pages[cur]) {
      pages[cur].scrollIntoView({ block: 'start' });
    }
  }

  function nearestPageInView() {
    var top = window.scrollY + (document.querySelector('#top') ? 70 : 0);
    var idx = 0;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].offsetTop <= top + 40) idx = i;
    }
    return idx;
  }

  /* ── 3. 슬라이드 이동 ────────────────────────────────── */
  function renderSlide() {
    pages.forEach(function (p, i) { p.classList.toggle('is-off', i !== cur); });
    setCount(cur + 1, pages.length, ((cur + 1) / pages.length) * 100);
    var prev = $('#pprev'), next = $('#pnext');
    if (prev) prev.disabled = (cur === 0);
    if (next) next.disabled = (cur === pages.length - 1);
    window.scrollTo(0, 0);
  }

  function go(n) {
    if (!pages.length) return;
    n = Math.max(0, Math.min(pages.length - 1, n));
    cur = n;
    if (slideMode) {
      renderSlide();
      try { history.replaceState(null, '', '#' + pages[cur].id); } catch (e) {}
    } else {
      pages[cur].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setCount(now, total, pct) {
    var c = $('#count');
    if (c) c.textContent = now + ' / ' + total;
    var pr = $('#prog');
    if (pr) pr.style.width = pct + '%';
  }

  function updateScrollProgress() {
    if (slideMode || !pages.length) return;
    var i = nearestPageInView();
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? (window.scrollY / h) * 100 : 100;
    setCount(i + 1, pages.length, pct);
    var t = $('#totop');
    if (t) t.classList.toggle('show', window.scrollY > 600);
    highlightToc(i);
  }

  /* ── 4. 목차 ─────────────────────────────────────────── */
  function toggleToc(force) {
    var t = $('#toc'), s = $('#scrim');
    if (!t) return;
    var open = (typeof force === 'boolean') ? force : !t.classList.contains('open');
    t.classList.toggle('open', open);
    if (s) s.classList.toggle('show', open);
  }

  /* 전체 교과서 목차는 각 HTML에 복사하지 않고 이 공통 스크립트에서만 관리한다. */
  var COURSE_TOC_HTML = [
    '<div class="toc-part"><span class="ko">1부 · 오리엔테이션</span><span class="zh">第 1 部 · 导论</span></div>',
    '<a href="../../01/textbook/01-1.html"><span class="n">01-1</span><span>수업 소개</span></a>',
    '<a href="../../01/textbook/01-2.html"><span class="n">01-2</span><span>수업 열기</span></a>',
    '<div class="toc-part"><span class="ko">2부 · Python과 데이터</span><span class="zh">第 2 部 · Python 与数据</span></div>',
    '<a href="../../02/textbook/02-1.html"><span class="n">02-1</span><span>개발 도구 설치와 확인</span></a>',
    '<a href="../../02/textbook/02-2.html"><span class="n">02-2</span><span>숫자와 변수로 계산하기</span></a>',
    '<a href="../../02/textbook/02-3.html"><span class="n">02-3</span><span>웹과 프로그래밍 언어의 역사</span></a>',
    '<a href="../../03/textbook/03-1.html"><span class="n">03-1</span><span>비교 결과로 판단하기</span></a>',
    '<a href="../../03/textbook/03-2.html"><span class="n">03-2</span><span>프로젝트별 Python 환경과 자료구조</span></a>',
    '<a href="../../04/textbook/04-1.html"><span class="n">04-1</span><span>Matplotlib으로 그래프 이해하기</span></a>',
    '<a href="../../04/textbook/04-2.html"><span class="n">04-2</span><span>pandas로 표 데이터를 쉽게 사용하기</span></a>',
    '<a href="../../05/textbook/05-1.html"><span class="n">05-1</span><span>수행평가 1 안내</span></a>',
    '<a href="../../05/textbook/05-2.html"><span class="n">05-2</span><span>수행평가 1 · AI 활용 데이터 시각화</span></a>',
    '<div class="toc-part"><span class="ko">3부 · 기획과 데이터 설계</span><span class="zh">第 3 部 · 规划与数据设计</span></div>',
    '<a href="../../06/textbook/06-1.html"><span class="n">06-1</span><span>서비스 기획의 기초</span></a>',
    '<a href="../../06/textbook/06-2.html"><span class="n">06-2</span><span>서비스 제작 계획서(PRD) 시작하기</span></a>',
    '<a href="../../07/textbook/07-1.html"><span class="n">07-1</span><span>관계형 데이터베이스의 기초</span></a>',
    '<a href="../../07/textbook/07-2.html"><span class="n">07-2</span><span>PRD에 데이터 목록 덧붙이기</span></a>',
    '<a href="../../08/textbook/08-1.html"><span class="n">08-1</span><span>수행평가 2 안내</span></a>',
    '<a href="../../08/textbook/08-2.html"><span class="n">08-2</span><span>수행평가 2 · PRD 완성·제출</span></a>',
    '<div class="toc-part"><span class="ko">4부 · AI와 서비스 개발</span><span class="zh">第 4 部 · 与 AI 开发服务</span></div>',
    '<a href="../../09/textbook/09-1.html"><span class="n">09-1</span><span>서비스 사용자 흐름(Flow) 설계</span></a>',
    '<a href="../../09/textbook/09-2.html"><span class="n">09-2</span><span>AI와 사용자 흐름·개발 계획 확정</span></a>',
    '<a href="../../10/textbook/10-1.html"><span class="n">10-1</span><span>API와 요청·응답 이해하기</span></a>',
    '<a href="../../10/textbook/10-2.html"><span class="n">10-2</span><span>AI와 핵심 API 연결하기</span></a>',
    '<a href="../../11/textbook/11-1.html"><span class="n">11-1</span><span>서비스가 데이터를 기억하는 과정</span></a>',
    '<a href="../../11/textbook/11-2.html"><span class="n">11-2</span><span>SQLite 데이터 저장 연결하기</span></a>',
    '<a href="../../12/textbook/12-1.html"><span class="n">12-1</span><span>사용자 흐름으로 서비스 테스트하기</span></a>',
    '<a href="../../12/textbook/12-2.html"><span class="n">12-2</span><span>사용자 흐름 테스트와 시험 제출</span></a>',
    '<a href="../../13/textbook/13-1.html"><span class="n">13-1</span><span>수행평가 3 · 결과 반영과 가다듬기</span></a>',
    '<a href="../../13/textbook/13-2.html"><span class="n">13-2</span><span>수행평가 3 · 실행·설명·최종 제출</span></a>',
    '<div class="toc-part"><span class="ko">별도 자료</span><span class="zh">单独资料</span></div>',
    '<a href="../../09/textbook/09-0.html"><span class="n">09-0</span><span>AI 개발 조건</span></a>',
    '<a href="../../appendix/textbook/glossary.html"><span class="n">부록</span><span>프로그램 뒤편의 이야기</span></a>'
  ].join('');

  function structureToc() {
    var toc = $('#toc');
    if (!toc || toc.dataset.structured === '1') return;
    var nodes = Array.prototype.slice.call(toc.children);
    var groups = [];
    var current = null;

    nodes.forEach(function (node) {
      if (node.classList && node.classList.contains('h')) {
        current = { heading: node, items: [] };
        groups.push(current);
      } else if (current) {
        current.items.push(node);
      }
    });

    var local = groups.find(function (g) {
      return /이 차시|이 자료|本课时|本资料/.test(g.heading.textContent);
    });
    if (!local) return;

    toc.innerHTML = '';
    var globalBlock = document.createElement('div');
    globalBlock.className = 'toc-block toc-global';
    globalBlock.innerHTML = '<div class="toc-block-title"><span class="ko">전체 교과서</span><span class="zh">全部教材</span><small>01–13</small></div>';
    globalBlock.insertAdjacentHTML('beforeend', COURSE_TOC_HTML);
    Array.prototype.forEach.call(globalBlock.querySelectorAll('a'), function (link) {
      if (link.pathname === location.pathname) link.classList.add('here');
    });

    var localBlock = document.createElement('div');
    localBlock.className = 'toc-block toc-local';
    localBlock.innerHTML = '<div class="toc-block-title"><span class="ko">이 문서 안에서</span><span class="zh">本文件内</span><small>PAGE</small></div>';
    local.items.forEach(function (node) { localBlock.appendChild(node); });

    toc.appendChild(globalBlock);
    toc.appendChild(localBlock);
    toc.dataset.structured = '1';
  }

  function highlightToc(pageIdx) {
    var links = $$('#toc a[href^="#"]');
    if (!links.length || !pages[pageIdx]) return;
    var id = pages[pageIdx].id;
    var hit = null;
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) hit = a;
    });
    // 정확히 일치하는 링크가 없으면 그 위쪽에서 가장 가까운 링크를 고른다.
    if (!hit) {
      for (var i = pageIdx; i >= 0; i--) {
        var pid = pages[i].id;
        for (var k = 0; k < links.length; k++) {
          if (links[k].getAttribute('href') === '#' + pid) { hit = links[k]; break; }
        }
        if (hit) break;
      }
    }
    links.forEach(function (a) { a.classList.toggle('here', a === hit); });
  }

  /* ── 5. 코드 복사 ────────────────────────────────────── */
  function copyCode(btn) {
    var card = btn.closest('.code');
    var pre = card ? card.querySelector('pre') : null;
    if (!pre) return;
    var text = pre.innerText;
    var done = function () {
      if (!btn.dataset.origHtml) btn.dataset.origHtml = btn.innerHTML;
      btn.textContent = document.documentElement.classList.contains('lang-zh') ? '已复制' : '복사됨';
      setTimeout(function () { btn.innerHTML = btn.dataset.origHtml; }, 1300);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(pre, done); });
    } else {
      fallback(pre, done);
    }
  }

  function fallback(pre, done) {
    var r = document.createRange();
    r.selectNodeContents(pre);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    try { document.execCommand('copy'); done(); } catch (e) {}
    s.removeAllRanges();
  }

  /* ── 6. 이미지 자리표시자 ────────────────────────────────
     교과서 HTML에는 아직 만들지 않은 그림도 <img> 로 적어 둔다.
     assets/img/<ID>.png 파일을 넣으면 그대로 그림이 나오고,
     파일이 없으면 아래 함수가 안내 상자로 바꿔 준다.
     ─────────────────────────────────────────────────── */
  function imgPlaceholder(img) {
    if (img.dataset.phDone) return;
    img.dataset.phDone = '1';
    var box = document.createElement('div');
    box.className = 'imgph';
    var id = img.dataset.id || '(ID 없음)';
    var desc = img.getAttribute('alt') || '';
    var spec = img.dataset.spec || '';
    box.innerHTML =
      '<div class="pid">IMG ' + esc(id) + '</div>' +
      '<div class="pdesc">' + esc(desc) + '</div>' +
      (spec ? '<div class="pspec">' + esc(spec) + '</div>' : '');
    img.parentNode.replaceChild(box, img);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ── 7. 언어 전환 ────────────────────────────────────────
     본문은 .ko 와 .zh 를 나란히 적어 두고 CSS 로 한쪽만 보여 준다.
     여기서는 body 의 클래스와 버튼 표시만 바꾼다.
     ─────────────────────────────────────────────────── */
  function applyLangBtn() {
    var zh = document.body.classList.contains('lang-zh');
    var b = $('.lng');
    if (b) {
      b.textContent = zh ? '한국어' : '中文';
      b.title = zh ? '한국어로 봅니다' : '中文으로 봅니다 (본문만 바뀝니다)';
      b.setAttribute('aria-pressed', zh ? 'true' : 'false');
    }
  }

  function toggleLang() {
    var zh = document.body.classList.toggle('lang-zh');
    document.body.classList.toggle('lang-ko', !zh);
    document.documentElement.lang = zh ? 'zh' : 'ko';
    applyLangBtn();
    // 언어에 따라 글자 수가 달라지므로 페이지 높이를 다시 잰다.
    updateScrollProgress();
    try { localStorage.setItem('jdh_tb_lang', zh ? 'zh' : 'ko'); } catch (e) {}
  }

  /* ── 8. 시작 ─────────────────────────────────────────── */
  function init() {
    structureToc();
    collectPages();

    // 저장된 설정 복원
    try {
      if (localStorage.getItem('jdh_tb_mode') === 'slide') slideMode = true;
      if (localStorage.getItem('jdh_tb_lang') === 'zh') {
        document.body.classList.remove('lang-ko');
        document.body.classList.add('lang-zh');
        document.documentElement.lang = 'zh';
      }
    } catch (e) {}

    // 주소의 #아이디 로 시작 위치 잡기
    var hs = (location.hash || '').replace('#', '');
    if (hs) {
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].id === hs) { cur = i; break; }
      }
    }

    applyLangBtn();
    applyMode();
    if (!slideMode && hs && pages[cur]) pages[cur].scrollIntoView({ block: 'start' });

    // 슬라이드 모드 이동 버튼
    var pv = $('#pprev'), nx = $('#pnext');
    if (pv) pv.addEventListener('click', function () { go(cur - 1); });
    if (nx) nx.addEventListener('click', function () { go(cur + 1); });

    // 이미지 자리표시자 — onerror 를 놓친 경우까지 처리
    $$('img.figimg').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) imgPlaceholder(img);
    });

    // 이벤트
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].id === id) {
          e.preventDefault();
          go(i);
          toggleToc(false);
          return;
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (!slideMode) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(pages.length - 1); }
    });

    // 인쇄할 때는 확인 문제 해설을 모두 펼친다 (인쇄본은 접을 수 없으므로)
    var reopened = [];
    window.addEventListener('beforeprint', function () {
      reopened = $$('details:not([open])');
      reopened.forEach(function (d) { d.open = true; });
    });
    window.addEventListener('afterprint', function () {
      reopened.forEach(function (d) { d.open = false; });
      reopened = [];
    });

    updateScrollProgress();
  }

  // 전역으로 열어 두는 함수 (HTML의 onclick / onerror 에서 사용)
  window.tbToggleMode = toggleMode;
  window.tbToggleToc = toggleToc;
  window.tbToggleLang = toggleLang;
  window.tbGo = go;
  window.copyCode = copyCode;
  window.imgPlaceholder = imgPlaceholder;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
