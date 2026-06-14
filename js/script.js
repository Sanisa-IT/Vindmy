document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = navLinks ? navLinks.querySelectorAll("a") : [];

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isActive = navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active", isActive);
      menuToggle.setAttribute("aria-expanded", String(isActive));
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
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

document.addEventListener("DOMContentLoaded", () => {
  const deleteLink = document.getElementById("delete-account-link");
  const deleteModal = document.getElementById("deleteModal");
  const closeBtn = document.querySelector(".modal .close");
  const deleteForm = document.getElementById("deleteAccountForm");

  // Show modal when footer link is clicked
  deleteLink.addEventListener("click", (e) => {
    e.preventDefault();
    deleteModal.style.display = "block";
  });

  // Close modal when "X" is clicked
  closeBtn.addEventListener("click", () => {
    deleteModal.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", (e) => {
    if (e.target === deleteModal) {
      deleteModal.style.display = "none";
    }
  });

  // Handle form submission
  deleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("userEmail").value;

    try {
      const response = await fetch("/api/send-delete-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        alert("Verification link sent to your email.");
        deleteModal.style.display = "none";
        deleteForm.reset();
      } else {
        alert("Error sending verification link.");
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error. Please try again later.");
    }
  });
});
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {

        faqItems.forEach(faq => {
            if(faq !== item){
                faq.classList.remove('active');
            }
        });

        item.classList.toggle('active');
    });
});
