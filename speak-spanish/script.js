(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header state ---------- */

  const header = document.getElementById("site-header");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  const closeNav = () => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  if (navToggle && nav) {
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

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeNav();
    });
  }

  /* ---------- 25-minute lesson timer ---------- */

  const timerDisplay = document.getElementById("timer-display");
  const timerProgress = document.getElementById("timer-progress");
  const timerToggle = document.getElementById("timer-toggle");
  const timerReset = document.getElementById("timer-reset");
  const timerStatus = document.getElementById("timer-status");

  const TOTAL_SECONDS = 25 * 60;
  const CIRCUMFERENCE = 2 * Math.PI * 88;
  const RING_LENGTH = Math.round(CIRCUMFERENCE * 10) / 10;

  let secondsLeft = TOTAL_SECONDS;
  let timerId = null;
  let timerRunning = false;

  const formatTime = (total) => {
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const paintTimer = () => {
    if (!timerDisplay || !timerProgress) return;

    const elapsed = TOTAL_SECONDS - secondsLeft;
    const ratio = elapsed / TOTAL_SECONDS;

    timerDisplay.textContent = formatTime(secondsLeft);
    timerDisplay.setAttribute("aria-label", `${Math.ceil(secondsLeft / 60)} minutes remaining`);
    timerProgress.style.strokeDashoffset = String(RING_LENGTH * ratio);
  };

  const stopTimer = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
    timerRunning = false;
  };

  const finishTimer = () => {
    stopTimer();
    secondsLeft = 0;
    paintTimer();
    if (timerToggle) timerToggle.textContent = "Run it again";
    if (timerStatus) {
      timerStatus.textContent = "That is the format. One conversation, twenty-five minutes.";
      timerStatus.classList.remove("is-running");
    }
    if (timerReset) timerReset.disabled = false;
  };

  const tick = () => {
    secondsLeft -= 1;

    if (secondsLeft <= 0) {
      finishTimer();
      return;
    }

    paintTimer();
  };

  const startTimer = () => {
    if (secondsLeft <= 0) {
      secondsLeft = TOTAL_SECONDS;
      paintTimer();
    }

    stopTimer();
    timerRunning = true;
    if (timerToggle) timerToggle.textContent = "Pause";
    if (timerStatus) {
      timerStatus.textContent = "Lesson in progress. The timer runs for one conversation.";
      timerStatus.classList.add("is-running");
    }
    if (timerReset) timerReset.disabled = false;
    timerId = window.setInterval(tick, 1000);
  };

  const pauseTimer = () => {
    stopTimer();
    if (timerToggle) timerToggle.textContent = "Resume";
    if (timerStatus) {
      timerStatus.textContent = "Paused. The clock keeps your place.";
      timerStatus.classList.remove("is-running");
    }
  };

  const resetTimer = () => {
    stopTimer();
    secondsLeft = TOTAL_SECONDS;
    paintTimer();
    if (timerToggle) timerToggle.textContent = "Start demo";
    if (timerStatus) {
      timerStatus.textContent = "Press play to try the format.";
      timerStatus.classList.remove("is-running");
    }
    if (timerReset) timerReset.disabled = true;
  };

  if (timerDisplay && timerProgress && timerToggle && timerReset && timerStatus) {
    timerProgress.style.strokeDasharray = String(RING_LENGTH);
    paintTimer();

    timerToggle.addEventListener("click", () => {
      if (timerRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    });

    timerReset.addEventListener("click", resetTimer);
  }

  /* ---------- Practice partner ---------- */

  const scenarios = {
    coffee: {
      context: "You’re at a café in Antigua.",
      messages: [
        { role: "ai", text: "¡Buenos días! ¿Qué te sirvo?" },
        { role: "user", text: "Un café con leche, por favor." },
        { role: "ai", text: "Claro. ¿Lo quieres con azúcar?" },
      ],
      rounds: [
        [
          {
            reply: "Sin azúcar, gracias.",
            ai: "Perfecto, sin azúcar. ¿Algo para comer?",
          },
          {
            reply: "¿Tienes leche de avena?",
            ai: "Sí, claro. ¿La quieres caliente o fría?",
          },
        ],
        [
          {
            reply: "Solo un café, gracias.",
            ai: "Muy bien. Son veinte quetzales. ¿Efectivo o tarjeta?",
          },
          {
            reply: "Un pan dulce, por favor.",
            ai: "Buena elección. Ahora mismo te lo traigo.",
          },
        ],
        [
          {
            reply: "Gracias, ¿me trae la cuenta?",
            ai: "Claro, aquí la tienes. ¡Hasta luego!",
          },
          {
            reply: "Muy amable, gracias.",
            ai: "A ti. ¡Que tengas un buen día!",
          },
        ],
      ],
    },
    interview: {
      context: "You’re interviewing for a job in Guatemala City.",
      messages: [
        { role: "ai", text: "Buenos días. Cuéntame un poco sobre ti." },
        { role: "user", text: "Tengo cinco años de experiencia en diseño." },
        { role: "ai", text: "Muy bien. ¿Por qué te interesa este puesto?" },
      ],
      rounds: [
        [
          {
            reply: "Me gusta el proyecto y el equipo.",
            ai: "Buena respuesta. ¿Y qué puedes aportar al equipo?",
          },
          {
            reply: "Busco nuevos retos.",
            ai: "Eso suena convincente. ¿Tienes alguna pregunta para mí?",
          },
        ],
        [
          {
            reply: "Puedo mejorar el producto.",
            ai: "Me gusta. ¿Cómo trabajarías con el resto del equipo?",
          },
          {
            reply: "Tengo mucha experiencia.",
            ai: "Interesante. ¿Y cómo te adaptas a los cambios?",
          },
        ],
        [
          {
            reply: "Sí, ¿cómo es el equipo?",
            ai: "Es un equipo pequeño y muy cercano. ¿Cuándo podrías empezar?",
          },
          {
            reply: "No, gracias. Todo está claro.",
            ai: "Perfecto. Te escribimos mañana con la decisión.",
          },
        ],
      ],
    },
    dinner: {
      context: "You’re having dinner with friends in Quetzaltenango.",
      messages: [
        { role: "ai", text: "¡Qué gusto verte! ¿Qué se te antoja cenar?" },
        { role: "user", text: "Me encantaría probar algo típico." },
        { role: "ai", text: "Te recomiendo el pepián. ¿Te gusta el picante?" },
      ],
      rounds: [
        [
          {
            reply: "Sí, me gustan bastante.",
            ai: "¡Perfecto! Entonces pido una ración para compartir.",
          },
          {
            reply: "Prefiero algo suave, por favor.",
            ai: "Sin problema. También tenemos tamales muy ricos.",
          },
        ],
        [
          {
            reply: "¿Qué me recomiendas beber?",
            ai: "Un licuado de banano. Está buenísimo.",
          },
          {
            reply: "¿Tienen opciones vegetarianas?",
            ai: "Sí, las hilachas son una delicia.",
          },
        ],
        [
          {
            reply: "¿Nos traes la cuenta?",
            ai: "Claro. ¿Quieres que la divida?",
          },
          {
            reply: "Todo estaba delicioso.",
            ai: "Qué alegría. ¡Vuelve cuando quieras!",
          },
        ],
      ],
    },
  };

  const scenarioButtons = Array.from(document.querySelectorAll(".scenario-btn"));
  const scenarioContext = document.getElementById("scenario-context");
  const chatLog = document.getElementById("chat-log");
  const chatReplies = document.getElementById("chat-replies");

  let activeScenario = "coffee";
  let roundIndex = 0;
  let replyTimeout = null;

  const createMessage = (role, text, who) => {
    const message = document.createElement("div");
    message.className = `chat-msg chat-msg--${role}`;

    const label = document.createElement("span");
    label.className = "chat-who";
    label.textContent = who;

    const body = document.createElement("p");
    body.textContent = text;
    body.lang = "es";

    message.append(label, body);
    return message;
  };

  const createTyping = () => {
    const message = document.createElement("div");
    message.className = "chat-msg chat-msg--ai chat-typing";

    const label = document.createElement("span");
    label.className = "chat-who";
    label.textContent = "Practice partner";

    const body = document.createElement("p");
    body.textContent = "···";
    body.setAttribute("aria-label", "Practice partner is replying");

    message.append(label, body);
    return message;
  };

  const scrollChat = () => {
    if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;
  };

  const renderReplies = () => {
    if (!chatReplies) return;

    chatReplies.replaceChildren();
    const scenario = scenarios[activeScenario];
    const round = scenario.rounds[roundIndex];

    if (!round) {
      const again = document.createElement("button");
      again.type = "button";
      again.className = "chat-reply chat-replay";
      again.textContent = "Run the scene again";
      again.addEventListener("click", () => loadScenario(activeScenario));
      chatReplies.append(again);
      return;
    }

    round.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-reply";
      button.textContent = option.reply;
      button.addEventListener("click", () => chooseReply(option));
      chatReplies.append(button);
    });
  };

  const chooseReply = (option) => {
    if (!chatLog || !chatReplies) return;

    if (replyTimeout) {
      window.clearTimeout(replyTimeout);
      replyTimeout = null;
    }

    chatLog.append(createMessage("user", option.reply, "You"));
    chatReplies.replaceChildren();
    scrollChat();

    const typing = createTyping();
    chatLog.append(typing);
    scrollChat();

    const scenarioAtClick = activeScenario;

    replyTimeout = window.setTimeout(() => {
      if (activeScenario !== scenarioAtClick || !chatLog) return;

      typing.remove();
      chatLog.append(createMessage("ai", option.ai, "Practice partner"));
      scrollChat();

      roundIndex += 1;
      renderReplies();
      replyTimeout = null;
    }, 520);
  };

  const loadScenario = (key) => {
    const scenario = scenarios[key];
    if (!scenario || !chatLog || !chatReplies) return;

    if (replyTimeout) {
      window.clearTimeout(replyTimeout);
      replyTimeout = null;
    }

    activeScenario = key;
    roundIndex = 0;

    if (scenarioContext) scenarioContext.textContent = scenario.context;
    chatLog.replaceChildren(
      ...scenario.messages.map((message) =>
        createMessage(message.role, message.text, message.role === "ai" ? "Practice partner" : "You")
      )
    );
    renderReplies();
    scrollChat();

    scenarioButtons.forEach((button) => {
      const isActive = button.dataset.scenario === key;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.scenario !== activeScenario) {
        loadScenario(button.dataset.scenario);
      }
    });
  });

  /* ---------- Teacher filter ---------- */

  const filterButtons = Array.from(document.querySelectorAll(".coach-filter-btn"));
  const coachCards = Array.from(document.querySelectorAll(".coach-card"));
  const coachCount = document.getElementById("coach-count");

  const filterTeachers = (language) => {
    const labels = { spanish: "Spanish", english: "English" };
    let shown = 0;

    coachCards.forEach((card) => {
      const visible = !language || card.dataset.language === language;
      card.hidden = !visible;
      if (visible) {
        shown += 1;
        card.classList.add("is-visible");
      }
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === language;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (coachCount) {
      coachCount.textContent = `Showing ${shown} ${labels[language] || "native"} ${
        shown === 1 ? "teacher" : "teachers"
      }`;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => filterTeachers(button.dataset.filter));
  });

  /* ---------- Plan and teacher selection ---------- */

  const selectionNote = document.getElementById("selection-note");
  const levelForm = document.getElementById("level-form");
  const levelSuccess = document.getElementById("level-success");
  const levelLanguage = document.getElementById("level-language");

  const showSelection = (text) => {
    if (!selectionNote) return;
    selectionNote.textContent = text;
    selectionNote.hidden = false;
    selectionNote.style.animation = "none";
    void selectionNote.offsetWidth;
    selectionNote.style.animation = "pop 0.32s var(--ease) both";
  };

  const returnToForm = () => {
    if (!levelForm || !levelSuccess) return;
    levelSuccess.hidden = true;
    levelForm.hidden = false;
  };

  document.querySelectorAll(".js-choose-plan").forEach((link) => {
    link.addEventListener("click", () => {
      returnToForm();
      showSelection(
        `Plan selected: ${link.dataset.plan}. Finish the form and we’ll confirm your first lesson.`
      );
    });
  });

  document.querySelectorAll(".js-choose-teacher").forEach((link) => {
    link.addEventListener("click", () => {
      returnToForm();
      const card = link.closest(".coach-card");
      const language = card?.dataset.language;
      const teacher = link.dataset.teacher;

      if (levelLanguage && language) {
        levelLanguage.value = language === "spanish" ? "Spanish" : "English";
      }

      showSelection(
        `Teacher preference: ${teacher}. We’ll match you with ${teacher.split(" ")[0]} or the closest fit.`
      );
    });
  });

  /* ---------- FAQ ---------- */

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));

  const setFaqState = (item, open) => {
    const button = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-panel");
    if (!button || !panel) return;

    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    panel.toggleAttribute("inert", !open);
  };

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    if (!button) return;

    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      faqItems.forEach((other) => setFaqState(other, other === item && willOpen));
    });
  });

  /* ---------- Level test form ---------- */

  const form = document.getElementById("level-form");
  const formError = document.getElementById("form-error");
  const success = document.getElementById("level-success");
  const successName = document.getElementById("success-name");
  const successEmail = document.getElementById("success-email");
  const successLanguage = document.getElementById("success-language");
  const againButton = document.getElementById("level-again");
  const nameInput = document.getElementById("level-name");
  const emailInput = document.getElementById("level-email");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const clearError = () => {
    if (!formError) return;
    formError.hidden = true;
    formError.textContent = "";
  };

  const showError = (message, field) => {
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
    if (field) field.focus();
  };

  if (nameInput) nameInput.addEventListener("input", clearError);
  if (emailInput) emailInput.addEventListener("input", clearError);

  if (form && success) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearError();

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";

      if (!name) {
        showError("Please add your name so we know who to expect.", nameInput);
        return;
      }

      if (!EMAIL_PATTERN.test(email)) {
        showError("That email does not look complete. Check it and try again.", emailInput);
        return;
      }

      const language = levelLanguage ? levelLanguage.value : "Spanish";
      const firstName = name.split(/\s+/)[0];

      if (successName) successName.textContent = firstName;
      if (successEmail) successEmail.textContent = email;
      if (successLanguage) successLanguage.textContent = language;

      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus({ preventScroll: true });
    });
  }

  if (againButton) {
    againButton.addEventListener("click", () => {
      if (!form || !success) return;

      form.reset();
      clearError();
      if (selectionNote) {
        selectionNote.hidden = true;
        selectionNote.textContent = "";
      }

      success.hidden = true;
      form.hidden = false;
      if (nameInput) nameInput.focus();
    });
  }

  /* ---------- Footer year ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Reveal on scroll ---------- */

  const revealTargets = Array.from(
    document.querySelectorAll(
      [
        ".section-head",
        ".why-intro",
        ".why-item",
        ".step",
        ".teacher-panel",
        ".ai-panel",
        ".report-copy",
        ".report-card",
        ".coach-card",
        ".use-card",
        ".price-card",
        ".review",
        ".faq-copy",
        ".faq-list",
        ".ledger-grid > div",
      ].join(",")
    )
  );

  if (!("IntersectionObserver" in window) || reducedMotion) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    revealTargets.forEach((element) => element.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealTargets.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
      observer.observe(element);
    });
  }
})();
