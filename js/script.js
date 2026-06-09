document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = navLinks ? navLinks.querySelectorAll("a") : [];

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isActive = navLinks.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isActive));
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Welcome to Vindmy! Let's get you started.");
    });
  }

  const signupBtn = document.querySelector(".signup-btn");
  if (signupBtn) {
    signupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Redirecting to Sign Up page...");
    });
  }
});
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  let range = end - start;
  let stepTime = Math.abs(Math.floor(duration / range));
  let current = start;
  let increment = end > start ? 1 : -1;
  let timer = setInterval(function() {
    current += increment;
    obj.textContent = current.toLocaleString();
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}

window.onload = function() {
  animateValue("tickets", 0, 15000000, 2000);
  animateValue("cards", 0, 30000, 2000);
};



