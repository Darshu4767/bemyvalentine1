/* Typing Animation */
const text = "Will you be my Valentine?";
let index = 0;
const typingEl = document.getElementById("typingText");

function typeText() {
  if (index < text.length) {
    typingEl.textContent += text.charAt(index);
    index++;
    setTimeout(typeText, 80);
  }
}
typeText();

/* Yes Button Growing */
const yesBtn = document.getElementById("yesBtn");
let scale = 1;

yesBtn.addEventListener("click", () => {
  scale += 0.15;
  yesBtn.style.transform = `scale(${scale})`;

  if (scale > 1.8) {
    document.querySelector(".container").innerHTML = `
      <h1>YAYYYY!! 💘🥹</h1>
      <p>You just made me the happiest person ever ❤️</p>
    `;
  }
});

/* No Button Dodge */
const noBtn = document.getElementById("noBtn");

noBtn.addEventListener("mouseenter", moveNoBtn);
noBtn.addEventListener("click", moveNoBtn);

function moveNoBtn() {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * 200 - 100;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

/* Floating Hearts */
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 4 + "s";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

setInterval(createHeart, 350);