const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const button = document.getElementById("celebrate");
const message = document.getElementById("message");
const buttonLabel = button.querySelector(".button-label");

let width = 0;
let height = 0;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  stars = Array.from({ length: Math.min(180, Math.floor(width / 7)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.4 + .25,
    alpha: Math.random() * .7 + .2,
    speed: Math.random() * .012 + .004
  }));
}

let stars = [];
resize();
window.addEventListener("resize", resize);

function burst(x, y, amount = 70) {
  const palette = ["#fff4c7", "#f6c875", "#aaa0ff", "#78dcf7", "#f18bba"];

  for (let i = 0; i < amount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 5.5 + 1.2;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      gravity: .055,
      life: 1,
      decay: Math.random() * .012 + .008,
      size: Math.random() * 2.6 + 1,
      color: palette[Math.floor(Math.random() * palette.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - .5) * .18,
      shape: Math.random() > .48 ? "confetti" : "dot"
    });
  }
}

function partyBurst() {
  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  burst(x, y, 150);

  for (let i = 0; i < 5; i++) {
    window.setTimeout(() => {
      burst(
        width * (.12 + Math.random() * .76),
        height * (.18 + Math.random() * .38),
        90
      );
    }, i * 130);
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  stars.forEach((star, index) => {
    star.alpha += Math.sin(Date.now() * star.speed + index) * .003;
    ctx.globalAlpha = Math.max(.08, Math.min(.8, star.alpha));
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  particles = particles.filter(particle => particle.life > 0);

  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.vx *= .992;
    particle.rotation += particle.rotationSpeed;
    particle.life -= particle.decay;

    ctx.globalAlpha = particle.life;
    ctx.fillStyle = particle.color;
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    if (particle.shape === "confetti") {
      ctx.fillRect(-particle.size * 1.8, -particle.size * .7, particle.size * 3.6, particle.size * 1.4);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}

animate();

window.setTimeout(() => burst(width * .18, height * .28, 90), 350);
window.setTimeout(() => burst(width * .82, height * .24, 90), 750);
window.setTimeout(() => burst(width * .50, height * .18, 110), 1150);

const text = "A new year. A fresh horizon. May 2027 be kind, bright, and unforgettable.";
let index = 0;

function typeMessage() {
  if (index <= text.length) {
    message.textContent = text.slice(0, index);
    index++;
    window.setTimeout(typeMessage, 38);
  }
}

window.setTimeout(typeMessage, 900);

let celebrationTimeout;

function celebrate() {
  window.clearTimeout(celebrationTimeout);
  button.classList.remove("is-celebrating");
  void button.offsetWidth;
  button.classList.add("is-celebrating");
  buttonLabel.textContent = "Celebrating!";
  partyBurst();

  celebrationTimeout = window.setTimeout(() => {
    button.classList.remove("is-celebrating");
    buttonLabel.textContent = "Celebrate again";
  }, 1000);
}

button.addEventListener("pointerdown", event => {
  event.preventDefault();
  celebrate();
});

button.addEventListener("click", event => {
  if (event.detail === 0) {
    celebrate();
  }
});

window.addEventListener("pointerdown", event => {
  if (event.target !== button && !button.contains(event.target)) {
    burst(event.clientX, event.clientY, 38);
  }
});
