/* =========================================================
   HYPHEN CODE - main.js
   1. Starfield canvases (hero + contact) with mouse parallax
   2. Rotating word carousel in the hero
   3. Scroll-reveal via IntersectionObserver
   4. 3D tilt on cards
   5. Magnetic buttons
   6. Navbar state + mobile menu
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
  const words = [...box.children];
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

  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  document.getElementById("year").textContent = new Date().getFullYear();
})();
