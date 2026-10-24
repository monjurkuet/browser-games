(function () {
  "use strict";
  if (typeof self === "undefined") return;
  if (self.__zeusBridgeInstalled) return;
  self.__zeusBridgeInstalled = true;

  var IS_WORKER = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;

  var channel = null;
  try {
    channel = new BroadcastChannel("zeus-events");
  } catch (e) {
    channel = null;
  }

  function emit(ev) {
    ev.__zeus = 1;
    ev.v = 1;
    ev.t = Math.round(performance.now());
    var ok = false;
    try {
      if (channel) {
        channel.postMessage(ev);
        ok = true;
      }
    } catch (e) {}
    if (!ok && IS_WORKER) {
      try {
        self.postMessage(ev);
      } catch (e) {}
    }
    if (!IS_WORKER && typeof window !== "undefined") {
      try {
        window.dispatchEvent(new CustomEvent("zeus-event", { detail: ev }));
      } catch (e) {}
    }
  }

  var NUMBER_VARS = [
    "isSpinninng",
    "balance",
    "betAmount",
    "BONUS",
    "remaining_spins",
    "turbo",
    "autoSpin",
    "som",
    "musica",
    "winAmount",
    "crWIN",
    "Multiplier",
    "lines",
    "line_bet",
    "ganhou",
  ];
  var STAGE_VARS = ["stage_col0", "stage_col1", "stage_col2", "stage_col3", "stage_col4"];

  var rt = null;
  var esm = null;
  var gvMap = null;
  var premioInst = null;
  var premioSdk = null;
  var errored = false;
  var booted = false;
  var prev = null;
  var stopped = [false, false, false, false, false];

  function findGlobalMap() {
    var list = esm.GetAllGlobalVariables();
    var map = {};
    for (var i = 0; i < list.length; i++) {
      try {
        map[list[i].GetName()] = list[i];
      } catch (e) {}
    }
    return map;
  }

  function readNum(name) {
    var g = gvMap[name];
    if (!g) return null;
    try {
      var v = typeof g.GetValue === "function" ? g.GetValue() : g.value;
      if (typeof v === "number") return v;
      if (typeof v === "boolean") return v ? 1 : 0;
      if (typeof v === "string") {
        var n = parseFloat(v);
        return isFinite(n) ? n : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function findPremio() {
    var all;
    try {
      all = rt.allInstances();
    } catch (e) {
      return;
    }
    var it = all[Symbol.iterator] ? all[Symbol.iterator]() : null;
    if (!it) return;
    var step;
    while (!(step = it.next()).done) {
      var inst = step.value;
      try {
        if (inst.GetObjectClass().GetName() === "txt_premio") {
          premioInst = inst;
          premioSdk = inst.GetSdkInstance();
          return;
        }
      } catch (e) {}
    }
  }

  function readPremioText() {
    if (!premioSdk) {
      findPremio();
      if (!premioSdk) return null;
    }
    try {
      return premioSdk.GetText();
    } catch (e) {
      premioInst = null;
      premioSdk = null;
      return null;
    }
  }

  function parseAmount(s) {
    if (typeof s !== "string") return 0;
    var t = s.replace(/[^0-9.,]/g, "");
    if (!t) return 0;
    var lc = t.lastIndexOf(",");
    var ld = t.lastIndexOf(".");
    if (lc >= 0 && ld >= 0) {
      if (lc > ld) t = t.replace(/\./g, "").replace(",", ".");
      else t = t.replace(/,/g, "");
    } else if (lc >= 0) {
      var after = t.length - lc - 1;
      if (after === 3 && t.length > 4) t = t.replace(/,/g, "");
      else t = t.replace(",", ".");
    }
    var n = parseFloat(t);
    return isFinite(n) ? n : 0;
  }

  function tick() {
    if (errored) return;
    try {
      if (!rt) {
        rt = self.__zeusRuntime;
        if (!rt) return;
      }
      if (!esm) {
        try {
          esm = rt.GetEventSheetManager();
        } catch (e) {
          return;
        }
      }
      if (!gvMap) {
        gvMap = findGlobalMap();
        if (!Object.keys(gvMap).length) {
          gvMap = null;
          return;
        }
      }

      var spinning = readNum("isSpinninng") || 0;
      var balance = readNum("balance");
      var bet = readNum("betAmount");
      var bonus = readNum("BONUS") || 0;
      var rem = readNum("remaining_spins") || 0;
      var turbo = readNum("turbo");
      var auto = readNum("autoSpin") || 0;
      var som = readNum("som");
      var musica = readNum("musica");
      var winAmount = readNum("winAmount") || 0;
      var crWIN = readNum("crWIN") || 0;
      var mult = readNum("Multiplier");
      var ganhou = readNum("ganhou");
      var premioText = readPremioText();
      var premio = premioText === null ? null : parseAmount(premioText);
      var stages = [];
      for (var i = 0; i < 5; i++) {
        var v = readNum(STAGE_VARS[i]);
        stages.push(v === null ? -1 : v);
      }

      if (!booted) {
        booted = true;
        emit({ ev: "hello", worker: IS_WORKER ? 1 : 0 });
        emit({
          ev: "state",
          spinning: spinning,
          balance: balance,
          bet: bet,
          turbo: turbo,
          auto: auto,
          som: som,
          musica: musica,
          lines: readNum("lines"),
          lineBet: readNum("line_bet"),
        });
      }

      var startSpin = function () {
        for (var c = 0; c < 5; c++) stopped[c] = false;
      };

      if (prev) {
        if (prev.spinning === 0 && spinning === 1) {
          startSpin();
          emit({ ev: "spinStart", balance: balance, bet: bet, turbo: turbo });
        } else if (prev.spinning === 1 && spinning === 0) {
          emit({ ev: "spinEnd", balance: balance });
        }

        for (var c = 0; c < 5; c++) {
          if (!stopped[c] && stages[c] >= 4) {
            stopped[c] = true;
            emit({ ev: "reelStop", col: c });
          }
        }

        if (premio !== null && prev.premio !== null) {
          if (prev.premio === 0 && premio > 0) {
            emit({
              ev: "win",
              amount: premio,
              bet: bet,
              ratio: bet && bet > 0 ? premio / bet : null,
              text: premioText,
              balance: balance,
            });
          } else if (prev.premio > 0 && premio === 0) {
            emit({ ev: "winClear" });
          }
        }

        var bonusOn = bonus !== 0 || rem > 0;
        var prevBonusOn = prev.bonus !== 0 || prev.rem > 0;
        if (bonusOn && !prevBonusOn) {
          emit({ ev: "bonusStart", remaining: rem, bonus: bonus });
        } else if (!bonusOn && prevBonusOn) {
          emit({
            ev: "bonusEnd",
            winAmount: winAmount,
            crWIN: crWIN,
            balance: balance,
            mult: mult,
            ganhou: ganhou,
          });
        } else if (bonusOn && rem !== prev.rem) {
          emit({ ev: "bonusSpin", remaining: rem });
        }

        if (
          prev.turbo !== turbo ||
          prev.auto !== auto ||
          prev.som !== som ||
          prev.musica !== musica ||
          prev.bet !== bet
        ) {
          emit({
            ev: "state",
            spinning: spinning,
            balance: balance,
            bet: bet,
            turbo: turbo,
            auto: auto,
            som: som,
            musica: musica,
            lines: readNum("lines"),
            lineBet: readNum("line_bet"),
          });
        }
      }

      prev = {
        spinning: spinning,
        premio: premio,
        bonus: bonus,
        rem: rem,
        turbo: turbo,
        auto: auto,
        som: som,
        musica: musica,
        bet: bet,
      };
    } catch (e) {
      errored = true;
      try {
        console.error("[zeus-bridge] error", e);
      } catch (e2) {}
    }
  }

  var origInit = self.C3_InitRuntime;
  if (typeof origInit === "function") {
    self.C3_InitRuntime = function (runtime, opts) {
      self.__zeusRuntime = runtime;
      try {
        setTimeout(tick, 500);
        setInterval(tick, 16);
      } catch (e) {}
      return origInit.call(self, runtime, opts);
    };
  }

  self.__zeusBridge = {
    emit: emit,
    get runtime() {
      return rt;
    },
  };
})();
