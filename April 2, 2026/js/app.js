(function () {
  const STORAGE_KEY = "birthdayScavengerIndex2026";

  if (new URLSearchParams(window.location.search).get("reset") === "1") {
    localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const cfg = window.GIFT_CONFIG;
  if (!cfg || !Array.isArray(cfg.steps)) {
    document.body.innerHTML =
      "<p style=\"padding:2rem;color:#fff;font-family:system-ui\">Missing GIFT_CONFIG in js/config.js</p>";
    return;
  }

  const root = document.getElementById("app");
  const metaTitle = document.getElementById("meta-title");

  if (metaTitle && cfg.meta?.pageTitle) metaTitle.textContent = cfg.meta.pageTitle;
  if (cfg.meta?.pageTitle) document.title = cfg.meta.pageTitle;

  function normalizeAnswer(s) {
    return String(s || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function loadIndex() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 0 && n < cfg.steps.length) return n;
    return 0;
  }

  function saveIndex(i) {
    localStorage.setItem(STORAGE_KEY, String(i));
  }

  let stepIndex = loadIndex();

  function spotifyEmbedUrl(shareUrl) {
    try {
      const u = new URL(shareUrl);
      const path = u.pathname;
      if (path.includes("/playlist/")) {
        const id = path.split("/playlist/")[1].split("?")[0];
        return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
      }
      if (path.includes("/album/")) {
        const id = path.split("/album/")[1].split("?")[0];
        return `https://open.spotify.com/embed/album/${id}?utm_source=generator&theme=0`;
      }
    } catch (_) {
      /* ignore */
    }
    return null;
  }

  function renderBackNav() {
    if (stepIndex <= 0) return "";
    return `<div class="nav-back"><button type="button" class="ghost" id="btn-back">← Previous step</button></div>`;
  }

  function renderProgress() {
    const dots = cfg.steps
      .map((_, i) => {
        let cls = "";
        if (i < stepIndex) cls = "done";
        else if (i === stepIndex) cls = "current";
        return `<span class="${cls}" aria-hidden="true"></span>`;
      })
      .join("");
    return `<div class="progress" role="presentation">${dots}</div>`;
  }

  function renderMedia(step) {
    if (step.video) {
      return `<div class="media"><video src="${escapeAttr(step.video)}" controls playsinline preload="metadata"></video></div>`;
    }
    if (step.image) {
      return `<div class="media"><img src="${escapeAttr(step.image)}" alt="" loading="lazy" /></div>`;
    }
    return "";
  }

  function renderGate(step) {
    const hintHtml = step.hint
      ? `<p class="hint" id="hint-el">${escapeHtml(step.hint)}</p>`
      : "";
    const media = renderMedia(step);

    return `
      ${renderProgress()}
      <div class="card">
        <h1>${escapeHtml(step.title)}</h1>
        <div class="body">${step.body}</div>
        ${media}
        <div class="input-wrap">
          <label class="sr" for="answer-input">Your answer</label>
          <input class="answer" id="answer-input" type="text" autocomplete="off" placeholder="Type the answer…" />
        </div>
        <p class="err" id="gate-err" aria-live="polite"></p>
        ${hintHtml}
        <div class="actions row">
          <button type="button" class="primary" id="btn-submit">Unlock</button>
          ${step.hint ? `<button type="button" class="ghost" id="btn-hint">Need a hint?</button>` : ""}
        </div>
        ${renderBackNav()}
      </div>
    `;
  }

  function renderIntroOrInterlude(step) {
    const media = renderMedia(step);
    return `
      ${renderProgress()}
      <div class="card">
        <h1>${escapeHtml(step.title)}</h1>
        <div class="body">${step.body}</div>
        ${media}
        <div class="actions">
          <button type="button" class="primary" id="btn-next">Continue</button>
        </div>
        ${renderBackNav()}
      </div>
    `;
  }

  /** 5 clickable stars; starMessages[0] = 1 star … starMessages[4] = 5 stars (HTML snippets). */
  function renderRating(step) {
    const stars = [1, 2, 3, 4, 5]
      .map(
        (n) =>
          `<button type="button" class="star-btn" data-star="${n}" aria-label="${n} star${n === 1 ? "" : "s"}">★</button>`
      )
      .join("");
    const requirePick = step.requireStarPick !== false;
    return `
      ${renderProgress()}
      <div class="card">
        <h1>${escapeHtml(step.title)}</h1>
        <div class="body">${step.body}</div>
        <div class="star-rating" role="group" aria-label="Choose a rating">${stars}</div>
        <div class="rating-reply body" id="rating-reply" hidden></div>
        <div class="actions">
          <button type="button" class="primary" id="btn-next"${requirePick ? " disabled" : ""}>Continue</button>
        </div>
        ${renderBackNav()}
      </div>
    `;
  }

  /**
   * Two truths & a lie — exactly three options: two with isLie: false, one with isLie: true.
   * Each: label (short), reveal (HTML shown after pick).
   */
  function renderTwoTruthsLie(step) {
    const opts = step.options;
    const requirePick = step.requirePick !== false;
    let choices = "";
    if (Array.isArray(opts) && opts.length === 3) {
      choices = opts
        .map((o, i) => {
          const lie = !!o.isLie;
          return `<button type="button" class="ttal-choice" data-ttal-index="${i}" data-is-lie="${lie}" aria-expanded="false">
            <span class="ttal-label">${escapeHtml(o.label || `Option ${i + 1}`)}</span>
            <div class="ttal-reveal-slot" aria-hidden="true">
              <div class="ttal-reveal body"></div>
            </div>
          </button>`;
        })
        .join("");
    } else {
      choices = `<p class="body"><em>Add exactly three items to <code>options</code> (see js/config.js — two truths, one lie).</em></p>`;
    }

    return `
      ${renderProgress()}
      <div class="card">
        <h1>${escapeHtml(step.title)}</h1>
        <div class="body">${step.body}</div>
        <div class="ttal-row" id="ttal-row" role="group" aria-label="Two truths and a lie">${choices}</div>
        <div class="actions">
          <button type="button" class="primary" id="btn-next"${requirePick ? " disabled" : ""}>Continue</button>
        </div>
        ${renderBackNav()}
      </div>
    `;
  }

  /**
   * Scratch-off cover — `reveal` is HTML under the matte. Optional: scratchClearPercent (0–1, default ~0.34),
   * scratchBrush (CSS px radius, default 26), requireScratch, showRevealLink.
   */
  function renderScratch(step) {
    const requireScratch = step.requireScratch !== false;
    const showSkip = step.showRevealLink !== false;
    const skipEl =
      showSkip ?
        `<button type="button" class="scratch-skip ghost" id="scratch-skip">Reveal without scratching</button>`
      : "";
    return `
      ${renderProgress()}
      <div class="card">
        <h1>${escapeHtml(step.title)}</h1>
        <div class="body">${step.body}</div>
        <div class="scratch-wrap" id="scratch-wrap">
          <div class="scratch-under body" id="scratch-under">${step.reveal || ""}</div>
          <canvas class="scratch-canvas" id="scratch-canvas" width="16" height="16" aria-hidden="true"></canvas>
        </div>
        <p class="scratch-hint body" id="scratch-hint">Scratch the gray with your finger or mouse.</p>
        <p class="scratch-status body" id="scratch-status" aria-live="polite"></p>
        ${skipEl}
        <div class="actions">
          <button type="button" class="primary" id="btn-next"${requireScratch ? " disabled" : ""}>Continue</button>
        </div>
        ${renderBackNav()}
      </div>
    `;
  }

  function renderFinale(step) {
    const embed = spotifyEmbedUrl(cfg.spotifyUrl || "");
    const frame =
      embed ?
        `<div class="spotify-frame">
          <iframe title="Spotify playlist" src="${escapeAttr(embed)}" allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>`
      : `<p class="body"><a href="${escapeAttr(cfg.spotifyUrl || "#")}" target="_blank" rel="noopener">Open the playlist in Spotify</a></p>`;

    return `
      ${renderProgress()}
      <div class="card">
        <h1>${escapeHtml(step.title)}</h1>
        <div class="body">${step.body}</div>
        ${frame}
        ${renderBackNav()}
      </div>
    `;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  const STEP_TRANSITION_MS = 280;
  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Wraps step markup; fade + nudge between steps (disabled if reduced motion). */
  function transitionToContent(innerHtml, afterMount) {
    const wrapped = `<div class="step-surface">${innerHtml}</div>`;
    const prev = root.querySelector(".step-surface");
    const reduced = prefersReducedMotion();

    const commit = () => {
      root.innerHTML = wrapped;
      const el = root.querySelector(".step-surface");
      if (!reduced && el) {
        el.classList.add("step-enter-start");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.classList.remove("step-enter-start");
          });
        });
      }
      afterMount();
    };

    if (!prev || reduced) {
      commit();
      return;
    }

    prev.classList.add("step-leave");
    window.setTimeout(commit, STEP_TRANSITION_MS);
  }

  function render() {
    const step = cfg.steps[stepIndex];
    if (!step) {
      stepIndex = 0;
      saveIndex(0);
      return render();
    }

    let html = "";
    if (step.kind === "gate") html = renderGate(step);
    else if (step.kind === "finale") html = renderFinale(step);
    else if (step.kind === "rating") html = renderRating(step);
    else if (step.kind === "twoTruthsLie") html = renderTwoTruthsLie(step);
    else if (step.kind === "scratch") html = renderScratch(step);
    else html = renderIntroOrInterlude(step);

    transitionToContent(html, () => bindStep(step));
  }

  function advance() {
    if (stepIndex < cfg.steps.length - 1) {
      stepIndex += 1;
      saveIndex(stepIndex);
      render();
    }
  }

  function retreat() {
    if (stepIndex > 0) {
      stepIndex -= 1;
      saveIndex(stepIndex);
      render();
    }
  }

  function bindStep(step) {
    const back = document.getElementById("btn-back");
    if (back) back.addEventListener("click", retreat);

    const next = document.getElementById("btn-next");
    if (next) next.addEventListener("click", advance);

    const submit = document.getElementById("btn-submit");
    const input = document.getElementById("answer-input");
    const errEl = document.getElementById("gate-err");
    const hintBtn = document.getElementById("btn-hint");
    const hintEl = document.getElementById("hint-el");

    if (hintBtn && hintEl) {
      hintBtn.addEventListener("click", () => hintEl.classList.add("visible"));
    }

    if (submit && input && errEl) {
      const trySubmit = () => {
        const got = normalizeAnswer(input.value);
        const ok = (step.answers || []).some((a) => normalizeAnswer(a) === got);
        if (ok) {
          errEl.textContent = "";
          advance();
        } else {
          errEl.textContent = "Not quite right — try again, or ask someone who refuses to help because that’s cheating.";
          errEl.classList.remove("shake");
          void errEl.offsetWidth;
          errEl.classList.add("shake");
        }
      };
      submit.addEventListener("click", trySubmit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") trySubmit();
      });
      input.focus();
    }

    if (step.kind === "rating") {
      const reply = document.getElementById("rating-reply");
      const nextBtn = document.getElementById("btn-next");
      const msgs = step.starMessages;
      const requirePick = step.requireStarPick !== false;
      root.querySelectorAll(".star-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const n = parseInt(btn.getAttribute("data-star"), 10);
          root.querySelectorAll(".star-btn").forEach((b) => {
            const k = parseInt(b.getAttribute("data-star"), 10);
            b.classList.toggle("is-filled", k <= n);
          });
          const fragment =
            Array.isArray(msgs) && msgs[n - 1] != null ?
              String(msgs[n - 1])
            : `<p><em>Add five entries to starMessages in config (index 0 = 1 star, … 4 = 5 stars).</em></p>`;
          if (reply) {
            reply.innerHTML = fragment;
            reply.hidden = false;
          }
          if (nextBtn && requirePick) nextBtn.disabled = false;
        });
      });
    }

    if (step.kind === "twoTruthsLie") {
      const row = document.getElementById("ttal-row");
      const nextBtn = document.getElementById("btn-next");
      const opts = step.options;
      const requirePick = step.requirePick !== false;
      if (row && Array.isArray(opts) && opts.length === 3) {
        row.querySelectorAll(".ttal-choice").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (row.classList.contains("ttal-resolved")) return;
          const idx = parseInt(btn.getAttribute("data-ttal-index"), 10);
          const isLie = btn.getAttribute("data-is-lie") === "true";
          const o = opts[idx];
          if (!o) return;

          row.classList.add("ttal-resolved");
          btn.classList.add("ttal-picked");
          btn.classList.add(isLie ? "ttal-lie" : "ttal-truth");
          btn.setAttribute("aria-expanded", "true");

          const slot = btn.querySelector(".ttal-reveal-slot");
          const inner = btn.querySelector(".ttal-reveal");
          if (inner) inner.innerHTML = String(o.reveal || "");
          if (slot) {
            slot.setAttribute("aria-hidden", "false");
            requestAnimationFrame(() => slot.classList.add("ttal-open"));
          }

          row.querySelectorAll(".ttal-choice").forEach((b) => {
            if (b !== btn) b.setAttribute("disabled", "");
          });

          if (nextBtn && requirePick) nextBtn.disabled = false;

          const actionsEl = root.querySelector(".actions");
          const focusContinue = () => {
            actionsEl?.scrollIntoView({ behavior: "smooth", block: "end" });
            if (nextBtn && !nextBtn.disabled) nextBtn.focus({ preventScroll: true });
          };
          requestAnimationFrame(focusContinue);
          setTimeout(focusContinue, 520);
        });
      });
      }
    }

    if (step.kind === "scratch") {
      const wrap = document.getElementById("scratch-wrap");
      const canvas = document.getElementById("scratch-canvas");
      const nextBtn = document.getElementById("btn-next");
      const statusEl = document.getElementById("scratch-status");
      const hintEl = document.getElementById("scratch-hint");
      const skipBtn = document.getElementById("scratch-skip");
      if (!wrap || !canvas) return;

      const requireScratch = step.requireScratch !== false;
      const threshold =
        typeof step.scratchClearPercent === "number" ?
          Math.min(0.95, Math.max(0.08, step.scratchClearPercent))
        : 0.34;
      const brushCss = typeof step.scratchBrush === "number" ? step.scratchBrush : 26;

      let ctx = null;
      let dpr = 1;
      let buffW = 0;
      let buffH = 0;
      let drawing = false;
      let done = false;

      function paintMatte(cssW, cssH) {
        const g = ctx.createLinearGradient(0, 0, cssW, cssH);
        g.addColorStop(0, "#c5dbe8");
        g.addColorStop(0.48, "#5a7a8a");
        g.addColorStop(1, "#9ec8bf");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, cssW, cssH);
        ctx.globalCompositeOperation = "destination-out";
      }

      function sizeCanvas() {
        const rect = wrap.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        if (w < 8 || h < 8) return false;
        dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        buffW = Math.max(1, Math.floor(w * dpr));
        buffH = Math.max(1, Math.floor(h * dpr));
        canvas.width = buffW;
        canvas.height = buffH;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx = canvas.getContext("2d", { alpha: true });
        paintMatte(w, h);
        return true;
      }

      function scratchAt(clientX, clientY) {
        if (!ctx || done) return;
        const r = canvas.getBoundingClientRect();
        const x = clientX - r.left;
        const y = clientY - r.top;
        const w = r.width;
        const h = r.height;
        if (x < -brushCss || y < -brushCss || x > w + brushCss || y > h + brushCss) return;
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, brushCss, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function clearedFraction() {
        if (!ctx || buffW < 2 || buffH < 2) return 0;
        const data = ctx.getImageData(0, 0, buffW, buffH).data;
        const step = Math.max(8, Math.floor(Math.min(buffW, buffH) / 24));
        let cleared = 0;
        let total = 0;
        for (let y = Math.floor(step / 2); y < buffH; y += step) {
          for (let x = Math.floor(step / 2); x < buffW; x += step) {
            const i = (y * buffW + x) * 4;
            total += 1;
            if (data[i + 3] < 45) cleared += 1;
          }
        }
        return total > 0 ? cleared / total : 0;
      }

      function checkProgress() {
        if (done || !ctx) return;
        const f = clearedFraction();
        if (f >= threshold) markDone();
      }

      function markDone() {
        if (done) return;
        done = true;
        wrap.classList.add("scratch-wrap--done");
        if (hintEl) hintEl.hidden = true;
        if (statusEl) statusEl.textContent = "";
        if (nextBtn && requireScratch) nextBtn.disabled = false;
        requestAnimationFrame(() => {
          const actionsEl = root.querySelector(".actions");
          actionsEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }

      let initTries = 0;
      function init() {
        initTries += 1;
        if (!sizeCanvas()) {
          if (initTries < 40) requestAnimationFrame(init);
          return;
        }
        canvas.addEventListener("pointerdown", (e) => {
          if (done) return;
          drawing = true;
          try {
            canvas.setPointerCapture(e.pointerId);
          } catch (_) {
            /* ignore */
          }
          scratchAt(e.clientX, e.clientY);
        });
        canvas.addEventListener("pointermove", (e) => {
          if (!drawing || done) return;
          scratchAt(e.clientX, e.clientY);
        });
        const endStroke = (e) => {
          if (!drawing) return;
          drawing = false;
          try {
            canvas.releasePointerCapture(e.pointerId);
          } catch (_) {
            /* ignore */
          }
          checkProgress();
        };
        canvas.addEventListener("pointerup", endStroke);
        canvas.addEventListener("pointercancel", () => {
          drawing = false;
          checkProgress();
        });
        if (skipBtn) {
          skipBtn.addEventListener("click", () => markDone());
        }
      }

      requestAnimationFrame(() => requestAnimationFrame(init));
    }

    attachInteractiveFx();
  }

  /** Background parallax + card tilt; no-op if reduced motion. */
  function attachInteractiveFx() {
    const surface = root.querySelector(".step-surface");
    const card = surface && surface.querySelector(".card");
    if (card) attachCardTilt(card);
  }

  function attachCardTilt(card) {
    if (!card || prefersReducedMotion()) return;
    const maxDeg = 4.25;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const clamp = (n) => Math.max(-1, Math.min(1, n));
      const rx = -clamp(py) * maxDeg;
      const ry = clamp(px) * maxDeg;
      card.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
    };
    const onLeave = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
  }

  function initAmbientParallax() {
    if (prefersReducedMotion()) return;
    let scheduled = false;
    let lx = 0;
    let ly = 0;
    document.addEventListener(
      "pointermove",
      (e) => {
        lx = e.clientX;
        ly = e.clientY;
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          const w = window.innerWidth || 1;
          const h = window.innerHeight || 1;
          const mx = ((lx / w) * 2 - 1).toFixed(4);
          const my = ((ly / h) * 2 - 1).toFixed(4);
          document.documentElement.style.setProperty("--mx", mx);
          document.documentElement.style.setProperty("--my", my);
        });
      },
      { passive: true }
    );
  }

  function initBgm() {
    const o = cfg.bgm;
    const audio = document.getElementById("ambient-bgm");
    const btn = document.getElementById("bgm-toggle");
    if (!o || !o.src || !audio) {
      if (btn) btn.hidden = true;
      return;
    }

    audio.loop = true;
    audio.src = o.src;

    const targetVol = typeof o.volume === "number" ? Math.min(1, Math.max(0, o.volume)) : 0.22;
    let fadeTimer = null;

    const fadeTo = (dest) => {
      if (fadeTimer) window.clearInterval(fadeTimer);
      const step = 0.025;
      fadeTimer = window.setInterval(() => {
        const v = audio.volume;
        if (Math.abs(v - dest) < step + 0.001) {
          audio.volume = dest;
          window.clearInterval(fadeTimer);
          fadeTimer = null;
        } else {
          audio.volume = v + (v < dest ? step : -step);
        }
      }, 55);
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      audio.volume = 0;
      audio
        .play()
        .then(() => fadeTo(targetVol))
        .catch(() => {
          started = false;
        });
    };

    const tryUnlock = () => {
      start();
      document.removeEventListener("pointerdown", tryUnlock, true);
      document.removeEventListener("keydown", tryUnlock, true);
    };
    document.addEventListener("pointerdown", tryUnlock, true);
    document.addEventListener("keydown", tryUnlock, true);

    audio.addEventListener("error", () => {
      if (btn) btn.hidden = true;
    });

    if (btn) {
      btn.hidden = false;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!started) {
          start();
          document.removeEventListener("pointerdown", tryUnlock, true);
          document.removeEventListener("keydown", tryUnlock, true);
          btn.setAttribute("aria-pressed", "true");
          btn.setAttribute("aria-label", "Mute background music");
          return;
        }
        audio.muted = !audio.muted;
        const m = audio.muted;
        btn.setAttribute("aria-pressed", m ? "false" : "true");
        btn.setAttribute(
          "aria-label",
          m ? "Unmute background music" : "Mute background music"
        );
        btn.classList.toggle("is-muted", m);
      });
    }
  }

  initBgm();
  initAmbientParallax();
  render();

  /* Service worker — only on HTTPS or localhost */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        /* offline optional */
      });
    });
  }
})();
