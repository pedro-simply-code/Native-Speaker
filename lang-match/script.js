/* Native Speaker Match — mobile nav, matching quiz, FAQ, form. */
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

  /* ---------- Matching quiz ---------- */

  const teachers = {
    spanish: {
      Travel: {
        name: "María Serrano",
        photo: "../assets/img/hero-maria.jpg",
        meta: "Antigua, Guatemala · Native Spanish",
        quote: "“We’ll build the Spanish you actually need, one real conversation at a time.”",
      },
      Work: {
        name: "Diego Álvarez",
        photo: "../assets/img/teacher-diego.jpg",
        meta: "Guatemala City, Guatemala · Native Spanish",
        quote: "“Spanish for the meeting, the dinner, and the joke after.”",
      },
      Family: {
        name: "Camila Rojas",
        photo: "../assets/img/teacher-camila.jpg",
        meta: "Quetzaltenango, Guatemala · Native Spanish",
        quote: "“Mistakes are how we find the words that stick. Bring all of yours.”",
      },
    },
    english: {
      Travel: {
        name: "Maya Okafor",
        photo: "../assets/img/teacher-maya.jpg",
        meta: "Chicago, Illinois · Native English",
        quote: "“No scripts. We talk about your life, your work, your next trip.”",
      },
      Work: {
        name: "Daniel Brooks",
        photo: "../assets/img/teacher-daniel.jpg",
        meta: "New York, New York · Native English",
        quote: "“We rehearse the real meeting, not a textbook dialogue.”",
      },
      Family: {
        name: "James Whitfield",
        photo: "../assets/img/teacher-james.jpg",
        meta: "Austin, Texas · Native English",
        quote: "“We’ll fix the mistakes that have been following you around for years.”",
      },
    },
  };

  const matchCard = doc.querySelector(".match-card");
  const steps = Array.from(doc.querySelectorAll(".match-step"));
  const result = doc.getElementById("match-result");
  const bar = doc.getElementById("match-bar");
  const dots = Array.from(doc.querySelectorAll(".match-dots span"));
  const langButtons = Array.from(doc.querySelectorAll(".lang-pill"));
  const restart = doc.getElementById("match-restart");

  const answers = { goal: null, style: null, time: null };
  let language = "spanish";
  let currentStep = 1;

  const setProgress = (step) => {
    if (bar) bar.style.width = `${(step / 3) * 100}%`;
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-on", index < step);
    });
  };

  const showStep = (step) => {
    currentStep = step;
    steps.forEach((panel) => {
      const active = Number(panel.dataset.step) === step;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (result) result.hidden = true;
    setProgress(step);

    const active = steps.find((panel) => Number(panel.dataset.step) === step);
    if (active) {
      const question = active.querySelector(".match-question");
      if (question) {
        question.tabIndex = -1;
        question.focus({ preventScroll: true });
      }
    }
  };

  const scoreFor = () => {
    const styleBonus = answers.style === "A mix" ? 3 : 2;
    const timeBonus = answers.time === "Weekends" ? 2 : 3;
    return Math.min(98, 90 + styleBonus + timeBonus);
  };

  const renderResult = () => {
    if (!result) return;
    const teacher = teachers[language][answers.goal] || teachers[language].Travel;
    const score = scoreFor();

    const name = doc.getElementById("result-name");
    const photo = doc.getElementById("result-photo");
    const meta = doc.getElementById("result-meta");
    const quote = doc.getElementById("result-quote");
    const tags = doc.getElementById("result-tags");
    const scoreEl = doc.getElementById("result-score");

    if (name) name.textContent = teacher.name;
    if (photo) {
      photo.src = teacher.photo;
      photo.alt = `Portrait of ${teacher.name}`;
    }
    if (meta) {
      meta.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-pin"></use></svg> ${teacher.meta}`;
    }
    if (quote) quote.textContent = teacher.quote;
    if (scoreEl) scoreEl.textContent = `${score}%`;
    if (tags) {
      tags.innerHTML = "";
      [answers.goal, answers.style, answers.time].forEach((value) => {
        if (!value) return;
        const tag = doc.createElement("span");
        tag.textContent = value;
        tags.appendChild(tag);
      });
    }

    steps.forEach((panel) => {
      panel.hidden = true;
    });
    result.hidden = false;
    setProgress(3);

    if (name) {
      name.tabIndex = -1;
      name.focus({ preventScroll: true });
    }
  };

  steps.forEach((panel) => {
    panel.querySelectorAll(".choice").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.key;
        const value = button.dataset.value;

        panel.querySelectorAll(".choice").forEach((item) => {
          const selected = item === button;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-pressed", selected ? "true" : "false");
        });

        answers[key] = value;

        if (currentStep < 3) {
          window.setTimeout(() => showStep(currentStep + 1), 180);
        } else {
          window.setTimeout(renderResult, 220);
        }
      });
    });
  });

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      language = button.dataset.lang;
      langButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      if (result && !result.hidden && answers.goal) renderResult();
    });
  });

  if (restart) {
    restart.addEventListener("click", () => {
      answers.goal = null;
      answers.style = null;
      answers.time = null;
      doc.querySelectorAll(".choice").forEach((button) => {
        button.classList.remove("is-selected");
        button.setAttribute("aria-pressed", "false");
      });
      showStep(1);
    });
  }

  if (matchCard) setProgress(1);

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
          error.textContent = "Please enter an email so we can send your shortlist.";
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

      const lang = doc.getElementById("join-language");
      const level = doc.getElementById("join-level");
      const successEmail = doc.getElementById("success-email");
      const successLanguage = doc.getElementById("success-language");
      const successLevel = doc.getElementById("success-level");

      if (successEmail) successEmail.textContent = value;
      if (successLanguage) successLanguage.textContent = lang ? lang.value : "Spanish";
      if (successLevel) successLevel.textContent = level ? level.value : "B1–B2";

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
