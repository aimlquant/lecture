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
  var narrationPanel = document.getElementById("narrationPanel");
  var narrationToggle = document.getElementById("narrationToggle");
  var narrationClose = document.getElementById("narrationClose");
  var narrationCounter = document.getElementById("narrationCounter");
  var deckSettingsPanel = document.getElementById("settingsPanel");
  var deckSettingsToggle = document.getElementById("settingsToggle");
  var narrationNotes = narrationPanel
    ? Array.prototype.slice.call(narrationPanel.querySelectorAll("[data-narration-slide]"))
    : [];
  var videoFrameDeck = Boolean(stage.querySelector("[data-frame-pattern]"));
  var hyperframesSceneDeck = Boolean(stage.querySelector("[data-hyperframes-scene]"));
  var printFramePreloads = [];
  if (videoFrameDeck) {
    slides.forEach(function (slide) {
      var frame = slide.querySelector("[data-frame-final]");
      if (!frame) return;
      var preload = new Image();
      preload.src = frame.getAttribute("data-frame-final");
      printFramePreloads.push(preload);
    });
  }

  function maxStep(slide) {
    var marked = slide.querySelectorAll("[data-reveal]");
    var top = 0;
    for (var i = 0; i < marked.length; i += 1) {
      var value = parseInt(marked[i].getAttribute("data-reveal"), 10);
      if (!isNaN(value) && value > top) top = value;
    }
    return top;
  }

  function setHyperframesStep(scene, step) {
    if (!scene || !scene.contentWindow) return;
    scene.setAttribute("data-scene-step", String(step));
    try {
      if (typeof scene.contentWindow.aimlquantHyperframesSetStep === "function") {
        scene.contentWindow.aimlquantHyperframesSetStep(step);
        return;
      }
    } catch (_error) {
      // 다른 origin에서 장면을 보는 경우는 postMessage 경로를 쓴다.
    }
    scene.contentWindow.postMessage({
      type: "aimlquant-hyperframes-step",
      step: step
    }, "*");
  }

  function paint(slide) {
    var current = steps.get(slide) || 1;
    var top = maxStep(slide);
    var frame = slide.querySelector("[data-frame-pattern]");
    if (frame) {
      var frameStep = enabled ? current : top;
      var pattern = frame.getAttribute("data-frame-pattern") || "";
      frame.src = pattern.replace("{step}", String(frameStep).padStart(2, "0"));
    }
    var scene = slide.querySelector("[data-hyperframes-scene]");
    if (scene) {
      var sceneStep = enabled ? current : top;
      setHyperframesStep(scene, sceneStep);
    }
    var marked = slide.querySelectorAll("[data-reveal]");
    for (var i = 0; i < marked.length; i += 1) {
      var node = marked[i];
      var value = parseInt(node.getAttribute("data-reveal"), 10);
      var shown = enabled ? value <= current : true;
      node.classList.toggle("is-shown", shown);
      node.classList.toggle("is-now", enabled && value === current);
    }
    if (slide.classList.contains("is-active")) paintNarration(slide);
  }

  function paintNarration(slide) {
    if (!narrationPanel) return;
    var slideId = slide ? slide.id : "";
    var note = null;
    for (var i = 0; i < narrationNotes.length; i += 1) {
      var active = narrationNotes[i].getAttribute("data-narration-slide") === slideId;
      narrationNotes[i].classList.toggle("is-active", active);
      narrationNotes[i].setAttribute("aria-hidden", String(!active));
      if (active) note = narrationNotes[i];
    }
    if (!note) return;

    var index = Number(note.getAttribute("data-narration-index")) || 1;
    if (narrationCounter) narrationCounter.textContent = index + " / " + narrationNotes.length;
    var current = steps.get(slide) || 1;
    var top = maxStep(slide);
    var sentences = note.querySelectorAll("[data-narration-sentence]");
    for (var j = 0; j < sentences.length; j += 1) {
      var sentenceStep = Number(sentences[j].getAttribute("data-narration-sentence"));
      var shown = top <= 1 || !enabled || sentenceStep <= current;
      var now = top <= 1 ? sentenceStep === 1 : enabled && sentenceStep === current;
      sentences[j].classList.toggle("is-shown", shown);
      sentences[j].classList.toggle("is-current", now);
    }
    var body = narrationPanel.querySelector(".narration-panel__body");
    if (body && document.body.classList.contains("narration-open")) {
      var currentSentence = note.querySelector(".narration-sentence.is-current");
      if (currentSentence) currentSentence.scrollIntoView({ block: "nearest" });
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
    var scene = slide.querySelector("[data-hyperframes-scene]");
    if (scene) scene.addEventListener("load", function () { paint(slide); });
  });

  window.addEventListener("message", function (event) {
    var data = event.data || {};
    if (data.type !== "aimlquant-hyperframes-key") return;
    var slide = activeSlide();
    var scene = slide && slide.querySelector("[data-hyperframes-scene]");
    if (!scene || event.source !== scene.contentWindow) return;
    if (data.key === "ArrowRight" || data.key === "ArrowLeft") {
      var direction = data.key === "ArrowRight" ? 1 : -1;
      if (!advance(direction)) {
        var button = document.getElementById(direction > 0 ? "nextButton" : "prevButton");
        if (button) button.click();
      }
    } else if (String(data.key).toLowerCase() === "n" && narrationPanel) {
      setNarration(!document.body.classList.contains("narration-open"));
    }
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
    if (videoFrameDeck || hyperframesSceneDeck) toggle.textContent = "문장 따라가기 켬";
    toggle.addEventListener("click", function () {
      enabled = !enabled;
      document.documentElement.classList.toggle("stepping", enabled);
      toggle.setAttribute("aria-pressed", String(enabled));
      toggle.textContent = (videoFrameDeck || hyperframesSceneDeck)
        ? (enabled ? "문장 따라가기 켬" : "최종 화면 고정")
        : (enabled ? "드러내기 켬" : "드러내기 끔");
      slides.forEach(paint);
    });
  }

  window.addEventListener("beforeprint", function () {
    slides.forEach(function (slide) {
      var frame = slide.querySelector("[data-frame-final]");
      if (frame) frame.src = frame.getAttribute("data-frame-final");
      var scene = slide.querySelector("[data-hyperframes-scene]");
      if (scene) setHyperframesStep(scene, maxStep(slide));
    });
  });
  window.addEventListener("afterprint", function () {
    slides.forEach(paint);
  });

  function savedNarrationOpen() {
    var requested = new URLSearchParams(window.location.search).get("narration");
    if (requested === "1") return true;
    if (requested === "0") return false;
    try {
      return window.localStorage.getItem("aimlquant-deck-narration") === "open";
    } catch (_error) {
      return false;
    }
  }

  function setNarration(open, remember) {
    if (!narrationPanel || !narrationToggle) return;
    if (open && deckSettingsPanel && deckSettingsToggle) {
      deckSettingsPanel.classList.remove("is-open");
      deckSettingsPanel.setAttribute("aria-hidden", "true");
      deckSettingsToggle.setAttribute("aria-expanded", "false");
    }
    document.body.classList.toggle("narration-open", open);
    narrationPanel.setAttribute("aria-hidden", String(!open));
    narrationToggle.setAttribute("aria-expanded", String(open));
    narrationToggle.setAttribute("aria-pressed", String(open));
    narrationToggle.setAttribute("aria-label", open ? "내레이션 닫기" : "내레이션 열기");
    narrationToggle.setAttribute("title", open ? "내레이션 닫기 (N)" : "내레이션 열기 (N)");
    narrationToggle.textContent = open ? "켬" : "끔";
    if (remember !== false) {
      try {
        window.localStorage.setItem("aimlquant-deck-narration", open ? "open" : "closed");
      } catch (_error) {
        // 저장을 막는 환경에서도 현재 페이지의 기능은 그대로 쓴다.
      }
    }
    paintNarration(activeSlide());
    window.dispatchEvent(new Event("resize"));
  }

  if (narrationToggle && narrationPanel) {
    narrationToggle.addEventListener("click", function () {
      setNarration(!document.body.classList.contains("narration-open"));
    });
    if (narrationClose) {
      narrationClose.addEventListener("click", function () {
        setNarration(false);
        if (deckSettingsToggle) deckSettingsToggle.focus();
      });
    }
    document.addEventListener("keydown", function (event) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target.matches("input, textarea, button, a, select, [contenteditable='true']")) return;
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        setNarration(!document.body.classList.contains("narration-open"));
      } else if (event.key === "Escape" && document.body.classList.contains("narration-open")) {
        setNarration(false);
      }
    });
    setNarration(savedNarrationOpen(), false);
  }

  document.documentElement.classList.add("stepping");
  slides.forEach(paint);
})();
