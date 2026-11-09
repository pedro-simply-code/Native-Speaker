/* Native Speaker Ruta — mobile nav, route tabs, join form. */
(function () {
  "use strict";

  var doc = document;

  /* ---------- Header ---------- */

  var header = doc.getElementById("site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */

  var nav = doc.getElementById("primary-nav");
  var navToggle = doc.querySelector(".nav-toggle");

  if (nav && navToggle) {
    function closeNav() {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      doc.body.classList.remove("nav-open");
    }

    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      nav.classList.toggle("is-open", !open);
      navToggle.setAttribute("aria-expanded", open ? "false" : "true");
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
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* ---------- City routes ---------- */

  var cities = {
    antigua: {
      kicker: "Stop 01 · Sacatepéquez",
      name: "Antigua",
      lede: "The city where everyone has time for one more question. Colonial streets, a volcano on the horizon, and a teacher who takes the lesson to the plaza when the sun comes out.",
      best: "First trips · A1–B2",
      klass: "4 hours a day, one-to-one",
      stay: "Host family or guesthouse",
      day: [
        ["07:30", "Breakfast with your host family. You are responsible for one question."],
        ["08:30", "One-to-one class in the courtyard. Grammar only when it helps."],
        ["12:30", "Market mission: buy lunch with a budget and a list."],
        ["16:00", "Walk and debrief. One phrase you will use again tomorrow."]
      ]
    },
    atitlan: {
      kicker: "Stop 02 · Sololá",
      name: "Lake Atitlán",
      lede: "A lake ringed by volcanoes and villages, each with its own rhythm. You will ask about boat times, buy from a market, and hold a conversation while the wind picks up.",
      best: "Slow travel · A2–B2",
      klass: "3 hours a day, one-to-one",
      stay: "Lakeside guesthouse",
      day: [
        ["07:00", "Coffee on the dock. Describe the lake to someone who has never seen it."],
        ["09:00", "Class on the terrace. Today: directions, boats, and polite bargaining."],
        ["13:00", "Cross to a village. Ask three people the same question."],
        ["17:30", "Sunset debrief. What did you understand without translating?"]
      ]
    },
    xela: {
      kicker: "Stop 03 · Quetzaltenango",
      name: "Quetzaltenango",
      lede: "A highland city of students, markets, and long conversations. Colder air, warmer tables, and the week your sentences start arriving on time.",
      best: "Confident speakers · B1–C1",
      klass: "4 hours a day, one-to-one",
      stay: "Teacher's house",
      day: [
        ["07:30", "Breakfast at the long table with the other students."],
        ["08:30", "Class. You bring the topic; the teacher brings the structure."],
        ["13:00", "Lunch at the market. Order for someone else, not yourself."],
        ["18:00", "Language exchange at a student café. Stay for one hour."]
      ]
    }
  };

  var tabs = Array.prototype.slice.call(doc.querySelectorAll(".city-tab"));
  var panel = doc.getElementById("city-panel");

  var elKicker = doc.getElementById("city-kicker");
  var elName = doc.getElementById("city-name");
  var elLede = doc.getElementById("city-lede");
  var elBest = doc.getElementById("city-best");
  var elClass = doc.getElementById("city-class");
  var elStay = doc.getElementById("city-stay");
  var elDay = doc.getElementById("city-day");

  function selectCity(key) {
    var data = cities[key];
    if (!data) return;

    tabs.forEach(function (tab) {
      var active = tab.dataset.city === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
    });

    if (panel) panel.setAttribute("aria-labelledby", "tab-" + key);
    if (elKicker) elKicker.textContent = data.kicker;
    if (elName) elName.textContent = data.name;
    if (elLede) elLede.textContent = data.lede;
    if (elBest) elBest.textContent = data.best;
    if (elClass) elClass.textContent = data.klass;
    if (elStay) elStay.textContent = data.stay;

    if (elDay) {
      elDay.innerHTML = "";
      data.day.forEach(function (row) {
        var li = doc.createElement("li");
        var time = doc.createElement("span");
        var text = doc.createElement("p");
        time.textContent = row[0];
        text.textContent = row[1];
        li.appendChild(time);
        li.appendChild(text);
        elDay.appendChild(li);
      });
    }

    var choose = doc.querySelector(".js-choose-city");
    if (choose) choose.dataset.city = data.name;
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectCity(tab.dataset.city);
    });

    tab.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      tabs[next].focus();
      selectCity(tabs[next].dataset.city);
    });
  });

  doc.querySelectorAll(".js-choose-city").forEach(function (link) {
    link.addEventListener("click", function () {
      var select = doc.getElementById("join-city");
      if (select) {
        select.value = link.dataset.city || select.value;
        select.focus({ preventScroll: true });
      }
    });
  });

  /* ---------- FAQ ---------- */

  doc.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var panelEl = doc.getElementById(button.getAttribute("aria-controls"));
      if (!item || !panelEl) return;

      var open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      item.classList.toggle("is-open", !open);
      panelEl.setAttribute("aria-hidden", open ? "true" : "false");
      if (open) {
        panelEl.setAttribute("inert", "");
      } else {
        panelEl.removeAttribute("inert");
      }
    });
  });

  /* ---------- Join form ---------- */

  var form = doc.getElementById("join-form");
  var success = doc.getElementById("join-success");
  var error = doc.getElementById("form-error");
  var again = doc.getElementById("join-again");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var email = doc.getElementById("join-email");
      var weeks = doc.getElementById("join-weeks");
      var city = doc.getElementById("join-city");
      var value = email ? email.value.trim() : "";
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!valid) {
        if (error) {
          error.textContent = "Please enter an email address so we can send your route.";
          error.hidden = false;
        }
        if (email) {
          email.setAttribute("aria-invalid", "true");
          email.focus();
        }
        return;
      }

      if (error) {
        error.hidden = true;
        error.textContent = "";
      }
      if (email) email.removeAttribute("aria-invalid");

      var lengths = {
        "Two weeks": "two-week",
        "Four weeks": "four-week",
        "Eight weeks": "eight-week",
        "Not sure yet": "flexible"
      };

      var successEmail = doc.getElementById("success-email");
      var successWeeks = doc.getElementById("success-weeks");
      var successCity = doc.getElementById("success-city");
      if (successEmail) successEmail.textContent = value;
      if (successWeeks) {
        successWeeks.textContent = weeks ? lengths[weeks.value] || "flexible" : "four-week";
      }
      if (successCity) successCity.textContent = city ? city.value : "Antigua";

      form.hidden = true;
      if (success) {
        success.hidden = false;
        var heading = success.querySelector("h3");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus();
        }
      }
    });
  }

  if (again) {
    again.addEventListener("click", function () {
      if (success) success.hidden = true;
      if (form) {
        form.hidden = false;
        var email = doc.getElementById("join-email");
        if (email) {
          email.value = "";
          email.focus();
        }
      }
    });
  }

  /* ---------- Year ---------- */

  var year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
