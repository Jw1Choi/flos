(function () {
  const MENU_TEMPLATE = `
<section id="nav-section">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');

  #nav-section {
    --tp-brand: #098940;
    --tp-brand-dark: #087a39;
    --tp-white: #ffffff;
    --tp-white-soft: rgba(255,255,255,0.72);
    --tp-white-dim: rgba(255,255,255,0.45);
    --tp-white-line: rgba(255,255,255,0.1);
    --tp-black-overlay: rgba(0, 0, 0, 0.45);
  }

  #nav-section .tp-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
    background: var(--tp-brand);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition:
      background 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
      box-shadow 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
      transform 0.42s cubic-bezier(0.33, 1, 0.68, 1),
      color 0.3s ease,
      border-color 0.3s ease;
    will-change: transform;
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
    color: var(--tp-white);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    line-height: 1.5;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }

  #nav-section .tp-header.scrolled {
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.18);
  }

  #nav-section .tp-header.menu-open {
    background: var(--tp-brand);
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
    width: 230px;
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
    color: var(--tp-white);
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
    color: var(--tp-white);
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
    background: var(--tp-white);
    transition: transform 0.35s cubic-bezier(0.33, 1, 0.68, 1),
                background 0.3s ease;
    transform-origin: center;
  }

  #nav-section .tp-nav__item.active .tp-nav__link {
    color: var(--tp-white);
  }

  #nav-section .tp-nav__item.active .tp-nav__link::after {
    transform: translateX(-50%) scaleX(1);
  }

  #nav-section .tp-nav.has-active .tp-nav__item:not(.active) .tp-nav__link {
    color: var(--tp-white-dim);
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
    color: rgba(255,255,255,0.55);
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.04em;
    padding: 4px 2px;
    transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    line-height: 1.5;
  }

  #nav-section .tp-lang__btn.active { color: var(--tp-white); }
  #nav-section .tp-lang__btn:hover { color: var(--tp-white); }

  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-lang__btn {
    color: rgba(255,255,255,0.74);
  }

  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-lang__btn.active,
  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-lang__btn:hover {
    color: var(--tp-white);
  }

  #nav-section .tp-dropdown {
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background: var(--tp-brand);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    overflow: hidden;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-8px);
    transition: opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.3s ease;
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
    font-weight: 700;
    color: var(--tp-white-soft);
    text-decoration: none;
    letter-spacing: -0.01em;
    transition: color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
                transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.3s ease;
    white-space: nowrap;
    text-align: center;
    border-radius: 4px;
    font-family: 'Noto Sans KR', sans-serif;
    background: none;
    border: none;
    line-height: 1.6;
  }

  #nav-section .tp-dropdown__link:hover {
    color: #fff;
    transform: scale(1.02);
    border-bottom: 1px solid #fff;
    border-radius: 0;
  }

  #nav-section .tp-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--tp-black-overlay);
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
    background: var(--tp-white);
    transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),
                background 0.3s ease;
    position: absolute;
  }

  #nav-section .tp-header.top-transparent:not(.menu-open) .tp-hamburger__line {
    background: var(--tp-white);
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
    background: var(--tp-brand);
    z-index: 10000;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 28px 40px;
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.45s cubic-bezier(0.25, 0.1, 0.25, 1),
                transform 0.45s cubic-bezier(0.33, 1, 0.68, 1),
                background 0.3s ease;
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--tp-white);
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
    background: var(--tp-brand);
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
    width: 230px;
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
    stroke: var(--tp-white);
    stroke-width: 1.8;
  }

  #nav-section .tp-mobile-close:hover svg {
    transform: rotate(90deg);
  }

  #nav-section .tp-mobile-nav {
    padding-top: 18px;
  }

  #nav-section .tp-mobile-nav__item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    overflow: hidden;
    list-style: none;
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
    color: var(--tp-white);
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
    color: rgba(255,255,255,0.98);
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
    stroke: rgba(255,255,255,0.7);
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  #nav-section .tp-mobile-nav__link.active .tp-mobile-nav__arrow {
    transform: rotate(180deg);
  }

  #nav-section .tp-mobile-nav__link.active .tp-mobile-nav__arrow path {
    stroke: var(--tp-white);
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
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    transition: color 0.3s ease, opacity 0.3s ease;
    font-family: 'Noto Sans KR', sans-serif;
    line-height: 1.6;
  }

  #nav-section .tp-mobile-sub__link:hover {
    color: var(--tp-white);
    opacity: 1;
  }

  #nav-section .tp-mobile-lang {
    display: flex;
    gap: 16px;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  #nav-section .tp-mobile-lang__btn {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.58);
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 4px;
    transition: color 0.3s ease;
    line-height: 1.5;
  }

  #nav-section .tp-mobile-lang__btn.active {
    color: var(--tp-white);
  }

  /* 반전 상태 */
  #nav-section.invert .tp-header {
    background: rgba(255,255,255,0.96);
    color: var(--tp-brand);
    border-bottom: 1px solid rgba(9, 137, 64, 0.12);
  }

  #nav-section.invert .tp-header.menu-open {
    background: rgba(255,255,255,0.98);
  }

  #nav-section.invert .tp-header.scrolled {
    box-shadow: 0 1px 20px rgba(9, 137, 64, 0.08);
  }

  #nav-section.invert .tp-header.top-transparent {
    background: transparent;
    border-bottom-color: transparent;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  #nav-section.invert .tp-nav__link,
  #nav-section.invert .tp-header.top-transparent:not(.menu-open) .tp-nav__link {
    color: var(--tp-brand);
  }

  #nav-section.invert .tp-nav__item.active .tp-nav__link {
    color: var(--tp-brand);
  }

  #nav-section.invert .tp-nav.has-active .tp-nav__item:not(.active) .tp-nav__link {
    color: rgba(9, 137, 64, 0.42);
  }

  #nav-section.invert .tp-nav__link::after {
    background: var(--tp-brand);
  }

  #nav-section.invert .tp-lang__btn,
  #nav-section.invert .tp-header.top-transparent:not(.menu-open) .tp-lang__btn {
    color: rgba(9, 137, 64, 0.56);
  }

  #nav-section.invert .tp-lang__btn.active,
  #nav-section.invert .tp-lang__btn:hover,
  #nav-section.invert .tp-header.top-transparent:not(.menu-open) .tp-lang__btn.active,
  #nav-section.invert .tp-header.top-transparent:not(.menu-open) .tp-lang__btn:hover {
    color: var(--tp-brand);
  }

  #nav-section.invert .tp-hamburger__line,
  #nav-section.invert .tp-header.top-transparent:not(.menu-open) .tp-hamburger__line {
    background: var(--tp-brand);
  }

  #nav-section.invert .tp-dropdown {
    background: rgba(255,255,255,0.98);
    border-top: 1px solid rgba(9, 137, 64, 0.12);
  }

  #nav-section.invert .tp-dropdown__link {
    color: rgba(9, 137, 64, 0.78);
  }

  #nav-section.invert .tp-dropdown__link:hover {
    color: var(--tp-white);
    background: var(--tp-brand);
  }

  #nav-section.invert .tp-overlay {
    background: rgba(9, 137, 64, 0.14);
  }

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

    #nav-section .tp-logo img {
      width: 230px;
      height: auto;
      display: block;
    }
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
      <div class="tp-nav__item" data-menu="0"><a href="./introduce.html" class="tp-nav__link">소개&미션</a></div>
      <div class="tp-nav__item" data-menu="1"><a href="#" class="tp-nav__link">자연과 회복</a></div>
      <div class="tp-nav__item" data-menu="2"><a href="#" class="tp-nav__link">프로그램 소개</a></div>
      <div class="tp-nav__item" data-menu="3"><a href="#" class="tp-nav__link">진행 중인 프로그램</a></div>
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
        <a href="./introduce.html" class="tp-dropdown__link">우리는</a>
        <a href="./ceo.html" class="tp-dropdown__link">활동 연혁</a>
        <a href="./vision.html" class="tp-dropdown__link">함께하는 사람들</a>
        <a href="./vision.html" class="tp-dropdown__link">오시는 길</a>
      </div>
      <div class="tp-dropdown__col" data-col="1">
        <a href="./brand-hompage.html" class="tp-dropdown__link">자연과 회복</a>
      </div>
      <div class="tp-dropdown__col" data-col="2">
        <a href="#" class="tp-dropdown__link">어린이 숲 프로그램</a>
        <a href="#" class="tp-dropdown__link">전문가 숲 프로그램</a>
      </div>
      <div class="tp-dropdown__col" data-col="3">
        <a href="#" class="tp-dropdown__link">세부 프로그램</a>
        <a href="#" class="tp-dropdown__link">연간 프로그램</a>
        <a href="#" class="tp-dropdown__link">참여 및 문의</a>
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
        <span>소개&미션</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="0">
        <a href="./introduce.html" class="tp-mobile-sub__link">우리는</a>
        <a href="./ceo.html" class="tp-mobile-sub__link">활동 연혁</a>
        <a href="./vision.html" class="tp-mobile-sub__link">함께하는 사람들</a>
        <a href="./vision.html" class="tp-mobile-sub__link">오시는 길</a>
      </div>
    </div>

    <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="1" type="button">
        <span>자연과 회복</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="1">
        <a href="./brand-hompage.html" class="tp-mobile-sub__link">자연과 회복</a>
      </div>
    </div>

    <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="2" type="button">
        <span>프로그램 소개</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="2">
        <a href="#" class="tp-mobile-sub__link">어린이 숲 프로그램</a>
        <a href="#" class="tp-mobile-sub__link">전문가 숲 프로그램</a>
      </div>
    </div>

    <div class="tp-mobile-nav__item">
      <button class="tp-mobile-nav__link" data-mobile="3" type="button">
        <span>진행 중인 프로그램</span>
        <svg class="tp-mobile-nav__arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="tp-mobile-sub" data-mobile-sub="3">
        <a href="#" class="tp-mobile-sub__link">세부 프로그램</a>
        <a href="#" class="tp-mobile-sub__link">연간 프로그램</a>
        <a href="#" class="tp-mobile-sub__link">참여 및 문의</a>
      </div>
    </div>
  </div>
</div>
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

      if (Math.abs(diff) < scrollDelta) return;

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

  function mountTpMenu() {
    var mount = document.getElementById('menu_navi');
    if (!mount) return;
    if (mount._tpMenuMounted) return;

    mount._tpMenuMounted = true;
    mount.innerHTML = MENU_TEMPLATE;

    var root = mount.querySelector('#nav-section');
    initTpMenu(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountTpMenu);
  } else {
    mountTpMenu();
  }
})();