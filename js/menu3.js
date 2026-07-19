(function () {
  const MENU_TEMPLATE = `
<section id="nav-section">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');

  #nav-section .tp-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.94);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition:
      background 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
      box-shadow 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
      transform 0.42s cubic-bezier(0.33, 1, 0.68, 1),
      color 0.3s ease;
    will-change: transform;
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    line-height: 1.5;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  #nav-section .tp-header.scrolled {
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.38);
  }

  #nav-section .tp-header.menu-open {
    background: rgba(0, 0, 0, 0.98);
  }

  #nav-section .tp-header.hide-on-scroll {
    transform: translateY(-100%);
  }

  #nav-section .tp-header.top-transparent {
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-bottom-color: transparent;
  }

  #nav-section .tp-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 60px;
    height: 80px;
    position: relative;
  }

  #nav-section .tp-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    z-index: 10001;
    flex-shrink: 0;
  }

  #nav-section .tp-logo img {
    display: block;
    width: 130px;
    height: auto;
  }

  #nav-section .tp-nav {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 0;
  }

  #nav-section .tp-nav__item {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    list-style: none;
  }

  #nav-section .tp-nav__link {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 24px;
    font-size: 15.5px;
    font-weight: 500;
    color: #ffffff;
    text-decoration: none;
    letter-spacing: -0.02em;
    transition: color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
                padding 0.45s cubic-bezier(0.33, 1, 0.68, 1);
    white-space: nowrap;
    position: relative;
    cursor: pointer;
    font-family: 'Noto Sans KR', sans-serif;
    background: none;
    border: none;
  }

  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-nav__link {
    color: #ffffff;
  }

  #nav-section .tp-nav.has-active .tp-nav__link {
    padding: 0 38px;
  }

  #nav-section .tp-nav__link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: calc(100% - 48px);
    height: 2px;
    background: #ffffff;
    transition: transform 0.35s cubic-bezier(0.33, 1, 0.68, 1);
    transform-origin: center;
  }

  #nav-section .tp-nav__item.active .tp-nav__link {
    color: #ffffff;
  }

  #nav-section .tp-nav__item.active .tp-nav__link::after {
    transform: translateX(-50%) scaleX(1);
  }

  #nav-section .tp-nav.has-active .tp-nav__item:not(.active) .tp-nav__link {
    color: rgba(255,255,255,0.45);
  }

  #nav-section .tp-lang {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: 40px;
    flex-shrink: 0;
    z-index: 10001;
  }

  #nav-section .tp-lang__btn {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.04em;
    padding: 4px 2px;
    transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    line-height: 1.5;
  }

  #nav-section .tp-lang__btn.active { color: #ffffff; }
  #nav-section .tp-lang__btn:hover { color: #ffffff; }

  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-lang__btn {
    color: rgba(255,255,255,0.72);
  }

  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-lang__btn.active,
  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-lang__btn:hover {
    color: #ffffff;
  }

  #nav-section .tp-dropdown {
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-8px);
    transition: opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  #nav-section .tp-dropdown.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  #nav-section .tp-dropdown__inner {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 28px 60px 36px;
  }

  #nav-section .tp-dropdown__col {
    position: absolute;
    top: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
                transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  #nav-section .tp-dropdown.visible .tp-dropdown__col {
    opacity: 1;
    transform: translateY(0);
  }

  #nav-section .tp-dropdown.visible .tp-dropdown__col:nth-child(1) { transition-delay: 0.04s; }
  #nav-section .tp-dropdown.visible .tp-dropdown__col:nth-child(2) { transition-delay: 0.08s; }
  #nav-section .tp-dropdown.visible .tp-dropdown__col:nth-child(3) { transition-delay: 0.12s; }
  #nav-section .tp-dropdown.visible .tp-dropdown__col:nth-child(4) { transition-delay: 0.16s; }
  #nav-section .tp-dropdown.visible .tp-dropdown__col:nth-child(5) { transition-delay: 0.20s; }
  #nav-section .tp-dropdown.visible .tp-dropdown__col:nth-child(6) { transition-delay: 0.24s; }

  #nav-section .tp-dropdown__link {
    display: block;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255,255,255,0.72);
    text-decoration: none;
    letter-spacing: -0.01em;
    transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
                transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    white-space: nowrap;
    text-align: center;
    border-radius: 4px;
    font-family: 'Noto Sans KR', sans-serif;
    background: none;
    border: none;
    line-height: 1.6;
  }

  #nav-section .tp-dropdown__link:hover {
    color: #4aa8ff;
    transform: scale(1.02);
  }

  #nav-section .tp-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.45);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
    z-index: 9998;
  }

  #nav-section .tp-overlay.visible {
    opacity: 1;
    pointer-events: auto;
  }

  #nav-section .tp-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 10001;
    padding: 0;
    position: relative;
  }

  #nav-section .tp-hamburger__line {
    display: block;
    width: 24px;
    height: 1.5px;
    background: #ffffff;
    transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.3s ease;
    position: absolute;
  }

  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-hamburger__line {
    background: #ffffff;
  }

  #nav-section .tp-hamburger__line:nth-child(1) { transform: translateY(-7px); }
  #nav-section .tp-hamburger__line:nth-child(2) { transform: translateY(0); }
  #nav-section .tp-hamburger__line:nth-child(3) { transform: translateY(7px); }

  #nav-section .tp-hamburger.open .tp-hamburger__line:nth-child(1) { transform: translateY(0) rotate(45deg); }
  #nav-section .tp-hamburger.open .tp-hamburger__line:nth-child(2) { opacity: 0; }
  #nav-section .tp-hamburger.open .tp-hamburger__line:nth-child(3) { transform: translateY(0) rotate(-45deg); }

  #nav-section .tp-mobile-menu {
    display: none;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100dvh;
    background: #000000;
    z-index: 10000;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 28px 40px;
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.45s cubic-bezier(0.25, 0.1, 0.25, 1),
                transform 0.45s cubic-bezier(0.33, 1, 0.68, 1);
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #ffffff;
    line-height: 1.5;
    box-sizing: border-box;
  }

  #nav-section .tp-mobile-menu.open {
    opacity: 1;
    transform: translateX(0);
  }

  #nav-section .tp-mobile-header {
    display: flex;
    align-items: center;
    height: 68px;
    margin: 0 -28px;
    padding: env(safe-area-inset-top, 0px) 28px 0 28px;
    position: sticky;
    top: 0;
    background: #000000;
    z-index: 20;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  #nav-section .tp-mobile-header::after {
    content: '';
    position: absolute;
    left: 28px;
    right: 28px;
    bottom: 0;
    height: 1px;
  }

  #nav-section .tp-mobile-header__logo {
    display: inline-flex;
    align-items: center;
    height: 100%;
    text-decoration: none;
    padding-right: 56px;
  }

  #nav-section .tp-mobile-header__logo img {
    width: 110px;
    height: auto;
    display: block;
  }

  #nav-section .tp-mobile-close {
    position: absolute;
    top: calc(env(safe-area-inset-top, 0px) + 12px);
    right: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    flex-shrink: 0;
    z-index: 25;
    -webkit-tap-highlight-color: transparent;
  }

  #nav-section .tp-mobile-close svg {
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    display: block;
    transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    pointer-events: none;
  }

  #nav-section .tp-mobile-close svg path {
    stroke: #ffffff;
    stroke-width: 1.8;
  }

  #nav-section .tp-mobile-close:hover svg {
    transform: rotate(90deg);
  }

  #nav-section .tp-mobile-nav {
    padding-top: 18px;
  }

  #nav-section .tp-mobile-nav__item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    list-style: none;
  }

  #nav-section .tp-mobile-nav__item:first-child {
   <!-- border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  #nav-section .tp-mobile-nav__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 22px 0;
    font-size: 17px;
    font-weight: 600;
    color: #ffffff;
    text-decoration: none;
    letter-spacing: -0.02em;
    cursor: pointer;
    transition: color 0.3s ease;
    font-family: 'Noto Sans KR', sans-serif;
    background: none;
    border: none;
    line-height: 1.5;
    box-sizing: border-box;
    text-align: left;
  }

  #nav-section .tp-mobile-nav__link > span:first-child {
    flex: 1 1 auto;
    min-width: 0;
    display: block;
  }

  #nav-section .tp-mobile-nav__link:hover,
  #nav-section .tp-mobile-nav__link.active {
    color: #4aa8ff;
  }

  #nav-section .tp-mobile-nav__arrow {
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    flex: 0 0 20px;
    transition: transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
    display: block;
    margin-left: auto;
    pointer-events: none;
  }

  #nav-section .tp-mobile-nav__arrow path {
    stroke: rgba(255,255,255,0.6);
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  #nav-section .tp-mobile-nav__link.active .tp-mobile-nav__arrow {
    transform: rotate(180deg);
  }

  #nav-section .tp-mobile-nav__link.active .tp-mobile-nav__arrow path {
    stroke: #4aa8ff;
  }

  #nav-section .tp-mobile-sub {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  #nav-section .tp-mobile-sub.open {
    max-height: 500px;
  }

  #nav-section .tp-mobile-sub__link {
    display: block;
    padding: 12px 0 12px 16px;
    font-size: 15px;
    font-weight: 400;
    color: rgba(255,255,255,0.72);
    text-decoration: none;
    transition: color 0.3s ease;
    font-family: 'Noto Sans KR', sans-serif;
    line-height: 1.6;
  }

  #nav-section .tp-mobile-sub__link:hover {
    color: #4aa8ff;
  }

  #nav-section .tp-mobile-lang {
    display: flex;
    gap: 16px;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  #nav-section .tp-mobile-lang__btn {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.52);
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 4px;
    transition: color 0.3s ease;
    line-height: 1.5;
  }

  #nav-section .tp-mobile-lang__btn.active {
    color: #ffffff;
  }

<!--  @media (max-width: 1200px) {
    #nav-section .tp-header__inner { padding: 0 40px; }
    #nav-section .tp-nav__link { padding: 0 16px; font-size: 14.5px; }
    #nav-section .tp-nav.has-active .tp-nav__link { padding: 0 26px; }
    #nav-section .tp-dropdown__inner { padding: 28px 40px 36px; }
  } -->

  @media (max-width: 1200px) {
    #nav-section .tp-nav { display: none; }
    #nav-section .tp-lang { display: none; }
    #nav-section .tp-hamburger { display: flex; }
    #nav-section .tp-mobile-menu { display: block; }
    #nav-section .tp-dropdown { display: none; }
    #nav-section .tp-overlay { display: none; }
    #nav-section .tp-header__inner {
      padding: 0 20px;
      height: 64px;
    }
    #nav-section .tp-logo img { width: 110px; height: auto; display: block; }
  }

  @media (max-width: 480px) {
    #nav-section .tp-mobile-menu {
      padding: 0 24px 36px;
    }

    #nav-section .tp-mobile-header {
      margin: 0 -24px;
      padding: env(safe-area-inset-top, 0px) 24px 0 24px;
      height: 66px;
    }

    #nav-section .tp-mobile-header::after {
      left: 24px;
      right: 24px;
    }

    #nav-section .tp-mobile-close {
      right: 16px;
      top: calc(env(safe-area-inset-top, 0px) + 11px);
      width: 40px;
      height: 40px;
    }

    #nav-section .tp-mobile-nav__link {
      padding: 20px 0;
      font-size: 16px;
    }
  }
</style>

<header class="tp-header" id="tpHeader">
  <div class="tp-header__inner">
    <a href="./index.html" class="tp-logo" aria-label="TP Home">
      <img src="./img/logo-w.png" alt="TP Logo">
    </a>

    <nav class="tp-nav" id="tpNav">
      <div class="tp-nav__item" data-menu="0"><a href="./introduce.html" class="tp-nav__link">회사 소개</a></div>
      <div class="tp-nav__item" data-menu="1"><a href="#" class="tp-nav__link">브랜드 홈페이지</a></div>
      <div class="tp-nav__item" data-menu="2"><a href="#" class="tp-nav__link">랜딩페이지</a></div>
      <div class="tp-nav__item" data-menu="3"><a href="#" class="tp-nav__link">AI 영상 제작</a></div>
      <!-- <div class="tp-nav__item" data-menu="4"><a href="#" class="tp-nav__link">추억사진 AI 영상</a></div> -->
      <div class="tp-nav__item" data-menu="5"><a href="./column.html" class="tp-nav__link">전문 칼럼</a></div>
    </nav>

    <div class="tp-lang">
      <!-- <button class="tp-lang__btn active" type="button">KOR</button>
      <button class="tp-lang__btn" type="button">ENG</button> -->
    </div>

    <button class="tp-hamburger" id="tpHamburger" type="button" aria-label="메뉴 열기">
      <span class="tp-hamburger__line"></span>
      <span class="tp-hamburger__line"></span>
      <span class="tp-hamburger__line"></span>
    </button>
  </div>

  <div class="tp-dropdown" id="tpDropdown">
    <div class="tp-dropdown__inner" id="tpDropdownInner">
      <div class="tp-dropdown__col" data-col="0">
        <a href="./introduce.html" class="tp-dropdown__link">회사 소개</a>
        <a href="./ceo.html" class="tp-dropdown__link">인사말</a>
        <a href="./vision.html" class="tp-dropdown__link">비전 & 철학</a>
      </div>
      <div class="tp-dropdown__col" data-col="1">
        <a href="./brand-hompage.html" class="tp-dropdown__link">브랜드 홈페이지 제작</a>
      </div>
      <div class="tp-dropdown__col" data-col="2">
        <a href="./landing-page.html" class="tp-dropdown__link">랜딩페이지 제작</a>
      </div>
      <div class="tp-dropdown__col" data-col="3">
        <a href="./brand-ai.html" class="tp-dropdown__link">브랜드 AI 영상제작</a>
      <a href="./info-ai.html" class="tp-dropdown__link">안내 AI 영상제작</a>
      </div>
     <!-- <div class="tp-dropdown__col" data-col="4">
        <a href="#" class="tp-dropdown__link">추억사진 AI 영상제작</a>
      </div> -->
      <div class="tp-dropdown__col" data-col="5">
        <a href="./column.html" class="tp-dropdown__link">전문 칼럼</a>
      </div>
    </div>
  </div>
</header>

<div class="tp-overlay" id="tpOverlay"></div>

<div class="tp-mobile-menu" id="tpMobileMenu">
  <div class="tp-mobile-header">
    <a href="./index.html" class="tp-mobile-header__logo" aria-label="TP Home">
      <img src="./img/logo-w.png" alt="TP Logo">
    </a>

    <button class="tp-mobile-close" id="tpMobileClose" type="button" aria-label="메뉴 닫기">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M6 6L18 18" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

  <div class="tp-mobile-nav">
    <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="0" type="button">
        <span>회사 소개</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="0">
        <a href="./introduce.html" class="tp-mobile-sub__link">회사 소개</a>
        <a href="./ceo.html" class="tp-mobile-sub__link">인사말</a>
        <a href="./vision.html" class="tp-mobile-sub__link">비전 & 철학</a>
      </div>
    </div>

    <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="1" type="button">
        <span>브랜드 홈페이지</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="1">
        <a href="./brand-hompage.html" class="tp-mobile-sub__link">브랜드 홈페이지 제작</a>
        
      </div>
    </div>

    <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="2" type="button">
        <span>랜딩페이지</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="2">
        <a href="./landing-page.html" class="tp-mobile-sub__link">랜딩페이지 제작</a>
      </div>
    </div>

    <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="3" type="button">
        <span>AI 영상 제작</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="3">
        <a href="./brand-ai.html" class="tp-mobile-sub__link">브랜드 AI 영상제작</a>
        <a href="./info-ai.html" class="tp-mobile-sub__link">안내 AI 영상제작</a>
      </div>
    </div>

   <!-- <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="4" type="button">
        <span>추억사진 AI 영상</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="4">
        <a href="#" class="tp-mobile-sub__link">추억사진 AI 영상제작</a>
      </div>
    </div> -->

    <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="4" type="button">
        <span>전문 칼럼</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="4">
        <a href="./column.html" class="tp-mobile-sub__link">전문 칼럼</a>
      </div>
    </div>
  </div>

  <div class="tp-mobile-lang">
    <button class="tp-mobile-lang__btn active" type="button">KOR</button>
    <button class="tp-mobile-lang__btn" type="button">ENG</button>
  </div>
</div>
</section>
`;

  /* ================================
     QUICK MENU + RESERVATION POPUP
     (플로팅 섹션 템플릿 — 마크업/스타일 원본 그대로, 스크립트는 아래 initCfFloating 으로 분리)
  ================================ */
  const FLOATING_TEMPLATE = `
<section id="chanelFloatingSection">
  <!-- 우측 하단 플로팅 -->
  <div class="cf-floating" id="cfFloating">
    <!-- 퀵 패널 : 위아래(세로)로 펼쳐짐 -->
    <div class="cf-quick-panel" id="cfQuickPanel">
      <a href="#reservationSection" class="cf-quick-link">
        <span class="cf-quick-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 4.75h7.5L19.25 9.5V18A2.25 2.25 0 0 1 17 20.25H7A2.25 2.25 0 0 1 4.75 18V7A2.25 2.25 0 0 1 7 4.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M14.5 4.75V9.5h4.75" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M8.5 12.25h7M8.5 15.25h7M8.5 18.25h4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="cf-quick-text">회사소개서</span>
      </a>

      <a href="/doctor-intro.html" class="cf-quick-link">
        <span class="cf-quick-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6.7 5.75a2.2 2.2 0 0 1 3.1 0l1.36 1.36a2.2 2.2 0 0 1 0 3.11l-.72.72a13.3 13.3 0 0 0 2.62 2.62l.72-.72a2.2 2.2 0 0 1 3.11 0l1.36 1.36a2.2 2.2 0 0 1 0 3.1l-.68.68c-.77.77-1.92 1.08-2.98.8-2.36-.62-4.85-2.24-6.97-4.36-2.12-2.12-3.74-4.61-4.36-6.97-.28-1.06.03-2.21.8-2.98l.68-.68Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="cf-quick-text">전화문의</span>
      </a>

      <a href="/schedule.html" class="cf-quick-link">
        <span class="cf-quick-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5.25c-4.28 0-7.75 2.7-7.75 6.03 0 2.04 1.31 3.84 3.31 4.93l-.68 2.54a.45.45 0 0 0 .64.52l3.13-1.62c.44.06.89.09 1.35.09 4.28 0 7.75-2.7 7.75-6.03s-3.47-6.46-7.75-6.46Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M8.6 11.3h6.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="cf-quick-text">카카오톡</span>
      </a>
    </div>

    <!-- 퀵메뉴 버튼 -->
    <button type="button" class="cf-btn cf-btn-quick" id="cfQuickBtn" aria-label="퀵메뉴">
      <span class="cf-btn-icon">
        <svg class="cf-icon-menu" viewBox="0 0 24 24" fill="none">
          <path d="M13.2 3.8 6.9 12h4.35l-.45 8.2L17.1 12h-4.2l.3-8.2Z" fill="currentColor"/>
        </svg>
        <svg class="cf-icon-close" viewBox="0 0 24 24" fill="none">
          <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="cf-btn-label">QUICK</span>
    </button>

    <!-- 신청 버튼 -->
    <button type="button" class="cf-btn cf-btn-reserve" id="cfReserveBtn" aria-label="간편 신청">
      <span class="cf-btn-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4.75 19.25h4.5l9.1-9.1-4.5-4.5-9.1 9.1v4.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
          <path d="M12.9 6.6l4.5 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="cf-btn-label">간편신청</span>
    </button>

    <!-- TOP 버튼 -->
    <button type="button" class="cf-btn cf-btn-top" id="cfTopBtn" aria-label="맨 위로 이동">
      <span class="cf-btn-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 18V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M7.5 11.5 12 7l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 5.5h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="cf-btn-label">TOP</span>
    </button>
  </div>

  <!-- hidden iframe -->
  <iframe name="hidden_iframe_chanel_form" id="hidden_iframe_chanel_form" style="display:none;"></iframe>

  <!-- 예약 팝업 -->
  <div class="cf-modal" id="cfModal" aria-hidden="true">
    <div class="cf-modal-dim"></div>

    <div class="cf-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cfModalTitle">
      <button type="button" class="cf-modal-close" id="cfModalClose" aria-label="닫기">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="cf-modal-head">
        <!-- <p class="cf-modal-kicker">CHANEL-INSPIRED APPOINTMENT</p> -->
        <h2 class="cf-modal-title" id="cfModalTitle">간편 신청</h2>
        <p class="cf-modal-desc">
          신청 내용을 남겨주시면 빠르게 확인 후 연락드리겠습니다.
        </p>
      </div>

      <form
        id="cfReserveForm"
        class="cf-form"
        action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSdzlnHgrdyIafvzDj3gO2y6BS9L1XjpfiNuWiELhZ1eb6LwtQ/formResponse"
        method="POST"
        target="hidden_iframe_chanel_form"
        novalidate
      >
        <input type="hidden" name="entry.981041205" value="간편 신청">

        <div class="cf-field">
          <label class="cf-label" for="cfName">성함</label>
          <input
            type="text"
            id="cfName"
            name="entry.1262294308"
            placeholder="성함을 입력해주세요"
            maxlength="20"
            required
          >
        </div>

        <div class="cf-field">
          <label class="cf-label" for="cfPhone">연락처</label>
          <input
            type="tel"
            id="cfPhone"
            name="entry.197602348"
            placeholder="연락처를 입력해주세요"
            maxlength="13"
            required
          >
        </div>

        <div class="cf-field">
          <label class="cf-label" for="cfCategory">상담 분야</label>
          <div class="cf-select-wrap">
            <select id="cfCategory" name="entry.273651770" required>
              <option value="">상담 분야를 선택해주세요</option>
              <option value="브랜드 홈페이지">브랜드 홈페이지</option>
              <option value="랜딩페이지">랜딩페이지</option>
              <option value="브랜드 AI 영상">브랜드 AI 영상</option>
              <option value="AI 추억 영상">AI 추억 영상</option>
              <option value="기타 문의">기타 문의</option>
            </select>
            <span class="cf-select-arrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6.75 9.75 12 15l5.25-5.25" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </div>

        <div class="cf-checks">
          <label class="cf-check">
            <input type="checkbox" id="cfAgreeCall" required>
            <span class="cf-check-box"></span>
            <span class="cf-check-text">상담 연락 및 예약 진행에 동의합니다.</span>
          </label>

          <div class="cf-check-line">
            <label class="cf-check">
              <input type="checkbox" id="cfAgreePrivacy" required>
              <span class="cf-check-box"></span>
              <span class="cf-check-text">개인정보 수집 및 이용에 동의합니다.</span>
            </label>
            <a href="/privacy-policy.html" class="cf-privacy-link" id="cfPrivacyLink">자세히보기</a>
          </div>
        </div>

        <button type="submit" class="cf-submit-btn" id="cfSubmitBtn">신청하기</button>
      </form>
    </div>
  </div>

  <!-- 개인정보 팝업 -->
  <div class="cf-privacy-modal" id="cfPrivacyModal" aria-hidden="true">
    <div class="cf-privacy-dim" id="cfPrivacyDim"></div>

    <div class="cf-privacy-dialog" role="dialog" aria-modal="true" aria-labelledby="cfPrivacyTitle">
      <button type="button" class="cf-privacy-close" id="cfPrivacyClose" aria-label="개인정보 팝업 닫기">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="cf-privacy-head">
        <p class="cf-privacy-kicker">PRIVACY POLICY</p>
        <h3 class="cf-privacy-title" id="cfPrivacyTitle">개인정보 수집 및 이용 동의</h3>
      </div>

      <div class="cf-privacy-content">
        <div class="cf-privacy-item">
          <h4>1. 수집 항목</h4>
          <p>성함, 연락처, 상담 분야</p>
        </div>

        <div class="cf-privacy-item">
          <h4>2. 수집 및 이용 목적</h4>
          <p>상담 신청 접수, 문의 응대, 예약 진행 및 서비스 안내를 위한 연락</p>
        </div>

        <div class="cf-privacy-item">
          <h4>3. 보유 및 이용 기간</h4>
          <p>수집일로부터 3개월 보관 후 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관할 수 있습니다.</p>
        </div>

        <div class="cf-privacy-item">
          <h4>4. 동의 거부 권리</h4>
          <p>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 동의 거부 시 상담 신청 및 예약 진행이 제한될 수 있습니다.</p>
        </div>
      </div>
    </div>
  </div>

  <style>
    #chanelFloatingSection{
      position:relative;
      z-index:100;
      font-family:"Helvetica Neue","Pretendard","Noto Sans KR",sans-serif;
    }

    #chanelFloatingSection *{
      box-sizing:border-box;
    }

    /* 플로팅 버튼 영역 */
    #chanelFloatingSection .cf-floating{
      position:fixed;
      right:24px;
      bottom:24px;
      z-index:9999;
      display:flex;
      flex-direction:column;
      align-items:flex-end;
      gap:14px;
      transition:transform .35s ease, opacity .3s ease;
    }

    /* 아래로 스크롤 시 오른쪽으로 숨김 */
    #chanelFloatingSection .cf-floating.hide-right{
      transform:translateX(140px);
      opacity:0;
      pointer-events:none;
    }

    #chanelFloatingSection .cf-btn{
      width:84px;
      height:84px;
      border:none;
      border-radius:18px;
      cursor:pointer;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:8px;
      position:relative;
      padding:0;
      letter-spacing:.04em;
      box-shadow:
        0 20px 40px rgba(0,0,0,.18),
        inset 0 1px 0 rgba(255,255,255,.06);
      transition:
        transform .28s ease,
        box-shadow .28s ease,
        background .28s ease,
        color .28s ease,
        opacity .25s ease,
        visibility .25s ease;
    }

    #chanelFloatingSection .cf-btn:hover{
      transform:translateY(-2px);
      box-shadow:
        0 26px 46px rgba(0,0,0,.22),
        inset 0 1px 0 rgba(255,255,255,.08);
    }

    #chanelFloatingSection .cf-btn-icon{
      width:24px;
      height:24px;
      position:relative;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    #chanelFloatingSection .cf-btn-icon svg{
      width:24px;
      height:24px;
      display:block;
    }

    #chanelFloatingSection .cf-btn-label{
      font-size:11px;
      font-weight:700;
      line-height:1;
      letter-spacing:.14em;
    }

    /* 샤넬 느낌: 블랙 화이트 중심 */
    #chanelFloatingSection .cf-btn-quick{
      background:#111;
      color:#fff;
      border:1px solid rgba(255,255,255,.08);
    }

    #chanelFloatingSection .cf-btn-reserve{
      background:#fff;
      color:#111;
      border:1px solid rgba(17,17,17,.08);
    }

    #chanelFloatingSection .cf-btn-top{
      background:#111;
      color:#fff;
      border:1px solid rgba(255,255,255,.08);
      opacity:0;
      visibility:hidden;
      transform:translateY(10px);
    }

    #chanelFloatingSection .cf-floating.show-top .cf-btn-top{
      opacity:1;
      visibility:visible;
      transform:translateY(0);
    }

    /* quick 아이콘 전환 */
    #chanelFloatingSection .cf-icon-menu,
    #chanelFloatingSection .cf-icon-close{
      position:absolute;
      inset:0;
      transition:opacity .24s ease, transform .24s ease;
    }

    #chanelFloatingSection .cf-icon-menu{
      opacity:1;
      transform:scale(1) rotate(0deg);
    }

    #chanelFloatingSection .cf-icon-close{
      opacity:0;
      transform:scale(.72) rotate(-90deg);
    }

    #chanelFloatingSection .cf-floating.open .cf-icon-menu{
      opacity:0;
      transform:scale(.72) rotate(90deg);
    }

    #chanelFloatingSection .cf-floating.open .cf-icon-close{
      opacity:1;
      transform:scale(1) rotate(0deg);
    }

    /* 퀵 패널: 위쪽으로 세로 펼침 */
    #chanelFloatingSection .cf-quick-panel{
      position:absolute;
      right:0;
      bottom:294px;
      top:auto;
      min-width:unset;
      max-width:none;
      width:84px;
      height:auto;
      padding:8px;
      border-radius:18px;
      display:flex;
      flex-direction:column;
      align-items:stretch;
      gap:8px;
      background:rgba(17,17,17,.98);
      border:1px solid rgba(255,255,255,.08);
      box-shadow:
        0 24px 50px rgba(0,0,0,.22),
        inset 0 1px 0 rgba(255,255,255,.05);
      opacity:0;
      visibility:hidden;
      pointer-events:none;
      transform:translateY(12px);
      transition:
        opacity .25s ease,
        visibility .25s ease,
        transform .28s ease;
      overflow:hidden;
    }

    #chanelFloatingSection .cf-floating.open .cf-quick-panel{
      opacity:1;
      visibility:visible;
      pointer-events:auto;
      transform:translateY(0);
    }

    #chanelFloatingSection .cf-quick-link{
      width:100%;
      min-width:0;
      min-height:84px;
      border-radius:12px;
      text-decoration:none;
      color:#fff;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:10px;
      padding:8px 6px;
      background:transparent;
      transition:
        background .22s ease,
        transform .22s ease;
    }

    #chanelFloatingSection .cf-quick-link:hover{
      background:rgba(255,255,255,.06);
      transform:translateY(-1px);
    }

    #chanelFloatingSection .cf-quick-icon{
      width:22px;
      height:22px;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    #chanelFloatingSection .cf-quick-icon svg{
      width:22px;
      height:22px;
      display:block;
      color:#fff;
    }

    #chanelFloatingSection .cf-quick-text{
      font-size:12px;
      font-weight:700;
      line-height:1.2;
      letter-spacing:-0.02em;
      color:#fff;
      text-align:center;
      word-break:keep-all;
    }

    /* 예약 모달 */
    #chanelFloatingSection .cf-modal{
      position:fixed;
      inset:0;
      z-index:10000;
      opacity:0;
      visibility:hidden;
      pointer-events:none;
      transition:opacity .25s ease, visibility .25s ease;
    }

    #chanelFloatingSection .cf-modal.is-open{
      opacity:1;
      visibility:visible;
      pointer-events:auto;
    }

    #chanelFloatingSection .cf-modal-dim{
      position:absolute;
      inset:0;
      background:rgba(0,0,0,.52);
      backdrop-filter:blur(6px);
      -webkit-backdrop-filter:blur(6px);
    }

    /* 입력창이 화면 밖으로 안 나가게 */
    #chanelFloatingSection .cf-modal-dialog{
      position:absolute;
      left:50%;
      top:56%;
      transform:translate(-50%,-50%);
      width:min(92vw, 560px);
      max-height:calc(100vh - 40px);
      overflow:auto;
      background:#fff;
      color:#111;
      border-radius:24px;
      border:1px solid rgba(17,17,17,.06);
      box-shadow:
        0 40px 90px rgba(0,0,0,.22),
        inset 0 1px 0 rgba(255,255,255,.95);
      padding:34px 30px 30px;
    }

    #chanelFloatingSection .cf-modal-close{
      position:absolute;
      right:18px;
      top:18px;
      width:42px;
      height:42px;
      border:none;
      border-radius:50%;
      background:#111;
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      cursor:pointer;
      transition:transform .2s ease, opacity .2s ease;
    }

    #chanelFloatingSection .cf-modal-close:hover{
      transform:rotate(90deg);
      opacity:.92;
    }

    #chanelFloatingSection .cf-modal-close svg{
      width:20px;
      height:20px;
      display:block;
    }

    #chanelFloatingSection .cf-modal-head{
      margin-bottom:24px;
      padding-right:54px;
    }

    #chanelFloatingSection .cf-modal-kicker{
      margin:0 0 10px;
      font-size:11px;
      font-weight:700;
      letter-spacing:.24em;
      color:#8a8a8a;
    }

    #chanelFloatingSection .cf-modal-title{
      margin:0;
      font-size:34px;
      line-height:1.1;
      font-weight:800;
      letter-spacing:-0.05em;
      color:#111;
    }

    #chanelFloatingSection .cf-modal-desc{
      margin:14px 0 0;
      font-size:15px;
      line-height:1.7;
      color:#8b8b8b;
      letter-spacing:-0.02em;
    }

    #chanelFloatingSection .cf-form{
      margin:0;
    }

    #chanelFloatingSection .cf-field{
      margin-bottom:14px;
    }

    #chanelFloatingSection .cf-label{
      display:block;
      margin-bottom:8px;
      font-size:12px;
      font-weight:700;
      letter-spacing:.12em;
      color:#555;
    }

    #chanelFloatingSection .cf-field input,
    #chanelFloatingSection .cf-field select{
      width:100%;
      height:60px;
      border:1px solid #e6e6e6;
      border-radius:14px;
      background:#f7f7f7;
      color:#111;
      font-size:15px;
      font-weight:600;
      outline:none;
      padding:0 18px;
      box-shadow:none;
      appearance:none;
      -webkit-appearance:none;
      transition:
        border-color .22s ease,
        background .22s ease,
        box-shadow .22s ease;
    }

    #chanelFloatingSection .cf-field input:focus,
    #chanelFloatingSection .cf-field select:focus{
      border-color:#111;
      background:#fff;
      box-shadow:0 0 0 4px rgba(17,17,17,.06);
    }

    #chanelFloatingSection .cf-field input::placeholder{
      color:#9a9a9a;
      opacity:1;
    }

    #chanelFloatingSection .cf-select-wrap{
      position:relative;
    }

    #chanelFloatingSection .cf-select-arrow{
      position:absolute;
      right:16px;
      top:50%;
      transform:translateY(-50%);
      width:18px;
      height:18px;
      color:#111;
      pointer-events:none;
    }

    #chanelFloatingSection .cf-select-arrow svg{
      width:18px;
      height:18px;
      display:block;
    }

    #chanelFloatingSection .cf-checks{
      margin-top:6px;
    }

    #chanelFloatingSection .cf-check-line{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      margin-top:4px;
    }

    #chanelFloatingSection .cf-check{
      display:inline-flex;
      align-items:center;
      gap:10px;
      cursor:pointer;
      margin-top:10px;
    }

    #chanelFloatingSection .cf-check input{
      position:absolute;
      opacity:0;
      pointer-events:none;
    }

    #chanelFloatingSection .cf-check-box{
      width:22px;
      height:22px;
      border-radius:50%;
      border:1.5px solid #c9c9c9;
      background:#fff;
      position:relative;
      flex:0 0 22px;
      transition:
        border-color .2s ease,
        background .2s ease;
    }

    #chanelFloatingSection .cf-check-box::after{
      content:"";
      position:absolute;
      left:50%;
      top:50%;
      width:8px;
      height:4px;
      border-left:1.8px solid #fff;
      border-bottom:1.8px solid #fff;
      transform:translate(-50%,-62%) rotate(-45deg);
      opacity:0;
      transition:opacity .2s ease;
    }

    #chanelFloatingSection .cf-check input:checked + .cf-check-box{
      border-color:#111;
      background:#111;
    }

    #chanelFloatingSection .cf-check input:checked + .cf-check-box::after{
      opacity:1;
    }

    #chanelFloatingSection .cf-check-text{
      font-size:14px;
      line-height:1.45;
      color:#6d6d6d;
      letter-spacing:-0.02em;
    }

    #chanelFloatingSection .cf-privacy-link{
      margin-top:10px;
      font-size:13px;
      color:#777;
      text-decoration:none;
      border-bottom:1px solid #bbb;
      line-height:1.2;
    }

    #chanelFloatingSection .cf-submit-btn{
      width:100%;
      height:62px;
      margin-top:28px;
      border:none;
      border-radius:16px;
      background:#111;
      color:#fff;
      font-size:17px;
      font-weight:800;
      letter-spacing:-0.02em;
      cursor:pointer;
      transition:
        transform .22s ease,
        opacity .22s ease,
        box-shadow .22s ease;
      box-shadow:0 16px 28px rgba(0,0,0,.12);
    }

    #chanelFloatingSection .cf-submit-btn:hover{
      transform:translateY(-1px);
      opacity:.96;
    }

    #chanelFloatingSection .cf-submit-btn:disabled{
      opacity:.55;
      cursor:default;
      transform:none;
    }

    /* 개인정보 팝업 */
    #chanelFloatingSection .cf-privacy-modal{
      position:fixed;
      inset:0;
      z-index:10001;
      opacity:0;
      visibility:hidden;
      pointer-events:none;
      transition:opacity .25s ease, visibility .25s ease;
    }

    #chanelFloatingSection .cf-privacy-modal.is-open{
      opacity:1;
      visibility:visible;
      pointer-events:auto;
    }

    #chanelFloatingSection .cf-privacy-dim{
      position:absolute;
      inset:0;
      background:rgba(0,0,0,.52);
      backdrop-filter:blur(6px);
      -webkit-backdrop-filter:blur(6px);
    }

    #chanelFloatingSection .cf-privacy-dialog{
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      width:min(92vw, 560px);
      max-height:calc(100vh - 40px);
      overflow:auto;
      background:#fff;
      color:#111;
      border-radius:24px;
      border:1px solid rgba(17,17,17,.06);
      box-shadow:
        0 40px 90px rgba(0,0,0,.22),
        inset 0 1px 0 rgba(255,255,255,.95);
      padding:34px 30px 30px;
    }

    #chanelFloatingSection .cf-privacy-close{
      position:absolute;
      right:18px;
      top:18px;
      width:42px;
      height:42px;
      border:none;
      border-radius:50%;
      background:#111;
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      cursor:pointer;
      transition:transform .2s ease, opacity .2s ease;
    }

    #chanelFloatingSection .cf-privacy-close:hover{
      transform:rotate(90deg);
      opacity:.92;
    }

    #chanelFloatingSection .cf-privacy-close svg{
      width:20px;
      height:20px;
      display:block;
    }

    #chanelFloatingSection .cf-privacy-head{
      margin-bottom:24px;
      padding-right:54px;
    }

    #chanelFloatingSection .cf-privacy-kicker{
      margin:0 0 10px;
      font-size:11px;
      font-weight:700;
      letter-spacing:.24em;
      color:#8a8a8a;
    }

    #chanelFloatingSection .cf-privacy-title{
      margin:0;
      font-size:30px;
      line-height:1.2;
      font-weight:800;
      letter-spacing:-0.04em;
      color:#111;
    }

    #chanelFloatingSection .cf-privacy-content{
      display:flex;
      flex-direction:column;
      gap:14px;
    }

    #chanelFloatingSection .cf-privacy-item{
      padding:16px 18px;
      border:1px solid #ececec;
      border-radius:16px;
      background:#fafafa;
    }

    #chanelFloatingSection .cf-privacy-item h4{
      margin:0 0 8px;
      font-size:15px;
      line-height:1.4;
      font-weight:700;
      color:#111;
    }

    #chanelFloatingSection .cf-privacy-item p{
      margin:0;
      font-size:14px;
      line-height:1.7;
      color:#666;
      letter-spacing:-0.02em;
    }

    @media (max-width: 900px){
      #chanelFloatingSection .cf-quick-panel{
        width:84px;
      }
    }

    /* 모바일 */
    @media (max-width: 768px){
      #chanelFloatingSection .cf-floating{
        right:14px;
        bottom:84px;
        gap:10px;
      }

      /* 모바일 숨김 이동 거리 */
      #chanelFloatingSection .cf-floating.hide-right{
        transform:translateX(100px);
      }

      #chanelFloatingSection .cf-btn{
        width:52px;
        height:52px;
        border-radius:16px;
        gap:7px;
      }

      #chanelFloatingSection .cf-btn-icon,
      #chanelFloatingSection .cf-btn-icon svg{
        width:22px;
        height:22px;
      }

      #chanelFloatingSection .cf-btn-label{
        font-size:7px;
        letter-spacing:.12em;
      }

      #chanelFloatingSection .cf-quick-panel{
        right:0;
        top:auto;
        bottom:192px;
        width:74px;
        max-width:none;
        min-width:unset;
        height:auto;
        padding:8px;
        border-radius:16px;
        display:flex;
        flex-direction:column;
        gap:8px;
        transform:translateY(12px);
      }

      #chanelFloatingSection .cf-floating.open .cf-quick-panel{
        transform:translateY(0);
      }

      #chanelFloatingSection .cf-quick-link{
        min-height:72px;
        gap:8px;
        padding:8px 6px;
      }

      #chanelFloatingSection .cf-quick-icon,
      #chanelFloatingSection .cf-quick-icon svg{
        width:20px;
        height:20px;
      }

      #chanelFloatingSection .cf-quick-text{
        font-size:11px;
      }

      /* ✅ 모바일 팝업 크기 축소 — 화면을 꽉 채우지 않고
         상단 고정 헤더와 겹치지 않도록 상하 여백 확보 */
      #chanelFloatingSection .cf-modal-dialog,
      #chanelFloatingSection .cf-privacy-dialog{
        width:min(88vw, 440px);
        /* 상하로 넉넉한 여백을 두어 헤더/하단바와 겹침 방지 (dvh 우선) */
        max-height:calc(100vh - 180px);
        max-height:calc(100dvh - 180px);
        border-radius:22px;
        padding:22px 18px 20px;
      }

      #chanelFloatingSection .cf-modal-head,
      #chanelFloatingSection .cf-privacy-head{
        padding-right:44px;
        margin-bottom:18px;
      }

      #chanelFloatingSection .cf-modal-close,
      #chanelFloatingSection .cf-privacy-close{
        width:38px;
        height:38px;
        right:14px;
        top:14px;
      }

      #chanelFloatingSection .cf-modal-close svg,
      #chanelFloatingSection .cf-privacy-close svg{
        width:18px;
        height:18px;
      }

      #chanelFloatingSection .cf-modal-title{
        font-size:25px;
      }

      #chanelFloatingSection .cf-privacy-title{
        font-size:22px;
      }

      #chanelFloatingSection .cf-modal-desc{
        font-size:13.5px;
        line-height:1.6;
        margin-top:10px;
      }

      #chanelFloatingSection .cf-field{
        margin-bottom:12px;
      }

      #chanelFloatingSection .cf-field input,
      #chanelFloatingSection .cf-field select{
        height:52px;
        border-radius:12px;
        font-size:14px;
      }

      #chanelFloatingSection .cf-check-text{
        font-size:13.5px;
      }

      #chanelFloatingSection .cf-submit-btn{
        height:54px;
        margin-top:22px;
        border-radius:14px;
        font-size:16px;
      }

      #chanelFloatingSection .cf-privacy-item{
        padding:14px 14px;
        border-radius:14px;
      }

      #chanelFloatingSection .cf-privacy-item h4{
        font-size:14px;
      }

      #chanelFloatingSection .cf-privacy-item p{
        font-size:13px;
      }
    }

    /* 세로로 아주 짧은 화면(가로 모드 등) 대응 */
    @media (max-width: 768px) and (max-height: 720px){
      #chanelFloatingSection .cf-modal-dialog,
      #chanelFloatingSection .cf-privacy-dialog{
        max-height:calc(100vh - 100px);
        max-height:calc(110dvh - 100px);
      }
    }
  </style>
</section>
`;

  function initTpMenu(root) {
    if (!root) return;

    var header = root.querySelector('#tpHeader');
    var nav = root.querySelector('#tpNav');
    var dropdown = root.querySelector('#tpDropdown');
    var dropdownInner = root.querySelector('#tpDropdownInner');
    var overlay = root.querySelector('#tpOverlay');
    var hamburger = root.querySelector('#tpHamburger');
    var mobileMenu = root.querySelector('#tpMobileMenu');
    var mobileClose = root.querySelector('#tpMobileClose');
    var navItems = nav ? nav.querySelectorAll('.tp-nav__item') : [];
    var dropdownCols = dropdownInner ? dropdownInner.querySelectorAll('.tp-dropdown__col') : [];

    var activeMenu = null;
    var closeTimeout = null;
    var isDesktop = window.innerWidth > 768;
    var mobileOpen = false;
    var alignRAF = null;
    var ticking = false;
    var lastScrollY = window.scrollY || 0;
    var scrollDelta = 8;
    var headerRevealPoint = 10;

    function updateHeaderTopState() {
      var atTop = (window.scrollY || window.pageYOffset || 0) <= 10;

      if (atTop && !dropdown.classList.contains('visible') && !mobileOpen) {
        header.classList.add('top-transparent');
        header.classList.remove('scrolled');
      } else {
        header.classList.remove('top-transparent');
      }

      if (!atTop) {
        header.classList.add('scrolled');
      }
    }

    function alignDropdownColumns() {
      if (!isDesktop || !dropdownInner || !navItems.length) return;

      var innerRect = dropdownInner.getBoundingClientRect();

      navItems.forEach(function(item, i) {
        var col = dropdownCols[i];
        if (!col) return;

        var linkEl = item.querySelector('.tp-nav__link');
        if (!linkEl) return;

        var linkRect = linkEl.getBoundingClientRect();
        var linkCenterX = linkRect.left + linkRect.width / 2;

        var colWidth = col.scrollWidth;
        var leftPos = linkCenterX - innerRect.left - colWidth / 2;

        var maxLeft = innerRect.width - colWidth - 10;
        if (leftPos < 0) leftPos = 0;
        if (leftPos > maxLeft) leftPos = maxLeft;

        col.style.left = leftPos + 'px';
      });

      var maxH = 0;
      dropdownCols.forEach(function(col) {
        var h = col.scrollHeight;
        if (h > maxH) maxH = h;
      });
      dropdownInner.style.minHeight = (maxH + 56) + 'px';
    }

    function startContinuousAlign() {
      var startTime = performance.now();
      var duration = 480;

      function tick() {
        alignDropdownColumns();
        if (performance.now() - startTime < duration) {
          alignRAF = requestAnimationFrame(tick);
        } else {
          alignRAF = null;
        }
      }

      if (alignRAF) cancelAnimationFrame(alignRAF);
      alignRAF = requestAnimationFrame(tick);
    }

    function forceHeaderShow() {
      header.classList.remove('hide-on-scroll');
    }

    function openDropdown(index) {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }

      activeMenu = index;
      nav.classList.add('has-active');

      navItems.forEach(function(item, i) {
        item.classList.toggle('active', i === index);
      });

      dropdown.classList.add('visible');
      overlay.classList.add('visible');
      header.classList.add('menu-open');
      header.classList.remove('top-transparent');
      header.classList.add('scrolled');
      forceHeaderShow();

      startContinuousAlign();
    }

    function closeDropdown() {
      closeTimeout = setTimeout(function() {
        activeMenu = null;
        nav.classList.remove('has-active');
        navItems.forEach(function(item) { item.classList.remove('active'); });
        dropdown.classList.remove('visible');
        overlay.classList.remove('visible');
        header.classList.remove('menu-open');

        if (alignRAF) {
          cancelAnimationFrame(alignRAF);
          alignRAF = null;
        }

        updateHeaderTopState();
      }, 120);
    }

    if (navItems.length) {
      navItems.forEach(function(item, index) {
        item.addEventListener('mouseenter', function() {
          if (isDesktop) openDropdown(index);
        });

        item.addEventListener('mouseleave', function() {
          if (isDesktop) closeDropdown();
        });
      });
    }

    if (dropdown) {
      dropdown.addEventListener('mouseenter', function() {
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
      });

      dropdown.addEventListener('mouseleave', function() {
        closeDropdown();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function() {
        if (closeTimeout) clearTimeout(closeTimeout);
        activeMenu = null;
        nav.classList.remove('has-active');
        navItems.forEach(function(item) { item.classList.remove('active'); });
        dropdown.classList.remove('visible');
        overlay.classList.remove('visible');
        header.classList.remove('menu-open');
        forceHeaderShow();
        updateHeaderTopState();
      });
    }

    root.querySelectorAll('.tp-nav__link, .tp-dropdown__link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var href = link.getAttribute('href');

        if (!href || href.trim() === '' || href === '#') {
          e.preventDefault();
        }
      });
    });

    function handleHeaderScroll() {
      var currentScrollY = window.scrollY || 0;
      var diff = currentScrollY - lastScrollY;

      updateHeaderTopState();

      if (currentScrollY <= headerRevealPoint) {
        header.classList.remove('hide-on-scroll');
        lastScrollY = currentScrollY;
        return;
      }

      if (mobileOpen || dropdown.classList.contains('visible')) {
        header.classList.remove('hide-on-scroll');
        lastScrollY = currentScrollY;
        return;
      }

      if (Math.abs(diff) < scrollDelta) {
        return;
      }

      if (diff > 0) {
        header.classList.add('hide-on-scroll');
      } else {
        header.classList.remove('hide-on-scroll');
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          handleHeaderScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    function closeMobileMenu() {
      mobileOpen = false;
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      forceHeaderShow();
      updateHeaderTopState();
    }

    function openMobileMenu() {
      mobileOpen = true;
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
      header.classList.remove('top-transparent');
      header.classList.add('scrolled');
      forceHeaderShow();
    }

    if (hamburger) {
      hamburger.addEventListener('click', function() {
        if (mobileOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if (mobileClose) {
      mobileClose.addEventListener('click', function() {
        closeMobileMenu();
      });
    }

    root.querySelectorAll('.tp-mobile-nav__link').forEach(function(link) {
      link.addEventListener('click', function() {
        var idx = link.getAttribute('data-mobile');
        var sub = root.querySelector('[data-mobile-sub="' + idx + '"]');
        var wasActive = link.classList.contains('active');

        root.querySelectorAll('.tp-mobile-nav__link').forEach(function(l) {
          l.classList.remove('active');
        });

        root.querySelectorAll('.tp-mobile-sub').forEach(function(s) {
          s.classList.remove('open');
        });

        if (!wasActive && sub) {
          link.classList.add('active');
          sub.classList.add('open');
        }
      });
    });

    root.querySelectorAll('.tp-mobile-sub__link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var href = link.getAttribute('href');

        if (!href || href.trim() === '' || href === '#') {
          e.preventDefault();
          return;
        }

        closeMobileMenu();
      });
    });

    root.querySelectorAll('.tp-lang__btn, .tp-mobile-lang__btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var group = btn.closest('.tp-lang') || btn.closest('.tp-mobile-lang');
        if (!group) return;
        group.querySelectorAll('button').forEach(function(b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });

    window.addEventListener('resize', function() {
      isDesktop = window.innerWidth > 768;

      if (isDesktop && mobileOpen) {
        closeMobileMenu();
      }

      if (isDesktop && dropdown.classList.contains('visible')) {
        alignDropdownColumns();
      }

      forceHeaderShow();
      lastScrollY = window.scrollY || 0;
      updateHeaderTopState();
    });

    if (dropdown) {
      var origTransition = dropdown.style.transition;
      dropdown.style.transition = 'none';
      dropdown.style.opacity = '0';
      dropdown.style.pointerEvents = 'none';
      dropdown.classList.add('visible');

      requestAnimationFrame(function() {
        alignDropdownColumns();
        dropdown.classList.remove('visible');
        requestAnimationFrame(function() {
          dropdown.style.transition = origTransition || '';
          dropdown.style.opacity = '';
          dropdown.style.pointerEvents = '';
          updateHeaderTopState();
        });
      });
    } else {
      updateHeaderTopState();
    }
  }

  /* ================================
     플로팅 퀵메뉴 / 신청 팝업 초기화
     (원본 인라인 스크립트 로직 그대로 — root 스코프로만 변경해 메뉴와 충돌 방지)
  ================================ */
  function initCfFloating(root) {
    if (!root) return;

    const floating = root.querySelector('#cfFloating');
    const quickBtn = root.querySelector('#cfQuickBtn');
    const reserveBtn = root.querySelector('#cfReserveBtn');
    const topBtn = root.querySelector('#cfTopBtn');

    const modal = root.querySelector('#cfModal');
    const modalClose = root.querySelector('#cfModalClose');
    const modalDim = modal.querySelector('.cf-modal-dim');

    const privacyLink = root.querySelector('#cfPrivacyLink');
    const privacyModal = root.querySelector('#cfPrivacyModal');
    const privacyClose = root.querySelector('#cfPrivacyClose');
    const privacyDim = root.querySelector('#cfPrivacyDim');

    const form = root.querySelector('#cfReserveForm');
    const submitBtn = root.querySelector('#cfSubmitBtn');

    const nameInput = root.querySelector('#cfName');
    const phoneInput = root.querySelector('#cfPhone');
    const categoryInput = root.querySelector('#cfCategory');
    const agreeCall = root.querySelector('#cfAgreeCall');
    const agreePrivacy = root.querySelector('#cfAgreePrivacy');

    let submitted = false;

    /* 메뉴(모바일 메뉴)가 body overflow 를 잠근 상태인지 확인
       → 팝업을 닫을 때 메뉴 쪽 스크롤 잠금을 풀어버리지 않도록 방지 */
    function isTpMobileMenuOpen() {
      var tpMenu = document.querySelector('#tpMobileMenu');
      return !!(tpMenu && tpMenu.classList.contains('open'));
    }

    function restoreScrollIfSafe() {
      if (!privacyModal.classList.contains('is-open') &&
          !modal.classList.contains('is-open') &&
          !isTpMobileMenuOpen()) {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    }

    function openModal(){
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      floating.classList.remove('open');
      setTimeout(function(){
        nameInput.focus();
      }, 50);
    }

    function closeModal(){
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      restoreScrollIfSafe();
    }

    function openPrivacyModal(){
      privacyModal.classList.add('is-open');
      privacyModal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function closePrivacyModal(){
      privacyModal.classList.remove('is-open');
      privacyModal.setAttribute('aria-hidden', 'true');
      restoreScrollIfSafe();
    }

    quickBtn.addEventListener('click', function(e){
      e.stopPropagation();
      floating.classList.toggle('open');
    });

    document.addEventListener('click', function(e){
      if(!floating.contains(e.target)){
        floating.classList.remove('open');
      }
    });

    reserveBtn.addEventListener('click', function(){
      openModal();
    });

    modalClose.addEventListener('click', closeModal);
    modalDim.addEventListener('click', closeModal);

    if(privacyLink){
      privacyLink.addEventListener('click', function(e){
        e.preventDefault();
        openPrivacyModal();
      });
    }

    if(privacyClose){
      privacyClose.addEventListener('click', closePrivacyModal);
    }

    if(privacyDim){
      privacyDim.addEventListener('click', closePrivacyModal);
    }

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        if(privacyModal.classList.contains('is-open')){
          closePrivacyModal();
          return;
        }

        if(modal.classList.contains('is-open')){
          closeModal();
        }
      }
    });

    /* 스크롤 방향 감지: 아래로 → 오른쪽 숨김 / 위로 → 표시
       (메뉴 헤더의 스크롤 리스너와 별개 변수로 독립 동작) */
    let cfLastScrollY = window.scrollY;

    window.addEventListener('scroll', function(){
      const currentY = window.scrollY;

      // TOP 버튼 표시 여부
      if(currentY > 220){
        floating.classList.add('show-top');
      }else{
        floating.classList.remove('show-top');
      }

      // 미세한 흔들림 무시: 8px 이상 이동 시에만 반응
      if(Math.abs(currentY - cfLastScrollY) > 8){
        if(currentY > cfLastScrollY && currentY > 120){
          // 아래로 스크롤 → 숨김
          floating.classList.add('hide-right');
          floating.classList.remove('open');
        }else{
          // 위로 스크롤 → 표시
          floating.classList.remove('hide-right');
        }
        cfLastScrollY = currentY;
      }
    }, { passive: true });

    topBtn.addEventListener('click', function(){
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    phoneInput.addEventListener('input', function(e){
      let value = e.target.value.replace(/[^0-9]/g, '');
      if(value.length > 11) value = value.slice(0, 11);

      if(value.length < 4){
        e.target.value = value;
      }else if(value.length < 8){
        e.target.value = value.slice(0,3) + '-' + value.slice(3);
      }else{
        e.target.value = value.slice(0,3) + '-' + value.slice(3,7) + '-' + value.slice(7);
      }
    });

    form.addEventListener('submit', function(e){
      if(submitted){
        e.preventDefault();
        return;
      }

      if(!nameInput.value.trim()){
        e.preventDefault();
        alert('성함을 입력해주세요.');
        nameInput.focus();
        return;
      }

      if(!phoneInput.value.trim()){
        e.preventDefault();
        alert('연락처를 입력해주세요.');
        phoneInput.focus();
        return;
      }

      if(!categoryInput.value){
        e.preventDefault();
        alert('상담 분야를 선택해주세요.');
        categoryInput.focus();
        return;
      }

      if(!agreeCall.checked){
        e.preventDefault();
        alert('상담 연락 및 예약 진행 동의가 필요합니다.');
        return;
      }

      if(!agreePrivacy.checked){
        e.preventDefault();
        alert('개인정보 수집 및 이용 동의가 필요합니다.');
        return;
      }

      submitted = true;
      submitBtn.disabled = true;

      setTimeout(function(){
        alert('신청이 접수되었습니다.');
        form.reset();
        submitBtn.disabled = false;
        submitted = false;
        closeModal();
      }, 900);
    });
  }

  function mountTpMenu() {
    var mount = document.getElementById('menu_navi');
    if (!mount) return;
    if (mount._tpMenuMounted) return;

    mount._tpMenuMounted = true;
    mount.innerHTML = MENU_TEMPLATE;

    var root = mount.querySelector('#nav-section');
    initTpMenu(root);
  }

  /* 플로팅 섹션은 별도 div 를 body 끝에 자동 생성해서 마운트
     → 페이지에 추가 마크업 없이 이 파일 하나만 넣으면 동작 */
  function mountCfFloating() {
    if (document.getElementById('chanelFloatingSection')) return; // 중복 마운트 방지

    var mount = document.createElement('div');
    mount.id = 'cfFloatingMount';
    document.body.appendChild(mount);
    mount.innerHTML = FLOATING_TEMPLATE;

    var root = mount.querySelector('#chanelFloatingSection');
    initCfFloating(root);
  }

  function mountAll() {
    mountTpMenu();
    mountCfFloating();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }
})();