document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
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
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});



