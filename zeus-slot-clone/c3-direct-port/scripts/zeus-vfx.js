(function () {
  "use strict";
  if (typeof window === "undefined" || !window.document) return;
  if (window.__zeusVFXInstalled) return;
  window.__zeusVFXInstalled = true;

  var CONFIG = {
    version: 1,
    sfxVolume: 0.9,
    coinDensity: 1,
    sparkDensity: 1,
    shakeEnabled: true,
    reducedMotion: false,
    logEvents: false,
  };
  try {
    CONFIG.reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  var DESIGN_W = 405;
  var DESIGN_H = 720;
  var REEL_X = [0.187, 0.344, 0.502, 0.65, 0.813];
  var REEL_TOP = 0.3;
  var REEL_BOTTOM = 0.56;
  var CENTER_Y = 0.42;

  var root = null;
  var fxCanvas = null;
  var fxCtx = null;
  var banner = null;
  var bannerLabel = null;
  var bannerAmount = null;
  var chip = null;
  var frame = null;
  var gameCanvas = null;
  var lastRect = { l: -1, t: -1, w: -1, h: -1 };
  var scale = 1;
  var dpr = 1;

  var sfxOn = true;
  var compact = false;
  var connected = false;
  var bonusActive = false;
  var bonusWonTotal = 0;
  var lastSpinStartT = 0;
  var spinDurations = [];
  var lastWinShownAt = 0;

  var parts = [];
  var bolts = [];
  var rays = [];
  var texts = [];
  var flash = { a: 0, decay: 0, color: "255,220,120" };
  var shake = { t: 0, dur: 0, amp: 0 };
  var shakeApplied = false;
  var shakePrevTransform = "";

  var coinSprite = null;
  var sparkSprite = null;

  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  function rnd(a, b) {
    return a + Math.random() * (b - a);
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function formatAmount(v) {
    var r = Math.round(v * 100) / 100;
    if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
    return r.toFixed(2);
  }

  function ensureRoot() {
    if (root && root.isConnected) return true;
    gameCanvas = window.c3canvas || document.querySelector("canvas");
    if (!gameCanvas) return false;
    root = document.createElement("div");
    root.id = "zeus-vfx-root";
    root.style.cssText =
      "position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483000;overflow:hidden;";
    fxCanvas = document.createElement("canvas");
    fxCanvas.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;";
    root.appendChild(fxCanvas);

    frame = document.createElement("div");
    frame.className = "zfx-frame";
    root.appendChild(frame);

    chip = document.createElement("div");
    chip.className = "zfx-chip";
    root.appendChild(chip);

    banner = document.createElement("div");
    banner.className = "zfx-banner";
    banner.innerHTML =
      '<div class="zfx-banner-glow"></div><div class="zfx-banner-label"></div><div class="zfx-banner-amount"></div>';
    root.appendChild(banner);
    bannerLabel = banner.querySelector(".zfx-banner-label");
    bannerAmount = banner.querySelector(".zfx-banner-amount");

    injectStyles();
    document.body.appendChild(root);
    fxCtx = fxCanvas.getContext("2d");
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    coinSprite = makeCoinSprite();
    sparkSprite = makeSparkSprite();
    return true;
  }

  function injectStyles() {
    if (document.getElementById("zeus-vfx-style")) return;
    var st = document.createElement("style");
    st.id = "zeus-vfx-style";
    st.textContent = [
      "#zeus-vfx-root{--zs:1}",
      "#zeus-vfx-root canvas{z-index:1}",
      ".zfx-frame,.zfx-chip{z-index:2}",
      ".zfx-banner{position:absolute;z-index:3;left:50%;top:42%;transform:translate(-50%,-50%) scale(.3);opacity:0;text-align:center;font-family:'Arial Black','Segoe UI',system-ui,sans-serif}",
      ".zfx-banner.zfx-show{animation:zfx-pop .5s cubic-bezier(.18,1.5,.4,1) forwards}",
      ".zfx-banner.zfx-hide{animation:zfx-out .32s ease-in forwards}",
      "@keyframes zfx-pop{to{transform:translate(-50%,-50%) scale(1);opacity:1}}",
      "@keyframes zfx-out{to{transform:translate(-50%,-50%) scale(1.12);opacity:0}}",
      ".zfx-banner-label{font-size:calc(40px*var(--zs));font-weight:900;letter-spacing:calc(2px*var(--zs));line-height:1.05;background:linear-gradient(180deg,#fffbe0 0%,#ffd24a 42%,#f39c12 68%,#8a5a00 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 2px 0 rgba(96,56,0,.9)) drop-shadow(0 0 calc(14px*var(--zs)) rgba(255,196,60,.85));text-transform:uppercase}",
      ".zfx-banner-amount{margin-top:calc(2px*var(--zs));font-size:calc(26px*var(--zs));font-weight:900;color:#fff7d6;text-shadow:0 0 calc(10px*var(--zs)) rgba(255,190,40,.95),0 2px 2px rgba(0,0,0,.75)}",
      ".zfx-banner-glow{position:absolute;left:50%;top:50%;width:calc(340px*var(--zs));height:calc(150px*var(--zs));transform:translate(-50%,-50%);background:radial-gradient(ellipse at center,rgba(255,200,60,.5) 0%,rgba(255,160,20,.22) 40%,rgba(255,140,0,0) 72%);z-index:-1}",
      ".zfx-chip{position:absolute;top:calc(10px*var(--zs));left:50%;transform:translateX(-50%) scale(.85);opacity:0;transition:opacity .25s ease,transform .25s ease;background:linear-gradient(180deg,#4a3200,#241600);border:calc(2px*var(--zs)) solid #ffcf4d;border-radius:calc(999px*var(--zs));padding:calc(5px*var(--zs)) calc(14px*var(--zs));color:#ffe9a8;font:700 calc(13px*var(--zs))/1.2 'Segoe UI',system-ui,sans-serif;letter-spacing:calc(.6px*var(--zs));text-shadow:0 1px 2px #000;box-shadow:0 0 calc(12px*var(--zs)) rgba(255,190,40,.55)}",
      ".zfx-chip.zfx-on{opacity:1;transform:translateX(-50%) scale(1)}",
      ".zfx-chip.zfx-pulse{animation:zfx-chip-pulse .5s ease}",
      "@keyframes zfx-chip-pulse{0%{transform:translateX(-50%) scale(1)}40%{transform:translateX(-50%) scale(1.14)}100%{transform:translateX(-50%) scale(1)}}",
      ".zfx-frame{position:absolute;left:0;top:0;right:0;bottom:0;opacity:0;transition:opacity .4s ease;box-shadow:inset 0 0 0 calc(3px*var(--zs)) rgba(255,205,70,.65),inset 0 0 calc(46px*var(--zs)) rgba(255,170,20,.28);border-radius:calc(8px*var(--zs))}",
      ".zfx-frame.zfx-on{opacity:1;animation:zfx-frame-pulse 1.4s ease-in-out infinite alternate}",
      "@keyframes zfx-frame-pulse{from{box-shadow:inset 0 0 0 calc(3px*var(--zs)) rgba(255,205,70,.45),inset 0 0 calc(30px*var(--zs)) rgba(255,170,20,.18)}to{box-shadow:inset 0 0 0 calc(3px*var(--zs)) rgba(255,215,90,.85),inset 0 0 calc(60px*var(--zs)) rgba(255,180,30,.4)}}",
    ].join("\n");
    document.head.appendChild(st);
  }

  function syncLayout() {
    if (!ensureRoot()) return;
    var r = gameCanvas.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return;
    if (r.left !== lastRect.l || r.top !== lastRect.t || r.width !== lastRect.w || r.height !== lastRect.h) {
      lastRect = { l: r.left, t: r.top, w: r.width, h: r.height };
      root.style.left = r.left + "px";
      root.style.top = r.top + "px";
      root.style.width = r.width + "px";
      root.style.height = r.height + "px";
      scale = r.width / DESIGN_W;
      root.style.setProperty("--zs", String(Math.round(scale * 1000) / 1000));
      var pw = Math.max(1, Math.round(r.width * dpr));
      var ph = Math.max(1, Math.round(r.height * dpr));
      if (fxCanvas.width !== pw || fxCanvas.height !== ph) {
        fxCanvas.width = pw;
        fxCanvas.height = ph;
      }
    }
  }

  function makeCoinSprite() {
    var s = 64;
    var c = document.createElement("canvas");
    c.width = s;
    c.height = s;
    var g = c.getContext("2d");
    g.translate(s / 2, s / 2);
    var grad = g.createRadialGradient(-6, -8, 4, 0, 0, 28);
    grad.addColorStop(0, "#fffbe6");
    grad.addColorStop(0.35, "#ffd75e");
    grad.addColorStop(0.72, "#e8a20c");
    grad.addColorStop(1, "#9a6400");
    g.beginPath();
    g.arc(0, 0, 27, 0, Math.PI * 2);
    g.fillStyle = grad;
    g.fill();
    g.lineWidth = 3.4;
    g.strokeStyle = "#8a5a00";
    g.stroke();
    g.beginPath();
    g.arc(0, 0, 19.5, 0, Math.PI * 2);
    g.lineWidth = 2.2;
    g.strokeStyle = "rgba(140,90,0,.75)";
    g.stroke();
    g.beginPath();
    g.moveTo(5.5, -14);
    g.lineTo(-3.5, 1.5);
    g.lineTo(1.8, 2.6);
    g.lineTo(-5.8, 15);
    g.lineTo(6.4, -1.2);
    g.lineTo(0.8, -2.4);
    g.closePath();
    g.fillStyle = "#a8730a";
    g.fill();
    g.lineWidth = 1.6;
    g.strokeStyle = "rgba(255,246,200,.55)";
    g.stroke();
    g.beginPath();
    g.ellipse(-9, -10, 7, 4.6, -0.7, 0, Math.PI * 2);
    g.fillStyle = "rgba(255,255,240,.55)";
    g.fill();
    return c;
  }

  function makeSparkSprite() {
    var s = 48;
    var c = document.createElement("canvas");
    c.width = s;
    c.height = s;
    var g = c.getContext("2d");
    var grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, "rgba(255,255,235,1)");
    grad.addColorStop(0.28, "rgba(255,225,130,.9)");
    grad.addColorStop(0.6, "rgba(255,170,40,.35)");
    grad.addColorStop(1, "rgba(255,150,20,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    return c;
  }

  var AC = null;
  var compressor = null;
  var dryBus = null;
  var wetBus = null;
  var noiseBuf = null;

  function ensureAudio() {
    if (AC) return AC;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      AC = new Ctx();
    } catch (e) {
      AC = null;
      return null;
    }
    try {
      compressor = AC.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.knee.value = 22;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.004;
      compressor.release.value = 0.24;
      compressor.connect(AC.destination);
      dryBus = AC.createGain();
      dryBus.gain.value = 1;
      dryBus.connect(compressor);
      var conv = AC.createConvolver();
      conv.buffer = makeIR(1.35);
      wetBus = AC.createGain();
      wetBus.gain.value = 0.22;
      wetBus.connect(conv);
      conv.connect(compressor);
      var len = Math.floor(AC.sampleRate * 1.2);
      noiseBuf = AC.createBuffer(1, len, AC.sampleRate);
      var ch = noiseBuf.getChannelData(0);
      for (var i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    } catch (e) {}
    return AC;
  }

  function makeIR(dur) {
    var rate = AC.sampleRate;
    var len = Math.floor(rate * dur);
    var buf = AC.createBuffer(2, len, rate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) {
        var t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * (t < 0.012 ? t / 0.012 : 1);
      }
    }
    return buf;
  }

  function unlockAudio() {
    ensureAudio();
    if (AC && AC.state === "suspended") {
      try {
        AC.resume();
      } catch (e) {}
    }
  }

  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });

  function audioReady() {
    if (!sfxOn) return null;
    if (!AC) return null;
    if (AC.state === "suspended") {
      try {
        AC.resume();
      } catch (e) {
        return null;
      }
    }
    return AC;
  }

  function bus(wet) {
    return wet ? wetBus : dryBus;
  }

  function tone(o) {
    var ac = o.ac;
    var t0 = o.t0;
    var dur = o.dur;
    var osc = ac.createOscillator();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.endFreq), t0 + dur);
    if (o.detune) osc.detune.value = o.detune;
    var g = ac.createGain();
    var peak = Math.max(0.0002, (o.vol || 0.2) * CONFIG.sfxVolume);
    var atk = Math.min(o.attack || 0.004, dur * 0.5);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    var node = osc;
    if (o.lp) {
      var f = ac.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = o.lp;
      node.connect(f);
      node = f;
    }
    node.connect(g);
    var out = g;
    if (o.pan) {
      var p = ac.createStereoPanner();
      p.pan.value = clamp(o.pan, -1, 1);
      g.connect(p);
      out = p;
    }
    out.connect(o.dest || bus(false));
    if (o.wet !== 0) out.connect(bus(true));
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noise(o) {
    var ac = o.ac;
    if (!noiseBuf) return;
    var src = ac.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    var f = ac.createBiquadFilter();
    f.type = o.filter || "lowpass";
    f.frequency.setValueAtTime(o.f0 || 1000, o.t0);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(Math.max(20, o.f1), o.t0 + o.dur);
    if (o.q) f.Q.value = o.q;
    var g = ac.createGain();
    var peak = Math.max(0.0002, (o.vol || 0.2) * CONFIG.sfxVolume);
    g.gain.setValueAtTime(0.0001, o.t0);
    g.gain.exponentialRampToValueAtTime(peak, o.t0 + (o.attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, o.t0 + o.dur);
    src.connect(f);
    f.connect(g);
    var out = g;
    if (o.pan) {
      var p = ac.createStereoPanner();
      p.pan.value = clamp(o.pan, -1, 1);
      g.connect(p);
      out = p;
    }
    out.connect(o.dest || bus(false));
    if (o.wet !== 0) out.connect(bus(true));
    src.start(o.t0, Math.random() * 0.5);
    src.stop(o.t0 + o.dur + 0.05);
  }

  function sfxReelStop(col) {
    var ac = audioReady();
    if (!ac) return;
    var t0 = ac.currentTime + 0.001;
    tone({ ac: ac, t0: t0, freq: 172 + col * 24, endFreq: 108 + col * 16, type: "sine", dur: 0.1, vol: 0.26, attack: 0.002 });
    noise({ ac: ac, t0: t0, dur: 0.05, vol: 0.09, filter: "lowpass", f0: 2400, f1: 550 });
    tone({ ac: ac, t0: t0, freq: 2450 + col * 140, type: "triangle", dur: 0.035, vol: 0.045, attack: 0.001, wet: 0.4 });
  }

  function sfxCoin(when, base, vol) {
    var ac = audioReady();
    if (!ac) return;
    var t0 = ac.currentTime + when;
    var f = base || rnd(1600, 4200);
    var pan = rnd(-0.6, 0.6);
    tone({ ac: ac, t0: t0, freq: f, type: "triangle", dur: 0.24, vol: (vol || 0.13), attack: 0.002, pan: pan, wet: 0.35 });
    tone({ ac: ac, t0: t0 + 0.012, freq: f * 1.4983, type: "triangle", dur: 0.17, vol: (vol || 0.13) * 0.55, attack: 0.002, pan: pan, wet: 0.35 });
  }

  function sfxCascade(n, spread, base) {
    var ac = audioReady();
    if (!ac) return;
    n = Math.max(1, Math.round(n * (compact ? 0.6 : 1)));
    for (var i = 0; i < n; i++) {
      sfxCoin(Math.random() * spread, base ? base * rnd(0.85, 1.3) : undefined, rnd(0.07, 0.14));
    }
  }

  function sfxChime(notes, step, vol) {
    var ac = audioReady();
    if (!ac) return;
    var t = 0.02;
    for (var i = 0; i < notes.length; i++) {
      tone({ ac: ac, t0: ac.currentTime + t, freq: notes[i], type: "triangle", dur: 0.5, vol: vol || 0.16, attack: 0.004, wet: 0.5 });
      tone({ ac: ac, t0: ac.currentTime + t, freq: notes[i] * 2, type: "sine", dur: 0.32, vol: (vol || 0.16) * 0.4, attack: 0.004, wet: 0.5 });
      t += step;
    }
  }

  function sfxFanfare(kind) {
    var ac = audioReady();
    if (!ac) return;
    var seq;
    var step;
    var vol;
    if (kind === "medium") {
      seq = [523.25, 659.25, 783.99, 1046.5];
      step = 0.085;
      vol = 0.15;
    } else if (kind === "big") {
      seq = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
      step = 0.1;
      vol = 0.18;
    } else {
      seq = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
      step = 0.115;
      vol = 0.2;
    }
    var t = 0.03;
    for (var i = 0; i < seq.length; i++) {
      var f = seq[i];
      tone({ ac: ac, t0: ac.currentTime + t, freq: f, type: "sawtooth", dur: 0.5, vol: vol, attack: 0.006, lp: 4200, wet: 0.45 });
      tone({ ac: ac, t0: ac.currentTime + t, freq: f * 1.005, type: "sawtooth", dur: 0.5, vol: vol * 0.6, attack: 0.006, lp: 4200, wet: 0.45 });
      tone({ ac: ac, t0: ac.currentTime + t, freq: f / 2, type: "square", dur: 0.44, vol: vol * 0.28, attack: 0.006, lp: 1600, wet: 0.3 });
      t += step;
    }
    var endT = 0.03 + seq.length * step + 0.05;
    var chord = kind === "mega" ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
    for (var c = 0; c < chord.length; c++) {
      tone({ ac: ac, t0: ac.currentTime + endT, freq: chord[c], type: "sawtooth", dur: kind === "mega" ? 1.9 : 1.1, vol: vol * 0.55, attack: 0.05, lp: 3000, wet: 0.55 });
    }
    if (kind === "mega") {
      for (var h = 0; h < 4; h++) {
        tone({ ac: ac, t0: ac.currentTime + endT + h * 0.14, freq: 2093 + h * 120, type: "sine", dur: 0.5, vol: 0.05, attack: 0.01, wet: 0.7 });
      }
    }
  }

  function sfxThunder(power) {
    var ac = audioReady();
    if (!ac) return;
    power = power || 1;
    var t0 = ac.currentTime + 0.01;
    noise({ ac: ac, t0: t0, dur: 0.28, vol: 0.5 * power, filter: "highpass", f0: 900, f1: 200, attack: 0.002, wet: 0.3 });
    noise({ ac: ac, t0: t0, dur: 1.9, vol: 0.42 * power, filter: "lowpass", f0: 220, f1: 55, attack: 0.02, wet: 0.4 });
    tone({ ac: ac, t0: t0, freq: 64, endFreq: 34, type: "sine", dur: 0.8, vol: 0.24 * power, attack: 0.004 });
    noise({ ac: ac, t0: t0 + 0.1, dur: 1.4, vol: 0.2 * power, filter: "bandpass", f0: 120, f1: 70, q: 1.1, attack: 0.12, wet: 0.5 });
  }

  function sfxWhoosh() {
    var ac = audioReady();
    if (!ac) return;
    var t0 = ac.currentTime + 0.01;
    noise({ ac: ac, t0: t0, dur: 0.9, vol: 0.18, filter: "bandpass", f0: 220, f1: 3200, q: 1.4, attack: 0.3, wet: 0.4 });
    noise({ ac: ac, t0: t0 + 0.75, dur: 0.5, vol: 0.14, filter: "bandpass", f0: 3200, f1: 500, q: 1.4, attack: 0.05, wet: 0.4 });
  }

  function sfxGong() {
    var ac = audioReady();
    if (!ac) return;
    var t0 = ac.currentTime + 0.02;
    tone({ ac: ac, t0: t0, freq: 98, type: "sine", dur: 1.7, vol: 0.3, attack: 0.01, wet: 0.6 });
    tone({ ac: ac, t0: t0, freq: 147, type: "sine", dur: 1.4, vol: 0.16, attack: 0.01, wet: 0.6 });
    tone({ ac: ac, t0: t0, freq: 196, type: "triangle", dur: 1.1, vol: 0.1, attack: 0.01, wet: 0.6 });
    noise({ ac: ac, t0: t0, dur: 0.6, vol: 0.12, filter: "bandpass", f0: 300, f1: 140, q: 0.8, attack: 0.01, wet: 0.5 });
  }

  function sfxTick() {
    var ac = audioReady();
    if (!ac) return;
    tone({ ac: ac, t0: ac.currentTime + 0.001, freq: rnd(1650, 2350), type: "square", dur: 0.018, vol: 0.03, attack: 0.001, wet: 0.25 });
  }

  function spawnCoin(x, y, opt) {
    if (parts.length > 520) return;
    opt = opt || {};
    var ang = opt.angle !== undefined ? opt.angle : rnd(-Math.PI * 0.85, -Math.PI * 0.15);
    var sp = opt.speed !== undefined ? opt.speed : rnd(240, 620);
    parts.push({
      type: "coin",
      x: x,
      y: y,
      vx: Math.cos(ang) * sp * rnd(0.7, 1.25),
      vy: Math.sin(ang) * sp,
      g: opt.g !== undefined ? opt.g : 1350,
      rot: rnd(0, Math.PI * 2),
      vr: rnd(-9, 9),
      r: rnd(9, 15) * (opt.size || 1),
      life: rnd(1.1, 1.9),
      age: 0,
      bounce: opt.bounce !== false,
      wob: rnd(0, Math.PI * 2),
    });
  }

  function spawnSpark(x, y, opt) {
    if (parts.length > 520) return;
    opt = opt || {};
    var ang = opt.angle !== undefined ? opt.angle : rnd(0, Math.PI * 2);
    var sp = opt.speed !== undefined ? opt.speed : rnd(60, 330);
    parts.push({
      type: "spark",
      x: x,
      y: y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - rnd(0, 90),
      g: rnd(400, 900),
      r: rnd(4, 11) * (opt.size || 1),
      life: rnd(0.35, 0.9),
      age: 0,
    });
  }

  function spawnDust(x, y, n) {
    n = Math.round(n * CONFIG.coinDensity);
    for (var i = 0; i < n; i++) {
      if (parts.length > 520) return;
      parts.push({
        type: "dust",
        x: x + rnd(-14, 14),
        y: y + rnd(-8, 8),
        vx: rnd(-55, 55),
        vy: rnd(-95, -18),
        g: -30,
        r: rnd(5, 14),
        life: rnd(0.4, 0.8),
        age: 0,
      });
    }
  }

  function spawnRing(x, y, opt) {
    if (parts.length > 520) return;
    opt = opt || {};
    parts.push({
      type: "ring",
      x: x,
      y: y,
      r0: opt.r0 || 6,
      r1: opt.r1 || 60,
      lw: opt.lw || 3,
      color: opt.color || "255,210,90",
      life: opt.life || 0.45,
      age: 0,
    });
  }

  function spawnConfetti(n) {
    var colors = ["#ffd24a", "#ff9d2e", "#fff3c4", "#7ec8ff", "#ffe9a8"];
    for (var i = 0; i < n; i++) {
      if (parts.length > 620) return;
      parts.push({
        type: "confetti",
        x: rnd(0.1, 0.9) * DESIGN_W,
        y: rnd(-40, -10),
        vx: rnd(-40, 40),
        vy: rnd(90, 210),
        g: 60,
        rot: rnd(0, Math.PI * 2),
        vr: rnd(-7, 7),
        w: rnd(5, 9),
        h: rnd(8, 15),
        color: pick(colors),
        wob: rnd(0, Math.PI * 2),
        life: rnd(2.2, 3.4),
        age: 0,
      });
    }
  }

  function spawnBolt(x1, y1, x2, y2, opt) {
    opt = opt || {};
    bolts.push({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      segs: opt.segs || 10,
      jitter: opt.jitter || 22,
      life: opt.life || 0.24,
      age: 0,
      points: null,
    });
  }

  function spawnRays(x, y, opt) {
    opt = opt || {};
    rays.push({
      x: x,
      y: y,
      n: opt.n || 12,
      len: opt.len || DESIGN_H * 0.9,
      rot: rnd(0, Math.PI),
      vr: opt.vr !== undefined ? opt.vr : 0.35,
      life: opt.life || 1.2,
      age: 0,
      alpha: opt.alpha || 0.1,
    });
  }

  function spawnText(x, y, str, opt) {
    opt = opt || {};
    texts.push({
      x: x,
      y: y,
      str: str,
      size: opt.size || 30,
      life: opt.life || 1.2,
      age: 0,
      vy: opt.vy || -46,
      color: opt.color || "#ffe9a8",
    });
  }

  function doFlash(a, decay, color) {
    flash.a = Math.max(flash.a, a);
    flash.decay = decay || 4.2;
    flash.color = color || "255,220,120";
  }

  function doShake(amp) {
    if (!CONFIG.shakeEnabled || CONFIG.reducedMotion) return;
    shake.amp = Math.max(shake.amp, amp);
    shake.dur = 0.55;
    shake.t = 0;
  }

  function coinBurst(x, y, n, opt) {
    n = Math.round(n * CONFIG.coinDensity * (compact ? 0.55 : 1));
    for (var i = 0; i < n; i++) spawnCoin(x, y, opt);
  }

  function sparkBurst(x, y, n, opt) {
    n = Math.round(n * CONFIG.sparkDensity * (compact ? 0.5 : 1));
    for (var i = 0; i < n; i++) spawnSpark(x, y, opt);
  }

  function coinRain(n, spread) {
    n = Math.round(n * CONFIG.coinDensity * (compact ? 0.5 : 1));
    for (var i = 0; i < n; i++) {
      spawnCoin(rnd(0.08, 0.92) * DESIGN_W, rnd(-30, -6), {
        angle: Math.PI / 2 + rnd(-0.28, 0.28),
        speed: rnd(60, 190),
        g: 520,
        size: rnd(0.75, 1.15),
        bounce: false,
      });
    }
  }

  var bannerTimer = null;
  var bannerCountRaf = 0;

  function showBanner(label, amount, duration, compactMode) {
    if (!ensureRoot()) return;
    var dur = duration * (compactMode ? 0.55 : 1);
    if (bannerTimer) clearTimeout(bannerTimer);
    cancelAnimationFrame(bannerCountRaf);
    bannerTimer = null;
    banner.classList.remove("zfx-show", "zfx-hide");
    bannerLabel.textContent = "";
    bannerAmount.textContent = "";
    requestAnimationFrame(function () {
      if (!banner.isConnected) return;
      bannerLabel.textContent = label;
      bannerAmount.textContent = amount ? "+0" : "";
      void banner.offsetWidth;
      banner.classList.add("zfx-show");
      if (amount) {
        var t0 = performance.now();
        var rollDur = Math.min(dur * 520, 1500);
        var step = function (now) {
          var k = clamp((now - t0) / rollDur, 0, 1);
          var e = 1 - Math.pow(1 - k, 3);
          bannerAmount.textContent = "+" + formatAmount(amount * e);
          if (k < 1) bannerCountRaf = requestAnimationFrame(step);
          else bannerAmount.textContent = "+" + formatAmount(amount);
        };
        bannerCountRaf = requestAnimationFrame(step);
      }
      bannerTimer = setTimeout(function () {
        banner.classList.remove("zfx-show");
        banner.classList.add("zfx-hide");
      }, dur * 1000);
    });
  }

  function hideBanner() {
    if (!banner) return;
    if (bannerTimer) clearTimeout(bannerTimer);
    cancelAnimationFrame(bannerCountRaf);
    banner.classList.remove("zfx-show");
    banner.classList.add("zfx-hide");
  }

  function setChip(str) {
    if (!chip) return;
    chip.textContent = str;
    chip.classList.add("zfx-on");
    chip.classList.remove("zfx-pulse");
    void chip.offsetWidth;
    chip.classList.add("zfx-pulse");
  }

  function clearChip() {
    if (chip) chip.classList.remove("zfx-on");
  }

  function setBonusFrame(on) {
    if (!frame) return;
    frame.classList.toggle("zfx-on", !!on);
  }

  var TIERS = {
    small: { label: "", coins: 16, sparks: 6, shake: 0, flash: 0, banner: 0, sound: "small" },
    medium: { label: "WIN", coins: 44, sparks: 14, shake: 0.12, flash: 0.12, banner: 1.4, sound: "medium" },
    big: { label: "BIG WIN", coins: 90, sparks: 22, shake: 0.42, flash: 0.26, banner: 2.6, sound: "big" },
    mega: { label: "MEGA WIN", coins: 150, sparks: 34, shake: 0.68, flash: 0.4, banner: 3.8, sound: "mega" },
  };

  function tierFor(ratio, amount) {
    if (ratio !== null && ratio !== undefined && ratio > 0) {
      if (ratio >= 100) return "mega";
      if (ratio >= 20) return "big";
      if (ratio >= 5) return "medium";
      return "small";
    }
    if (amount >= 100) return "mega";
    if (amount >= 20) return "big";
    if (amount >= 5) return "medium";
    return "small";
  }

  function celebrate(tierId, amount) {
    var t = TIERS[tierId] || TIERS.small;
    var cx = DESIGN_W / 2;
    var cy = DESIGN_H * CENTER_Y;
    var reelCy = DESIGN_H * (REEL_TOP + REEL_BOTTOM) / 2;

    coinBurst(cx, reelCy, t.coins, {});
    if (t.coins > 30) coinRain(t.coins * 0.35);
    if (t.coins > 60) {
      coinBurst(DESIGN_W * REEL_X[1], reelCy, t.coins * 0.3, {});
      coinBurst(DESIGN_W * REEL_X[3], reelCy, t.coins * 0.3, {});
    }
    sparkBurst(cx, reelCy, t.sparks, {});
    spawnRing(cx, reelCy, { r1: DESIGN_W * 0.55, lw: 4, color: "255,215,100", life: 0.55 });

    if (tierId === "small") {
      sfxCoin(0.02, rnd(1800, 2600), 0.16);
      sfxCoin(0.1, undefined, 0.12);
      if (amount) spawnText(cx, cy, "+" + formatAmount(amount), { size: compact ? 26 : 32 });
      return;
    }

    if (tierId === "medium") {
      sfxChime([659.25, 783.99, 1046.5], 0.075, 0.15);
      sfxCascade(10, 0.7);
    } else {
      sfxFanfare(t.sound);
      sfxCascade(tierId === "mega" ? 26 : 16, 1.5);
      if (tierId === "big" || tierId === "mega") {
        sfxThunder(tierId === "mega" ? 1 : 0.65);
        spawnBolt(cx, -10, cx + rnd(-60, 60), DESIGN_H * 0.3, { jitter: 30, life: 0.3 });
        spawnBolt(rnd(0.15, 0.85) * DESIGN_W, -10, rnd(0.2, 0.8) * DESIGN_W, DESIGN_H * 0.34, { jitter: 26, life: 0.26 });
        if (tierId === "mega") {
          spawnBolt(rnd(0.1, 0.9) * DESIGN_W, -10, rnd(0.1, 0.9) * DESIGN_W, DESIGN_H * 0.36, { jitter: 34, life: 0.3 });
          spawnBolt(rnd(0.1, 0.9) * DESIGN_W, -10, rnd(0.1, 0.9) * DESIGN_W, DESIGN_H * 0.32, { jitter: 30, life: 0.34 });
          spawnConfetti(40);
        }
      }
      spawnRays(cx, reelCy, { n: tierId === "mega" ? 16 : 12, alpha: tierId === "mega" ? 0.12 : 0.09, life: tierId === "mega" ? 1.7 : 1.2, len: tierId === "mega" ? DESIGN_H : DESIGN_H * 0.75 });
    }

    doFlash(t.flash, 4.2, "255,225,130");
    doShake(t.shake);
    if (t.banner > 0 && amount) {
      showBanner(t.label, amount, t.banner, compact);
    } else if (t.banner > 0) {
      showBanner(t.label, 0, t.banner, compact);
    }
  }

  function onReelStop(col) {
    var x = DESIGN_W * REEL_X[col];
    spawnDust(x, DESIGN_H * REEL_BOTTOM, 7);
    spawnRing(x, DESIGN_H * REEL_BOTTOM - 6, { r0: 4, r1: 34, lw: 2.4, color: "255,220,120", life: 0.35 });
    sfxReelStop(col);
    sparkBurst(x, DESIGN_H * (REEL_TOP + REEL_BOTTOM) / 2, 3, { speed: 120, size: 0.6 });
  }

  function onWin(ev) {
    var amount = ev.amount || 0;
    var tier = tierFor(ev.ratio, amount);
    lastWinShownAt = performance.now();
    if (bonusActive) {
      bonusWonTotal += amount;
      celebrate(tier === "mega" ? "big" : tier, amount);
      return;
    }
    celebrate(tier, amount);
  }

  function onBonusStart(remaining) {
    bonusActive = true;
    bonusWonTotal = 0;
    setBonusFrame(true);
    setChip("FREE SPINS" + (remaining ? " \u00b7 " + remaining + " LEFT" : ""));
    sfxWhoosh();
    sfxThunder(0.9);
    sfxGong();
    spawnBolt(DESIGN_W * 0.5, -10, DESIGN_W * 0.5, DESIGN_H * 0.35, { jitter: 36, life: 0.4 });
    spawnRays(DESIGN_W / 2, DESIGN_H * CENTER_Y, { n: 16, alpha: 0.12, life: 2.2, len: DESIGN_H });
    doFlash(0.35, 3.4, "255,230,150");
    showBanner("FREE SPINS", 0, 2.4, compact);
  }

  function onBonusSpin(remaining) {
    if (remaining > 0) setChip("FREE SPINS \u00b7 " + remaining + " LEFT");
    sfxTick();
    coinRain(6);
  }

  function onBonusEnd(ev) {
    bonusActive = false;
    setBonusFrame(false);
    clearChip();
    var total = bonusWonTotal;
    if (ev && ev.winAmount && ev.winAmount > 0) total = Math.max(total, ev.winAmount);
    if (total > 0) {
      bonusWonTotal = 0;
      flash.a = 0;
      setTimeout(function () {
        celebrate(tierFor(null, total) === "small" ? "medium" : tierFor(null, total), total);
      }, 250);
    }
  }

  function onEvent(ev) {
    if (!ev || ev.__zeus !== 1) return;
    if (CONFIG.logEvents) {
      try {
        console.log("[zeus-vfx]", ev.ev, ev);
      } catch (e) {}
    }
    switch (ev.ev) {
      case "hello":
        connected = true;
        break;
      case "state":
        if (ev.som !== null && ev.som !== undefined) sfxOn = !(ev.som === 0);
        if (ev.turbo === 1) compact = true;
        else if (ev.turbo === 2) compact = spinDurations.length >= 2 ? median(spinDurations) < 2600 : false;
        break;
      case "spinStart":
        lastSpinStartT = ev.t;
        onSpinStart();
        break;
      case "reelStop":
        onReelStop(ev.col);
        break;
      case "spinEnd":
        if (lastSpinStartT) {
          spinDurations.push(ev.t - lastSpinStartT);
          if (spinDurations.length > 5) spinDurations.shift();
          if (spinDurations.length >= 2) compact = median(spinDurations) < 2600;
        }
        break;
      case "win":
        onWin(ev);
        break;
      case "winClear":
        break;
      case "bonusStart":
        onBonusStart(ev.remaining);
        break;
      case "bonusSpin":
        onBonusSpin(ev.remaining);
        break;
      case "bonusEnd":
        onBonusEnd(ev);
        break;
    }
  }

  function median(arr) {
    var a = arr.slice().sort(function (x, y) {
      return x - y;
    });
    return a[(a.length / 2) | 0];
  }

  function onSpinStart() {
    if (bonusActive) sfxTick();
    var cx = DESIGN_W / 2;
    sparkBurst(cx, DESIGN_H * REEL_TOP, 4, { speed: 90, size: 0.55 });
  }

  function stepParticles(dt) {
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.age += dt;
      if (p.age >= p.life) {
        parts.splice(i, 1);
        continue;
      }
      if (p.type === "ring") continue;
      p.vy += (p.g || 0) * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === "coin" || p.type === "confetti") {
        p.rot += p.vr * dt;
        if (p.bounce && p.y > DESIGN_H - 12 && p.vy > 0) {
          p.y = DESIGN_H - 12;
          p.vy *= -0.42;
          p.vx *= 0.82;
          if (Math.abs(p.vy) < 40) p.vy = 0;
          p.bounce = Math.abs(p.vy) > 40;
        }
        if (p.type === "confetti") {
          p.wob += dt * 5;
          p.x += Math.sin(p.wob) * 26 * dt;
        }
      }
      if (p.x < -60 || p.x > DESIGN_W + 60 || p.y > DESIGN_H + 80) parts.splice(i, 1);
    }
    for (var b = bolts.length - 1; b >= 0; b--) {
      bolts[b].age += dt;
      if (bolts[b].age >= bolts[b].life) bolts.splice(b, 1);
    }
    for (var r = rays.length - 1; r >= 0; r--) {
      rays[r].age += dt;
      rays[r].rot += rays[r].vr * dt;
      if (rays[r].age >= rays[r].life) rays.splice(r, 1);
    }
    for (var t = texts.length - 1; t >= 0; t--) {
      texts[t].age += dt;
      if (texts[t].age >= texts[t].life) texts.splice(t, 1);
    }
    if (flash.a > 0) flash.a = Math.max(0, flash.a - flash.decay * dt);
  }

  function boltPoints(b) {
    if (!b.points || (performance.now() & 32) === 0) {
      var pts = [];
      var n = b.segs;
      for (var i = 0; i <= n; i++) {
        var k = i / n;
        var x = b.x1 + (b.x2 - b.x1) * k;
        var y = b.y1 + (b.y2 - b.y1) * k;
        if (i > 0 && i < n) {
          var dx = b.x2 - b.x1;
          var dy = b.y2 - b.y1;
          var len = Math.sqrt(dx * dx + dy * dy) || 1;
          var nx = -dy / len;
          var ny = dx / len;
          var off = rnd(-b.jitter, b.jitter) * (1 - Math.abs(k - 0.5) * 1.4);
          x += nx * off;
          y += ny * off;
        }
        pts.push([x, y]);
      }
      b.points = pts;
    }
    return b.points;
  }

  function drawFx() {
    if (!fxCtx) return;
    var ctx = fxCtx;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    ctx.clearRect(0, 0, DESIGN_W, DESIGN_H);
    ctx.globalCompositeOperation = "source-over";

    var now = performance.now();

    for (var r = 0; r < rays.length; r++) {
      var ry = rays[r];
      var rk = ry.age / ry.life;
      var ra = ry.alpha * Math.sin(Math.PI * clamp(rk, 0, 1));
      if (ra <= 0.002) continue;
      ctx.save();
      ctx.translate(ry.x, ry.y);
      ctx.rotate(ry.rot);
      ctx.globalCompositeOperation = "lighter";
      for (var s = 0; s < ry.n; s++) {
        var ang = (s / ry.n) * Math.PI * 2;
        ctx.save();
        ctx.rotate(ang);
        var grad = ctx.createLinearGradient(0, 0, ry.len, 0);
        grad.addColorStop(0, "rgba(255,235,160," + ra.toFixed(3) + ")");
        grad.addColorStop(0.5, "rgba(255,200,80," + (ra * 0.55).toFixed(3) + ")");
        grad.addColorStop(1, "rgba(255,170,30,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ry.len, -ry.len * 0.045);
        ctx.lineTo(ry.len, ry.len * 0.045);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    ctx.globalCompositeOperation = "source-over";
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var k = p.age / p.life;
      var alpha = k < 0.75 ? 1 : 1 - (k - 0.75) / 0.25;
      if (p.type === "coin") {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        var sc = (p.r * 2) / coinSprite.width;
        ctx.drawImage(coinSprite, -p.r, -p.r, coinSprite.width * sc, coinSprite.height * sc);
        ctx.restore();
      } else if (p.type === "spark") {
        ctx.save();
        ctx.globalAlpha = alpha * 0.95;
        ctx.globalCompositeOperation = "lighter";
        var sr = p.r * (1 + k * 0.6);
        ctx.drawImage(sparkSprite, p.x - sr, p.y - sr, sr * 2, sr * 2);
        ctx.restore();
      } else if (p.type === "dust") {
        ctx.save();
        ctx.globalAlpha = alpha * 0.32;
        ctx.fillStyle = "rgba(226,208,170,1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + k * 1.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === "ring") {
        var rk2 = p.age / p.life;
        var rr = p.r0 + (p.r1 - p.r0) * (1 - Math.pow(1 - rk2, 2));
        ctx.save();
        ctx.globalAlpha = (1 - rk2) * 0.85;
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = "rgba(" + p.color + ",1)";
        ctx.lineWidth = p.lw * (1 - rk2 * 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (p.type === "confetti") {
        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha * 1.6);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * (0.4 + 0.6 * Math.abs(Math.sin(p.wob))));
        ctx.restore();
      }
    }

    for (var bl = 0; bl < bolts.length; bl++) {
      var bolt = bolts[bl];
      var bk = bolt.age / bolt.life;
      var ba = (1 - bk) * (0.55 + 0.45 * Math.random());
      if (ba <= 0.02) continue;
      var pts2 = boltPoints(bolt);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = ba * 0.4;
      ctx.strokeStyle = "rgba(255,210,90,1)";
      ctx.lineWidth = 7;
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (var q = 0; q < pts2.length; q++) {
        if (q === 0) ctx.moveTo(pts2[q][0], pts2[q][1]);
        else ctx.lineTo(pts2[q][0], pts2[q][1]);
      }
      ctx.stroke();
      ctx.globalAlpha = ba;
      ctx.strokeStyle = "rgba(255,252,225,1)";
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.restore();
    }

    for (var ti = 0; ti < texts.length; ti++) {
      var tx = texts[ti];
      var tk = tx.age / tx.life;
      var ty2 = tx.y + tx.vy * Math.pow(tk, 0.7);
      ctx.save();
      ctx.globalAlpha = tk < 0.7 ? 1 : 1 - (tk - 0.7) / 0.3;
      ctx.font = "900 " + tx.size + "px 'Arial Black','Segoe UI',system-ui,sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(70,40,0,.9)";
      ctx.strokeText(tx.str, tx.x, ty2);
      var tg = ctx.createLinearGradient(0, ty2 - tx.size / 2, 0, ty2 + tx.size / 2);
      tg.addColorStop(0, "#fffbe0");
      tg.addColorStop(0.55, "#ffd24a");
      tg.addColorStop(1, "#e89a10");
      ctx.fillStyle = tg;
      ctx.fillText(tx.str, tx.x, ty2);
      ctx.restore();
    }

    if (flash.a > 0.002) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(" + flash.color + "," + flash.a.toFixed(3) + ")";
      ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
      ctx.restore();
    }
  }

  var lastFrame = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    var dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    syncLayout();
    if (!fxCtx) return;

    if (shake.dur > 0) {
      shake.t += dt;
      if (shake.t >= shake.dur) {
        shake.dur = 0;
        shake.amp = 0;
        if (gameCanvas && shakeApplied) {
          gameCanvas.style.transform = shakePrevTransform;
          shakeApplied = false;
        }
      } else if (gameCanvas) {
        if (!shakeApplied) {
          shakePrevTransform = gameCanvas.style.transform || "";
          shakeApplied = true;
        }
        var k2 = 1 - shake.t / shake.dur;
        var a = shake.amp * k2 * k2;
        var dx = rnd(-a, a) * 6;
        var dy = rnd(-a, a) * 6;
        gameCanvas.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      }
    }

    if (parts.length || bolts.length || rays.length || texts.length || flash.a > 0.002) {
      stepParticles(dt);
      drawFx();
    }
  }
  requestAnimationFrame(loop);

  try {
    var bc = new BroadcastChannel("zeus-events");
    bc.onmessage = function (e) {
      var d = e.data;
      if (d && d.__zeus === 1) onEvent(d);
    };
    window.__zeusChannel = bc;
  } catch (e) {
    if (typeof BroadcastChannel === "undefined") {
      window.addEventListener("message", function (e) {
        var d = e.data;
        if (d && d.__zeus === 1) onEvent(d);
      });
    }
  }
  window.addEventListener("zeus-event", function (e) {
    if (e.detail && e.detail.__zeus === 1) onEvent(e.detail);
  });

  window.__zeusFX = {
    version: 1,
    config: CONFIG,
    connected: function () {
      return connected;
    },
    celebrate: celebrate,
    win: function (amount, ratio) {
      onWin({ amount: amount, ratio: ratio });
    },
    bonusStart: onBonusStart,
    bonusEnd: function (total) {
      onBonusEnd({ winAmount: total });
    },
    reelStop: onReelStop,
    event: onEvent,
    audioState: function () {
      return AC ? AC.state : "absent";
    },
    sfxOn: function () {
      return sfxOn;
    },
  };
})();
