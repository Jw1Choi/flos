/* ════════════════════════════════════════════════════════════════
 * 법무법인 업체 모집 신청폼 → Supabase insert (구글폼 대체)
 * --------------------------------------------------------------
 * 기존 jQuery / 구글폼(form_e12, hidden_iframe) 코드를 전부 지우고
 * 이 파일 하나로 교체하세요. HTML 은 그대로 둬도 됩니다.
 *   - 사용 ID: #name1 #phone1 #region #db4 #memo #agree #send_message1
 *   - 전송 대상 테이블: lawfirm_consultations
 * ════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  // ── ① 설정 ───────────────────────────────────────────────────
  // ※ URL 과 ANON 키는 같은 프로젝트(yiuioprceyuybwkgxmrm) 여야 함
  var SUPABASE_URL  = "https://yiuioprceyuybwkgxmrm.supabase.co";
  var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdWlvcHJjZXl1eWJ3a2d4bXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NDM1MDIsImV4cCI6MjA5NDMxOTUwMn0.SkkBCH9avPMZu-LeBtdOh5zsppcRMvbnilj38CkHEZs";
  var TABLE         = "lawfirm_consultations";
  var SOURCE        = "메타";                 // 유입소스
  var RESULT_URL    = "./result.html";        // 완료 후 이동

  // ── ② 엘리먼트 ───────────────────────────────────────────────
  var form    = document.getElementById("form_e12");
  var elName   = document.getElementById("name1");
  var elPhone  = document.getElementById("phone1");
  var elRegion = document.getElementById("region");
  var elDb     = document.getElementById("db4");
  var elMemo   = document.getElementById("memo");
  var elAgree  = document.getElementById("agree");
  var btn      = document.getElementById("send_message1");
  if (!form || !btn) return;

  // 구글폼 잔재 제거 (action / target / 인라인 onsubmit 무력화)
  form.setAttribute("action", "");
  form.removeAttribute("target");
  form.onsubmit = null;

  var sending = false;

  // ── ③ 검증 헬퍼 ──────────────────────────────────────────────
  var reKor   = /^[가-힣]+$/;        // 이름: 한글만
  var rePhone = /^010[0-9]{8}$/;      // 010 으로 시작하는 11자리만 허용
  function onlyDigits(v) { return (v || "").replace(/[^0-9]/g, ""); }

  function getValues() {
    return {
      name:   (elName.value || "").trim(),
      phone:  onlyDigits(elPhone.value),
      region: elRegion.value || "",
      db:     elDb ? (elDb.value || "") : "",
      memo:   elMemo ? (elMemo.value || "").trim() : "",
      agree:  !!(elAgree && elAgree.checked),
    };
  }

  // 필수: 이름 / 전화 / 지역 / 동의  (DB 규모·문의는 선택)
  function validate(v) {
    if (!(reKor.test(v.name) && v.name.length > 1))
      return { ok: false, msg: "성함 입력을 확인하세요." };
    if (!rePhone.test(v.phone))
      return { ok: false, msg: "010 으로 시작하는 번호를 확인하세요." };
    if (!v.region)
      return { ok: false, msg: "지역 선택을 확인하세요." };
    if (!v.agree)
      return { ok: false, msg: "개인정보 동의를 확인해주세요." };
    return { ok: true, msg: "지금 신청하기" };
  }

  // ── ④ 전화번호: 입력 중 하이픈 자동, 저장은 숫자만 ────────────
  if (elPhone) {
    elPhone.maxLength = 13;                 // HTML maxlength="11"(하이픈 포함 잘림) 해제
    elPhone.setAttribute("inputmode", "numeric");
    elPhone.addEventListener("input", function () {
      var d = onlyDigits(elPhone.value).slice(0, 11);
      var out = d;
      if (d.length > 7)      out = d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7);
      else if (d.length > 3) out = d.slice(0, 3) + "-" + d.slice(3);
      elPhone.value = out;
    });
  }

  // ── ⑤ 버튼 실시간 활성화/비활성화 ────────────────────────────
  function refreshBtn() {
    if (sending) return;
    var r = validate(getValues());
    btn.disabled = !r.ok;
    btn.value = r.msg;
    btn.style.transition = "1s";
    btn.style.cursor = r.ok ? "pointer" : "default";
    btn.style.background = r.ok ? "#0e3b64" : "#595959";
    btn.style.color = "#fff";
  }

  ["input", "change", "keyup", "click"].forEach(function (ev) {
    [elName, elPhone, elRegion, elDb, elMemo, elAgree].forEach(function (el) {
      if (el) el.addEventListener(ev, refreshBtn);
    });
  });
  refreshBtn();

  // ── ⑥ 전송 ───────────────────────────────────────────────────
  function setSending(on, label) {
    sending = on;
    btn.disabled = on;
    if (label) btn.value = label;
    btn.style.cursor = on ? "default" : "pointer";
    btn.style.background = on ? "#222" : "#0e3b64";
  }

  form.addEventListener("submit", submitForm);
  btn.addEventListener("click", function (e) {
    if (btn.type !== "submit") { e.preventDefault(); submitForm(e); }
  });

  function submitForm(e) {
    if (e) e.preventDefault();
    if (sending) return;

    var v = getValues();
    var r = validate(v);
    if (!r.ok) { alert(r.msg); refreshBtn(); return; }

    setSending(true, "정보를 확인 중입니다");

    var payload = {
      name:      v.name,
      phone:     v.phone,          // 숫자만 (DB CHECK 통과)
      region:    v.region,
      db_volume: v.db || null,
      memo:      v.memo || null,
      source:    SOURCE,
    };

    fetch(SUPABASE_URL + "/rest/v1/" + TABLE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON,
        "Authorization": "Bearer " + SUPABASE_ANON,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.ok) {                       // 201 Created
          btn.value = "곧 신청이 완료됩니다";
          setTimeout(function () {
            alert("신청이 완료되었습니다.");
            window.location.href = RESULT_URL;
          }, 600);
          return;
        }
        return res.text().then(function (t) {
          var detail = "";
          try { var j = JSON.parse(t); detail = j.message || j.hint || j.code || t; }
          catch (_) { detail = t; }
          console.error("insert 실패:", res.status, t);

          if (res.status === 409 || /Too many requests/i.test(t)) {
            alert("이미 신청이 접수되었습니다. 잠시 후 다시 시도해주세요.");
          } else if (res.status === 404 || /does not exist|schema cache/i.test(t)) {
            alert("[" + res.status + "] 테이블(" + TABLE + ")을 찾을 수 없습니다.\n" + detail +
                  "\n→ Supabase 에서 " + TABLE + " 테이블 SQL을 실행했는지 확인하세요.");
          } else if (res.status === 401 || res.status === 403 || /row-level security|permission|JWT|api key/i.test(t)) {
            alert("[" + res.status + "] 권한/키 오류.\n" + detail +
                  "\n→ URL과 anon 키가 같은 프로젝트인지, anon insert 정책이 있는지 확인하세요.");
          } else {
            alert("[" + res.status + "] 전송 오류\n" + detail);
          }
          setSending(false);
          refreshBtn();
        });
      })
      .catch(function (err) {
        console.error(err);
        alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setSending(false);
        refreshBtn();
      });
  }
})();