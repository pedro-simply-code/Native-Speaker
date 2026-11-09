/* Native Speaker Daily — nav, week tabs, language switch, streak, FAQ, form. */
(() => {
  "use strict";

  const doc = document;

  /* ---------- Header ---------- */

  const header = doc.getElementById("site-header");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile nav ---------- */

  const nav = doc.getElementById("primary-nav");
  const navToggle = doc.querySelector(".nav-toggle");

  if (nav && navToggle) {
    const closeNav = () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      doc.body.classList.remove("nav-open");
    };

    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      nav.classList.toggle("is-open", !open);
      navToggle.setAttribute("aria-expanded", open ? "false" : "true");
      navToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      doc.body.classList.toggle("nav-open", !open);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });

    doc.addEventListener("click", (event) => {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeNav();
      }
    });

    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* ---------- Day tabs ---------- */

  const dayTabs = Array.from(doc.querySelectorAll(".day-tab"));
  const dayPanels = Array.from(doc.querySelectorAll(".day-panel"));

  const activateDay = (tab, focus = false) => {
    const id = tab.getAttribute("aria-controls");

    dayTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.tabIndex = active ? 0 : -1;
    });

    dayPanels.forEach((panel) => {
      const active = panel.id === id;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });

    if (focus) tab.focus();
  };

  dayTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateDay(tab));

    tab.addEventListener("keydown", (event) => {
      let next = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        next = dayTabs[(index + 1) % dayTabs.length];
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        next = dayTabs[(index - 1 + dayTabs.length) % dayTabs.length];
      } else if (event.key === "Home") {
        next = dayTabs[0];
      } else if (event.key === "End") {
        next = dayTabs[dayTabs.length - 1];
      }

      if (next) {
        event.preventDefault();
        activateDay(next, true);
      }
    });
  });

  /* ---------- Language switch ---------- */

  const langButtons = Array.from(doc.querySelectorAll(".lang-btn"));
  const phrases = Array.from(doc.querySelectorAll(".phrase-target[data-es], .phrase-source[data-es]"));

  const paintLanguage = (language) => {
    phrases.forEach((phrase) => {
      const value = phrase.dataset[language];
      if (value) phrase.textContent = value;
    });
  };

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      langButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      paintLanguage(button.dataset.lang === "english" ? "en" : "es");
    });
  });

  /* ---------- Today: listen ---------- */

  const listen = doc.getElementById("today-listen");
  const listenLabel = doc.getElementById("today-listen-label");
  let listenTimer = null;

  if (listen && listenLabel) {
    const stopListening = () => {
      if (listenTimer) {
        window.clearTimeout(listenTimer);
        listenTimer = null;
      }
      listen.setAttribute("aria-pressed", "false");
      listenLabel.textContent = "Listen";
    };

    listen.addEventListener("click", () => {
      const playing = listen.getAttribute("aria-pressed") === "true";
      if (playing) {
        stopListening();
        return;
      }

      listen.setAttribute("aria-pressed", "true");
      listenLabel.textContent = "Playing…";

      if (listenTimer) window.clearTimeout(listenTimer);
      listenTimer = window.setTimeout(stopListening, 1800);
    });
  }

  /* ---------- Today: streak ---------- */

  const done = doc.getElementById("today-done");
  const status = doc.getElementById("today-status");
  const streak = doc.getElementById("streak-count");
  const todayDot = doc.querySelector('.day-dots [data-day="wed"]');
  const baseStreak = 2;
  const doneStreak = 3;

  if (done && streak && todayDot) {
    done.addEventListener("click", () => {
      const isDone = done.getAttribute("aria-pressed") === "true";

      if (isDone) {
        done.setAttribute("aria-pressed", "false");
        done.textContent = "Mark today done";
        streak.textContent = String(baseStreak);
        todayDot.classList.remove("is-done");
        if (status) status.textContent = "Marked as not done. Ten minutes when you are ready.";
        return;
      }

      done.setAttribute("aria-pressed", "true");
      done.textContent = "Done for today";
      streak.textContent = String(doneStreak);
      todayDot.classList.add("is-done");
      if (status) status.textContent = "Nice. Three days in a row. See you tomorrow.";
    });
  }

  /* ---------- FAQ ---------- */

  doc.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const panel = doc.getElementById(button.getAttribute("aria-controls"));
      if (!item || !panel) return;

      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      item.classList.toggle("is-open", !open);
      panel.setAttribute("aria-hidden", open ? "true" : "false");
      if (open) {
        panel.setAttribute("inert", "");
      } else {
        panel.removeAttribute("inert");
      }
    });
  });

  /* ---------- Form ---------- */

  const form = doc.getElementById("join-form");
  const success = doc.getElementById("join-success");
  const error = doc.getElementById("form-error");
  const again = doc.getElementById("join-again");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = doc.getElementById("join-email");
      const value = email ? email.value.trim() : "";
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!valid) {
        if (error) {
          error.textContent = "Please enter an email so we can send your first prompt.";
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

      const language = doc.getElementById("join-language");
      const time = doc.getElementById("join-time");
      const successEmail = doc.getElementById("success-email");
      const successLanguage = doc.getElementById("success-language");
      const successTime = doc.getElementById("success-time");

      if (successEmail) successEmail.textContent = value;
      if (successLanguage) successLanguage.textContent = language ? language.value : "Spanish";
      if (successTime) successTime.textContent = time ? time.value : "Morning";

      form.hidden = true;
      if (success) {
        success.hidden = false;
        const heading = success.querySelector("h3");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus();
        }
      }
    });
  }

  if (again) {
    again.addEventListener("click", () => {
      if (success) success.hidden = true;
      if (form) {
        form.hidden = false;
        const email = doc.getElementById("join-email");
        if (email) {
          email.value = "";
          email.focus();
        }
      }
    });
  }

  /* ---------- Year ---------- */

  const year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
