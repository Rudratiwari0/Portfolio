const themeToggle = document.getElementById("themeToggle");
const storedTheme = localStorage.getItem("portfolio-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

const applyTheme = (theme) => {
  const isLight = theme === "light";

  document.body.classList.toggle("light-mode", isLight);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    themeToggle.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
  }
};

const resolveInitialTheme = () => {
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return prefersLight.matches ? "light" : "dark";
};

applyTheme(resolveInitialTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
    localStorage.setItem("portfolio-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

if (typeof prefersLight.addEventListener === "function") {
  prefersLight.addEventListener("change", (event) => {
    if (!localStorage.getItem("portfolio-theme")) {
      applyTheme(event.matches ? "light" : "dark");
    }
  });
}

const navbar = document.getElementById("navbar");

const updateNavbarState = () => {
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  }
};

updateNavbarState();
window.addEventListener("scroll", updateNavbarState, { passive: true });

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
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    setMenuState(false);
  }
});

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
          delay = index * 75;
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

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const downloadForm = document.getElementById("downloadForm");
const videoLinkInput = document.getElementById("videoLink");
const downloadButton = document.getElementById("downloadButton");
const downloadStatus = document.getElementById("downloadStatus");

if (downloadForm && videoLinkInput && downloadButton && downloadStatus) {
  const setDownloadMessage = (message, type = "") => {
    downloadStatus.textContent = message;
    downloadStatus.className = `download-status${type ? ` ${type}` : ""}`;
  };

  videoLinkInput.addEventListener("input", () => {
    videoLinkInput.classList.remove("invalid");

    if (downloadStatus.classList.contains("error")) {
      setDownloadMessage("");
    }
  });

  downloadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const linkValue = videoLinkInput.value.trim();

    if (!linkValue) {
      videoLinkInput.classList.add("invalid");
      setDownloadMessage("Please paste a video link before continuing.", "error");
      videoLinkInput.focus();
      return;
    }

    downloadButton.disabled = true;
    downloadButton.textContent = "Fetching video…";
    setDownloadMessage("Fetching video…", "success");

    // Preserve deployability on static hosting. Replace this timeout with your real API call when ready.
    window.setTimeout(() => {
      downloadButton.disabled = false;
      downloadButton.textContent = "Fetch Video";
      setDownloadMessage("Video details are ready. Connect your processing endpoint here to continue the download flow.", "success");
    }, 1600);
  });
}

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
  { threshold: 0.45, rootMargin: "-10% 0px -48% 0px" }
);

sections.forEach((section) => activeObserver.observe(section));

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
