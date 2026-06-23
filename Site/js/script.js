document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("pointerup", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");
    console.log("Hamburger tapped!");
  });

  document.querySelectorAll("#nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
    });
  });
});

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
// Toggle sections
document.querySelectorAll(".section-title").forEach(title => {
    title.addEventListener("click", () => {
        const content = title.nextElementSibling;
        content.style.display =
            content.style.display === "block" ? "none" : "block";
    });
});

// Toggle answers
document.querySelectorAll(".question-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const answer = btn.nextElementSibling;
        answer.style.display =
            answer.style.display === "block" ? "none" : "block";
    });
});

function updateFaqSearch() {
  const faqSearchInput = document.getElementById("faq-search");
  const faqSearchStatus = document.getElementById("faq-search-status");
  const faqSections = Array.from(document.querySelectorAll(".section"));

  if (!faqSearchInput || !faqSearchStatus) {
    return;
  }

  const searchTerm = faqSearchInput.value.trim().toLowerCase();
  let totalMatches = 0;

  faqSections.forEach(section => {
    const questionButtons = Array.from(section.querySelectorAll(".question-btn"));
    let sectionHasMatch = false;

    questionButtons.forEach(btn => {
      const answer = btn.nextElementSibling;
      const text = `${btn.textContent} ${answer ? answer.textContent : ""}`.toLowerCase();
      const matched = searchTerm === "" || text.includes(searchTerm);

      btn.style.display = matched ? "" : "none";
      if (answer && !matched) {
        answer.style.display = "none";
      }

      if (matched) {
        sectionHasMatch = true;
        totalMatches += 1;
      }
    });

    section.style.display = sectionHasMatch ? "" : "none";
    const sectionContent = section.querySelector(".section-content");
    if (sectionContent) {
      if (searchTerm && sectionHasMatch) {
        sectionContent.style.display = "block";
      } else if (!searchTerm) {
        sectionContent.style.display = "none";
      }
    }
  });

  if (searchTerm === "") {
    faqSearchStatus.textContent = "Search questions by keyword";
  } else if (totalMatches === 0) {
    faqSearchStatus.textContent = "No matching FAQs found. Try another keyword.";
  } else {
    faqSearchStatus.textContent = `${totalMatches} matching question${totalMatches === 1 ? "" : "s"} shown.`;
  }
}

const faqSearchInput = document.getElementById("faq-search");
if (faqSearchInput) {
  faqSearchInput.addEventListener("input", updateFaqSearch);
}

const items = document.querySelectorAll(".section");

window.addEventListener("load", () => {
  items.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";

    setTimeout(() => {
      item.style.transition = "0.6s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, index * 80);
  });
});

 /* ==============================
     AUTO-FILL FROM URL
  ============================== */
  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const surname = params.get("surname");
    const email = params.get("email");
    const mobile = params.get("mobile");
    const alias = params.get("alias");
    const vindmyTag = params.get("vindmyTag");
    if (name) document.getElementById("name").value = name;
    if (surname) document.getElementById("surname").value = surname;
    if (email) document.getElementById("email").value = email;
    if (mobile) document.getElementById("mobile").value = mobile;
    if (alias) document.getElementById("alias").value = alias;
    if (vindmyTag) document.getElementById("vindmyTag").value = vindmyTag;
});

  /* ==============================
     FORM SUBMIT (ONLY ONCE)
  ============================== */
  
document.addEventListener("DOMContentLoaded", () => {
  const supportFormJson = document.getElementById("supportForm");

  if (supportFormJson) {
    supportFormJson.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = document.getElementById("submitButton") || supportFormJson.querySelector("button");

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        const formData = new FormData(supportForm);

        const fileInput = document.getElementById("documents");
        if (fileInput && fileInput.files.length > 0) {
          const totalSize = Array.from(fileInput.files).reduce((sum, file) => sum + file.size, 0);
          const MAX_SIZE = 40 * 1024 * 1024; // 40MB in bytes

          if (totalSize > MAX_SIZE) {
            alert("Total file size exceeds 40MB. Please reduce the number or size of files.");
            submitButton.disabled = false;
            submitButton.textContent = "Submit Query";
            return;
          }

          // Re-append files explicitly to ensure all are included
          formData.delete("documents");
          for (const file of fileInput.files) {
            formData.append("documents", file);
          }
        }

        const response = await fetch("/support", {
          method: "POST",
          // ⚠️ Do NOT set Content-Type — browser handles multipart boundary automatically
          body: formData
        });

        const result = await response.json();

if (response.ok) {
          alert("Your query has been submitted successfully.");
          supportForm.reset();
        } else {
          alert(result.error || "Failed to submit query.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while sending your query.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Query";
      }
    });
  }

  const verificationForm = document.getElementById("verificationForm");

  if (verificationForm) {
    verificationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = document.getElementById("submitBtn") || verificationForm.querySelector("button");

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        const formData = new FormData(verificationForm);

      const files = document.getElementById("documents").files;
      const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
      const MAX_SIZE = 40 * 1024 * 1024; // 40MB in bytes

      if (totalSize > MAX_SIZE) {
        alert("Total file size exceeds 40MB. Please reduce the number or size of files.");
        submitButton.disabled = false;
        submitButton.textContent = "Submit Verification";
        return;
      }

      // Re-append files explicitly to ensure all are included
      formData.delete("documents");
      for (const file of files) {
        formData.append("documents", file);
      }

      const response = await fetch("/verification", {
        method: "POST",
        // ⚠️ Do NOT set Content-Type header — browser handles multipart boundary automatically
        body: formData
      });

      const result = await response.json();

        if (response.ok) {
          alert("Your verification request has been submitted successfully.");
          verificationForm.reset();
        } else {
          alert(result.error || "Failed to submit verification request.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while sending your verification request.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Verification";
      }
    });
  }

});

