/* Native Speaker Puente — mobile nav, language toggle, FAQ, demo form. */
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

  /* ---------- Session language toggle ---------- */

  var sessionCopy = {
    es: {
      label: "What the US team practises",
      text: "Opening a meeting in Spanish, asking for a decision without hedging, and repeating back what was agreed so nobody leaves with a different version."
    },
    en: {
      label: "What the Guatemala team practises",
      text: "Presenting a status update in English, disagreeing without softening the point into nothing, and asking a client the question everyone is avoiding."
    }
  };

  var langButtons = Array.prototype.slice.call(doc.querySelectorAll(".lang-btn"));
  var sessionLabel = doc.getElementById("session-label");
  var sessionText = doc.getElementById("session-text");

  langButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var key = button.dataset.lang;
      var copy = sessionCopy[key];
      if (!copy) return;

      langButtons.forEach(function (other) {
        var active = other === button;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", active ? "true" : "false");
      });

      if (sessionLabel) sessionLabel.textContent = copy.label;
      if (sessionText) sessionText.textContent = copy.text;
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

  /* ---------- Demo form ---------- */

  var form = doc.getElementById("join-form");
  var success = doc.getElementById("join-success");
  var error = doc.getElementById("form-error");
  var again = doc.getElementById("join-again");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var email = doc.getElementById("join-email");
      var size = doc.getElementById("join-size");
      var direction = doc.getElementById("join-direction");
      var value = email ? email.value.trim() : "";
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!valid) {
        if (error) {
          error.textContent = "Please enter a work email so we can send a time.";
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
      var successSize = doc.getElementById("success-size");
      var successDirection = doc.getElementById("success-direction");
      if (successEmail) successEmail.textContent = value;
      if (successSize) successSize.textContent = size ? size.value : "9–20";
      if (successDirection) {
        successDirection.textContent = direction
          ? direction.value.replace(/^Spanish for our US team$/, "Spanish for your US team")
              .replace(/^English for our Guatemala team$/, "English for your Guatemala team")
          : "Spanish for your US team";
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
