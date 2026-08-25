/* 내레이션 덱 — 슬라이드 안의 드러내기 단계 이동.
 *
 * 영상에서는 내레이션 문장에 맞춰 항목이 하나씩 밝아진다. 사람이 브라우저로 덱을 볼
 * 때도 같은 순서를 따라갈 수 있어야 하므로, 화살표가 먼저 단계를 넘기고 단계가 끝나면
 * 다음 슬라이드로 간다.
 *
 * `deck.js` 를 수정하지 않는다. 발표용 덱이 같은 파일을 쓴다. 대신
 *   - 키와 버튼을 **캡처 단계** 에서 먼저 받아 남은 단계가 있으면 전파를 끊는다
 *   - 슬라이드 활성화는 MutationObserver 로 관찰한다 (deck.js 가 이벤트를 내지 않는다)
 *
 * 이 파일이 없거나 실행되지 않으면 `stepping` 클래스가 붙지 않으므로 모든 항목이 밝은
 * 상태로 남는다. 내용이 사라지지 않는 쪽이 기본값이다.
 */
(function () {
  "use strict";

  var stage = document.getElementById("deck");
  if (!stage) return;

  var slides = Array.prototype.slice.call(stage.querySelectorAll(".slide"));
  if (!slides.length) return;

  var enabled = true;
  var steps = new WeakMap();

  function maxStep(slide) {
    var marked = slide.querySelectorAll("[data-reveal]");
    var top = 0;
    for (var i = 0; i < marked.length; i += 1) {
      var value = parseInt(marked[i].getAttribute("data-reveal"), 10);
      if (!isNaN(value) && value > top) top = value;
    }
    return top;
  }

  function paint(slide) {
    var current = steps.get(slide) || 1;
    var marked = slide.querySelectorAll("[data-reveal]");
    for (var i = 0; i < marked.length; i += 1) {
      var node = marked[i];
      var value = parseInt(node.getAttribute("data-reveal"), 10);
      var shown = enabled ? value <= current : true;
      node.classList.toggle("is-shown", shown);
      node.classList.toggle("is-now", enabled && value === current);
    }
  }

  function activeSlide() {
    for (var i = 0; i < slides.length; i += 1) {
      if (slides[i].classList.contains("is-active")) return slides[i];
    }
    return null;
  }

  function advance(direction) {
    if (!enabled) return false;
    var slide = activeSlide();
    if (!slide) return false;
    var top = maxStep(slide);
    if (top <= 1) return false;
    var current = steps.get(slide) || 1;
    var next = current + direction;
    if (next < 1 || next > top) return false;
    steps.set(slide, next);
    paint(slide);
    return true;
  }

  // 슬라이드가 활성화되면 그 슬라이드의 단계를 처음으로 되돌린다. 뒤로 올 때는
  // 마지막 단계에서 시작하는 것이 자연스럽지만, 되돌아온 슬라이드를 다시 읽는
  // 사람에게는 처음부터가 낫다. 단순한 쪽을 고른다.
  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i += 1) {
      var target = records[i].target;
      if (target.classList && target.classList.contains("is-active")) {
        if (!steps.has(target)) steps.set(target, 1);
        paint(target);
      }
    }
  });
  slides.forEach(function (slide) {
    steps.set(slide, 1);
    observer.observe(slide, { attributes: true, attributeFilter: ["class"] });
  });

  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    var direction = event.key === "ArrowRight" ? 1
      : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    if (advance(direction)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  ["nextButton", "prevButton"].forEach(function (id) {
    var button = document.getElementById(id);
    if (!button) return;
    button.addEventListener("click", function (event) {
      if (advance(id === "nextButton" ? 1 : -1)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  });

  var toggle = document.getElementById("stepToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      enabled = !enabled;
      document.documentElement.classList.toggle("stepping", enabled);
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.textContent = enabled ? "드러내기 켬" : "드러내기 끔";
      slides.forEach(paint);
    });
  }

  document.documentElement.classList.add("stepping");
  slides.forEach(paint);
})();
