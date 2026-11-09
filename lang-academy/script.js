/* ============================================================
   Native Speaker Academy — homepage interactions
   ============================================================ */

(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;

  // Enables reveal styles before the first paint.
  root.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileNavQuery = window.matchMedia("(max-width: 860px)");

  /* ---------- Header scroll state ---------- */

  const header = doc.getElementById("site-header");
  let scrollTicking = false;

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    scrollTicking = false;
  };

  if (header) {
    updateHeader();
    window.addEventListener(
      "scroll",
      () => {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(updateHeader);
      },
      { passive: true }
    );
  }

  /* ---------- Mobile navigation ---------- */

  const nav = doc.getElementById("primary-nav");
  const navToggle = doc.querySelector(".nav-toggle");

  const isNavOpen = () => Boolean(nav && nav.classList.contains("is-open"));

  const setNavOpen = (open, restoreFocus = false) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    doc.body.classList.toggle("nav-open", open);
    if (!open && restoreFocus) navToggle.focus();
  };

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => setNavOpen(!isNavOpen()));

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a") && mobileNavQuery.matches) setNavOpen(false);
    });

    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isNavOpen()) setNavOpen(false, true);
    });

    doc.addEventListener("click", (event) => {
      if (!isNavOpen()) return;
      if (!event.target.closest(".nav-shell")) setNavOpen(false);
    });

    const onNavBreakpoint = (event) => {
      if (!event.matches) setNavOpen(false);
    };

    if (typeof mobileNavQuery.addEventListener === "function") {
      mobileNavQuery.addEventListener("change", onNavBreakpoint);
    } else if (typeof mobileNavQuery.addListener === "function") {
      mobileNavQuery.addListener(onNavBreakpoint);
    }
  }

  /* ---------- Program tabs ---------- */

  const tabs = Array.from(doc.querySelectorAll(".program-tab"));
  const panels = tabs.map((tab) => doc.getElementById(tab.getAttribute("aria-controls")));

  const activateProgram = (index, moveFocus = false) => {
    if (!tabs.length) return;

    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;

      const panel = panels[i];
      if (!panel) return;
      panel.hidden = !active;
      if (!active) panel.classList.remove("is-entering");
    });

    const panel = panels[index];
    if (panel && !prefersReducedMotion) {
      void panel.offsetWidth;
      panel.classList.add("is-entering");
    }

    if (moveFocus) tabs[index].focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateProgram(index));

    tab.addEventListener("keydown", (event) => {
      let next = null;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (index + 1) % tabs.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (index - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = tabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      activateProgram(next, true);
    });
  });

  /* ---------- Billing toggle ---------- */

  const billingButtons = Array.from(doc.querySelectorAll(".billing-btn"));
  const priceAmounts = Array.from(doc.querySelectorAll(".price-amount"));
  const billingNotes = Array.from(doc.querySelectorAll(".billing-note"));
  const pricingNote = doc.querySelector(".pricing-note");

  const pricingCopy = {
    monthly:
      "Prices in USD. Sibling discount applied at enrollment. Schools and co-ops get custom quotes.",
    quarterly:
      "Quarterly plans are billed once per term and save 10%. Prices in USD. Schools and co-ops get custom quotes.",
  };

  const setBilling = (period) => {
    if (period !== "monthly" && period !== "quarterly") return;

    billingButtons.forEach((button) => {
      const active = button.dataset.billing === period;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    priceAmounts.forEach((amount) => {
      const next = amount.dataset[period];
      if (next && amount.textContent !== next) amount.textContent = next;
    });

    billingNotes.forEach((note) => {
      const next = period === "monthly" ? note.dataset.monthlyNote : note.dataset.quarterlyNote;
      if (next) note.textContent = next;
    });

    if (pricingNote) pricingNote.textContent = pricingCopy[period];
  };

  billingButtons.forEach((button) => {
    button.addEventListener("click", () => setBilling(button.dataset.billing));
  });

  /* ---------- FAQ accordion ---------- */

  doc.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-panel");
    if (!question || !panel) return;

    question.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");

      item.classList.toggle("is-open", willOpen);
      question.setAttribute("aria-expanded", String(willOpen));
      panel.setAttribute("aria-hidden", String(!willOpen));

      if (willOpen) {
        panel.removeAttribute("inert");
      } else {
        panel.setAttribute("inert", "");
      }
    });
  });

  /* ---------- Booking dialog ---------- */

  const dialog = doc.getElementById("booking-dialog");
  const bookingForm = doc.getElementById("booking-form");
  const bookingSuccess = doc.querySelector(".booking-success");
  const successEmail = doc.getElementById("success-email");
  const emailField = bookingForm ? bookingForm.querySelector('input[name="email"]') : null;
  const studentField = bookingForm ? bookingForm.querySelector('select[name="student"]') : null;
  const dialogContext = doc.getElementById("dialog-context");
  const bookTitle = doc.getElementById("book-title");
  const timeInputs = bookingForm
    ? Array.from(bookingForm.querySelectorAll('input[name="time"]'))
    : [];

  const planInfo = {
    Starter: "Starter plan · 1 class a week",
    Family: "Family plan · 2 classes a week",
    Immersion: "Immersion plan · 3 classes a week",
  };

  const programInfo = {
    Preschool: { student: "My child (4–10)", label: "Preschool program" },
    Elementary: { student: "My child (4–10)", label: "Elementary program" },
    "Middle school": { student: "My teen (11–17)", label: "Middle school program" },
    "High school": { student: "My teen (11–17)", label: "High school program" },
    Adults: { student: "Myself (18+)", label: "Adults program" },
    Schools: { student: "My school or co-op", label: "Schools & co-ops" },
  };

  const updateTimeLabels = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    timeInputs.forEach((input) => {
      const targetDay = Number(input.dataset.day);
      if (!Number.isFinite(targetDay)) return;

      let offset = (targetDay - today.getDay() + 7) % 7;
      if (offset === 0) offset = 7;

      const date = new Date(today);
      date.setDate(date.getDate() + offset);

      const label = input.closest(".time-option")?.querySelector(".time-date");
      if (!label) return;

      label.textContent = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    });
  };

  const setDialogContext = (parts) => {
    if (!dialogContext) return;
    if (parts.length) {
      dialogContext.textContent = parts.join(" · ");
      dialogContext.hidden = false;
    } else {
      dialogContext.textContent = "";
      dialogContext.hidden = true;
    }
  };

  const openDialog = (options = {}) => {
    if (!dialog || !bookingForm || !bookingSuccess) return;

    setNavOpen(false);

    bookingForm.hidden = false;
    bookingSuccess.hidden = true;

    const contextParts = [];

    const program = programInfo[options.program];
    if (program) {
      if (studentField) studentField.value = program.student;
      contextParts.push(program.label);
    }

    const plan = planInfo[options.plan];
    if (plan) contextParts.push(plan);

    if (options.email && emailField) emailField.value = options.email;

    setDialogContext(contextParts);
    updateTimeLabels();

    if (typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    } else if (!dialog.open) {
      dialog.setAttribute("open", "");
    }

    doc.body.classList.add("dialog-open");

    if (bookTitle) {
      window.requestAnimationFrame(() => bookTitle.focus({ preventScroll: true }));
    }
  };

  const closeDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  };

  doc.addEventListener("click", (event) => {
    const trigger = event.target.closest(".js-book");
    if (!trigger) return;

    event.preventDefault();
    openDialog({
      program: trigger.dataset.program,
      plan: trigger.dataset.plan,
    });
  });

  if (dialog) {
    const closeButton = dialog.querySelector(".dialog-close");

    if (closeButton) closeButton.addEventListener("click", closeDialog);

    dialog.querySelectorAll("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", closeDialog);
    });

    dialog.addEventListener("close", () => {
      doc.body.classList.remove("dialog-open");
    });

    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) closeDialog();
    });
  }

  const heroForm = doc.getElementById("hero-form");
  const heroEmail = doc.getElementById("hero-email");

  if (heroForm && heroEmail) {
    heroForm.addEventListener("submit", (event) => {
      event.preventDefault();
      openDialog({ email: heroEmail.value.trim() });
    });
  }

  if (bookingForm && bookingSuccess && successEmail) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = emailField ? emailField.value.trim() : "";
      successEmail.textContent = email;
      bookingForm.hidden = true;
      bookingSuccess.hidden = false;

      const done = bookingSuccess.querySelector("[data-close-dialog]");
      if (done) done.focus();
      else if (bookTitle) bookTitle.focus({ preventScroll: true });
    });
  }

  /* ---------- Footer year ---------- */

  const year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Scroll reveal ---------- */

  const revealTargets = Array.from(
    doc.querySelectorAll(
      [
        ".section-head",
        ".step",
        ".bento-card",
        ".teacher-card",
        ".review",
        ".price-card",
        ".program-panel",
        ".cta-panel",
        ".schools-copy",
        ".schools-list",
        ".faq-copy",
        ".faq-list",
      ].join(",")
    )
  );

  if (revealTargets.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((element) => element.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    revealTargets.forEach((element) => observer.observe(element));
  }
})();
