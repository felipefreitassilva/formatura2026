const scrollIndicator = document.getElementById("scrollIndicator");
const countdownSection = document.getElementById("countdown-section");

if (scrollIndicator && countdownSection) {
  scrollIndicator.addEventListener("click", () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    countdownSection.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });
}

const targetDate = new Date(
  "2026-08-14T21:00:00"
);

const previousCountdownValues = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null
};

function pulseBox(id) {
  const box = document.getElementById(id).closest(".time-box");

  if (!box) {
    return;
  }

  box.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.04)" },
      { transform: "scale(1)" }
    ],
    { duration: 350 }
  );
}

function setCountdownValue(id, value) {
  const el = document.getElementById(id);

  if (el.textContent !== value) {
    el.textContent = value;

    if (previousCountdownValues[id] !== null) {
      pulseBox(id);
    }

    previousCountdownValues[id] = value;
  }
}

function updateCountdown() {
  const now = new Date();

  const diff = targetDate - now;

  if (diff <= 0) {

    setCountdownValue("days", "0");
    setCountdownValue("hours", "0");
    setCountdownValue("minutes", "0");
    setCountdownValue("seconds", "0");

    return;
  }

  const seconds = Math.floor(diff / 1000);

  const days = Math.floor(seconds / 86400);

  const hours = Math.floor((seconds % 86400) / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const secs = seconds % 60;

  setCountdownValue("days", String(days));

  setCountdownValue("hours", String(hours).padStart(2, "0"));

  setCountdownValue("minutes", String(minutes).padStart(2, "0"));

  setCountdownValue("seconds", String(secs).padStart(2, "0"));
}

updateCountdown();

setInterval(
  updateCountdown,
  1000
);

// Images shown here are used only if assets/assets.json can't be loaded
// (e.g. previewing index.html locally without running the deploy workflow).
// In production, the GitHub Actions workflow generates assets/assets.json
// by scanning the assets/ folder, so adding/removing a photo there is
// enough — no HTML/JS changes needed.
const FALLBACK_IMAGES = [
  "assets/01_Todos.jpg",
  "assets/02_CarolPaola.jpeg",
  "assets/03_MateusFelipe.jpg",
  "assets/04_CarolMateus.jpg"
];

const sliderEl = document.getElementById("slider");
const dotsEl = document.getElementById("dots");

let slides = [];
let dots = [];
let current = 0;
let interval = null;

function showSlide(index) {
  if (!slides.length) {
    return;
  }

  slides.forEach((s, i) => {
    s.classList.toggle("active", i === index);
  });

  dots.forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });

  current = index;
}

function nextSlide() {
  if (!slides.length) {
    return;
  }

  showSlide((current + 1) % slides.length);
}

function startSlideshow() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 4500);
}

async function loadSliderImages() {
  let images = FALLBACK_IMAGES;

  try {
    const res = await fetch("assets/assets.json");

    if (res.ok) {
      const list = await res.json();

      if (Array.isArray(list) && list.length) {
        images = list;
      }
    }
  } catch (err) {
    console.warn(
      "Could not load assets/assets.json, using fallback image list.",
      err
    );
  }

  sliderEl.innerHTML = "";
  dotsEl.innerHTML = "";

  images.forEach((src, i) => {
    const slide = document.createElement("div");

    slide.className = "slide" + (i === 0 ? " active" : "");
    slide.style.backgroundImage = `url('./${src}')`;

    sliderEl.appendChild(slide);

    const dot = document.createElement("div");

    dot.className = "dot" + (i === 0 ? " active" : "");

    dotsEl.appendChild(dot);
  });

  slides = [...sliderEl.querySelectorAll(".slide")];
  dots = [...dotsEl.querySelectorAll(".dot")];
  current = 0;

  dots.forEach((dot, i) => {
    dot.onclick = () => {
      showSlide(i);
      startSlideshow();
    };
  });

  if (slides.length > 1) {
    startSlideshow();
  }
}

loadSliderImages();

let startX = 0;

sliderEl.addEventListener(
  "touchstart",
  e => {
    startX = e.touches[0].clientX;
  }
);

sliderEl.addEventListener(
  "touchend",
  e => {
    const endX = e.changedTouches[0].clientX;

    const delta = endX - startX;

    if (Math.abs(delta) < 40 || !slides.length) {
      return;
    }

    if (delta < 0) {
      showSlide(
        (current + 1) % slides.length
      );
    } else {
      showSlide(
        (current - 1 + slides.length) % slides.length
      );
    }

    startSlideshow();
  }
);


const canvas = document.getElementById("confetti");

const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener(
  "resize",
  resizeCanvas
);

const pieces = [];

for (let i = 0; i < 180; i++) {
  pieces.push({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,

    r: Math.random() * 6 + 3,

    vx: (Math.random() - .5) * 3,
    vy: Math.random() * 3 + 2,

    rot: Math.random() * 360,

    vr: (Math.random() - .5) * 10,

    shape: Math.random() > .5 ? "rect" : "circle"
  });
}

