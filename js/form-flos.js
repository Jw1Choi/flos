/*!
 * FLOS 상담 신청 폼 — JS 컴포넌트
 * ============================================================================
 * 사용법
 *   <div data-flos-form
 *        data-source="본문 신청폼"
 *        data-ad-platform="메타"
 *        data-form-position="본문 하단"
 *        data-thanks-url="./thanks.html"></div>
 *
 *   <script src="./flos-apply-form.js" defer></script>
 *
 * ----------------------------------------------------------------------------
 * · div 를 여러 개 두면 폼도 여러 개 생성됩니다 (ID 자동 분리 → 충돌 없음)
 * · 스타일과 팝업은 문서당 1회만 주입됩니다
 * · 팝업은 document.body 에 붙어 부모의 stacking context 를 벗어납니다
 * ==========================================================================*/

(function () {
  'use strict';

  var VERSION = '1.0.0';

  /* ==========================================================================
     1. 설정
     --------------------------------------------------------------------------
     페이지에서 덮어쓰려면 이 스크립트보다 "먼저" 아래를 선언하세요.

       <script>
         window.FLOS_FORM_CONFIG = {
           thanksUrl: './thanks.html',
           showTech: false
         };
       </script>
  ========================================================================== */
  var DEFAULTS = {
    supabaseUrl:     'https://yiuioprceyuybwkgxmrm.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdWlvcHJjZXl1eWJ3a2d4bXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NDM1MDIsImV4cCI6MjA5NDMxOTUwMn0.SkkBCH9avPMZu-LeBtdOh5zsppcRMvbnilj38CkHEZs',

    /* 신청 완료 후 이동할 주소. 비우면 새로고침 */
    thanksUrl: '',

    /* 오류 팝업에 기술 정보 노출 여부
       개발/테스트 중 true, 실제 오픈 시 false 권장
       URL 에 ?flosdebug=1 을 붙이면 설정과 무관하게 항상 표시 */
    showTech: true,
    autoOpen: true,

    /* 기본 문구 (div 의 data-kicker / data-title / data-desc 로 개별 변경 가능) */
    kicker: 'FLOS LANDING PAGE',
    title:  '무료 상담 신청',
    desc:   '랜딩페이지 제작 가능 여부 및<br>비즈니스에 적용 가능할 수 있도록<br>제작을 도와드리겠습니다.',
    note:   '문의 내용을 남겨주시면 확인 후 순차적으로 연락드립니다.',

    /* 신청 프로그램 종류 — DB 화이트리스트와 반드시 일치해야 합니다 */
    programs: ['브랜딩 홈페이지', '랜딩페이지', '브랜드 컨설팅', 'AI 영상', '통합 패키지'],

    /* 버튼 문구 */
    btnLabel: {
      ready:   '무료 상담 신청하기',
      name:    '성함 입력을 확인하세요',
      phone:   '전화번호 입력을 확인하세요',
      program: '상담 분야 선택을 확인하세요',
      agree:   '개인정보 동의를 확인하세요'
    },

    sendingSteps: ['정보를 확인 중입니다', '전송 준비 중입니다', '곧 신청이 완료됩니다'],

    /* 성함 입력칸 최대 길이 */
    nameMaxLength: 6
  };

  var CFG = merge(DEFAULTS, window.FLOS_FORM_CONFIG || {});
  var RPC_URL = CFG.supabaseUrl.replace(/\/+$/, '') + '/rest/v1/rpc/submit_flos_consultation';

  var DEBUG = false;
  try { DEBUG = new URLSearchParams(location.search).get('flosdebug') === '1'; } catch (e) {}

  function merge(base, over) {
    var out = {}, k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    for (k in over) if (Object.prototype.hasOwnProperty.call(over, k)) {
      if (k === 'btnLabel' && over[k]) out[k] = merge(base[k], over[k]);
      else out[k] = over[k];
    }
    return out;
  }

  function log() {
    try { console.log.apply(console, ['[FLOS]'].concat([].slice.call(arguments))); } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ==========================================================================
     2. 스타일 (문서당 1회 주입)
  ========================================================================== */
  var CSS = [
    '.flos-apply-form{position:relative;background:#000;color:#fff;padding:80px 20px;',
    'font-family:"Pretendard","Noto Sans KR","Helvetica Neue",Arial,sans-serif;overflow:hidden;}',
    '.flos-apply-form *{box-sizing:border-box;}',

    '.flos-apply-form .flos-bg-line{position:absolute;left:50%;top:0;transform:translateX(-50%);',
    'width:min(92vw,1100px);height:100%;border-left:1px solid rgba(255,255,255,0.04);',
    'border-right:1px solid rgba(255,255,255,0.04);pointer-events:none;}',

    '.flos-apply-form .flos-form-wrap{width:100%;max-width:760px;margin:0 auto;position:relative;z-index:2;}',
    '.flos-apply-form .flos-form-head{text-align:center;margin-bottom:40px;}',
    '.flos-apply-form .flos-form-kicker{display:inline-block;font-size:12px;letter-spacing:0.34em;',
    'text-transform:uppercase;color:rgba(255,255,255,0.68);margin-bottom:16px;padding-bottom:10px;',
    'border-bottom:1px solid rgba(255,255,255,0.18);}',
    '.flos-apply-form .flos-form-title{margin:0;font-size:clamp(30px,5vw,54px);line-height:1.12;',
    'font-weight:500;letter-spacing:-0.04em;}',
    '.flos-apply-form .flos-form-desc{margin:16px auto 0;max-width:560px;font-size:15px;',
    'line-height:1.85;color:rgba(255,255,255,0.72);letter-spacing:-0.02em;}',

    '.flos-apply-form .gc-form{border:1px solid rgba(255,255,255,0.14);',
    'background:linear-gradient(180deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.02) 100%);',
    'padding:34px 28px 28px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
    'margin:0;position:relative;}',

    '.flos-apply-form .flos-hp{position:absolute !important;left:-9999px !important;top:auto !important;',
    'width:1px !important;height:1px !important;opacity:0 !important;overflow:hidden !important;',
    'pointer-events:none !important;z-index:-1 !important;}',

    '.flos-apply-form .gc-row{display:grid;grid-template-columns:1fr 1fr;gap:16px 14px;',
    'align-items:start;margin-bottom:16px;}',
    '.flos-apply-form .gc-row.gc-full{grid-template-columns:1fr;}',
    '.flos-apply-form .gc-row.gc-footer{grid-template-columns:1fr;gap:16px;margin-bottom:0;',
    'margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.1);}',

    '.flos-apply-form label{display:flex;flex-direction:column;gap:8px;min-width:0;}',
    '.flos-apply-form label > span{display:block;font-size:12px;color:rgba(255,255,255,0.78);',
    'letter-spacing:0.04em;line-height:1.5;}',
    '.flos-apply-form .req{color:#fff;margin-left:3px;}',

    '.flos-apply-form input[type="text"],.flos-apply-form input[type="tel"],',
    '.flos-apply-form select,.flos-apply-form textarea{width:100%;border:none;',
    'border-bottom:1px solid rgba(255,255,255,0.24);background:transparent;color:#fff;font-size:15px;',
    'padding:12px 2px;outline:none;border-radius:0;transition:border-color .3s ease,background .3s ease;',
    'appearance:none;-webkit-appearance:none;box-shadow:none;font-family:inherit;caret-color:#fff;}',

    '.flos-apply-form input[type="text"]::placeholder,.flos-apply-form input[type="tel"]::placeholder,',
    '.flos-apply-form textarea::placeholder{color:rgba(255,255,255,0.34);}',

    '.flos-apply-form input[type="text"]:focus,.flos-apply-form input[type="tel"]:focus,',
    '.flos-apply-form select:focus,.flos-apply-form textarea:focus{border-bottom-color:#fff;',
    'background:rgba(255,255,255,0.02);}',

    '.flos-apply-form input:-webkit-autofill,.flos-apply-form input:-webkit-autofill:hover,',
    '.flos-apply-form input:-webkit-autofill:focus,.flos-apply-form input:-webkit-autofill:active,',
    '.flos-apply-form textarea:-webkit-autofill,.flos-apply-form select:-webkit-autofill{',
    '-webkit-text-fill-color:#fff !important;caret-color:#fff !important;',
    'box-shadow:0 0 0px 1000px #000 inset !important;-webkit-box-shadow:0 0 0px 1000px #000 inset !important;',
    'transition:background-color 9999s ease-out 0s,color 9999s ease-out 0s !important;',
    'border-bottom:1px solid rgba(255,255,255,0.24) !important;}',
    '.flos-apply-form input:-internal-autofill-selected{background-color:transparent !important;color:#fff !important;}',

    '.flos-apply-form .custom-select-wrap{position:relative;width:100%;}',
    '.flos-apply-form .custom-select{background-image:url("data:image/svg+xml,%3Csvg width=\'14\' height=\'9\' viewBox=\'0 0 14 9\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L7 7.5L13 1.5\' stroke=\'white\' stroke-width=\'1.2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E");',
    'background-repeat:no-repeat;background-position:right 4px center;padding-right:28px;}',
    '.flos-apply-form .custom-select option{color:#111;background:#fff;}',

    '.flos-apply-form textarea{display:block;width:100%;height:140px;min-height:140px;max-height:200px;',
    'resize:vertical;overflow:auto;line-height:1.7;}',

    '.flos-apply-form .gc-consent{display:block;margin:0;cursor:pointer;}',
    '.flos-apply-form .gc-consent-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}',
    '.flos-apply-form .gc-consent input[type="checkbox"]{appearance:none;-webkit-appearance:none;',
    'width:18px;height:18px;border:1px solid rgba(255,255,255,0.42);background:transparent;margin:0;',
    'flex:0 0 18px;position:relative;cursor:pointer;vertical-align:middle;}',
    '.flos-apply-form .gc-consent input[type="checkbox"]::after{content:"";position:absolute;left:4px;top:1px;',
    'width:6px;height:10px;border-right:1.5px solid #000;border-bottom:1.5px solid #000;',
    'transform:rotate(45deg) scale(0);transform-origin:center;transition:transform .22s ease;}',
    '.flos-apply-form .gc-consent input[type="checkbox"]:checked{background:#fff;border-color:#fff;}',
    '.flos-apply-form .gc-consent input[type="checkbox"]:checked::after{transform:rotate(45deg) scale(1);}',
    '.flos-apply-form .gc-consent-main{display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0;flex:1;}',
    '.flos-apply-form .gc-consent-title{font-size:14px;line-height:1.4;color:#fff;font-weight:500;',
    'letter-spacing:-0.01em;white-space:nowrap;}',
    '.flos-apply-form .gc-policy-btn{border:none;background:transparent;color:rgba(255,255,255,0.78);',
    'font-size:13px;line-height:1.4;letter-spacing:-0.01em;padding:0;cursor:pointer;',
    'border-bottom:1px solid rgba(255,255,255,0.45);transition:all .25s ease;font-family:inherit;white-space:nowrap;}',
    '.flos-apply-form .gc-policy-btn:hover{color:#fff;border-bottom-color:#fff;}',
    '.flos-apply-form .gc-consent-desc{margin-top:6px;padding-left:28px;font-size:14px;line-height:1.7;',
    'color:rgba(255,255,255,0.72);letter-spacing:-0.01em;}',

    '.flos-apply-form .gc-button{width:100%;padding:17px 24px;border:1px solid #fff;background:#efefef;',
    'color:#000;font-size:15px;font-weight:600;letter-spacing:0.04em;cursor:pointer;',
    'transition:background .45s ease,color .45s ease,border-color .45s ease;font-family:inherit;}',
    '.flos-apply-form .gc-button:hover{background:#000;color:#fff;}',
    '.flos-apply-form .gc-button:disabled{background:#0a0a0a;border-color:rgba(255,255,255,0.24);',
    'color:rgba(255,255,255,0.6);cursor:default;opacity:1;font-weight:500;}',
    '.flos-apply-form .gc-button:disabled:hover{background:#0a0a0a;color:rgba(255,255,255,0.6);}',
    '.flos-apply-form .gc-button.is-sending,.flos-apply-form .gc-button.is-sending:hover{',
    'background:#222;border-color:#222;color:#fff;cursor:progress;}',

    '.flos-apply-form .flos-note{margin-top:16px;text-align:center;font-size:12px;line-height:1.7;',
    'color:rgba(255,255,255,0.46);}',

    /* ---------- 팝업 공통 (body 직속) ---------- */
    '.flos-ov{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;',
    'font-family:"Pretendard","Noto Sans KR","Helvetica Neue",Arial,sans-serif;',
    'opacity:0;visibility:hidden;pointer-events:none;transition:opacity .28s ease,visibility .28s ease;}',
    '.flos-ov *{box-sizing:border-box;}',
    '.flos-ov.is-open{opacity:1;visibility:visible;pointer-events:auto;}',
    'body.flos-modal-open{overflow:hidden;}',

    /* ---------- 개인정보 모달 ---------- */
    '.flos-policy-ov{padding:24px;background:rgba(0,0,0,0.76);z-index:99999;}',
    '.flos-policy-dialog{width:100%;max-width:760px;max-height:88vh;overflow:hidden;background:#0b0b0b;',
    'border:1px solid rgba(255,255,255,0.16);box-shadow:0 30px 80px rgba(0,0,0,0.45);',
    'transform:translateY(18px);transition:transform .28s ease;}',
    '.flos-policy-ov.is-open .flos-policy-dialog{transform:translateY(0);}',
    '.flos-policy-head{display:flex;align-items:center;justify-content:space-between;gap:20px;',
    'padding:20px 22px;border-bottom:1px solid rgba(255,255,255,0.1);}',
    '.flos-policy-title{margin:0;font-size:20px;font-weight:500;letter-spacing:-0.03em;color:#fff;}',
    '.flos-policy-close{border:none;background:transparent;color:rgba(255,255,255,0.8);font-size:28px;',
    'line-height:1;cursor:pointer;padding:0;width:32px;height:32px;flex:0 0 32px;font-family:inherit;}',
    '.flos-policy-close:hover{color:#fff;}',
    '.flos-policy-body{max-height:calc(88vh - 74px);overflow:auto;padding:24px 22px 26px;',
    'color:rgba(255,255,255,0.78);line-height:1.9;font-size:15px;}',
    '.flos-policy-body h4{margin:0 0 10px;font-size:15px;font-weight:600;color:#fff;letter-spacing:-0.02em;}',
    '.flos-policy-body .policy-block + .policy-block{margin-top:20px;padding-top:20px;',
    'border-top:1px solid rgba(255,255,255,0.08);}',
    '.flos-policy-body ul{margin:8px 0 0;padding-left:18px;}',
    '.flos-policy-body li{margin-bottom:6px;}',
    '.flos-policy-body strong{color:#fff;font-weight:500;}',

    /* ---------- 결과 / 진단 팝업 ---------- */
    '.flos-result-ov{padding:20px;background:rgba(0,0,0,0.82);z-index:100000;}',
    '.flos-result-dialog{width:100%;max-width:560px;max-height:86vh;display:flex;flex-direction:column;',
    'background:#0b0b0b;border:1px solid rgba(255,255,255,0.16);box-shadow:0 30px 80px rgba(0,0,0,0.5);',
    'transform:translateY(16px);transition:transform .25s ease;overflow:hidden;}',
    '.flos-result-ov.is-open .flos-result-dialog{transform:translateY(0);}',
    '.flos-result-bar{height:3px;background:#8a8a8a;flex:0 0 3px;}',
    '.flos-result-ov.type-success .flos-result-bar{background:#3ecf8e;}',
    '.flos-result-ov.type-error .flos-result-bar{background:#ff5c5c;}',
    '.flos-result-ov.type-warn .flos-result-bar{background:#ffb020;}',
    '.flos-result-head{display:flex;align-items:flex-start;gap:12px;padding:24px 24px 0;}',
    '.flos-result-icon{width:26px;height:26px;flex:0 0 26px;border-radius:50%;display:flex;',
    'align-items:center;justify-content:center;font-size:15px;font-weight:700;line-height:1;color:#000;',
    'background:#8a8a8a;margin-top:2px;}',
    '.flos-result-ov.type-success .flos-result-icon{background:#3ecf8e;}',
    '.flos-result-ov.type-error .flos-result-icon{background:#ff5c5c;}',
    '.flos-result-ov.type-warn .flos-result-icon{background:#ffb020;}',
    '.flos-result-title{margin:0;font-size:19px;font-weight:600;letter-spacing:-0.03em;color:#fff;line-height:1.4;}',
    '.flos-result-body{padding:12px 24px 0;overflow:auto;flex:1 1 auto;}',
    '.flos-result-msg{margin:0;font-size:15px;line-height:1.75;color:rgba(255,255,255,0.78);',
    'letter-spacing:-0.01em;white-space:pre-line;}',
    '.flos-result-tech{margin-top:18px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.03);}',
    '.flos-result-tech[hidden]{display:none;}',
    '.flos-result-tech > summary{list-style:none;cursor:pointer;padding:11px 14px;font-size:12px;',
    'letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.62);user-select:none;}',
    '.flos-result-tech > summary::-webkit-details-marker{display:none;}',
    '.flos-result-tech > summary::before{content:"\\25B8 ";color:rgba(255,255,255,0.45);}',
    '.flos-result-tech[open] > summary::before{content:"\\25BE ";}',
    '.flos-result-tech > summary:hover{color:#fff;}',
    '.flos-result-pre{margin:0;padding:0 14px 14px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;',
    'font-size:12px;line-height:1.7;color:rgba(255,255,255,0.8);white-space:pre-wrap;word-break:break-all;',
    'max-height:280px;overflow:auto;}',
    '.flos-result-actions{display:flex;gap:10px;padding:20px 24px 24px;flex:0 0 auto;}',
    '.flos-result-btn{flex:1;padding:13px 16px;border:1px solid rgba(255,255,255,0.28);background:transparent;',
    'color:#fff;font-size:14px;font-weight:500;letter-spacing:0.04em;cursor:pointer;transition:all .25s ease;',
    'font-family:inherit;}',
    '.flos-result-btn:hover{border-color:#fff;background:rgba(255,255,255,0.08);}',
    '.flos-result-btn.is-primary{background:#efefef;border-color:#efefef;color:#000;font-weight:600;}',
    '.flos-result-btn.is-primary:hover{background:#fff;border-color:#fff;}',
    '.flos-result-btn[hidden]{display:none;}',

    /* ---------- 모바일 ---------- */
    '@media (max-width:768px){',
    '.flos-apply-form{padding:64px 16px;}',
    '.flos-apply-form .flos-form-head{margin-bottom:32px;}',
    '.flos-apply-form .gc-form{padding:26px 20px 22px;}',
    '.flos-apply-form .gc-row{grid-template-columns:1fr;gap:14px;margin-bottom:14px;}',
    '.flos-apply-form .flos-form-desc{font-size:14px;line-height:1.8;}',
    '.flos-apply-form textarea{height:126px;min-height:126px;max-height:180px;}',
    '.flos-apply-form .gc-consent-row{align-items:flex-start;}',
    '.flos-apply-form .gc-consent-main{align-items:flex-start;gap:8px;}',
    '.flos-apply-form .gc-consent-title,.flos-apply-form .gc-consent-desc{font-size:13px;}',
    '.flos-apply-form .gc-consent-title{white-space:normal;}',
    '.flos-apply-form .gc-button{font-size:14px;padding:16px 20px;}',
    '.flos-policy-ov{padding:14px;}',
    '.flos-policy-head{padding:18px;}',
    '.flos-policy-body{padding:20px 18px 22px;font-size:14px;}',
    '.flos-policy-title{font-size:18px;}',
    '.flos-result-ov{padding:14px;}',
    '.flos-result-head{padding:20px 18px 0;}',
    '.flos-result-body{padding:10px 18px 0;}',
    '.flos-result-actions{padding:16px 18px 18px;flex-direction:column;}',
    '.flos-result-title{font-size:17px;}',
    '.flos-result-msg{font-size:14px;}',
    '.flos-result-pre{font-size:11px;max-height:220px;}',
    '}'
  ].join('');

  function injectStyles() {
    if (document.getElementById('flos-apply-form-style')) return;
    var s = document.createElement('style');
    s.id = 'flos-apply-form-style';
    s.type = 'text/css';
    s.appendChild(document.createTextNode(CSS));
    (document.head || document.documentElement).appendChild(s);
  }

  /* ==========================================================================
     3. 공용 팝업 (문서당 1개, document.body 직속)
  ========================================================================== */
  var POLICY_HTML =
    '<div class="flos-policy-dialog" role="dialog" aria-modal="true">' +
      '<div class="flos-policy-head">' +
        '<h3 class="flos-policy-title">개인정보 수집 및 이용 동의</h3>' +
        '<button type="button" class="flos-policy-close" aria-label="닫기">&times;</button>' +
      '</div>' +
      '<div class="flos-policy-body">' +
        '<div class="policy-block">FLOS(이하 “회사”)는 상담 및 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.</div>' +
        '<div class="policy-block"><h4>1. 수집하는 개인정보 항목</h4><ul>' +
          '<li><strong>필수항목:</strong> 성함, 전화번호</li>' +
          '<li><strong>선택항목:</strong> 회사명, 신청 프로그램 종류, 문의 사항</li></ul></div>' +
        '<div class="policy-block"><h4>2. 개인정보 수집 및 이용 목적</h4><ul>' +
          '<li>상담 신청에 대한 응대 및 안내</li>' +
          '<li>서비스 제공을 위한 연락 및 커뮤니케이션</li>' +
          '<li>고객 요청사항 확인 및 맞춤 상담 진행</li></ul></div>' +
        '<div class="policy-block"><h4>3. 개인정보 보유 및 이용 기간</h4><ul>' +
          '<li>수집된 개인정보는 <strong>상담 완료 후 3개월간 보관</strong>되며, 이후 지체 없이 파기합니다.</li>' +
          '<li>단, 관련 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보관될 수 있습니다.</li></ul></div>' +
        '<div class="policy-block"><h4>4. 개인정보 제공 및 위탁</h4><ul>' +
          '<li>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.</li>' +
          '<li>다만, 법령에 의거하거나 이용자의 별도 동의가 있는 경우에 한하여 제공될 수 있습니다.</li></ul></div>' +
        '<div class="policy-block"><h4>5. 동의 거부 권리 및 불이익 안내</h4><ul>' +
          '<li>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.</li>' +
          '<li>단, 필수항목에 대한 동의를 거부할 경우 상담 신청이 제한될 수 있습니다.</li></ul></div>' +
        '<div class="policy-block"><h4>6. 개인정보 보호</h4>' +
          '회사는 고객의 개인정보를 안전하게 관리하기 위해 합리적인 보호조치를 적용하며, ' +
          '관련 법령이 정하는 기준에 따라 개인정보를 보호하기 위해 노력합니다.</div>' +
      '</div>' +
    '</div>';

  var RESULT_HTML =
    '<div class="flos-result-dialog" role="alertdialog" aria-modal="true">' +
      '<div class="flos-result-bar"></div>' +
      '<div class="flos-result-head">' +
        '<div class="flos-result-icon" data-fl="icon">!</div>' +
        '<h3 class="flos-result-title" data-fl="title">알림</h3>' +
      '</div>' +
      '<div class="flos-result-body">' +
        '<p class="flos-result-msg" data-fl="msg"></p>' +
        '<details class="flos-result-tech" data-fl="tech" hidden>' +
          '<summary>기술 정보 (개발자용)</summary>' +
          '<pre class="flos-result-pre" data-fl="pre"></pre>' +
        '</details>' +
      '</div>' +
      '<div class="flos-result-actions">' +
        '<button type="button" class="flos-result-btn" data-fl="copy" hidden>기술 정보 복사</button>' +
        '<button type="button" class="flos-result-btn is-primary" data-fl="close">확인</button>' +
      '</div>' +
    '</div>';

  var UI = null;

  function buildUI() {
    if (UI) return UI;

    /* --- 개인정보 모달 --- */
    var policy = document.createElement('div');
    policy.className = 'flos-ov flos-policy-ov';
    policy.setAttribute('aria-hidden', 'true');
    policy.innerHTML = POLICY_HTML;
    document.body.appendChild(policy);

    var policyDialog = policy.querySelector('.flos-policy-dialog');

    function openPolicy(e) {
      if (e) e.preventDefault();
      policy.classList.add('is-open');
      policy.setAttribute('aria-hidden', 'false');
      document.body.classList.add('flos-modal-open');
    }
    function closePolicy() {
      policy.classList.remove('is-open');
      policy.setAttribute('aria-hidden', 'true');
      if (!result.classList.contains('is-open')) document.body.classList.remove('flos-modal-open');
    }

    policy.querySelector('.flos-policy-close').addEventListener('click', closePolicy);
    policy.addEventListener('click', function (e) {
      if (!policyDialog.contains(e.target)) closePolicy();
    });

    /* --- 결과 / 진단 팝업 --- */
    var result = document.createElement('div');
    result.className = 'flos-ov flos-result-ov';
    result.setAttribute('aria-hidden', 'true');
    result.innerHTML = RESULT_HTML;
    document.body.appendChild(result);

    var rDialog = result.querySelector('.flos-result-dialog');
    var rIcon   = result.querySelector('[data-fl="icon"]');
    var rTitle  = result.querySelector('[data-fl="title"]');
    var rMsg    = result.querySelector('[data-fl="msg"]');
    var rTech   = result.querySelector('[data-fl="tech"]');
    var rPre    = result.querySelector('[data-fl="pre"]');
    var rCopy   = result.querySelector('[data-fl="copy"]');
    var rClose  = result.querySelector('[data-fl="close"]');

    var ICONS = { success: '\u2713', error: '!', warn: '!', info: 'i' };
    var onClose = null;

    function showResult(opt) {
      var type = opt.type || 'info';
      result.classList.remove('type-success', 'type-error', 'type-warn', 'type-info');
      result.classList.add('type-' + type);

      rIcon.textContent  = ICONS[type] || 'i';
      rTitle.textContent = opt.title || '알림';
      rMsg.textContent   = opt.message || '';
      rClose.textContent = opt.closeLabel || '확인';

      var tech = opt.tech || '';
      if (tech && (CFG.showTech || DEBUG)) {
        rPre.textContent = tech;
        rTech.hidden = false;
        rTech.open = DEBUG || CFG.autoOpen;
        rCopy.hidden = false;
      } else {
        rPre.textContent = '';
        rTech.hidden = true;
        rTech.open = false;
        rCopy.hidden = true;
      }

      onClose = typeof opt.onClose === 'function' ? opt.onClose : null;

      result.classList.add('is-open');
      result.setAttribute('aria-hidden', 'false');
      document.body.classList.add('flos-modal-open');
      try { rClose.focus(); } catch (e) {}
    }

    function closeResult() {
      result.classList.remove('is-open');
      result.setAttribute('aria-hidden', 'true');
      if (!policy.classList.contains('is-open')) document.body.classList.remove('flos-modal-open');

      var fn = onClose;
      onClose = null;
      if (fn) fn();
    }

    rClose.addEventListener('click', closeResult);
    result.addEventListener('click', function (e) {
      if (!rDialog.contains(e.target)) closeResult();
    });

    rCopy.addEventListener('click', function () {
      var text = rPre.textContent || '';
      var label = rCopy.textContent;
      function done() {
        rCopy.textContent = '복사되었습니다';
        setTimeout(function () { rCopy.textContent = label; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }

      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          done();
        } catch (e) {
          rCopy.textContent = '복사 실패 — 직접 선택해주세요';
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (result.classList.contains('is-open')) { closeResult(); return; }
      if (policy.classList.contains('is-open')) closePolicy();
    });

    UI = { openPolicy: openPolicy, showResult: showResult };
    return UI;
  }

  /* ==========================================================================
     4. 유입 정보 (문서당 1회 계산)
  ========================================================================== */
  var TRACK_KEY = 'flos_track_v1';
  var TRACK = null;

  function safeStr(v, max) {
    if (v == null) return '';
    return String(v).replace(/[\u0000-\u001F\u007F<>"'`\\]/g, '').trim().slice(0, max || 60);
  }

  function getTrack() {
    if (TRACK) return TRACK;

    var qs;
    try { qs = new URLSearchParams(window.location.search); }
    catch (e) { qs = new URLSearchParams(''); }

    function param(keys, max) {
      for (var i = 0; i < keys.length; i++) {
        var v = safeStr(qs.get(keys[i]), max);
        if (v) return v;
      }
      return '';
    }

    var fresh = {
      referral:     param(['referral', 'ref', 'utm_referral', 'utm_id'], 60).replace(/[^A-Za-z0-9가-힣_.\-]/g, ''),
      utm_source:   param(['utm_source'], 40),
      utm_content:  param(['utm_content'], 40),
      utm_medium:   param(['utm_medium'], 60),
      utm_campaign: param(['utm_campaign'], 100)
    };

    var saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(TRACK_KEY) || '{}'); } catch (e) {}

    TRACK = {
      referral:     fresh.referral     || safeStr(saved.referral, 60)      || '',
      utm_source:   fresh.utm_source   || safeStr(saved.utm_source, 40)    || '',
      utm_content:  fresh.utm_content  || safeStr(saved.utm_content, 40)   || '',
      utm_medium:   fresh.utm_medium   || safeStr(saved.utm_medium, 60)    || '',
      utm_campaign: fresh.utm_campaign || safeStr(saved.utm_campaign, 100) || ''
    };

    try { sessionStorage.setItem(TRACK_KEY, JSON.stringify(TRACK)); } catch (e) {}
    return TRACK;
  }

  /* ==========================================================================
     5. 오류 안내 매핑
  ========================================================================== */
  var CODE_MAP = {
    INVALID: {
      title: '입력 내용을 확인해주세요',
      message: '입력하신 정보 중 형식이 맞지 않는 항목이 있습니다.\n성함, 전화번호, 신청 프로그램을 다시 확인해주세요.',
      checklist: [
        'SQL 함수가 구버전일 수 있습니다 (INVALID 는 구버전 응답코드)',
        'flos_debug_patch.sql 적용 시 정확한 원인이 표시됩니다',
        'extensions.digest 미설치로 함수 내부 예외가 삼켜졌을 가능성',
        "확인: select encode(extensions.digest('t','sha256'),'hex');"
      ]
    },
    INVALID_NAME:    { title: '성함을 확인해주세요',          message: '성함 형식이 올바르지 않습니다.' },
    INVALID_PHONE:   { title: '전화번호를 확인해주세요',      message: '휴대폰 번호를 숫자만 입력해주세요.\n예) 01012345678' },
    INVALID_PROGRAM: { title: '신청 프로그램을 확인해주세요', message: '선택하신 프로그램 종류가 올바르지 않습니다.' },
    BUSY:            { title: '잠시 후 다시 시도해주세요',    message: '현재 신청이 많아 접수가 지연되고 있습니다.' },
    SERVER_ERROR:    { title: '접수 중 오류가 발생했습니다',  message: '잠시 후 다시 시도해주세요.\n계속 문제가 발생하면 아래 추적ID를 알려주세요.' }
  };

  var HTTP_MAP = {
    400: { title: '요청 형식 오류 (HTTP 400)',
           checklist: ['RPC 파라미터 이름이 함수 정의와 일치하는지 확인', '함수 변경 후 스키마 캐시 미갱신 가능성'],
           sql: "notify pgrst, 'reload schema';" },
    401: { title: '인증 오류 (HTTP 401)',
           checklist: ['anon key 가 이 프로젝트의 값이 맞는지 확인', 'Settings > API 에서 Project URL / anon public key 재확인'] },
    403: { title: '권한 오류 (HTTP 403)',
           checklist: ['anon 에게 함수 EXECUTE 권한이 없습니다', 'grant execute on function ... to anon; 실행 여부 확인'],
           sql: "select p.proname, has_function_privilege('anon', p.oid, 'execute') as anon_ok\n  from pg_proc p join pg_namespace n on n.oid = p.pronamespace\n where n.nspname='public' and p.proname='submit_flos_consultation';" },
    404: { title: '함수를 찾을 수 없습니다 (HTTP 404)',
           checklist: ['SQL 파일이 실제로 실행되었는지 확인', '스키마 캐시가 갱신되지 않았을 수 있습니다',
                       'supabaseUrl 의 프로젝트가 맞는지 확인', '파라미터 개수/이름이 다르면 404 가 납니다'],
           sql: "notify pgrst, 'reload schema';" },
    500: { title: '서버 오류 (HTTP 500)',
           checklist: ['Dashboard > Logs > Postgres 에서 상세 로그 확인', '함수 내부 미처리 예외 가능성'] }
  };

  function buildReport(info) {
    var lines = [];
    function add(k, v) {
      if (v === undefined || v === null || v === '') return;
      lines.push(k + ': ' + v);
    }
    add('발생시각', new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
    add('구분', info.kind);
    add('HTTP', info.status !== undefined ? (info.status + ' ' + (info.statusText || '')) : undefined);
    add('오류코드', info.code);
    add('추적ID', info.trace);
    add('요청URL', RPC_URL);
    add('페이지', location.href);
    add('컴포넌트', 'flos-apply-form.js v' + VERSION);
    add('브라우저', navigator.userAgent);

    if (info.raw) {
      lines.push('', '── 서버 응답 원문 ──', String(info.raw).slice(0, 1500));
    }
    if (info.payload) {
      lines.push('', '── 전송 데이터(번호 마스킹) ──');
      try { lines.push(JSON.stringify(info.payload, null, 2)); }
      catch (e) { lines.push('(직렬화 실패)'); }
    }
    if (info.checklist && info.checklist.length) {
      lines.push('', '── 확인할 것 ──');
      info.checklist.forEach(function (c, i) { lines.push((i + 1) + '. ' + c); });
    }
    if (info.sql) {
      lines.push('', '── SQL Editor 에서 실행 ──', info.sql);
    }
    return lines.join('\n');
  }

  function fireConversion() {
    try { if (window.karrotPixel && window.karrotPixel.track) window.karrotPixel.track('SubmitApplication'); } catch (e) {}
    try { if (typeof window.fbq === 'function') window.fbq('track', 'Lead'); } catch (e) {}
    try { if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead'); } catch (e) {}
    try { if (window.wcs && window.wcs_do) window.wcs_do(); } catch (e) {}
  }

  /* ==========================================================================
     6. 폼 마운트
  ========================================================================== */
  var NAME_RE  = /^[가-힣a-zA-Z][가-힣a-zA-Z\s]{1,}$/;
  var PHONE_RE = /^01[016789][0-9]{7,8}$/;
  var seq = 0;

  function mount(host) {
    if (host.getAttribute('data-flos-mounted') === '1') return;
    host.setAttribute('data-flos-mounted', '1');

    var ui  = buildUI();
    var uid = 'flosF' + (++seq);
    var d   = host.dataset || {};

    var opt = {
      source:       d.source       || '본문 신청폼',
      adPlatform:   d.adPlatform   || '',
      formPosition: d.formPosition || '',
      thanksUrl:    (d.thanksUrl !== undefined ? d.thanksUrl : CFG.thanksUrl) || '',
      kicker:       d.kicker || CFG.kicker,
      title:        d.title  || CFG.title,
      desc:         d.desc   || CFG.desc,
      note:         d.note   || CFG.note
    };

    var options = CFG.programs.map(function (p) {
      return '<option value="' + esc(p) + '">' + esc(p) + '</option>';
    }).join('');

    host.classList.add('flos-apply-form');
    host.innerHTML =
      '<div class="flos-bg-line"></div>' +
      '<div class="flos-form-wrap">' +
        '<div class="flos-form-head">' +
          '<div class="flos-form-kicker">' + esc(opt.kicker) + '</div>' +
          '<h2 class="flos-form-title">' + esc(opt.title) + '</h2>' +
          '<p class="flos-form-desc">' + opt.desc + '</p>' +
        '</div>' +
        '<form class="gc-form" novalidate>' +
          '<div class="flos-hp" aria-hidden="true">' +
            '<label for="' + uid + '_hp">이 항목은 비워두세요</label>' +
            '<input type="text" id="' + uid + '_hp" data-fl="hp" tabindex="-1" autocomplete="off">' +
          '</div>' +

          '<div class="gc-row">' +
            '<label for="' + uid + '_name"><span>성함<span class="req">*</span></span>' +
              '<input type="text" id="' + uid + '_name" data-fl="name" placeholder="성함을 입력해주세요." ' +
              'maxlength="' + CFG.nameMaxLength + '" autocomplete="name"></label>' +
            '<label for="' + uid + '_phone"><span>전화번호<span class="req">*</span></span>' +
              '<input type="tel" id="' + uid + '_phone" data-fl="phone" placeholder="연락처를 입력해주세요." ' +
              'maxlength="11" autocomplete="tel" inputmode="numeric"></label>' +
          '</div>' +

          '<div class="gc-row">' +
            '<label for="' + uid + '_company"><span>회사명</span>' +
              '<input type="text" id="' + uid + '_company" data-fl="company" ' +
              'placeholder="회사명 또는 브랜드명을 입력해주세요." maxlength="30" autocomplete="organization"></label>' +
            '<label for="' + uid + '_program"><span>신청 프로그램 종류<span class="req">*</span></span>' +
              '<div class="custom-select-wrap">' +
                '<select id="' + uid + '_program" data-fl="program" class="custom-select">' +
                  '<option value="" selected disabled>신청 프로그램 종류</option>' + options +
                '</select>' +
              '</div></label>' +
          '</div>' +

          '<div class="gc-row gc-full">' +
            '<label for="' + uid + '_message"><span>문의 사항</span>' +
              '<textarea id="' + uid + '_message" data-fl="message" maxlength="1000" autocomplete="off" ' +
              'placeholder="현재 고민하고 있는 내용이나 문의하실 내용을 자유롭게 작성해 주세요."></textarea></label>' +
          '</div>' +

          '<div class="gc-row gc-footer">' +
            '<label class="gc-consent" for="' + uid + '_agree">' +
              '<div class="gc-consent-row">' +
                '<input type="checkbox" id="' + uid + '_agree" data-fl="agree" checked>' +
                '<div class="gc-consent-main">' +
                  '<span class="gc-consent-title">개인정보 수집 및 이용에 동의합니다. <span class="req">*</span></span>' +
                  '<button type="button" class="gc-policy-btn" data-fl="policy">전문보기</button>' +
                '</div>' +
              '</div>' +
              '<div class="gc-consent-desc">상담 진행을 위한 최소한의 정보만 수집되며, 관련 목적 외에는 사용되지 않습니다.</div>' +
            '</label>' +
            '<input type="submit" class="gc-button" data-fl="submit" value="' + esc(CFG.btnLabel.ready) + '">' +
          '</div>' +

          '<p class="flos-note">' + esc(opt.note) + '</p>' +
        '</form>' +
      '</div>';

    /* ---------- 요소 참조 ---------- */
    var $ = function (n) { return host.querySelector('[data-fl="' + n + '"]'); };

    var form      = host.querySelector('form');
    var elName    = $('name');
    var elPhone   = $('phone');
    var elCompany = $('company');
    var elProgram = $('program');
    var elMessage = $('message');
    var elAgree   = $('agree');
    var elSubmit  = $('submit');
    var elHp      = $('hp');

    var mountedAt = Date.now();
    var sending   = false;
    var timer     = null;

    $('policy').addEventListener('click', ui.openPolicy);

    /* ---------- 버튼 상태 ---------- */
    function checkForm() {
      var name  = elName.value.trim();
      var phone = elPhone.value.replace(/[^0-9]/g, '');

      if (!NAME_RE.test(name))   return { ok: false, label: CFG.btnLabel.name,    focus: elName };
      if (!PHONE_RE.test(phone)) return { ok: false, label: CFG.btnLabel.phone,   focus: elPhone };
      if (!elProgram.value)      return { ok: false, label: CFG.btnLabel.program, focus: elProgram };
      if (!elAgree.checked)      return { ok: false, label: CFG.btnLabel.agree,   focus: elAgree };

      return { ok: true, label: CFG.btnLabel.ready };
    }

    function refreshButton() {
      if (sending) return;
      var st = checkForm();
      elSubmit.value = st.label;
      elSubmit.disabled = !st.ok;
      elSubmit.classList.remove('is-sending');
    }

    ['input', 'change', 'keyup', 'blur'].forEach(function (evt) {
      [elName, elPhone, elProgram, elAgree, elCompany, elMessage].forEach(function (el) {
        if (el) el.addEventListener(evt, refreshButton);
      });
    });

    elPhone.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
    });

    refreshButton();

    function startSending() {
      sending = true;
      elSubmit.disabled = true;
      elSubmit.classList.add('is-sending');
      elSubmit.value = CFG.sendingSteps[0];

      var i = 0;
      timer = setInterval(function () {
        i++;
        if (i < CFG.sendingSteps.length) elSubmit.value = CFG.sendingSteps[i];
        else { clearInterval(timer); timer = null; }
      }, 1000);
    }

    function stopSending() {
      if (timer) { clearInterval(timer); timer = null; }
      sending = false;
      elSubmit.classList.remove('is-sending');
      refreshButton();
    }

    function leaveAfterSuccess() {
      var url = String(opt.thanksUrl || '').trim();
      log('완료 후 이동:', url || '(새로고침)');
      if (url) window.location.href = url;
      else window.location.reload();
    }

    /* ---------- 제출 ---------- */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;

      var st = checkForm();
      if (!st.ok) {
        refreshButton();
        if (st.focus) { try { st.focus.focus(); } catch (err) {} }
        return;
      }

      var track = getTrack();

      var payload = {
        p_name:          elName.value.trim().slice(0, 20),
        p_phone:         elPhone.value.replace(/[^0-9]/g, '').slice(0, 11),
        p_program_type:  elProgram.value,
        p_company:       elCompany.value.trim().slice(0, 30) || null,
        p_message:       elMessage.value.trim().slice(0, 1000) || null,
        p_source:        safeStr(opt.source, 60) || '본문 신청폼',
        p_referral:      track.referral || null,
        p_ad_platform:   safeStr(opt.adPlatform, 40)   || track.utm_source  || null,
        p_form_position: safeStr(opt.formPosition, 40) || track.utm_content || null,
        p_utm_medium:    track.utm_medium   || null,
        p_utm_campaign:  track.utm_campaign || null,
        p_page_url:      (location.origin + location.pathname).slice(0, 300),
        p_hp:            elHp ? elHp.value : '',
        p_elapsed_ms:    Date.now() - mountedAt
      };

      var masked = {};
      for (var k in payload) masked[k] = payload[k];
      masked.p_phone = payload.p_phone.length >= 8
        ? payload.p_phone.slice(0, 3) + '****' + payload.p_phone.slice(-4)
        : '(invalid)';

      log('전송 payload', masked);
      startSending();

      var status = 0, statusText = '', raw = '';

      fetch(RPC_URL, {
        method: 'POST',
        headers: {
          'apikey': CFG.supabaseAnonKey,
          'Authorization': 'Bearer ' + CFG.supabaseAnonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        status = res.status;
        statusText = res.statusText || '';
        return res.text().then(function (t) { raw = t; return { ok: res.ok }; });
      })
      .then(function (meta) {
        var result = null;
        try { result = JSON.parse(raw); } catch (e) {}
        log('HTTP ' + status + ' ' + statusText, raw);

        /* --- 정상 접수 --- */
        if (meta.ok && result && result.ok === true) {
          fireConversion();
          ui.showResult({
            type: 'success',
            title: '상담 신청이 접수되었습니다',
            message: '확인 후 순차적으로 연락드리겠습니다.\n감사합니다.',
            onClose: leaveAfterSuccess
          });
          form.reset();
          elAgree.checked = true;
          if (elHp) elHp.value = '';
          stopSending();
          return;
        }

        /* --- HTTP 실패 --- */
        if (!meta.ok) {
          var info = HTTP_MAP[status] || {
            title: '접수 중 오류가 발생했습니다 (HTTP ' + status + ')',
            checklist: ['Dashboard > Logs 에서 상세 내역을 확인해주세요']
          };
          ui.showResult({
            type: 'error',
            title: (CFG.showTech || DEBUG) ? info.title : '접수 중 오류가 발생했습니다',
            message: '잠시 후 다시 시도해주세요.\n문제가 계속되면 아래 기술 정보를 담당자에게 전달해주세요.',
            tech: buildReport({
              kind: 'HTTP 오류', status: status, statusText: statusText,
              raw: raw, payload: masked, checklist: info.checklist, sql: info.sql
            })
          });
          stopSending();
          return;
        }

        /* --- 함수가 실패 코드 반환 --- */
        var code  = (result && result.code)  || 'SERVER_ERROR';
        var trace = (result && result.trace) || null;
        var cm    = CODE_MAP[code] || CODE_MAP.SERVER_ERROR;

        log('실패 코드', code, 'trace:', trace);

        ui.showResult({
          type: 'error',
          title: cm.title,
          message: cm.message + (trace ? '\n\n추적ID: ' + trace : ''),
          tech: buildReport({
            kind: '함수 반환 오류', status: status, statusText: statusText,
            code: code, trace: trace, raw: raw, payload: masked, checklist: cm.checklist,
            sql: trace
              ? "select * from public.flos_error_log where trace_id = '" + trace + "';"
              : "select created_at_kst, stage, sqlstate, err_message\n  from public.flos_error_log\n order by created_at desc limit 20;"
          })
        });
        stopSending();
      })
      .catch(function (err) {
        log('네트워크 예외', err);
        ui.showResult({
          type: 'error',
          title: '네트워크 오류',
          message: '연결 상태를 확인한 뒤 다시 시도해주세요.',
          tech: buildReport({
            kind: '네트워크 / CORS 예외',
            raw: (err && err.message) ? err.message : String(err),
            payload: masked,
            checklist: [
              '인터넷 연결 상태 확인',
              'supabaseUrl 오타 여부 확인',
              '광고 차단 확장 프로그램이 요청을 막고 있는지 확인',
              'file:// 로 열면 CORS 로 차단됩니다 — http(s) 로 접속하세요'
            ]
          })
        });
        stopSending();
      });
    });

    log('폼 마운트 완료 ·', uid, '· 위치:', opt.formPosition || '(미지정)',
        '· 완료 후 이동:', opt.thanksUrl || '(새로고침)');
  }

  /* ==========================================================================
     7. 초기화
  ========================================================================== */
  function init() {
    injectStyles();
    var nodes = document.querySelectorAll('[data-flos-form]');
    for (var i = 0; i < nodes.length; i++) mount(nodes[i]);
    log('초기화 완료 · v' + VERSION + ' · 폼 ' + nodes.length + '개 · 기술정보:',
        CFG.showTech ? 'ON' : 'OFF', '· 디버그:', DEBUG ? 'ON' : 'OFF');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* 나중에 동적으로 추가된 div 를 수동으로 마운트할 때 사용
     예) FlosApplyForm.mount(document.getElementById('my-div')); */
  window.FlosApplyForm = {
    version: VERSION,
    config: CFG,
    mount: function (el) { injectStyles(); mount(el); },
    refresh: init
  };
})();