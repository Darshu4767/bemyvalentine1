/* ---------- Celebration helpers (confetti, hearts, popup image) ---------- */

/* Colors for confetti */
const CONFETTI_COLORS = ["#ff4d6d","#ff758c","#ffd166","#ffb3c6","#ff9fb1","#fff3f5"];

/* Create confetti pieces at fixed center (cx, cy) and animate outward.
   count defaults to 40; pieces are position:fixed so they don't affect layout. */
function burstConfetti(cx, cy, count = 40) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    const w = Math.floor(Math.random() * 8) + 6;
    el.style.width = w + "px";
    el.style.height = (Math.random() > 0.5 ? w * 0.6 : w) + "px";
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    // trajectory: random horizontal spread and upward motion
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
    // small random delay so pieces don't all animate at once
    el.style.animationDelay = (Math.random() * 120) + "ms";
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

/* Hearts burst (emoji) */
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

/* Show a centered image popup (src) for `duration` ms. The image is fixed-position
   so it doesn't affect layout. Returns the element for further control if needed. */
function showPopupImage(src, duration = 2500) {
  const img = document.createElement("img");
  img.className = "popup-image";
  img.src = src;
  img.alt = "celebrate";
  document.body.appendChild(img);
  // remove after duration (allow animation to finish)
  setTimeout(() => {
    // fade out gently then remove
    img.style.transition = "opacity 260ms ease, transform 260ms ease";
    img.style.opacity = "0";
    img.style.transform = "translate(-50%, -50%) scale(0.96)";
    setTimeout(() => img.remove(), 300);
  }, duration);
  return img;
}

/* ---------- Minimal change: call celebration helpers from Yes click ---------- */

/* In your attachValentineInteractions function, replace the yesBtn click handler's
   celebration code with the calls below (or add them). This snippet shows the logic:

  const rect = yesBtn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2 + window.scrollX;
  const cy = rect.top + rect.height / 2 + window.scrollY;

  burstConfetti(cx, cy, 60);
  burstHearts(cx, cy, 18);
  // show popup image (place file under /images/celebrate.png or use external URL)
  showPopupImage('/images/celebrate.png', 2800);

*/