let confettiRunning = true;

function drawPiece(p) {
  ctx.save();

  ctx.translate(p.x, p.y);

  ctx.rotate(p.rot * Math.PI / 180);

  const palette = [
    "#184c89",
    "#d9b44a",
    "#ffffff",
    "#4e7cc3",
    "#efc75e"
  ];

  ctx.fillStyle = palette[
    Math.floor(
      (Math.abs(p.x + p.y)) % palette.length
    )
  ];

  if (p.shape === "rect") {
    ctx.fillRect(
      -p.r / 2,
      -p.r / 2,
      p.r,
      p.r * 1.6
    );
  } else {
    ctx.beginPath();

    ctx.arc(
      0,
      0,
      p.r / 2,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();
}

function animateConfetti() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  if (confettiRunning) {
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;

      p.rot += p.vr;

      drawPiece(p);
    }
  }

  requestAnimationFrame(animateConfetti);
}

animateConfetti();

setTimeout(() => {
  confettiRunning = false;
}, 2200);

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    pieces.forEach(p => {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * -100;

      p.vy = Math.random() * 5 + 3;
    });

    confettiRunning = true;

    setTimeout(() => {
      confettiRunning = false;
    }, 1800);
  });
});

function fadeInObserver() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              {
                opacity: 0,
                transform: "translateY(40px)",
              },
              {
                opacity: 1,
                transform: "translateY(0px)",
              }
            ],
            {
              duration: 700,
              fill: "forwards",
              easing: "ease-out",
            }
          );

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: .15
    }
  );

  document.querySelectorAll(
    ".section-title,.detail,.time-box"
  ).forEach(el => {
    el.style.opacity = 0;

    observer.observe(el);
  });
}

fadeInObserver();

function addFloatingBackground() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const wrapper = document.createElement("div");

  wrapper.style.position = "fixed";
  wrapper.style.inset = "0";
  wrapper.style.pointerEvents = "none";
  wrapper.style.overflow = "hidden";
  wrapper.style.zIndex = "-1";

  document.body.prepend(wrapper);

  const count = reduceMotion ? 8 : 25;

  for (let i = 0; i < count; i++) {
    const circle = document.createElement("div");

    const size = 6 + Math.random() * 16;

    circle.style.position = "absolute";
    circle.style.width = size + "px";
    circle.style.height = size + "px";
    circle.style.borderRadius = "0";

    circle.style.opacity = ".18";

    const palette = ["#4fd8f0", "#f4c430", "#6a4fd6"];

    circle.style.background =
      palette[Math.floor(Math.random() * palette.length)];

    circle.style.left = Math.random() * 100 + "vw";
    circle.style.top = Math.random() * 100 + "vh";

    if (!reduceMotion) {
      circle.animate(
        [
          {
            transform:
              "translateY(0px) translateX(0px)"
          },
          {
            transform:
              `translateY(${-80 - Math.random() * 120}px)
translateX(${Math.random() * 80 - 40}px)`
          }
        ],
        {
          duration: 8000 + Math.random() * 12000,
          iterations: Infinity,
          direction: "alternate",
          easing: "ease-in-out"
        }
      );
    }

    wrapper.appendChild(circle);
  }
}

addFloatingBackground();

document.querySelectorAll(
  ".name"
).forEach(card => {
  card.addEventListener(
    "mouseenter",
    () => {
      card.animate(
        [
          {
            transform: "translateY(0px)"
          },
          {
            transform: "translateY(-6px)"
          },
          {
            transform: "translateY(0px)"
          }
        ],
        {
          duration: 350
        }
      );
    }
  );

  card.addEventListener(
    "touchstart",
    () => {
      card.animate(
        [
          {
            transform: "scale(1)"
          },
          {
            transform: "scale(1.04)"
          },
          {
            transform: "scale(1)"
          }
        ],
        {
          duration: 250
        }
      );
    },
    {
      passive: true
    }
  );
});

const heroCard = document.querySelector(".hero-card");

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;

    heroCard.style.transform =
      `translateY(${y * 0.08}px)`;

    heroCard.style.opacity =
      Math.max(
        1 - y / 700,
        0
      );
  });

const revealElements = [
  ...document.querySelectorAll(
    ".detail,.slider,.section-title,.time-box"
  )
];

revealElements.forEach(el => {
  el.style.transition = "transform .7s ease, opacity .7s ease";
});

function revealOnScroll() {
  const trigger = window.innerHeight * 0.88;

  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();

    if (rect.top < trigger) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0px)";
    } else {
      el.style.opacity = ".01";
      el.style.transform = "translateY(40px)";
    }
  });
}

window.addEventListener(
  "scroll",
  revealOnScroll
);

window.addEventListener(
  "load",
  revealOnScroll
);

const title = document.querySelector("h1");

const originalTitle = title.textContent;

title.textContent = "";

let index = 0;

