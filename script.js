/* Combined Quiz + Valentine script
   - 5-question MCQ quiz (progress only on correct answers)
   - emoji popup on correct answer
   - reveal Valentine page after quiz completion
   - Yes: confetti + hearts + center popup image (fixed position overlays)
   - No: dodges on hover/click (doesn't act as a real "No")
*/

/* ---------------- Quiz data ---------------- */
const questions = [
  { q: "What day is Valentine's Day?", options: ["Jan 14", "Feb 14", "Mar 14", "Apr 14"], answer: 1 },
  { q: "Which flower is most associated with love?", options: ["Sunflower", "Daisy", "Rose", "Tulip"], answer: 2 },
  { q: "A common Valentine symbol is:", options: ["Star", "Heart", "Moon", "Lightning"], answer: 1 },
  { q: "Which color is most associated with romance?", options: ["Blue", "Green", "Red", "Yellow"], answer: 2 },
  { q: "Which one is a romantic gesture?", options: ["Sending a love note", "Ignoring", "Shouting", "Leaving"], answer: 0 }
];

let currentQuestion = 0;

/* DOM refs */
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
    btn.setAttribute("role", "listitem");
    btn.addEventListener("click", onOptionClick);
    optionsDiv.appendChild(btn);
  });
  progressEl.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
}

/* Handle option click: only advance on correct */
function onOptionClick(e) {
  const btn = e.currentTarget;
  const selected = Number(btn.dataset.index);
  const correct = questions[currentQuestion].answer;
  if (selected === correct) {
    btn.classList.add("correct");
    showPopupEmoji(btn);
    // small delay so the user sees the correct state + popup
    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        startValentine();
      }
    }, 450);
  } else {
    feedbackEl.textContent = "Oops — that's not right. Try again!";
    // brief shake effect
    quizContainer.classList.remove("shake");
    void quizContainer.offsetWidth;
    quizContainer.classList.add("shake");
  }
}

/* Initialize quiz */
showQuestion();

/* ---------------- Valentine behavior ---------------- */
const valContainer = document.getElementById("valentineContainer");
const text = "Will you be my Valentine?";
let typingTimer;

/* Start typing when valentine revealed */
function startTyping() {
  const typingEl = document.getElementById("typingText");
  typingEl.textContent = "";
  let idx = 0;
  function typeText() {
    if (idx < text.length) {
      typingEl.textContent += text.charAt(idx);
      idx++;
      typingTimer = setTimeout(typeText, 80);
    }
  }
  typeText();
}

/* Attach interactions for Yes / No */
function attachValentineInteractions() {
  let yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  // remove any old listeners by cloning
  yesBtn.replaceWith(yesBtn.cloneNode(true));
  yesBtn = document.getElementById("yesBtn");

  yesBtn.addEventListener("click", () => {
    // gentle scaling on click
    yesBtn.style.transition = "transform 220ms ease";
    // increase scale slightly each click
    const currentScale = (yesBtn.dataset.scale ? Number(yesBtn.dataset.scale) : 1);
    const newScale = currentScale + 0.15;
    yesBtn.dataset.scale = newScale;
    yesBtn.style.transform = `scale(${newScale})`;

    // celebratory burst centered on the button
    const rect = yesBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 + window.scrollX;
    const cy = rect.top + rect.height / 2 + window.scrollY;

    // confetti, hearts and a popup image (image path editable)
    burstConfetti(cx, cy, 60);
    burstHearts(cx, cy, 22);
    // Change this path to your chosen image in the repo or use an external URL
    showPopupImage('/image.png', 2800);

    // If user clicked many times (makes the button big) show final message
    if (newScale > 1.8) {
      // larger celebration
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

  // No button: dodges on hover and click; it does not "accept" a No answer.
  noBtn.addEventListener("mouseenter", moveNoBtn);
  noBtn.addEventListener("click", moveNoBtn);
}

function moveNoBtn() {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * 120 - 60;
  this.style.transform = `translate(${x}px, ${y}px)`;
}

/* Ambient floating hearts (original gentle hearts) */
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

/* Reveal Valentine UI after quiz */
function startValentine() {
  quizContainer.style.display = "none";
  valContainer.style.display = "";
  startTyping();
  attachValentineInteractions();
  if (!heartsIntervalId) {
    heartsIntervalId = setInterval(createHeart, 350);
  }
}

/* ---------------- Emoji popup for correct answers ---------------- */
const emojiChoices = ["💖", "😘", "❤️", "💋", "🥰"];
function showPopupEmoji(buttonEl) {
  const emoji = emojiChoices[Math.floor(Math.random() * emojiChoices.length)];
  const rect = buttonEl.getBoundingClientRect();
  const pop = document.createElement("div");
  pop.className = "emoji-pop";
  pop.textContent = emoji;
  document.body.appendChild(pop);
  const left = rect.left + rect.width / 2 + window.scrollX;
  const top = rect.top + window.scrollY - 8;
  pop.style.left = left + "px";
  pop.style.top = top + "px";
  pop.addEventListener("animationend", () => {
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
  });
  setTimeout(() => {
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
  }, 900);
}

/* ---------------- Celebration helpers (confetti, hearts, popup image) ---------------- */
const CONFETTI_COLORS = ["#ff4d6d","#ff758c","#ffd166","#ffb3c6","#ff9fb1","#fff3f5"];

function burstConfetti(cx, cy, count = 40) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    const w = Math.floor(Math.random() * 8) + 6;
    el.style.width = w + "px";
    el.style.height = (Math.random() > 0.5 ? w * 0.6 : w) + "px";
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
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
    el.style.animationDelay = (Math.random() * 120) + "ms";
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
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
    el.style.animationDelay = (Math.random() * 120) + "ms";
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

function showPopupImage(src, duration = 2500) {
  if (!src) return null;
  const img = document.createElement("img");
  img.className = "popup-image";
  img.src = src;
  img.alt = "celebrate";
  document.body.appendChild(img);
  setTimeout(() => {
    img.style.transition = "opacity 260ms ease, transform 260ms ease";
    img.style.opacity = "0";
    img.style.transform = "translate(-50%, -50%) scale(0.96)";
    setTimeout(() => img.remove(), 300);
  }, duration);
  return img;
}

/* End of script.js */