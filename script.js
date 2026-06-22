(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const header = document.querySelector("[data-header]");
  const savedTheme = localStorage.getItem("hbas-theme");

  /* ========================================
     DYNAMIC HEADER HEIGHT CALCULATION
     Prevents fixed header from overlapping content on all screen sizes.
     This function measures the header's actual height including its top offset
     and applies it as a CSS variable that adjusts hero section padding dynamically.
     ======================================== */
  function updateHeaderHeight() {
    if (header) {
      const totalHeaderSpace = Math.ceil(header.getBoundingClientRect().bottom);
      root.style.setProperty("--header-height", totalHeaderSpace + "px");
    }
  }

  // Call on DOMContentLoaded to set initial header height
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateHeaderHeight);
  } else {
    updateHeaderHeight();
  }

  window.addEventListener("load", updateHeaderHeight);

  if (header && "ResizeObserver" in window) {
    new ResizeObserver(updateHeaderHeight).observe(header);
  }

  // Recalculate when mobile menu opens/closes as it affects header size
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      setTimeout(updateHeaderHeight, 50);
    });
  }

  /* ========================================
     THEME TOGGLE
     ======================================== */
  if (savedTheme === "dark") {
    root.dataset.theme = "dark";
  }

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    if (nextTheme === "dark") {
      root.dataset.theme = "dark";
      localStorage.setItem("hbas-theme", "dark");
    } else {
      delete root.dataset.theme;
      localStorage.setItem("hbas-theme", "light");
    }
  });

  /* ========================================
     NAVIGATION MENU & DROPDOWN
     ======================================== */
  const dropdownToggles = document.querySelectorAll("[data-dropdown-toggle]");

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const dropdown = toggle.closest(".dropdown");
      const isOpen = dropdown.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const dropdown = toggle.closest(".dropdown");
        if (dropdown.classList.contains("open")) {
          dropdown.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown.open").forEach((dropdown) => {
        dropdown.classList.remove("open");
        dropdown
          .querySelector("[data-dropdown-toggle]")
          .setAttribute("aria-expanded", "false");
      });
    }
  });

  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.addEventListener("focusout", (e) => {
      setTimeout(() => {
        if (!dropdown.contains(document.activeElement)) {
          dropdown.classList.remove("open");
          const toggle = dropdown.querySelector("[data-dropdown-toggle]");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        }
      }, 10);
    });
  });

  navToggle?.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navPanel?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navPanel.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }
  });

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 24);
  });

  /* ========================================
     INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
     ======================================== */

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealItems.forEach((item) => revealObserver.observe(item));

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImg = document.querySelector("[data-lightbox-img]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");

  document.querySelectorAll("[data-full]").forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      lightboxImg.src = item.dataset.full;
      lightboxImg.alt = img?.alt || "Gallery preview";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
  };

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("open")) {
      closeLightbox();
    }
  });

  const contactForm = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const country = String(formData.get("country") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(
      `Global Export Inquiry from ${company || name}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nCountry: ${country}\nCompany: ${company}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    formStatus.innerHTML =
      "Opening WhatsApp... <br> <span class='text-muted' style='font-size:0.9em; margin-top:8px; display:inline-block;'>If WhatsApp doesn't open, <a href='mailto:info@hbasglobaltrade.com?subject=" +
      subject +
      "&body=" +
      body +
      "' style='text-decoration:underline;'>Click here to send via Email</a></span>";
    window.open(`https://wa.me/919892353517?text=${body}`, "_blank");
    contactForm.reset();
  });

  // Active Nav States
  const currentPath = window.location.pathname;
  const isHome =
    currentPath.endsWith("/") ||
    currentPath.endsWith("/index.html") ||
    currentPath === "";

  document
    .querySelectorAll(".nav-panel a, .dropdown-menu a")
    .forEach((link) => {
      const linkPath = new URL(link.href).pathname;

      if (
        isHome &&
        (linkPath.endsWith("/") ||
          linkPath.endsWith("/index.html") ||
          linkPath === "")
      ) {
        link.classList.add("active");
      } else if (!isHome && linkPath === currentPath) {
        link.classList.add("active");
        // If this is a dropdown item, also highlight the parent dropdown toggle
        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          const toggle = parentDropdown.querySelector(".dropdown-toggle");
          if (toggle) {
            toggle.classList.add("active");
          }
        }
      }
    });
})();
