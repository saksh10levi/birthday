// Full Interactive Birthday SPA + Secret Page + Future Page (Final Version)
document.addEventListener("DOMContentLoaded", () => {

  const pages = {
    welcome: document.getElementById("page-welcome"),
    born: document.getElementById("page-born"),
    cake: document.getElementById("page-cake"),
    balloons: document.getElementById("page-balloons"),
    final: document.getElementById("page-final"),
    secret: document.getElementById("page-secret"),
    future: document.getElementById("page-future") // NEW PAGE
  };

  const music = document.getElementById("bg-music");
  const popSound = document.getElementById("pop-sound");

  function show(pageEl) {
  Object.values(pages).forEach(p => {
    if (p) p.classList.add("hidden");
  });

  if (pageEl) pageEl.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

  // ---------------- WELCOME → BORN ----------------
  const btnReady = document.getElementById("btn-ready");
  if (btnReady) {
    btnReady.addEventListener("click", () => {

      if (music) {
        try {
          music.currentTime = 0;
          music.volume = 0.4;
          const playPromise = music.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(() => {/* play blocked or failed; ignore silently */});
          }
        } catch(e){}
      }

      const photo = document.querySelector(".welcome-photo");
      if (photo) {
        photo.animate(
          [{transform:"scale(1)"},{transform:"scale(1.05)"},{transform:"scale(1)"}],
          {duration:900}
        );
      }

      setTimeout(()=> show(pages.born), 600);
    });
  }

  // ---------------- BORN → CAKE ----------------
  const btnStart = document.getElementById("btn-start-celebration");
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      show(pages.cake);
    });
  }

  // ---------------- CAKE ----------------
  const btnBlow = document.getElementById("btn-blow");
  const candles = document.querySelectorAll(".candle");
  const btnPopBalloon = document.getElementById("btn-pop-balloons");

  if (btnBlow) {
    btnBlow.addEventListener("click", () => {

      candles.forEach((c, idx) => {
        setTimeout(()=> c.classList.add("out"), idx * 200);
      });

      setTimeout(()=> {
        if (btnPopBalloon) btnPopBalloon.classList.remove("hidden");
        btnBlow.classList.add("hidden");
      }, 1000);
    });
  }

  if (btnPopBalloon) {
    btnPopBalloon.addEventListener("click", () => {
      show(pages.balloons);
    });
  }

  // ---------------- BALLOONS ----------------
  const balloons = document.querySelectorAll(".balloon");
  const revealBox = document.getElementById("reveals");
  let poppedCount = 0;

  balloons.forEach(b => {
    b.addEventListener("click", () => {

      if (b.classList.contains("popped")) return;
      b.classList.add("popped");

      if (popSound) {
        try {
          popSound.currentTime = 0;
          const p = popSound.play();
          if (p && typeof p.then === 'function') p.catch(() => {});
        } catch(e){}
      }

      const msg = b.getAttribute("data-msg");
      const line = document.createElement("div");
      line.className = "line";
      line.innerText = msg;

      if (revealBox) revealBox.appendChild(line);

      setTimeout(()=>{
        line.style.opacity = 1;
        line.style.transform = "translateY(0)";
      },30);

      poppedCount++;

      if (poppedCount === balloons.length) {
        const finaleBtn = document.getElementById("btn-finale");
        if (finaleBtn) finaleBtn.style.display = "inline-block";
      }
    });
  });

  const finaleBtn = document.getElementById("btn-finale");
  if (finaleBtn) {
    finaleBtn.style.display = "none";
    finaleBtn.addEventListener("click", ()=> {
      show(pages.final);
      runConfetti();
    });
  }

  // ---------------- CONFETTI ----------------
  function runConfetti() {
    const canvas = document.getElementById("confetti");
    if (!canvas) return;

    // allow clicks to pass through the confetti canvas
    canvas.style.pointerEvents = "none";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const pieces = [];
    const colors = ["#ff5fbf","#ffd166","#9bdeac","#89cff0","#b497ff"];

    for (let i=0;i<120;i++){
      pieces.push({
        x: Math.random()*canvas.width,
        y: Math.random()*-canvas.height,
        r: 6+Math.random()*10,
        dx:(Math.random()-0.5)*2,
        dy:2+Math.random()*4,
        color: colors[Math.floor(Math.random()*colors.length)],
        tilt: Math.random()*0.3
      });
    }

    let t=0;
    function frame(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p=>{
        p.x+=p.dx;
        p.y+=p.dy;
        p.tilt+=0.02;
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(Math.sin(p.tilt));
        ctx.fillStyle=p.color;
        ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);
        ctx.restore();
        if(p.y>canvas.height+40){
          p.y=-20;
          p.x=Math.random()*canvas.width;
        }
      });
      t++;
      if(t<400) requestAnimationFrame(frame);
    }
    frame();
  }

  // ---------------- SECRET PAGE ----------------
  const btnOpenSecret = document.getElementById("btn-open-secret");
  if (btnOpenSecret) {
    btnOpenSecret.addEventListener("click", () => {
      show(pages.secret);
    });
  }

  const btnBack = document.getElementById("btn-back-to-final");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      show(pages.final);
    });
  }

  // ---------------- REACTION (HEARTS) ----------------
  const btnReact = document.getElementById("btn-react");
  if (btnReact) {
    btnReact.addEventListener("click", () => {
      // spawn a burst of hearts near the button
      for (let i = 0; i < 8; i++) {
        setTimeout(() => spawnHeart(), i * 110);
      }
    });
  }

  function spawnHeart(){
    if (!btnReact) return;
    const rect = btnReact.getBoundingClientRect();
    const h = document.createElement('div');
    h.className = 'heart';
    h.innerText = '💖';

    // start near the button center with small random horizontal offset
    const offsetX = (Math.random() - 0.5) * 140; // px
    const startLeft = rect.left + rect.width / 2 + offsetX;
    const startTop = rect.top - 8; // a little above the button

    h.style.left = startLeft + 'px';
    h.style.top = startTop + 'px';
    h.style.setProperty('--dx', Math.round((Math.random() - 0.5) * 160) + 'px');

    document.body.appendChild(h);

    // remove after animation completes
    setTimeout(() => {
      if (h && h.parentNode) h.parentNode.removeChild(h);
    }, 1600);
  }

  // ---------------- FUTURE PAGE ----------------
  const btnFuture = document.getElementById("btn-open-future");
  const btnBackFromFuture = document.getElementById("btn-back-from-future");

  if (!btnFuture) console.warn('btn-open-future not found in DOM — check element id');

  if (btnFuture) {
    btnFuture.addEventListener("click", () => {
      if (pages.future) {

        // Hide all other pages first (IMPORTANT FIX)
        Object.values(pages).forEach(p => {
          if (p) p.classList.add("hidden");
        });

        // Then show future page
        pages.future.classList.remove("hidden");

        // Trigger animation cleanly
        pages.future.classList.remove("show");
        void pages.future.offsetWidth;
        pages.future.classList.add("show");
      }
    });
  }

  if (btnBackFromFuture) {
    btnBackFromFuture.addEventListener("click", () => {
      if (pages.future) {
        pages.future.classList.remove("show");

        setTimeout(() => {
          pages.future.classList.add("hidden");
          show(pages.final); // go back properly
        }, 800);
      }
    });
  }
});