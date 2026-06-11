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
      const headerHeight = header.offsetHeight;
      const headerTop = parseInt(window.getComputedStyle(header).top, 10) || 0;
      const totalHeaderSpace = headerHeight + headerTop;
      root.style.setProperty('--header-height', totalHeaderSpace + 'px');
    }
  }

  // Call on DOMContentLoaded to set initial header height
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHeaderHeight);
  } else {
    updateHeaderHeight();
  }

  // Recalculate on window resize for responsive layout changes
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateHeaderHeight, 150);
  });

  // Recalculate when mobile menu opens/closes as it affects header size
  if (navToggle) {
    navToggle.addEventListener('click', () => {
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
     NAVIGATION MENU
     ======================================== */
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

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
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
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
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

    const subject = encodeURIComponent(`Cocopeat Export Inquiry from ${company || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nCountry: ${country}\nCompany: ${company}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    formStatus.textContent = "Opening your email app with the inquiry details.";
    window.location.href = `mailto:info@hbasglobaltrade.com?subject=${subject}&body=${body}`;
    contactForm.reset();
  });
})();
