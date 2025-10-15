(function() {
  // ===== Background Rotation =====
  const backgrounds = ["fiber1.jpg", "fiber2.jpg", "fiber3.jpg", "fiber4.jpg", "fiber5.jpg", "fiber6.jpg", "fiber7.jpg", "fiber8.jpg", "fiber9.jpg", "fiber10.jpg", "fiber11.jpg", "fiber12.jpg"];
  const gradients = [
    "linear-gradient(135deg, rgba(255,0,128,0.45), rgba(0,204,255,0.35))",
    "linear-gradient(135deg, rgba(255,50,180,0.45), rgba(0,120,255,0.35))",
    "linear-gradient(135deg, rgba(200,0,255,0.45), rgba(0,255,190,0.35))",
    "linear-gradient(135deg, rgba(255,70,200,0.45), rgba(80,160,255,0.35))"
  ];

  let current = 0;
  let showingBg1 = true;
  const intervalTime = 5000;
  const bg1 = document.getElementById("bg1");
  const bg2 = document.getElementById("bg2");
  const overlay = document.getElementById("overlay");
  let bgInterval;

  bg1.style.backgroundImage = `url('${backgrounds[0]}')`;
  bg2.style.backgroundImage = `url('${backgrounds[1]}')`;
  overlay.style.background = gradients[0];

  function changeBackground() {
    current = (current + 1) % backgrounds.length;
    const nextImg = backgrounds[current];
    const nextGradient = gradients[current];

    if (showingBg1) {
      bg2.style.backgroundImage = `url('${nextImg}')`;
      bg2.classList.remove("hidden");
      bg1.classList.add("hidden");
    } else {
      bg1.style.backgroundImage = `url('${nextImg}')`;
      bg1.classList.remove("hidden");
      bg2.classList.add("hidden");
    }

    overlay.style.background = nextGradient;
    showingBg1 = !showingBg1;
  }

  function startRotation() {
    bgInterval = setInterval(changeBackground, intervalTime);
  }

  function stopRotation() {
    clearInterval(bgInterval);
  }

  startRotation();

  // Pause animation on scroll
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    overlay.classList.add("paused");
    stopRotation();
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      overlay.classList.remove("paused");
      startRotation();
    }, 2000);
  });

  // ===== Header / Year / Smooth Scroll =====
  const header = document.getElementById("siteHeader");
  const yearEl = document.getElementById("year");
  const backBtn = document.getElementById("backToTop");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle("scrolled", scrolled);
    backBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===== Dark Mode Toggle =====
  const root = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") root.classList.add("dark");

  themeToggle.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
  });

  // ===== FAQ Accordion =====
  document.querySelectorAll(".faq-item h4").forEach(q => {
    q.addEventListener("click", () => {
      const p = q.nextElementSibling;
      const open = p.classList.contains("open");
      document.querySelectorAll(".faq-item p").forEach(el => el.classList.remove("open"));
      if (!open) p.classList.add("open");
    });
  });

  // ===== Scroll Reveal for Cards =====
  const revealEls = document.querySelectorAll(".cards");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => observer.observe(el));

  // === Subscription Popup ===
  const popup = document.getElementById('subscribePopup');
  const popupClose = document.getElementById('popupClose');
  const selectedPlan = document.getElementById('selectedPlan');
  const planInput = document.getElementById('planInput');
  const popupForm = document.getElementById('subscribeForm');
  const popupStatus = document.getElementById('popupStatus');

  document.querySelectorAll('.plan-card button').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.parentElement.querySelector('h3').textContent;
      selectedPlan.textContent = plan;
      planInput.value = plan;
      popup.classList.remove('hidden');
      popup.style.opacity = '1';
    });
  });

  popupClose.addEventListener('click', () => {
    popup.classList.add('hidden');
    popupStatus.textContent = '';
  });

  popupForm.addEventListener('submit', async e => {
    e.preventDefault();
    popupStatus.textContent = "Sending...";
    try {
      const data = new FormData(popupForm);
      const res = await fetch(popupForm.action, {
        method: 'POST',
        body: data,
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        popupStatus.textContent = "✅ Subscription request sent successfully!";
        popupForm.reset();
      } else throw new Error();
    } catch {
      popupStatus.textContent = "❌ Error sending. Please try again.";
    }
  });

  // ===== Contact Form (Formspree) =====
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.textContent = "Sending...";
    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        status.textContent = "✅ Thank you! We'll contact you soon.";
        form.reset();
      } else throw new Error();
    } catch {
      status.textContent = "❌ Error sending message. Please try again.";
    }
  });
})();
