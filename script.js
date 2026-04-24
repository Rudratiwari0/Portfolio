/* ===========================
   THEME TOGGLE
=========================== */
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("portfolio-theme");
const applyTheme = (theme) => {
  const isLight = theme === "light";

  document.body.classList.toggle("light-mode", isLight);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    themeToggle.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
  }
};

const initialTheme = savedTheme || "dark";
applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
    localStorage.setItem("portfolio-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

/* ===========================
   NAVBAR SCROLL STATE
=========================== */
const navbar = document.getElementById("navbar");

const updateNavbarState = () => {
  if (!navbar) {
    return;
  }

  navbar.classList.toggle("scrolled", window.scrollY > 24);
};

updateNavbarState();
window.addEventListener("scroll", updateNavbarState, { passive: true });

/* ===========================
   HAMBURGER MENU
=========================== */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

const setMenuState = (isOpen) => {
  if (!hamburger || !mobileMenu) {
    return;
  }

  mobileMenu.classList.toggle("open", isOpen);
  mobileMenu.hidden = !isOpen;
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
};

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });
}

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    setMenuState(false);
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    setMenuState(false);
  }
});

/* ===========================
   REVEAL ON SCROLL
=========================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const siblings = entry.target.parentElement.querySelectorAll(".reveal");
      let delay = 0;

      siblings.forEach((element, index) => {
        if (element === entry.target) {
          delay = index * 85;
        }
      });

      setTimeout(() => {
        entry.target.classList.add("visible");
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

/* ===========================
   SKILL BAR ANIMATION
=========================== */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
        const width = bar.getAttribute("data-w");
        bar.style.width = `${width}%`;
      });

      skillObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);

const skillsGrid = document.querySelector(".skills-grid");
if (skillsGrid) {
  skillObserver.observe(skillsGrid);
}

/* ===========================
   PROJECT FILTER
=========================== */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const isVisible = filter === "all" || category === filter;

      card.classList.toggle("hidden", !isVisible);
    });
  });
});

/* ===========================
   CONTACT FORM
=========================== */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  const requiredFields = [...contactForm.querySelectorAll("input[required], textarea[required]")];
  const emailField = document.getElementById("email");
  const contactEmail = "rptiwari1130@gmail.com";

  const markFieldState = (field) => {
    const isEmpty = !field.value.trim();
    const isEmail = field.type === "email";
    const hasInvalidEmail = isEmail && field.value.trim() && !field.checkValidity();
    field.classList.toggle("invalid", isEmpty || hasInvalidEmail);
    return !(isEmpty || hasInvalidEmail);
  };

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
      markFieldState(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const allValid = requiredFields.every((field) => markFieldState(field));

    if (!allValid) {
      const firstInvalid = requiredFields.find((field) => field.classList.contains("invalid")) || emailField;
      formStatus.textContent = "Please complete the required fields with valid details before sending.";
      formStatus.className = "form-status error";
      firstInvalid.focus();
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subjectValue = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(subjectValue || `Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message
      ].join("\n")
    );

    const button = contactForm.querySelector('button[type="submit"]');
    button.textContent = "Opening Mail App...";
    button.style.background = "#159f73";
    button.disabled = true;
    formStatus.textContent = "Your message is ready. Sending will open in your email app.";
    formStatus.className = "form-status success";

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      button.textContent = "Send Message";
      button.style.background = "";
      button.disabled = false;
      contactForm.reset();
      requiredFields.forEach((field) => field.classList.remove("invalid"));
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }, 3000);
  });
}

/* ===========================
   ACTIVE NAV LINK
=========================== */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("[data-section-link]");

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { threshold: 0.48, rootMargin: "-10% 0px -45% 0px" }
);

sections.forEach((section) => activeObserver.observe(section));

/* ===========================
   FOOTER YEAR
=========================== */
const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
