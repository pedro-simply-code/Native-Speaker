(() => {
  "use strict";

  /* ---------- Header state ---------- */

  const header = document.getElementById("site-header");

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  const closeNav = () => {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeNav();
      return;
    }

    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (
      nav.classList.contains("is-open") &&
      !nav.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeNav();
  });

  /* ---------- Teacher language filters ---------- */

  const filterButtons = Array.from(
    document.querySelectorAll(".filter[data-filter]")
  );
  const teacherCards = Array.from(document.querySelectorAll(".teacher-card"));
  const teacherCount = document.getElementById("teacher-count");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visible = 0;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      teacherCards.forEach((card) => {
        const matches =
          filter === "all" || card.dataset.language === filter;

        card.classList.toggle("is-filtered", !matches);

        if (matches) {
          visible += 1;
          card.classList.remove("is-enter");
          void card.offsetWidth;
          card.classList.add("is-enter");
        }
      });

      teacherCount.textContent =
        filter === "all"
          ? `Showing all ${visible} teachers`
          : `Showing ${visible} of ${teacherCards.length} teachers`;
    });
  });

  /* ---------- Favourite teachers ---------- */

  document.querySelectorAll(".heart").forEach((heart) => {
    heart.addEventListener("click", () => {
      const isLiked = heart.getAttribute("aria-pressed") !== "true";
      const use = heart.querySelector("use");

      heart.setAttribute("aria-pressed", String(isLiked));
      heart.classList.toggle("is-liked", isLiked);
      use.setAttribute("href", isLiked ? "#i-heart-fill" : "#i-heart");
    });
  });

  /* ---------- Lesson language switch ---------- */

  const chatButtons = Array.from(
    document.querySelectorAll(".chat-switch [data-chat]")
  );
  const chatPanels = Array.from(document.querySelectorAll(".chat-panel"));
  const chatAvatar = document.getElementById("chat-avatar");
  const chatName = document.getElementById("chat-name");
  const chatPlace = document.getElementById("chat-place");

  chatButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.dataset.chat;

      chatButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      chatPanels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== language;
      });

      chatAvatar.src = button.dataset.avatar;
      chatAvatar.alt = button.dataset.name;
      chatName.textContent = button.dataset.name;
      chatPlace.textContent = button.dataset.place;
    });
  });

  /* ---------- FAQ accordion ---------- */

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-panel");

    question.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");

      faqItems.forEach((other) => {
        const otherQuestion = other.querySelector(".faq-question");
        const otherPanel = other.querySelector(".faq-panel");

        other.classList.remove("is-open");
        otherQuestion.setAttribute("aria-expanded", "false");
        otherPanel.setAttribute("aria-hidden", "true");
        otherPanel.setAttribute("inert", "");
      });

      if (wasOpen) return;

      item.classList.add("is-open");
      question.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      panel.removeAttribute("inert");
    });
  });

  /* ---------- Booking dialog ---------- */

  const dialog = document.getElementById("booking-dialog");
  const bookingForm = document.getElementById("booking-form");
  const bookingSuccess = dialog.querySelector(".booking-success");
  const bookingTeacher = document.getElementById("booking-teacher");
  const bookingPhoto = document.getElementById("booking-photo");
  const successTeacher = document.getElementById("success-teacher");
  const successEmail = document.getElementById("success-email");
  const bookingTitle = document.getElementById("booking-title");
  const successTitle = bookingSuccess.querySelector("h2");
  const timeInputs = Array.from(
    bookingForm.querySelectorAll('input[name="time"]')
  );

  let lastTrigger = null;

  const formatNextDate = (day) => {
    const today = new Date();
    let difference = day - today.getDay();

    if (difference <= 0) difference += 7;

    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + difference
    );

    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  timeInputs.forEach((input) => {
    const dateLabel = input
      .closest(".time-option")
      .querySelector(".time-date");

    dateLabel.textContent = formatNextDate(Number(input.dataset.day));
  });

  document.querySelectorAll(".js-book").forEach((button) => {
    button.addEventListener("click", () => {
      const fullName = button.dataset.teacher || "your teacher";
      const firstName = fullName.split(" ")[0];
      const photo = button.dataset.photo || "../assets/img/teacher-sofia.jpg";

      lastTrigger = button;

      bookingTeacher.textContent = firstName;
      successTeacher.textContent = firstName;
      bookingPhoto.src = photo;
      bookingPhoto.alt = `Portrait of ${fullName}`;

      bookingForm.reset();
      bookingForm.hidden = false;
      bookingSuccess.hidden = true;

      dialog.showModal();
      document.body.classList.add("dialog-open");

      requestAnimationFrame(() => bookingTitle.focus());
    });
  });

  dialog.querySelector(".dialog-close").addEventListener("click", () => {
    dialog.close();
  });

  dialog.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (lastTrigger) lastTrigger.focus();
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) return;

    const email = bookingForm.elements.email.value.trim();

    successEmail.textContent = email;
    bookingForm.hidden = true;
    bookingSuccess.hidden = false;
    successTitle.setAttribute("tabindex", "-1");
    successTitle.focus();
  });

  /* ---------- Footer year ---------- */

  document.getElementById("year").textContent = new Date().getFullYear();
})();
