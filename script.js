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
      
      // Mobile Products Dropdown Debugging
      console.log(`[Products Dropdown] State: ${isOpen ? "OPEN" : "CLOSED"}`);
      const menu = dropdown.querySelector(".dropdown-menu");
      if (menu) {
        const items = menu.querySelectorAll("a");
        console.log(`[Products Dropdown] Found ${items.length} submenu items in DOM.`);
        if (items.length === 0) {
          console.warn("[Products Dropdown] WARNING: Submenu items are missing from DOM!");
        } else {
          console.log(`[Products Dropdown] First item: ${items[0].textContent.trim()} (${items[0].href})`);
        }
      } else {
        console.error("[Products Dropdown] ERROR: .dropdown-menu container not found!");
      }
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

  function closeMobileMenu() {
    if (navPanel) {
      navPanel.classList.remove("is-open", "active", "open");
      navToggle?.classList.remove("is-open", "active", "open");
      document.body.classList.remove("nav-open", "menu-open");
      navToggle?.setAttribute("aria-expanded", "false");
      
      // Close dropdowns when mobile menu closes
      document.querySelectorAll(".dropdown.open").forEach((dropdown) => {
        dropdown.classList.remove("open");
        dropdown.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
      });
    }
  }

  function openMobileMenu() {
    if (navPanel) {
      navPanel.classList.add("is-open", "open");
      navToggle?.classList.add("is-open", "open");
      document.body.classList.add("nav-open", "menu-open");
      navToggle?.setAttribute("aria-expanded", "true");
    }
  }

  navToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen =
      navPanel.classList.contains("is-open") ||
      navPanel.classList.contains("active") ||
      navPanel.classList.contains("open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  navPanel?.addEventListener("click", (e) => {
    // Prevent closing if tapping the Products dropdown toggle itself
    if (e.target.closest("[data-dropdown-toggle]")) return;
    
    // Close menu when tapping any regular link
    if (e.target.closest("a")) {
      closeMobileMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    const isOpen =
      navPanel?.classList.contains("is-open") ||
      navPanel?.classList.contains("open");
      
    if (isOpen && navPanel && !navPanel.contains(e.target) && navToggle && !navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    const isOpen =
      navPanel?.classList.contains("is-open") ||
      navPanel?.classList.contains("open");
      
    if (e.key === "Escape" && isOpen) {
      closeMobileMenu();
      navToggle?.focus();
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
