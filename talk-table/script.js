/* Native Speaker Talk Table — mobile nav, table tabs, FAQ, join form. */
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

  /* ---------- Conversation tables ---------- */

  var tables = {
    cafe: {
      level: "A2–B1",
      seats: "6 seats",
      title: "Café table",
      desc: "Ordering, recommending, complaining politely, and the small talk that happens before the coffee arrives. Built for the trip you are actually planning.",
      when: "Tuesdays · 19:00 CT",
      host: "Sofía Herrera",
      season: "Six weeks · one question a week",
      question: "“What do you order when you want to feel at home?”",
      list: [
        "One host from Guatemala",
        "Five learners, same level",
        "A voice note after every table"
      ]
    },
    work: {
      level: "B1–C1",
      seats: "6 seats",
      title: "Work table",
      desc: "Meetings, small talk before the call, and the sentence you need when you disagree with your boss. For people whose next promotion is in their second language.",
      when: "Wednesdays · 18:30 CT",
      host: "Maya Okafor",
      season: "Eight weeks · one scenario a week",
      question: "“How do you push back without making an enemy?”",
      list: [
        "English for Guatemalan teams",
        "Real workplace scenarios",
        "One interview rehearsal per season"
      ]
    },
    culture: {
      level: "B1–C1",
      seats: "6 seats",
      title: "Culture table",
      desc: "Food, music, family, and the things guidebooks never explain. A host from Guatemala brings a story; the table brings the questions.",
      when: "Thursdays · 19:00 CT",
      host: "Diego Salas",
      season: "Six weeks · one theme a week",
      question: "“What is a tradition you would defend to a stranger?”",
      list: [
        "A different Guatemalan city each week",
        "Recipes and songs welcome",
        "Notes and a reading list after"
      ]
    },
    beginners: {
      level: "A1–A2",
      seats: "5 seats",
      title: "First words",
      desc: "For the first hundred words and the first fifty mistakes. Slow, kind, and built around the sentences you need this week — not a textbook chapter.",
      when: "Saturdays · 10:00 CT",
      host: "Camila Rojas",
      season: "Six weeks · one small win a week",
      question: "“How do you introduce yourself when you are nervous?”",
      list: [
        "Five seats, extra patience",
        "No English unless you ask",
        "A phrase card after every table"
      ]
    }
  };

  var tabs = Array.prototype.slice.call(doc.querySelectorAll(".table-tab"));
  var panel = doc.getElementById("table-panel");

  var elLevel = doc.getElementById("table-level");
  var elSeats = doc.getElementById("table-seats");
  var elTitle = doc.getElementById("table-title");
  var elDesc = doc.getElementById("table-desc");
  var elWhen = doc.getElementById("table-when");
  var elHost = doc.getElementById("table-host");
  var elSeason = doc.getElementById("table-season");
  var elQuestion = doc.getElementById("table-question");
  var elList = doc.getElementById("table-list");

  function selectTable(key) {
    var data = tables[key];
    if (!data) return;

    tabs.forEach(function (tab) {
      var active = tab.dataset.table === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
    });

    if (panel) panel.setAttribute("aria-labelledby", "tab-" + key);
    if (elLevel) elLevel.textContent = data.level;
    if (elSeats) elSeats.textContent = data.seats;
    if (elTitle) elTitle.textContent = data.title;
    if (elDesc) elDesc.textContent = data.desc;
    if (elWhen) elWhen.textContent = data.when;
    if (elHost) elHost.textContent = data.host;
    if (elSeason) elSeason.textContent = data.season;
    if (elQuestion) elQuestion.textContent = data.question;

    if (elList) {
      elList.innerHTML = "";
      data.list.forEach(function (item) {
        var li = doc.createElement("li");
        li.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg>';
        li.appendChild(doc.createTextNode(" " + item));
        elList.appendChild(li);
      });
    }

    var choose = doc.querySelector(".js-choose-table");
    if (choose) choose.dataset.table = data.title;
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTable(tab.dataset.table);
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
      selectTable(tabs[next].dataset.table);
    });
  });

  /* ---------- Save a seat handoff ---------- */

  doc.querySelectorAll(".js-choose-table").forEach(function (link) {
    link.addEventListener("click", function () {
      var select = doc.getElementById("join-level");
      if (select && !select.dataset.touched) {
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
      var language = doc.getElementById("join-language");
      var level = doc.getElementById("join-level");
      var value = email ? email.value.trim() : "";
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!valid) {
        if (error) {
          error.textContent = "Please enter an email address so we can send your tables.";
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

      var successEmail = doc.getElementById("success-email");
      var successLanguage = doc.getElementById("success-language");
      if (successEmail) successEmail.textContent = value;
      if (successLanguage) {
        successLanguage.textContent = language ? language.value : "Spanish";
      }

      form.hidden = true;
      if (success) {
        success.hidden = false;
        var heading = success.querySelector("h3");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus();
        }
      }

      if (level) level.dataset.touched = "true";
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
