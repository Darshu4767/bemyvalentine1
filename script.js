/* Quiz + Valentine script with party popper/confetti on Yes */

// --- Quiz data (edit questions / options / answer index here) ---
const questions = [
  { q: "What day is Valentine's Day?", options: ["Jan 14", "Feb 14", "Mar 14", "Apr 14"], answer: 1 },
  { q: "Which flower is most associated with love?", options: ["Sunflower", "Daisy", "Rose", "Tulip"], answer: 2 },
  { q: "A common Valentine symbol is:", options: ["Star", "Heart", "Moon", "Lightning"], answer: 1 },
  { q: "Which color is most associated with romance?", options: ["Blue", "Green", "Red", "Yellow"], answer: 2 },
  { q: "Which one is a romantic gesture?", options: ["Sending a love note", "Ignoring", "Shouting", "Leaving"], answer: 0 }
];
// ----------------------------------------------------------------

let currentQuestion = 0;

const quizContainer = document.getElementById("quizContainer");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");

function showQuestion() {
  feedbackEl.textContent = "";
  const q = questions[currentQuestion];
  questionText.textContent = q.q;
  optionsDiv.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.textContent = opt;
    btn.dataset.index = i;
    btn.addEventListener("click", onOptionClick);
    optionsDiv.appendChild(btn);
  });
  progressEl.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
}

function onOptionClick(e) {
  const btn = e.currentTarget;
  const selected = Number(btn.dataset.index);
  const correct = questions[currentQuestion].answer;
  if (selected === correct) {
    // success feedback & popup emoji
    btn.classList.add("correct");
    showPopupEmoji(btn);
    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        // quiz finished -> show valentine
        startValentine();
      }
    }, 450);
  } else {
    // wrong answer feedback
    feedbackEl.textContent = "Oops — that's not right. Try again!";
    // brief shake effect
    quizContainer.classList.remove("shake");
    void quizContainer.offsetWidth;
    quizContainer.classList.add("shake");
  }
}

// Start the quiz initially
showQuestion();

/* ----------------------
   Valentine behavior (moved from original script)
   ---------------------- */

const valContainer = document.getElementById("valentineContainer");

// Typing animation (will run when valentine is revealed)
const text = "Will you be my Valentine?";
let index = 0;
let typingTimeoutId;

function startTyping() {
  const typingEl = document.getElementById("typingText");
  typingEl.textContent = "";
  index = 0;
  function typeText() {
    if (index < text.length) {
      typingEl.textContent += text.charAt(index);
      index++;
      typingTimeoutId = setTimeout(typeText, 80);
    }
  }
  typeText();
}

/* Yes button growing + party popper */
let yesBtn, noBtn, scale = 1;

function attachValentineInteractions() {
  yesBtn = document.getElementById("yesBtn");
  noBtn = document.getElementById("noBtn");

  // remove old listeners by cloning node
  yesBtn.replaceWith(yesBtn.cloneNode(true));
  yesBtn = document.getElementById("yesBtn");

  yesBtn.addEventListener("click", (ev) => {
    // scale effect (gentle)
    scale += 0.15;
    yesBtn.style.transform = `scale(${scale})`;
    yesBtn.style.transition = "transform 220ms ease";

    // trigger a celebratory burst at the button position
    const rect = yesBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 + window.scrollX;
    const cy = rect.top + rect.height / 2 + window.scrollY;

    // burst confetti + hearts
    burstConfetti(cx, cy, 60);
    burstHearts(cx, cy, 18);

    // if large enough, show final message
    if (scale > 1.8) {
      // a larger party burst before final message
      burstConfetti(cx, cy, 140);
      burstHearts(cx, cy, 60);
      setTimeout(() => {
        document.querySelector(".container").innerHTML = `
          <h1>YAYYYY!! 💘🥹</h1>
          <p>You just made me the happiest person ever ❤️</p>
        `;
      }, 900);
    }
  });

  // No button dodge
  noBtn.addEventListener("mouseenter", moveNoBtn);
  noBtn.addEventListener("click", moveNoBtn);
}

function moveNoBtn() {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * 200 - 100;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

/* Floating Hearts (gentle ambient hearts) - original behavior preserved */
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 4 + "s";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 6000);
}
let heartsIntervalId;

/* Reveal the valentine container and start its behaviors */
function startValentine() {
  // hide quiz, show valentine
  quizContainer.style.display = "none";
  valContainer.style.display = "";

  // start typing and interactions
  startTyping();
  attachValentineInteractions();

  // start ambient hearts if not running
  if (!heartsIntervalId) {
    heartsIntervalId = setInterval(createHeart, 350);
  }
}

/* ----------------------
   Emoji popup on correct answer
   ---------------------- */

const emojiChoices = ["💖", "😘", "❤️", "💋", "🥰"];

function showPopupEmoji(buttonEl) {
  // pick a random emoji
  const emoji = emojiChoices[Math.floor(Math.random() * emojiChoices.length)];

  const rect = buttonEl.getBoundingClientRect();
  const pop = document.createElement("div");
  pop.className = "emoji-pop";
  pop.textContent = emoji;
  document.body.appendChild(pop);

  // position above the button's center
  const left = rect.left + rect.width / 2 + window.scrollX;
  const top = rect.top + window.scrollY - 8;
  pop.style.left = left + "px";
  pop.style.top = top + "px";

  // remove after animation
  pop.addEventListener("animationend", () => {
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
  });

  // safety remove in case animationend didn't fire
  setTimeout(() => {
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
  }, 900);
}

/* ----------------------
   Party popper: confetti + heart bursts
   ---------------------- */

const CONFETTI_COLORS = ["#ff4d6d","#ff758c","#ffd166","#ffb3c6","#ff9fb1","#fff3f5"];

function burstConfetti(cx, cy, count = 40) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    // random size and color
    const w = Math.floor(Math.random() * 8) + 6;
    el.style.width = w + "px";
    el.style.height = (Math.random() > 0.5 ? w * 0.6 : w) + "px";
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    // random trajectory
    const tx = (Math.random() - 0.5) * (window.innerWidth * 0.6);
    const ty = - (Math.random() * (window.innerHeight * 0.6) + 80);
    const rot = Math.floor(Math.random() * 360) + "deg";
    const dur = (Math.random() * 0.9 + 0.9).toFixed(2) + "s";
    el.style.left = cx + "px";
    el.style.top = cy + "px";
    el.style.setProperty("--tx", tx + "px");
    el.style.setProperty("--ty", ty + "px");
    el.style.setProperty("--r", rot);
    el.style.setProperty("--dur", dur);
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
    // slight stagger
    el.style.animationDelay = (Math.random() * 120) + "ms";
  }
}

function burstHearts(cx, cy, count = 12) {
  const HEARTS = ["❤️","💖","💘","💋","🥰"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "pop-heart";
    el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    const tx = (Math.random() - 0.5) * (window.innerWidth * 0.5);
    const ty = - (Math.random() * (window.innerHeight * 0.6) + 120);
    const dur = (Math.random() * 0.9 + 0.9).toFixed(2) + "s";
    el.style.left = cx + "px";
    el.style.top = cy + "px";
    el.style.setProperty("--tx", tx + "px");
    el.style.setProperty("--ty", ty + "px");
    el.style.setProperty("--dur", dur);
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
    el.style.animationDelay = (Math.random() * 100) + "ms";
  }
}