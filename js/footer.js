(function () {
  const mount = document.getElementById('footer_template');
  if (!mount) return;

  if (document.getElementById('footerElite')) return;

  mount.innerHTML = `
<section id="footerElite" aria-label="사이트 푸터" style="position:relative;">
  <style>
    #footerElite{
      --bg:#0a0a0b;
      --ink:#e5e7eb;
      --muted:#9aa1aa;
      --line:rgba(255,255,255,.08);
      --glass:rgba(255,255,255,.06);
      --max:1280px;
      --radius:16px;
      --shadow:0 10px 30px rgba(0,0,0,.35);
      font-family:Pretendard,"Noto Sans KR",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      background:var(--bg);
      color:var(--muted);
      -webkit-font-smoothing:antialiased;
      text-rendering:optimizeLegibility;
    }

    #footerElite .wrap{
      max-width:var(--max);
      margin:0 auto;
      padding:3.5rem 1.25rem 2.25rem;
    }

    #footerElite .navGrid{
      display:grid;
      grid-template-columns:repeat(12,1fr);
      gap:2.2rem;
      border-bottom:1px solid var(--line);
      padding-bottom:2rem;
    }

    #footerElite .brandCol{
      grid-column:span 4;
      display:flex;
      flex-direction:column;
      gap:.9rem;
    }

    #footerElite .logoRow{
      display:flex;
      align-items:center;
    }

    #footerElite .slogan{
      font-size:.92rem;
      line-height:1.7;
      color:#b9c0cb;
    }

    #footerElite .col{
      grid-column:span 2;
    }

    #footerElite h4{
      margin:.1rem 0 .85rem;
      font-size:1rem;
      font-weight:800;
      color:#fff;
    }

    #footerElite ul{
      list-style:none;
      margin:0;
      padding:0;
    }

    #footerElite li{
      margin:.48rem 0;
    }

    #footerElite a{
      color:var(--muted);
      text-decoration:none;
      font-size:.92rem;
      transition:color .25s ease;
    }

    #footerElite a:hover{
      color:#fff;
    }

    #footerElite .footBar{
      display:flex;
      justify-content:space-between;
      gap:1rem;
      padding:1.15rem 0 0;
    }

    #footerElite .addr{
      font-size:.86rem;
      line-height:1.8;
    }

    #footerElite .policies{
      display:flex;
      gap:.9rem;
      flex-wrap:wrap;
      margin-top:.8rem;
    }

    #footerElite .corpLine{
      display:flex;
      flex-wrap:wrap;
      gap:.45rem .55rem;
    }

    #footerElite .corpName{
      color:var(--ink);
      font-weight:800;
    }

    #footerElite .corpMeta{
      display:flex;
      gap:.35rem .55rem;
      color:#b9c0cb;
      flex-wrap:wrap;
    }

    #footerElite .sep{
      color:rgba(255,255,255,.22);
    }

    #footerElite .meta b{
      color:#d7dde6;
      font-weight:700;
    }

    #footerElite .copy{
      margin-top:.7rem;
      font-size:.8rem;
      color:#88919c;
      line-height:1.7;
    }

    @media(max-width:900px){
      #footerElite .navGrid{
        grid-template-columns:repeat(6,1fr);
      }

      #footerElite .brandCol{
        grid-column:1/-1;
      }

      #footerElite .col{
        grid-column:span 3;
      }
    }

    @media(max-width:760px){
      #footerElite .navGrid{
        gap:1.6rem;
      }

      #footerElite .col{
        grid-column:1/-1;
      }

      #footerElite .footBar{
        flex-direction:column;
        align-items:flex-start;
      }
    }
  </style>

  <div class="wrap">
    <div class="navGrid">
      <div class="brandCol">
        <div class="logoRow">
          <img src="./img/logo-w.png" alt="FLOS 로고" style="width:130px;">
        </div>
        <p class="slogan">
          브랜드의 가치를 더 선명하게 전달하는<br>
          브랜드 홈페이지 · 랜딩페이지 · AI 영상 제작
        </p>
      </div>

      <div class="col">
        <h4>회사 소개</h4>
        <ul>
          <li><a href="./introduce.html">회사 소개</a></li>
          <li><a href="./ceo.html">인사말</a></li>
          <li><a href="./vision.html">비전 & 철학</a></li>
        </ul>
      </div>

      <div class="col">
        <h4>홈페이지</h4>
        <ul>
          <li><a href="./brand-hompage.html">브랜드 홈페이지 제작</a></li>
          <li><a href="#">랜딩페이지 제작</a></li>
        </ul>
      </div>

      <div class="col">
        <h4>AI 영상</h4>
        <ul>
          <li><a href="#">브랜드 AI 영상제작</a></li>
          <li><a href="#">추억사진 AI 영상제작</a></li>
        </ul>
      </div>

      <div class="col">
        <h4>콘텐츠</h4>
        <ul>
          <li><a href="#">전문 칼럼</a></li>
        </ul>
      </div>
    </div>

    <div class="footBar">
      <div class="addr">
        <div class="corpLine"
          data-corp="FLOS"
          data-ceo="대표자명"
          data-corpno=""
          data-bizno="">

          <span class="corpName" id="corpName">FLOS</span>
          <span class="corpMeta">
            <span class="sep">·</span>
            <span class="meta">대표 : <b id="corpCEO">대표자명</b></span>
          </span>
        </div>

        <div class="policies">
          <a href="#">개인정보처리방침</a>
          <a href="#">이용약관</a>
          <a href="#">법적고지</a>
          <a href="#">사이트맵</a>
        </div>

        <div class="copy">
          COPYRIGHT © 2026 FLOS<br>
          ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  </div>
</section>
`;

  const root = mount.querySelector('.corpLine');
  if (!root) return;

  const map = {
    corpName: root.dataset.corp,
    corpCEO: root.dataset.ceo,
    corpNo: root.dataset.corpno,
    bizNo: root.dataset.bizno
  };

  Object.entries(map).forEach(([id, value]) => {
    if (!value) return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
})();