/* Native Speaker Tandem — nav, exchange order, format tabs, FAQ, form. */
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

  /* ---------- Exchange order ---------- */

  const orderButtons = Array.from(doc.querySelectorAll(".order-btn"));
  const halfOne = doc.getElementById("half-one");
  const halfTwo = doc.getElementById("half-two");
  const halfOneTime = doc.getElementById("half-one-time");
  const halfTwoTime = doc.getElementById("half-two-time");
  const halfOneTitle = doc.getElementById("half-one-title");
  const halfTwoTitle = doc.getElementById("half-two-title");
  const halfOneNote = doc.getElementById("half-one-note");
  const halfTwoNote = doc.getElementById("half-two-note");

  const orders = {
    "en-first": {
      one: { time: "00:00–30:00", title: "English", note: "Camila practises with you" },
      two: { time: "30:00–60:00", title: "Spanish", note: "You practise with Camila" },
    },
    "es-first": {
      one: { time: "00:00–30:00", title: "Spanish", note: "You practise with Camila" },
      two: { time: "30:00–60:00", title: "English", note: "Camila practises with you" },
    },
  };

  const paintOrder = (key) => {
    const order = orders[key];
    if (!order) return;

    if (halfOneTime) halfOneTime.textContent = order.one.time;
    if (halfOneTitle) halfOneTitle.textContent = order.one.title;
    if (halfOneNote) halfOneNote.textContent = order.one.note;
    if (halfTwoTime) halfTwoTime.textContent = order.two.time;
    if (halfTwoTitle) halfTwoTitle.textContent = order.two.title;
    if (halfTwoNote) halfTwoNote.textContent = order.two.note;

    const firstIsEnglish = order.one.title === "English";
    if (halfOne) halfOne.classList.toggle("timeline-half--alt", !firstIsEnglish);
    if (halfTwo) halfTwo.classList.toggle("timeline-half--alt", firstIsEnglish);
  };

  orderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      orderButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      paintOrder(button.dataset.order);
    });
  });

  /* ---------- Exchange format tabs ---------- */

  const tabs = Array.from(doc.querySelectorAll(".exchange-tab"));
  const panels = Array.from(doc.querySelectorAll(".exchange-panel"));

  const activateTab = (tab, focus = false) => {
    const id = tab.getAttribute("aria-controls");

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.id === id;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });

    if (focus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (event) => {
      let next = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        next = tabs[(index + 1) % tabs.length];
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        next = tabs[(index - 1 + tabs.length) % tabs.length];
      } else if (event.key === "Home") {
        next = tabs[0];
      } else if (event.key === "End") {
        next = tabs[tabs.length - 1];
      }

      if (next) {
        event.preventDefault();
        activateTab(next, true);
      }
    });
  });

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
          error.textContent = "Please enter an email so we can send your partner.";
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

      const direction = doc.getElementById("join-direction");
      const frequency = doc.getElementById("join-frequency");
      const successEmail = doc.getElementById("success-email");
      const successDirection = doc.getElementById("success-direction");
      const successFrequency = doc.getElementById("success-frequency");

      if (successEmail) successEmail.textContent = value;
      if (successDirection) successDirection.textContent = direction ? direction.value : "English / Spanish";
      if (successFrequency) successFrequency.textContent = frequency ? frequency.value : "Weekly";

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
