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



