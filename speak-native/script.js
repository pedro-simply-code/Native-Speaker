/* ============================================================
   Native Speaker Voice
   Waveform demo, sound map, record simulation, plan handoff,
   FAQ, mobile nav, form states.
   ============================================================ */

(function () {
  "use strict";

  var doc = document;
  var header = doc.getElementById("site-header");
  var nav = doc.getElementById("primary-nav");
  var navToggle = doc.querySelector(".nav-toggle");
  var year = doc.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header + mobile nav ---------- */

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    doc.body.classList.remove("nav-open");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      nav.classList.toggle("is-open", !open);
      navToggle.setAttribute("aria-expanded", String(!open));
      navToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      doc.body.classList.toggle("nav-open", !open);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeNav();
    });
  }

  /* ---------- Waveforms ---------- */

  function buildWave(el, count, min, max, seed) {
    if (!el) return;
    var bars = [];
    for (var i = 0; i < count; i += 1) {
      var wave =
        Math.sin((i + seed) * 0.72) * 0.42 +
        Math.sin((i + seed) * 0.23) * 0.34 +
        Math.cos((i + seed) * 1.31) * 0.18;
      var height = Math.round(min + (max - min) * Math.abs(wave));
      bars.push(
        '<span style="--h:' + height + "px;--i:" + i + '" aria-hidden="true"></span>'
      );
    }
    el.innerHTML = bars.join("");
  }

  buildWave(doc.getElementById("hero-wave"), 44, 8, 56, 2);
  buildWave(doc.getElementById("wave-before-1"), 34, 5, 30, 5);
  buildWave(doc.getElementById("wave-after-1"), 34, 10, 34, 8);
  buildWave(doc.getElementById("wave-before-2"), 34, 5, 26, 3);
  buildWave(doc.getElementById("wave-after-2"), 34, 9, 33, 11);
  buildWave(doc.getElementById("wave-before-3"), 34, 5, 28, 7);
  buildWave(doc.getElementById("wave-after-3"), 34, 10, 34, 4);

  function playWave(wave, duration) {
    if (!wave) return;
    wave.classList.remove("is-playing");
    void wave.offsetWidth;
    wave.classList.add("is-playing");
    window.setTimeout(function () {
      wave.classList.remove("is-playing");
    }, duration || 1600);
  }

  /* ---------- Hero check ---------- */

  var heroRun = doc.getElementById("hero-run");
  var heroCheck = doc.getElementById("hero-check");
  var heroStatus = doc.getElementById("hero-status");
  var heroScore = doc.getElementById("hero-score");
  var heroFeedback = doc.getElementById("hero-feedback");
  var heroWave = doc.getElementById("hero-wave");
  var heroBusy = false;

  function runHeroCheck() {
    if (heroBusy) return;
    heroBusy = true;
    if (heroRun) {
      heroRun.disabled = true;
      heroRun.textContent = "Listening…";
    }
    if (heroStatus) heroStatus.textContent = "Capturing 3 seconds · keep the word steady";
    playWave(heroWave, 1500);

    window.setTimeout(function () {
      if (heroStatus) {
        heroStatus.textContent = "Clear pass · TH found at 0:01 · score updated";
      }
      if (heroScore) heroScore.textContent = "92";
      if (heroFeedback) {
        heroFeedback.innerHTML =
          "Better. Your <strong>TH</strong> is now dental. Keep the tongue forward on the second syllable — <strong>/li/</strong>, not <strong>/le/</strong>.";
      }
      if (heroRun) {
        heroRun.disabled = false;
        heroRun.innerHTML =
          'Run it again <svg class="icon" aria-hidden="true"><use href="#i-mic"></use></svg>';
      }
      heroBusy = false;
    }, 1600);
  }

  if (heroRun) heroRun.addEventListener("click", runHeroCheck);
  if (heroCheck) heroCheck.addEventListener("click", runHeroCheck);

  /* ---------- Sound map ---------- */

  var sounds = {
    th: {
      kicker: "Sound 01 · dental fricative",
      title: "Think, not sink.",
      desc: "The voiceless TH is a tongue-tip sound, not a /t/ and not an /s/. Spanish, French, Italian and many other first languages replace it with something nearby. The result is understandable, but it costs you a beat.",
      word: "think",
      ipa: "/θɪŋk/",
      pairs: [
        ["think", "/θɪŋk/", "sink", "/sɪŋk/"],
        ["three", "/θriː/", "tree", "/triː/"],
        ["mouth", "/maʊθ/", "mouse", "/maʊs/"]
      ],
      tip: "Tongue tip lightly between the teeth. Blow air, no voice. If your throat vibrates, you are making the other TH.",
      verdict: "Good placement. The tongue moved forward and the puff of air is there. Now keep it for the whole word, not just the first sound.",
      seed: 4
    },
    r: {
      kicker: "Sound 02 · approximant",
      title: "The R that never touches.",
      desc: "English /r/ is not a tap or a trill. The tongue tip stays near the ridge without touching it, the lips round slightly, and the vowel carries the sound. Most learners touch the roof of the mouth too early.",
      word: "really",
      ipa: "/ˈrɪə.li/",
      pairs: [
        ["right", "/raɪt/", "light", "/laɪt/"],
        ["road", "/rəʊd/", "load", "/ləʊd/"],
        ["pray", "/preɪ/", "play", "/pleɪ/"]
      ],
      tip: "Lift the tongue tip but leave a gap. Round the lips a little. Say the vowel first, then add the R in front of it.",
      verdict: "The R is still tapping. Keep the tip floating and let the vowel open. Try it twice slowly before the full word.",
      seed: 9
    },
    vowels: {
      kicker: "Sound 03 · length & tenseness",
      title: "Sheep, not ship.",
      desc: "English vowel pairs differ in length and tension, not just in the symbol. /iː/ is longer and tenser than /ɪ/. If you shorten both, “sheep” and “ship” become the same word in a noisy room.",
      word: "beach",
      ipa: "/biːtʃ/",
      pairs: [
        ["sheep", "/ʃiːp/", "ship", "/ʃɪp/"],
        ["feel", "/fiːl/", "fill", "/fɪl/"],
        ["leave", "/liːv/", "live", "/lɪv/"]
      ],
      tip: "For /iː/, smile slightly and hold the vowel. For /ɪ/, relax the jaw and keep it short. The difference should be audible before the next consonant.",
      verdict: "The length is there, but the vowel is still a little relaxed. Smile into the /iː/ and hold it for one extra beat.",
      seed: 6
    },
    rhythm: {
      kicker: "Sound 04 · word stress",
      title: "Stress changes the word.",
      desc: "In English, stress can change meaning. RE-cord is a noun; re-CORD is a verb. If every syllable gets the same weight, listeners have to work harder — even when every sound is correct.",
      word: "record",
      ipa: "/ˈrek.ɔːd/ noun · /rɪˈkɔːd/ verb",
      pairs: [
        ["RE-cord", "/ˈrek.ɔːd/", "re-CORD", "/rɪˈkɔːd/"],
        ["PRE-sent", "/ˈprez.ənt/", "pre-SENT", "/prɪˈzent/"],
        ["PER-mit", "/ˈpɜː.mɪt/", "per-MIT", "/pəˈmɪt/"]
      ],
      tip: "Clap once on the stressed syllable. Make the unstressed vowel smaller — it is often a schwa, not a full vowel.",
      verdict: "Stress landed on the second syllable. For the noun, hit the first and let the second fall. Clap it once, then say it again.",
      seed: 12
    }
  };

  var labTabs = Array.prototype.slice.call(doc.querySelectorAll(".lab-tab"));
  var labPanel = doc.getElementById("lab-panel");
  var labKicker = doc.getElementById("lab-kicker");
  var labTitle = doc.getElementById("lab-title");
  var labDesc = doc.getElementById("lab-desc");
  var labPairs = doc.getElementById("lab-pairs");
  var labTip = doc.getElementById("lab-tip");
  var labWord = doc.getElementById("lab-word");
  var labIpa = doc.getElementById("lab-ipa");
  var labWave = doc.getElementById("lab-wave");
  var labPlay = doc.getElementById("lab-play");
  var labRecord = doc.getElementById("lab-record");
  var labStatus = doc.getElementById("lab-status");
  var labScore = doc.getElementById("lab-score");
  var labAttempts = doc.getElementById("lab-attempts");
  var labVerdict = doc.getElementById("lab-verdict");
  var labVerdictText = doc.getElementById("lab-verdict-text");
  var currentSound = "th";
  var attempts = 0;
  var recording = false;

  function renderSound(key) {
    var data = sounds[key];
    if (!data) return;
    currentSound = key;

    labKicker.textContent = data.kicker;
    labTitle.textContent = data.title;
    labDesc.textContent = data.desc;
    labWord.textContent = data.word;
    labIpa.textContent = data.ipa;
    labTip.textContent = data.tip;

    labPairs.innerHTML = data.pairs
      .map(function (pair) {
        return (
          "<li>" + pair[0] + " <span>" + pair[1] + "</span> vs. " +
          pair[2] + " <span>" + pair[3] + "</span></li>"
        );
      })
      .join("");

    buildWave(labWave, 38, 6, 60, data.seed);
    labScore.textContent = "—";
    labAttempts.textContent = "0";
    attempts = 0;
    labVerdict.hidden = true;
    labStatus.textContent = "Target set. Record one word when you are ready.";

    if (labPanel) {
      labPanel.classList.remove("is-switching");
      void labPanel.offsetWidth;
      labPanel.classList.add("is-switching");
    }
  }

  function activateLabTab(tab, focus) {
    labTabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    if (labPanel) labPanel.setAttribute("aria-labelledby", tab.id);
    if (focus) tab.focus();
    renderSound(tab.dataset.sound);
  }

  labTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateLabTab(tab, false);
    });

    tab.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight") next = (index + 1) % labTabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + labTabs.length) % labTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = labTabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      activateLabTab(labTabs[next], true);
    });
  });

  renderSound("th");

  if (labPlay) {
    labPlay.addEventListener("click", function () {
      playWave(labWave, 1500);
      labStatus.textContent = "Playing the model · listen for the target sound once, then copy it.";
      labPlay.classList.add("is-playing");
      window.setTimeout(function () {
        labPlay.classList.remove("is-playing");
        labStatus.textContent = "Model finished. Record one word when you are ready.";
      }, 1600);
    });
  }

  if (labRecord) {
    labRecord.addEventListener("click", function () {
      if (recording) return;
      recording = true;
      labRecord.disabled = true;
      labStatus.textContent = "Listening… say the target word once, clearly.";
      playWave(labWave, 1300);

      window.setTimeout(function () {
        attempts += 1;
        var score = Math.min(94, 68 + attempts * 6);
        labScore.textContent = String(score);
        labAttempts.textContent = String(attempts);
        labVerdictText.textContent = sounds[currentSound].verdict;
        labVerdict.hidden = false;
        labStatus.textContent =
          "Attempt " + attempts + " analysed · demo score " + score + "/100.";
        labRecord.disabled = false;
        recording = false;
      }, 1400);
    });
  }

  /* ---------- Plan handoff ---------- */

  var selectionNote = doc.getElementById("selection-note");

  function setNote(message) {
    if (!selectionNote) return;
    selectionNote.textContent = message;
    selectionNote.hidden = false;
  }

  Array.prototype.forEach.call(doc.querySelectorAll(".js-choose-plan"), function (button) {
    button.addEventListener("click", function () {
      setNote("Selected: " + button.dataset.plan + ". Your first sound check stays free.");
    });
  });

  /* ---------- FAQ ---------- */

  Array.prototype.forEach.call(doc.querySelectorAll(".faq-question"), function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var panel = doc.getElementById(button.getAttribute("aria-controls"));
      var isOpen = item.classList.contains("is-open");

      Array.prototype.forEach.call(doc.querySelectorAll(".faq-item"), function (other) {
        var otherButton = other.querySelector(".faq-question");
        var otherPanel = doc.getElementById(otherButton.getAttribute("aria-controls"));
        other.classList.remove("is-open");
        otherButton.setAttribute("aria-expanded", "false");
        if (otherPanel) {
          otherPanel.setAttribute("aria-hidden", "true");
          otherPanel.setAttribute("inert", "");
        }
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        if (panel) {
          panel.setAttribute("aria-hidden", "false");
          panel.removeAttribute("inert");
        }
      }
    });
  });

  /* ---------- Join form ---------- */

  var form = doc.getElementById("join-form");
  var success = doc.getElementById("join-success");

  if (form && success) {
    var nameInput = doc.getElementById("join-name");
    var emailInput = doc.getElementById("join-email");
    var error = doc.getElementById("form-error");

    function showError(message) {
      if (!error) return;
      error.textContent = message;
      error.hidden = false;
    }

    [nameInput, emailInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener("input", function () {
        if (error) error.hidden = true;
        input.removeAttribute("aria-invalid");
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";

      if (!name) {
        showError("Tell us your name so the coach knows who is recording.");
        if (nameInput) {
          nameInput.setAttribute("aria-invalid", "true");
          nameInput.focus();
        }
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        showError("That email does not look right. Check it and try again.");
        if (emailInput) {
          emailInput.setAttribute("aria-invalid", "true");
          emailInput.focus();
        }
        return;
      }

      if (error) error.hidden = true;

      var language = doc.getElementById("join-language");
      var firstName = name.split(" ")[0];

      var successName = doc.getElementById("success-name");
      var successEmail = doc.getElementById("success-email");
      var successLanguage = doc.getElementById("success-language");

      if (successName) successName.textContent = firstName;
      if (successEmail) successEmail.textContent = email;
      if (successLanguage) successLanguage.textContent = language ? language.value : "English";

      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();

      if (selectionNote) selectionNote.hidden = true;
    });

    var again = doc.getElementById("join-again");
    if (again) {
      again.addEventListener("click", function () {
        success.hidden = true;
        form.hidden = false;
        form.reset();
        if (selectionNote) selectionNote.hidden = true;
        if (nameInput) nameInput.focus();
      });
    }
  }
})();
