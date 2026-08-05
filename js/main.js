/* =========================================================
   HYPHEN CODE - main.js
   1. Starfield canvases (hero + contact) with mouse parallax
   2. Rotating word carousel in the hero
   3. Scroll-reveal via IntersectionObserver
   4. 3D tilt on cards
   5. Magnetic buttons
   6. Navbar state + mobile menu
   7. Preloader
   8. Custom cursor
   9. Stat count-up
  10. Contact form
  11. Hero watermark parallax
   ========================================================= */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------------------------------------------------------
   1. STARFIELD
   Layered stars drifting slowly; nearby stars connect with
   faint lines around the cursor (constellation effect).
   --------------------------------------------------------- */
function starfield(canvasId, density = 9000, connect = true) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w, h, stars, mouse = { x: -9999, y: -9999 };

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const count = Math.floor((w * h) / density);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,          // depth: size + speed + parallax
      tw: Math.random() * Math.PI * 2,        // twinkle phase
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
    }));
  }

  canvas.parentElement.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    t += 0.016;

    for (const s of stars) {
      if (!prefersReducedMotion) {
        s.x += s.vx * s.z; s.y += s.vy * s.z;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
      }

      // parallax shift toward cursor
      const px = mouse.x > 0 ? (mouse.x - w / 2) * 0.01 * s.z : 0;
      const py = mouse.y > 0 ? (mouse.y - h / 2) * 0.01 * s.z : 0;

      const twinkle = prefersReducedMotion
        ? 0.7
        : 0.55 + 0.45 * Math.sin(t * 1.5 + s.tw);

      ctx.beginPath();
      ctx.arc(s.x + px, s.y + py, s.z * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237, 237, 237, ${0.25 + 0.55 * twinkle * s.z})`;
      ctx.fill();
    }

    // constellation lines near the cursor
    if (connect && mouse.x > 0) {
      const R = 130;
      for (const s of stars) {
        const dx = s.x - mouse.x, dy = s.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < R) {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = `rgba(154, 154, 154, ${(1 - d / R) * 0.22})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  frame();
}

starfield("stars", 8000, true);   // hero - denser, interactive
starfield("stars2", 14000, false); // contact - sparser, ambient

/* ---------------------------------------------------------
   2. ROTATING WORD CAROUSEL
   --------------------------------------------------------- */
(function rotator() {
  const box = document.getElementById("rotator");
  if (!box || prefersReducedMotion) return;
  const words = [...box.querySelectorAll(".hero__word")];  // skips the sizer
  if (!words.length) return;
  let i = 0;

  setInterval(() => {
    const current = words[i];
    i = (i + 1) % words.length;
    const next = words[i];

    current.classList.remove("is-active");
    current.classList.add("is-leaving");
    next.classList.add("is-active");

    setTimeout(() => current.classList.remove("is-leaving"), 600);
  }, 2600);
})();

/* ---------------------------------------------------------
   3. SCROLL REVEAL
   --------------------------------------------------------- */
(function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
})();

/* ---------------------------------------------------------
   4. 3D TILT ON CARDS
   --------------------------------------------------------- */
