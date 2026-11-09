/* ============================================================
   Native Speaker Studio
   Room tabs, plan handoff, FAQ, mobile nav, form states.
   ============================================================ */

(function () {
  "use strict";

  var doc = document;
  var header = doc.getElementById("site-header");
  var nav = doc.getElementById("primary-nav");
  var navToggle = doc.querySelector(".nav-toggle");
  var year = doc.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

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

  /* ---------- Rooms ---------- */

  var rooms = {
    conversation: {
      level: "B1–C1",
      seats: "8 seats",
      title: "Conversation Lab",
      desc: "One good question, seventy-five minutes, no agenda beyond following the interesting part. You will practice entering a conversation, changing its direction, and leaving it without apologising.",
      when: "Tuesdays · 19:00 CT",
      mentor: "Maya Okonkwo",
      project: "The question deck",
      length: "75 min",
      photo: "../assets/img/teacher-maya.jpg",
      role: "Native Spanish · Livingston · 11 seasons",
      shape: [
        ["00:00", "Warm-up", "One question, everyone answers"],
        ["00:10", "Prompt", "Choose a direction for the night"],
        ["00:25", "Work", "Pairs, then the whole room"],
        ["00:55", "Share", "One thing you want to keep"]
      ]
    },
    scene: {
      level: "B2–C1",
      seats: "6 seats",
      title: "Scene Study",
      desc: "Take a scene from a play, a film, or a real argument. Read it cold, then put the page down and play it. You will work on pauses, subtext, and the courage to hold the room.",
      when: "Thursdays · 18:30 CT",
      mentor: "Diego Salas",
      project: "A ten-minute two-hander",
      length: "90 min",
      photo: "../assets/img/teacher-diego.jpg",
      role: "Native Spanish · Antigua · 8 seasons",
      shape: [
        ["00:00", "Read cold", "One pass, no notes"],
        ["00:15", "Block", "Find the physical shape"],
        ["00:35", "Run", "Page down, stakes up"],
        ["01:05", "Notes", "One choice to keep"]
      ]
    },
    writing: {
      level: "A2–B2",
      seats: "10 seats",
      title: "Writing Room",
      desc: "Short, useful writing: a complaint that gets answered, a recommendation someone trusts, a love note you would actually send. We write in the room and read one line aloud.",
      when: "Saturdays · 11:00 CT",
      mentor: "Camila Rojas",
      project: "The pocket zine",
      length: "75 min",
      photo: "../assets/img/teacher-camila.jpg",
      role: "Native Spanish · Quetzaltenango · 7 seasons",
      shape: [
        ["00:00", "One line", "A sentence you wish you had said"],
        ["00:10", "Model", "Steal the shape, not the words"],
        ["00:25", "Draft", "Write badly, quickly"],
        ["00:55", "Read", "One line aloud, no apology"]
      ]
    },
    listening: {
      level: "B1–C1",
      seats: "12 seats",
      title: "Listening Club",
      desc: "One podcast, one argument, one page of notes. We slow down the parts that go by too fast and build a field guide to how people actually talk — fillers, jokes, interruptions and all.",
      when: "Sundays · 17:00 CT",
      mentor: "James Whitfield",
      project: "A field guide to how people talk",
      length: "60 min",
      photo: "../assets/img/teacher-james.jpg",
      role: "Native English · Antigua · 9 seasons",
      shape: [
        ["00:00", "First listen", "No transcript, just ears"],
        ["00:10", "Mark it", "Circle what nearly landed"],
        ["00:25", "Unpack", "One phrase, three contexts"],
        ["00:45", "Keep", "Add it to the field guide"]
      ]
    }
  };

  var tabs = Array.prototype.slice.call(doc.querySelectorAll(".class-tab"));
  var panel = doc.getElementById("class-panel");
  var roomLevel = doc.getElementById("room-level");
  var roomSeats = doc.getElementById("room-seats");
  var roomTitle = doc.getElementById("room-title");
  var roomDesc = doc.getElementById("room-desc");
  var roomWhen = doc.getElementById("room-when");
  var roomMentor = doc.getElementById("room-mentor");
  var roomProject = doc.getElementById("room-project");
  var roomLength = doc.getElementById("room-length");
  var roomPhoto = doc.getElementById("room-photo");
  var roomMentorFoot = doc.getElementById("room-mentor-foot");
  var roomMentorRole = doc.getElementById("room-mentor-role");
  var shapeList = doc.getElementById("shape-list");
  var chooseRoom = doc.querySelector(".js-choose-room");
  var joinRoom = doc.getElementById("join-room");

  function renderRoom(key) {
    var data = rooms[key];
    if (!data) return;

    roomLevel.textContent = data.level;
    roomSeats.textContent = data.seats;
    roomTitle.textContent = data.title;
    roomDesc.textContent = data.desc;
    roomWhen.textContent = data.when;
    roomMentor.textContent = data.mentor;
    roomProject.textContent = data.project;
    roomLength.textContent = data.length;
    roomPhoto.src = data.photo;
    roomPhoto.alt = "Portrait of " + data.mentor;
    roomMentorFoot.textContent = data.mentor;
    roomMentorRole.textContent = data.role;

    shapeList.innerHTML = data.shape
      .map(function (row) {
        return (
          "<li>" +
          "<span>" + row[0] + "</span>" +
          "<strong>" + row[1] + "</strong>" +
          "<em>" + row[2] + "</em>" +
          "</li>"
        );
      })
      .join("");

    if (chooseRoom) {
      chooseRoom.dataset.room = data.title;
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

    if (panel) panel.setAttribute("aria-labelledby", tab.id);
    if (focus) tab.focus();
    renderRoom(tab.dataset.room);
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

  /* ---------- Plan + room handoff ---------- */

  var selectionNote = doc.getElementById("selection-note");

  function setNote(message) {
    if (!selectionNote) return;
    selectionNote.textContent = message;
    selectionNote.hidden = false;
  }

  Array.prototype.forEach.call(doc.querySelectorAll(".js-choose-plan"), function (button) {
    button.addEventListener("click", function () {
      setNote("Selected: " + button.dataset.plan + ". Your first class is still free.");
    });
  });

  if (chooseRoom) {
    chooseRoom.addEventListener("click", function () {
      var room = chooseRoom.dataset.room;
      if (joinRoom) joinRoom.value = room;
      setNote("Seat held for " + room + ". First class is free.");
    });
  }

  if (joinRoom) {
    joinRoom.addEventListener("change", function () {
      if (joinRoom.value === "Not sure yet") {
        setNote("No problem. We will place you in the room that fits best.");
      } else {
        setNote("Room set to " + joinRoom.value + ". First class is free.");
      }
    });
  }

  /* ---------- FAQ ---------- */

  Array.prototype.forEach.call(doc.querySelectorAll(".faq-question"), function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".faq-item");
      var faqPanel = doc.getElementById(button.getAttribute("aria-controls"));
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
        if (faqPanel) {
          faqPanel.setAttribute("aria-hidden", "false");
          faqPanel.removeAttribute("inert");
        }
      }
    });
  });

  /* ---------- Join form ---------- */

  var form = doc.getElementById("join-form");
  var success = doc.getElementById("join-success");

  if (form && success) {
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

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";

      if (!name) {
        showError("Tell us your name so we can hold the right seat.");
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
      var room = doc.getElementById("join-room");
      var firstName = name.split(" ")[0];

      var successName = doc.getElementById("success-name");
      var successEmail = doc.getElementById("success-email");
      var successRoom = doc.getElementById("success-room");
      var successLanguage = doc.getElementById("success-language");

      if (successName) successName.textContent = firstName;
      if (successEmail) successEmail.textContent = email;
      if (successRoom) successRoom.textContent = room ? room.value : "Conversation Lab";
      if (successLanguage) successLanguage.textContent = language ? language.value : "Spanish";

      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();

      if (selectionNote) selectionNote.hidden = true;
    });

    var again = doc.getElementById("join-again");
    if (again) {
      again.addEventListener("click", function () {
        success.hidden = true;
        form.hidden = false;
        form.reset();
        if (selectionNote) selectionNote.hidden = true;
        if (nameInput) nameInput.focus();
      });
    }
  }
})();