function typeTitle() {
  if (index > originalTitle.length) {
    return;
  }

  title.textContent = originalTitle.substring(0, index);

  index++;

  setTimeout(typeTitle, 90);

}

typeTitle();

const year = document.querySelector(".year");

year.animate(
  [
    {
      opacity: 0,
      transform:
        "translateY(20px)"
    },
    {
      opacity: 1,
      transform:
        "translateY(0)"
    }
  ],
  {
    delay: 900,
    duration: 700,
    fill: "forwards"
  }
);

function smoothPulse() {
  const buttons = [
    ...document.querySelectorAll(".btn")
  ];

  setInterval(() => {
    buttons.forEach(btn => {
      btn.animate(
        [
          {
            transform: "scale(1)"
          },
          {
            transform: "scale(1.02)"
          },
          {
            transform: "scale(1)"
          }
        ],
        {
          duration: 700,
          easing: "ease-in-out"
        }
      );
    });
  }, 7000);
}

smoothPulse();

const revealFrame = document.getElementById("revealFrame");

function setRevealPosition(clientX, clientY) {
  const rect = revealFrame.getBoundingClientRect();

  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;

  revealFrame.style.setProperty("--reveal-x", x + "%");
  revealFrame.style.setProperty("--reveal-y", y + "%");
}

if (revealFrame) {
  revealFrame.addEventListener("mouseenter", () => {
    revealFrame.classList.add("reveal-active");
  });

  revealFrame.addEventListener("mousemove", e => {
    setRevealPosition(e.clientX, e.clientY);
  });

  revealFrame.addEventListener("mouseleave", () => {
    revealFrame.classList.remove("reveal-active");
  });

  revealFrame.addEventListener(
    "touchstart",
    e => {
      revealFrame.classList.add("reveal-active");
      setRevealPosition(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );

  revealFrame.addEventListener(
    "touchmove",
    e => {
      setRevealPosition(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );

  revealFrame.addEventListener("touchend", () => {
    revealFrame.classList.remove("reveal-active");
  });

  revealFrame.addEventListener("click", () => {
    revealFrame.querySelectorAll(".reveal-img").forEach(img => {
      img.classList.toggle("reveal-fg");
      img.classList.toggle("reveal-bg");
    });
  });
}

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      clearInterval(interval);
    } else {
      startSlideshow();
    }
  }
);

const footer = document.querySelector("footer");

footer.animate(
  [
    {
      opacity: 0,
      transform: "translateY(30px)"
    },
    {
      opacity: 1,
      transform: "translateY(0px)"
    }
  ],
  {
    duration: 1000,
    delay: 1200,
    fill: "forwards"
  }
);

console.log(
  "%c🎓 Formatura 2026 🎉",
  "font-size:24px;font-weight:bold;color:#184c89;"
);

console.log(
  "%cEsperamos você!",
  "font-size:16px;color:#d9b44a;"
);

// These placeholders are replaced at deploy time by the GitHub Actions
// workflow (.github/workflows/deploy.yml), which pulls the real numbers
// from repository secrets. They are NOT committed to the repo.
const numbers = {
  carolina: "__CAROLINA_NUMBER__",
  felipe: "__FELIPE_NUMBER__",
  mateus: "__MATEUS_NUMBER__",
  paola: "__PAOLA_NUMBER__"
};

const names = {
  carolina: "Carolina",
  felipe: "Felipe",
  mateus: "Mateus",
  paola: "Paola"
};

document.querySelectorAll(".rsvp-area").forEach(area => {
  const rsvpButton = area.querySelector(".rsvp-toggle");
  const rsvpOptions = area.querySelector(".rsvp-options");
  const rsvpTitle = area.querySelector(".rsvp-title");

  if (!rsvpButton || !rsvpOptions) {
    return;
  }

  rsvpButton.addEventListener(
    "click",
    () => {
      rsvpButton.style.display = "none";

      if (rsvpTitle) {
        rsvpTitle.classList.add("open");
      }

      rsvpOptions.classList.add("open");
    }
  );
});

document.querySelectorAll(".rsvp-option")
  .forEach(button => {
    button.addEventListener(
      "click",
      () => {
        const person = button.dataset.person;

        const msg =
          `Olá, ${names[person]}!

Estou confirmando minha presença na formatura do dia 14 de agosto de 2026 às 21h30.

Nos vemos lá!`;

        window.open("https://wa.me/"
          + numbers[person]
          + "?text="
          + encodeURIComponent(msg),
          "_blank",
          "noopener,noreferrer");
      }
    );
  });

const toast = document.getElementById("toast");

let toastTimeout = null;

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

document.querySelectorAll("[data-copy]").forEach(el => {
  el.addEventListener("click", async () => {
    const value = el.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      const textarea = document.createElement("textarea");

      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
      } catch (fallbackErr) {
        console.warn("Copy failed:", fallbackErr);
      }

      document.body.removeChild(textarea);
    }

    showToast("🔑 Chave PIX copiada!");
  });
});
