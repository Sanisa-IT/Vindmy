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

/*const supportForm = document.getElementById("supportForm");

supportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = supportForm.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
        const formData = new FormData(supportForm);

        const response = await fetch("/api/contact", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert("Your query has been submitted successfully.");
            supportForm.reset();
        } else {
            alert(result.message || "Failed to submit query.");
        }

    } catch (error) {
        console.error(error);
        alert("An error occurred while submitting your query.");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Query";
    }
});
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("supportForm");

  if (!form) return; */

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
  
document.getElementById("supportForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = document.getElementById("submitButton");

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
        const response = await fetch("/support", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById("name").value,
                surname: document.getElementById("surname").value,
                email: document.getElementById("email").value,
                mobile: document.getElementById("mobile").value,
                alias: document.getElementById("alias").value,
                vindmyTag: document.getElementById("vindmyTag").value,
                category: document.getElementById("category").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Your query has been submitted successfully.");
            document.getElementById("supportForm").reset();
        } else {
            alert("Failed to submit query.");
            console.error(result);
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while sending your query.");
    }

    submitButton.disabled = false;
    submitButton.textContent = "Submit Query";
});


document.getElementById("verificationForm").addEventListener("submit", async (e) => {

    e.preventDefault();

     const submitBtn = document.getElementById("submitBtn");

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const response = await fetch("/verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        alias: document.getElementById("alias").value,
        vindmyTag: document.getElementById("vindmyTag").value,
        identity: document.getElementById("identity").value,
        business: document.getElementById("business").value
      })
    });

    if (response.ok) {
      alert("Verification request submitted successfully.");
      document.getElementById("verificationForm").reset();
    } else {
      alert("Failed to submit verification request.");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Verification";
});


});
function openTerms() {
  document.getElementById("legalFrame").src =
    "https://www.iubenda.com/terms-and-conditions/86063130";

  document.getElementById("legalModal").style.display = "block";
}

function openPolicy() {
  document.getElementById("legalFrame").src =
    "https://www.iubenda.com/privacy-policy/86063130";

  document.getElementById("legalModal").style.display = "block";
}

function closeLegal() {
  document.getElementById("legalModal").style.display = "none";
  document.getElementById("legalFrame").src = "";

}