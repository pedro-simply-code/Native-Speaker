/* ============================================================
   Native Speaker Lang Learn
   City routes, plan handoff, FAQ, mobile nav, form states.
   ============================================================ */

(function () {
  "use strict";

  var doc = document;
  var header = doc.getElementById("site-header");
  var nav = doc.getElementById("primary-nav");
  var navToggle = doc.querySelector(".nav-toggle");
  var joinForm = doc.getElementById("join-form");
  var joinSuccess = doc.getElementById("join-success");
  var selectionNote = doc.getElementById("selection-note");
  var year = doc.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

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

  /* ---------- City routes ---------- */

  var cities = {
    antigua: {
      kicker: "Route 01 · Guatemala",
      name: "Antigua",
      phrase: "“¿Me regala un café con leche?”",
      note: "A city of cobblestones, cafés, and conversations that start with the weather and end with an invitation. You will order, ask for the good salsa, and learn what “chilero” actually means.",
      missions: "12 missions",
      level: "B1–C1",
      count: "03 this week",
      list: [
        {
          title: "Order without pointing",
          text: "Ask what the person behind the counter would choose. Say yes or ask for something else.",
          time: "12 min"
        },
        {
          title: "Ask for the real recommendation",
          text: "At the market, ask for the best thing in season — then buy it without switching to English.",
          time: "20 min"
        },
        {
          title: "Make a plan you might cancel",
          text: "Invite someone to something next week. Send one follow-up message before the debrief.",
          time: "15 min"
        }
      ]
    },
    atitlan: {
      kicker: "Route 02 · Guatemala",
      name: "Lake Atitlán",
      phrase: "“¿A qué hora sale la lancha?”",
      note: "A lake ringed by volcanoes and villages, each with its own rhythm. You will ask about boat times, buy from a market, and hold a conversation while the wind picks up.",
      missions: "15 missions",
      level: "A2–C1",
      count: "03 this week",
      list: [
        {
          title: "Catch the right boat",
          text: "Ask which dock, what time, and how much. Confirm the answer back in your own words.",
          time: "10 min"
        },
        {
          title: "Buy from the market",
          text: "Ask what is in season, buy one thing, and count your change out loud in Spanish.",
          time: "15 min"
        },
        {
          title: "Make a plan for sunset",
          text: "Invite someone to a viewpoint. Agree a time, a place, and who brings what.",
          time: "18 min"
        }
      ]
    },
    xela: {
      kicker: "Route 03 · Guatemala",
      name: "Quetzaltenango",
      phrase: "“¿Me contás un poco más?”",
      note: "A highland city of students, markets, and long conversations. You will interrupt politely, defend an opinion, and learn to leave a message that gets answered.",
      missions: "14 missions",
      level: "B1–C2",
      count: "03 this week",
      list: [
        {
          title: "Disagree without apologising",
          text: "Say what you actually think about a film, a meal, or a plan. Ask one follow-up question.",
          time: "14 min"
        },
        {
          title: "Leave a voice note that lands",
          text: "Send a 45-second message with a greeting, a reason, and a clear question at the end.",
          time: "8 min"
        },
        {
          title: "Join a table of strangers",
          text: "Ask to share a table, introduce yourself, and find one thing you have in common.",
          time: "20 min"
        }
      ]
    }
  };

  var tabs = Array.prototype.slice.call(doc.querySelectorAll(".city-tab"));
  var panel = doc.getElementById("city-panel");
  var cityName = doc.getElementById("city-name");
  var cityKicker = doc.getElementById("city-kicker");
  var cityPhrase = doc.getElementById("city-phrase");
  var cityNote = doc.getElementById("city-note");
  var cityMissionsMeta = doc.getElementById("city-missions-meta");
  var cityLevel = doc.getElementById("city-level");
  var missionCount = doc.getElementById("mission-count");
  var missionList = doc.getElementById("mission-list");
  var cityEnroll = doc.querySelector(".js-city-enroll");

  function renderCity(key) {
    var data = cities[key];
    if (!data || !missionList) return;

    cityKicker.textContent = data.kicker;
    cityName.textContent = data.name;
    cityPhrase.textContent = data.phrase;
    cityNote.textContent = data.note;
    cityMissionsMeta.textContent = data.missions;
    cityLevel.textContent = data.level;
    missionCount.textContent = data.count;

    missionList.innerHTML = data.list
      .map(function (mission, index) {
        return (
          "<li>" +
          '<span class="mission-index">' + String(index + 1).padStart(2, "0") + "</span>" +
          "<div><strong>" + mission.title + "</strong><p>" + mission.text + "</p></div>" +
          '<span class="mission-time">' + mission.time + "</span>" +
          "</li>"
        );
      })
      .join("");

    if (cityEnroll) {
      cityEnroll.dataset.city = data.name;
      cityEnroll.innerHTML =
        "Choose " + data.name +
        ' <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>';
    }

    if (panel) {
      panel.classList.remove("is-switching");
      void panel.offsetWidth;
      panel.classList.add("is-switching");
    }
  }

  function activateTab(tab, focus) {
    tabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });

    if (panel) {
      panel.setAttribute("aria-labelledby", tab.id);
    }
    if (focus) tab.focus();
    renderCity(tab.dataset.city);
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateTab(tab, false);
    });

    tab.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      activateTab(tabs[next], true);
    });
  });

  /* ---------- Plan + city handoff ---------- */

  var joinCity = doc.getElementById("join-city");
  var joinLanguage = doc.getElementById("join-language");

  function setNote(message) {
    if (!selectionNote) return;
    selectionNote.textContent = message;
    selectionNote.hidden = false;
  }

  Array.prototype.forEach.call(doc.querySelectorAll(".js-choose-plan"), function (button) {
    button.addEventListener("click", function () {
      setNote("Selected: " + button.dataset.plan + ". Your route test stays free.");
    });
  });

  if (cityEnroll) {
    cityEnroll.addEventListener("click", function () {
      if (joinCity) joinCity.value = cityEnroll.dataset.city;
      setNote("Route set to " + cityEnroll.dataset.city + ". The route test is free and online.");
    });
  }

  if (joinCity) {
    joinCity.addEventListener("change", function () {
      if (joinCity.value.indexOf("Online") === 0) {
        setNote("Online route selected. Your coach builds missions around your own city.");
      } else {
        setNote("Route set to " + joinCity.value + ". The route test is free and online.");
      }
    });
  }

  /* ---------- FAQ ---------- */

  Array.prototype.forEach.call(doc.querySelectorAll(".faq-question"), function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var panelEl = doc.getElementById(button.getAttribute("aria-controls"));
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
        if (panelEl) {
          panelEl.setAttribute("aria-hidden", "false");
          panelEl.removeAttribute("inert");
        }
      }
    });
  });

  /* ---------- Join form ---------- */

  if (joinForm && joinSuccess) {
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

    joinForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";

      if (!name) {
        showError("Tell us your name so the coach knows who to expect.");
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
      var city = doc.getElementById("join-city");
      var firstName = name.split(" ")[0];

      var successName = doc.getElementById("success-name");
      var successEmail = doc.getElementById("success-email");
      var successLanguage = doc.getElementById("success-language");
      var successCity = doc.getElementById("success-city");

      if (successName) successName.textContent = firstName;
      if (successEmail) successEmail.textContent = email;
      if (successLanguage) successLanguage.textContent = language ? language.value : "Spanish";
      if (successCity) successCity.textContent = city ? city.value : "Antigua";

      joinForm.hidden = true;
      joinSuccess.hidden = false;
      joinSuccess.setAttribute("tabindex", "-1");
      joinSuccess.focus();

      if (selectionNote) selectionNote.hidden = true;
    });

    var again = doc.getElementById("join-again");
    if (again) {
      again.addEventListener("click", function () {
        joinSuccess.hidden = true;
        joinForm.hidden = false;
        joinForm.reset();
        if (selectionNote) selectionNote.hidden = true;
        if (nameInput) nameInput.focus();
      });
    }
  }
})();
