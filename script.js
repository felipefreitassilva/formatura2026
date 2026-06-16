const targetDate = new Date(
  "2026-08-14T21:30:00"
);

function updateCountdown() {
  const now = new Date();

  const diff = targetDate - now;

  if (diff <= 0) {

    document.getElementById("days").textContent = "0";
    document.getElementById("hours").textContent = "0";
    document.getElementById("minutes").textContent = "0";
    document.getElementById("seconds").textContent = "0";

    return;
  }

  const seconds = Math.floor(diff / 1000);

  const days = Math.floor(seconds / 86400);

  const hours = Math.floor((seconds % 86400) / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const secs = seconds % 60;

  document.getElementById("days").textContent = days;

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(secs).padStart(2, "0");
}

updateCountdown();

setInterval(
  updateCountdown,
  1000
);

const slides = [
  ...document.querySelectorAll(".slide")
];

const dots = [
  ...document.querySelectorAll(".dot")
];

let current = 0;

function showSlide(index) {
  slides.forEach((s, i) => {
    s.classList.toggle(
      "active",
      i === index
    );
  });

  dots.forEach((d, i) => {
    d.classList.toggle(
      "active",
      i === index
    );
  });

  current = index;
}

function nextSlide() {
  showSlide((current + 1) % slides.length);
}

let interval = setInterval(nextSlide, 4500);

dots.forEach((dot, i) => {
  dot.onclick = () => {
    clearInterval(interval);

    showSlide(i);

    interval = setInterval(nextSlide, 4500);
  };
});

let startX = 0;

const slider = document.getElementById("slider");

slider.addEventListener(
  "touchstart",
  e => {
    startX = e.touches[0].clientX;
  }
);

slider.addEventListener(
  "touchend",
  e => {
    const endX = e.changedTouches[0].clientX;

    const delta = endX - startX;

    if (Math.abs(delta) < 40) {
      return;
    }

    clearInterval(interval);

    if (delta < 0) {
      showSlide(
        (current + 1) % slides.length
      );
    } else {
      showSlide(
        (current - 1 + slides.length) % slides.length
      );
    }

    interval = setInterval(nextSlide, 4500);
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

function createSparkle(x, y) {
  const sparkle = document.createElement("div");

  sparkle.style.position = "fixed";

  sparkle.style.left = x + "px";

  sparkle.style.top = y + "px";

  sparkle.style.width = "8px";

  sparkle.style.height = "8px";

  sparkle.style.borderRadius = "50%";

  sparkle.style.pointerEvents = "none";

  sparkle.style.background = "#d9b44a";

  sparkle.style.boxShadow = "0 0 12px #d9b44a";

  sparkle.style.zIndex = "9999";

  document.body.appendChild(sparkle);

  sparkle.animate(
    [
      {
        transform: "scale(0)",
        opacity: 1
      },
      {
        transform: "scale(2)",
        opacity: 0
      }
    ],
    {
      duration: 700,
      easing: "ease-out"
    }
  ).onfinish = () => {
    sparkle.remove();
  };
}

window.addEventListener(
  "pointerdown",
  e => {
    createSparkle(e.clientX, e.clientY);
  }
);

function addFloatingBackground() {
  const wrapper = document.createElement("div");

  wrapper.style.position = "fixed";
  wrapper.style.inset = "0";
  wrapper.style.pointerEvents = "none";
  wrapper.style.overflow = "hidden";
  wrapper.style.zIndex = "-1";

  document.body.prepend(wrapper);

  for (let i = 0; i < 25; i++) {
    const circle = document.createElement("div");

    const size = 40 + Math.random() * 180;

    circle.style.position = "absolute";
    circle.style.width = size + "px";
    circle.style.height = size + "px";
    circle.style.borderRadius = "50%";

    circle.style.opacity = ".05";

    circle.style.background = Math.random() > .5
      ? "#184c89"
      : "#d9b44a";

    circle.style.left = Math.random() * 100 + "vw";

    circle.style.top = Math.random() * 100 + "vh";

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

    wrapper.appendChild(circle);
  }
}

addFloatingBackground();

function highlightCountdown() {
  const boxes = [
    ...document.querySelectorAll(
      ".time-box"
    )
  ];

  setInterval(() => {
    boxes.forEach(box => {
      box.animate(
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
          duration: 350
        }
      );
    });
  }, 1000);
}

highlightCountdown();

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

document.querySelectorAll(
  ".btn"
).forEach(btn => {
  btn.addEventListener(
    "pointerdown",
    () => {
      btn.animate(
        [
          {
            transform: "scale(1)"
          },
          {
            transform: "scale(.95)"
          },
          {
            transform: "scale(1)"
          }
        ],
        {
          duration: 180
        }
      );
    });
});

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

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      clearInterval(interval);
    } else {
      clearInterval(interval);
      interval = setInterval(nextSlide, 4500);
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

const numbers = {
  carolina: "5551997536161",
  felipe: "5551981968251",
  mateus: "5551984564510",
  paola: "5551991149626"
};

const names = {
  carolina: "Carolina",
  felipe: "Felipe",
  mateus: "Mateus",
  paola: "Paola"
};

const rsvpButton = document.getElementById("rsvpButton");

const rsvpOptions = document.getElementById("rsvpOptions");

if (rsvpButton && rsvpOptions) {
  rsvpButton.addEventListener(
    "click",
    () => {
      rsvpButton.style.display = "none";
      rsvpOptions.classList.add("open");
    }
  );
}

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
          "_blank");
      }
    );
  });
