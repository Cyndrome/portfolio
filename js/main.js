/* ============================================================
   Personal Portfolio — main.js
   All interactivity lives here. Sections are numbered and
   independent — delete or tweak any block safely.
   ============================================================ */

(() => {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1. THEME — dark / light toggle, saved in localStorage.
        Respects the visitor's OS preference on first visit.
     ---------------------------------------------------------- */
  const initTheme = () => {
    const saved = localStorage.getItem("theme");
    const osPrefersLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    const theme = saved || (osPrefersLight ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
  };

  const setupThemeToggle = () => {
    const btn = $("#themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
    });
  };

  /* ----------------------------------------------------------
     2. NAVBAR — scrolled state, mobile drawer, active link.
     ---------------------------------------------------------- */
  const setupNavbar = () => {
    const navbar = $("#navbar");
    const toggleBtn = $("#navToggle");
    const navLinks = $("#navLinks");

    const onScroll = () =>
      navbar.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile hamburger
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        toggleBtn.setAttribute("aria-expanded", String(open));
        toggleBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
      // Close the drawer after tapping a link
      navLinks.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          navLinks.classList.remove("open");
          toggleBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Highlight the section currently in view
    const links = $$(".nav-link");
    const sections = links
      .map((l) => $(l.getAttribute("href")))
      .filter(Boolean);

    const setActive = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      let current = sections[0];
      for (const sec of sections) {
        if (sec.offsetTop <= pos) current = sec;
      }
      links.forEach((l) =>
        l.classList.toggle(
          "active",
          current && l.getAttribute("href") === `#${current.id}`
        )
      );
    };
    setActive();
    window.addEventListener("scroll", setActive, { passive: true });
  };

  /* ----------------------------------------------------------
     3. SCROLL PROGRESS + BACK TO TOP
     ---------------------------------------------------------- */
  const setupScrollExtras = () => {
    const bar = $("#scrollProgress");
    const topBtn = $("#backToTop");

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      if (topBtn) topBtn.classList.toggle("visible", window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    topBtn?.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
    );
  };

  /* ----------------------------------------------------------
     4. TYPEWRITER — cycles through the phrases stored in
        data-roles on #typedText. Edit the phrases in index.html.
     ---------------------------------------------------------- */
  const setupTypewriter = () => {
    const el = $("#typedText");
    if (!el || prefersReducedMotion) return;

    let roles = [];
    try {
      roles = JSON.parse(el.dataset.roles || "[]");
    } catch {
      roles = [];
    }
    if (!roles.length) return;

    const TYPE_MS = 65;     // speed of typing
    const DELETE_MS = 35;   // speed of deleting
    const HOLD_MS = 2000;   // pause on a full phrase

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const phrase = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      el.textContent = phrase.slice(0, charIndex);

      let delay = deleting ? DELETE_MS : TYPE_MS;

      if (!deleting && charIndex === phrase.length) {
        delay = HOLD_MS;               // finished typing — pause
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;                   // brief pause before next phrase
      }
      setTimeout(tick, delay);
    };
    tick();
  };

  /* ----------------------------------------------------------
     5. PARTICLES — light dot-network background on a canvas.
        Keeps a modest particle count so it stays smooth.
     ---------------------------------------------------------- */
  const setupParticles = () => {
    const canvas = $("#particles");
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let raf = null;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const accentRGB = () => {
      const dark = document.documentElement.dataset.theme !== "light";
      return dark ? "148, 163, 196" : "90, 103, 132"; // muted tone per theme
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);
      const rgb = accentRGB();

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.55)`;
        ctx.fill();
      }

      // Faint connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${rgb}, ${0.14 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };

    resize();
    frame();
    window.addEventListener("resize", resize);

    // Save battery when the tab is hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        frame();
      }
    });
  };

  /* ----------------------------------------------------------
     6. SCROLL REVEAL — elements with .reveal fade/slide in.
        data-delay="150" adds a stagger (milliseconds).
     ---------------------------------------------------------- */
  const setupReveal = () => {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => {
      const delay = el.dataset.delay;
      if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
      io.observe(el);
    });
  };

  /* ----------------------------------------------------------
     7. STAT COUNTERS — count up when scrolled into view.
        Numbers come from data-count / data-suffix in the HTML.
     ---------------------------------------------------------- */
  const setupCounters = () => {
    const nums = $$(".stat-num");
    if (!nums.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.suffix || "";
      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.6 }
    );
    nums.forEach((el) => io.observe(el));
  };

  /* ----------------------------------------------------------
     8. PROJECT FILTERS
     ---------------------------------------------------------- */
  const setupFilters = () => {
    const grid = $("#projectsGrid");
    const buttons = $$(".filter-btn");
    if (!grid || !buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;

        $$(".project-card", grid).forEach((card) => {
          const show = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("hidden-card", !show);
        });
      });
    });
  };

  /* ----------------------------------------------------------
     9. CARD TILT — subtle 3D hover on project cards (pointer
        devices only; disabled for touch & reduced motion).
     ---------------------------------------------------------- */
  const setupTilt = () => {
    if (prefersReducedMotion || !window.matchMedia("(hover: hover)").matches)
      return;

    $$(".tilt").forEach((card) => {
      const MAX_DEG = 6;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * MAX_DEG}deg) rotateX(${-py * MAX_DEG}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  };

  /* ----------------------------------------------------------
     10. CONTACT FORM — client-side validation + submission.
         If the Formspree action still contains {{FORM_ID}}
         (not configured), it runs in DEMO MODE: it validates,
         simulates a send and shows a toast — no data leaves.
         Once you plug in a real Formspree ID it posts via
         fetch and shows success/error toasts.
     ---------------------------------------------------------- */
  const setupContactForm = () => {
    const form = $("#contactForm");
    if (!form) return;

    const showToast = (msg, isError = false) => {
      const toast = $("#toast");
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.toggle("toast-error", isError);
      toast.classList.add("show");
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => toast.classList.remove("show"), 4200);
    };

    const setError = (input, msg) => {
      const field = input.closest(".form-field");
      const errorEl = $(".error-msg", field);
      field.classList.toggle("invalid", Boolean(msg));
      if (errorEl) errorEl.textContent = msg || "";
    };

    const validators = {
      name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
      email: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
          ? ""
          : "Please enter a valid email address.",
      subject: (v) =>
        v.trim().length >= 3 ? "" : "Please add a short subject.",
      message: (v) =>
        v.trim().length >= 10
          ? ""
          : "Message should be at least 10 characters.",
    };

    const validateField = (input) => {
      const check = validators[input.name];
      if (!check) return true;
      const msg = check(input.value);
      setError(input, msg);
      return !msg;
    };

    // Validate as the user types/leaves fields
    $$("input, textarea", form).forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".form-field")?.classList.contains("invalid")) {
          validateField(input);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // handled with fetch below (Formspree AJAX)
      const inputs = $$("input, textarea", form);
      const allValid = inputs.map(validateField).every(Boolean);
      if (!allValid) {
        showToast("Please fix the highlighted fields.", true);
        return;
      }

      const btn = $("#submitBtn");
      const label = $(".btn-label", btn);
      const action = form.getAttribute("action") || "";
      const configured = !action.includes("{{FORM_ID}}");

      btn.disabled = true;
      label.textContent = "Sending…";

      if (!configured) {
        // DEMO MODE — no backend attached yet
        await new Promise((r) => setTimeout(r, 900));
        btn.disabled = false;
        label.textContent = "Send Message";
        form.reset();
        showToast(
          "Demo mode: message “sent” locally. Connect Formspree to receive real emails (see README)."
        );
        return;
      }

      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          showToast("Thanks! Your message has been sent. 🎉");
        } else {
          showToast("Something went wrong — please email me directly.", true);
        }
      } catch {
        showToast("Network error — please try again later.", true);
      } finally {
        btn.disabled = false;
        label.textContent = "Send Message";
      }
    });
  };

  /* ----------------------------------------------------------
     11. MISC — footer year, avatar initials auto-sizing.
     ---------------------------------------------------------- */
  const setupAvatar = () => {
    const text = $("#avatarText");
    if (!text) return;
    // Monospace glyphs are ~0.6em wide; fit up to 170px of the 200px box.
    const size = Math.min(64, Math.floor(170 / (0.6 * text.textContent.length)));
    text.setAttribute("font-size", String(size));
  };

  const setupMisc = () => {
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
    setupAvatar();
  };

  /* ---------- Boot ---------- */
  const init = () => {
    initTheme();
    setupThemeToggle();
    setupNavbar();
    setupScrollExtras();
    setupTypewriter();
    setupParticles();
    setupReveal();
    setupCounters();
    setupFilters();
    setupTilt();
    setupContactForm();
    setupMisc();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