(function tilt() {
  if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ---------------------------------------------------------
   5. MAGNETIC BUTTONS
   --------------------------------------------------------- */
(function magnet() {
  if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll("[data-magnet]").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
})();

/* ---------------------------------------------------------
   6. NAVBAR + MOBILE MENU + FOOTER YEAR
   --------------------------------------------------------- */
(function nav() {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });

  function setMenu(open) {
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );

  // Escape closes the menu and hands focus back to the control that opened it
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("open")) {
      setMenu(false);
      burger.focus();
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

/* ---------------------------------------------------------
   7. PRELOADER
   Opens on `load`, but always opens - a slow or failed asset
   must never leave the page sitting behind the shutters.
   --------------------------------------------------------- */
(function preloader() {
  const el = document.getElementById("preloader");
  if (!el) return;
  if (prefersReducedMotion) { el.remove(); return; }

  const MIN_VISIBLE = 550;   // let the hyphen finish drawing
  const HARD_LIMIT = 1800;   // ...but never hold the page longer than this
  const start = performance.now();
  let done = false;

  function finish() {
    if (done) return;
    done = true;
    el.classList.add("is-done");
    setTimeout(() => el.classList.add("is-hidden"), 700);
  }

  window.addEventListener("load", () => {
    setTimeout(finish, Math.max(0, MIN_VISIBLE - (performance.now() - start)));
  });
  setTimeout(finish, HARD_LIMIT);
})();

/* ---------------------------------------------------------
   8. CUSTOM CURSOR
   Dot tracks the pointer exactly; ring lags behind and swells
   over anything interactive.
   --------------------------------------------------------- */
(function cursor() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  document.body.classList.add("has-cursor");

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });

  (function follow() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx.toFixed(2)}px, ${ry.toFixed(2)}px)`;
    requestAnimationFrame(follow);
  })();

  const HOVERABLE = "a, button, [data-tilt], .stack__list li, .work__tags li";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(HOVERABLE)) ring.classList.add("is-hover");
  });
  document.addEventListener("pointerout", (e) => {
    const to = e.relatedTarget;
    if (e.target.closest(HOVERABLE) && !(to && to.closest && to.closest(HOVERABLE))) {
      ring.classList.remove("is-hover");
    }
  });

  // hide when the pointer leaves the window entirely
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0"; ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = ""; ring.style.opacity = "";
  });
})();

/* ---------------------------------------------------------
   9. STAT COUNT-UP
   --------------------------------------------------------- */
(function counters() {
  const nums = document.querySelectorAll(".stat__num");
  if (!nums.length) return;

  function run(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const DUR = 1400;
    let t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      const p = Math.min(1, (ts - t0) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);       // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window)) {
    nums.forEach(run);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  nums.forEach((n) => io.observe(n));
})();

/* ---------------------------------------------------------
   10. CONTACT FORM
   Posts via fetch so the visitor stays on the page. Without
   JS the form still submits natively to the same endpoint.
   --------------------------------------------------------- */
(function contactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  const MAILTO = "contact@hyphencode.com";

  form.addEventListener("submit", async (e) => {
    // endpoint not set up yet - don't fire a request that 404s
    if (form.action.includes("REPLACE_WITH_YOUR_FORM_ID")) {
      e.preventDefault();
      status.textContent =
        `Form isn't connected yet - please email ${MAILTO} directly.`;
      status.className = "cform__status mono is-error";
      return;
    }

    e.preventDefault();
    if (!form.reportValidity()) return;

    form.classList.add("is-sending");
    status.textContent = "Sending...";
    status.className = "cform__status mono";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = "Thanks - we'll come back to you within 24 hours.";
      status.className = "cform__status mono is-ok";
    } catch (err) {
      status.textContent =
        `Something went wrong. Please email ${MAILTO} instead.`;
      status.className = "cform__status mono is-error";
    } finally {
      form.classList.remove("is-sending");
    }
  });
})();

/* ---------------------------------------------------------
   11. HERO WATERMARK PARALLAX
   Drifts against the starfield: stars shift toward the
   cursor, the mark shifts away from it.
   --------------------------------------------------------- */
(function watermark() {
  const el = document.getElementById("heroWatermark");
  const hero = document.querySelector(".hero");
  if (!el || !hero || prefersReducedMotion) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, scroll = 0;

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    tx = -((e.clientX - r.left) / r.width - 0.5) * 46;
    ty = -((e.clientY - r.top) / r.height - 0.5) * 46;
  }, { passive: true });

  hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; });

  window.addEventListener("scroll", () => {
    scroll = window.scrollY * 0.12;
  }, { passive: true });

  (function drift() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    el.style.transform =
      `translate(calc(-50% + ${cx.toFixed(1)}px), calc(-50% + ${(cy + scroll).toFixed(1)}px))`;
    requestAnimationFrame(drift);
  })();
})();
