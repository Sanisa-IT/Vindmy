const MAX_IMAGES = 3;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
]);

function fileExtension(name) {
  const match = String(name || "").toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : "";
}

function isAllowedImage(file) {
  const type = (file.type || "").toLowerCase();
  const ext = fileExtension(file.name);
  const mimeOk = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ].includes(type);
  return mimeOk || ALLOWED_EXTENSIONS.has(ext);
}

function validateImageUploads(files, { required = false } = {}) {
  const list = Array.from(files || []).filter((file) => file && file.size > 0);

  if (required && list.length === 0) {
    return "Please upload at least one picture (max 3, 20MB total).";
  }

  if (list.length > MAX_IMAGES) {
    return "You can upload a maximum of 3 pictures.";
  }

  for (const file of list) {
    if (!isAllowedImage(file)) {
      return "Only image files are allowed (JPG, PNG, WEBP, HEIC).";
    }
  }

  const totalSize = list.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_BYTES) {
    return "Total picture size exceeds 20MB. Please reduce the size or number of pictures.";
  }

  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("pointerup", () => {
      const isOpen = navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll("#nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});

// Toggle sections
document.querySelectorAll(".section-title").forEach((title) => {
  title.addEventListener("click", () => {
    const content = title.nextElementSibling;
    content.style.display =
      content.style.display === "block" ? "none" : "block";
  });
});

// Toggle answers
document.querySelectorAll(".question-btn").forEach((btn) => {
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

  faqSections.forEach((section) => {
    const questionButtons = Array.from(section.querySelectorAll(".question-btn"));
    let sectionHasMatch = false;

    questionButtons.forEach((btn) => {
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
    faqSearchStatus.classList.add("sr-only");
  } else if (totalMatches === 0) {
    faqSearchStatus.textContent = "No matching FAQs found. Try another keyword.";
    faqSearchStatus.classList.remove("sr-only");
  } else {
    faqSearchStatus.textContent = `${totalMatches} matching question${totalMatches === 1 ? "" : "s"} shown.`;
    faqSearchStatus.classList.remove("sr-only");
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
  const fields = ["name", "surname", "email", "mobile", "alias", "vindmyTag"];

  fields.forEach((id) => {
    const value = params.get(id);
    const el = document.getElementById(id);
    if (value && el) {
      el.value = value;
    }
  });
});

/* ==============================
   FORM SUBMIT
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const supportFormJson = document.getElementById("supportForm");

  if (supportFormJson) {
    supportFormJson.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton =
        document.getElementById("submitButton") ||
        supportFormJson.querySelector("button");
      const supportStatus = document.getElementById("supportStatus");

      function showSupportStatus(type, message) {
        if (!supportStatus) {
          alert(message);
          return;
        }
        const icon =
          type === "success"
            ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg width="3" height="12" viewBox="0 0 4 16" fill="none"><rect x="0" y="0" width="4" height="10" rx="2" fill="#fff"/><rect x="0" y="13" width="4" height="3" rx="1.5" fill="#fff"/></svg>';
        supportStatus.className = `form-status status-${type}`;
        supportStatus.innerHTML = `<span class="status-icon">${icon}</span><span>${message}</span>`;
        supportStatus.hidden = false;
        supportStatus.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      if (supportStatus) supportStatus.hidden = true;

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        const formData = new FormData(supportFormJson);

        const captchaToken = formData.get("g-recaptcha-response");
        if (!captchaToken) {
          showSupportStatus("error", "Please complete the reCAPTCHA.");
          return;
        }

        const fileInput = document.getElementById("documents");
        const uploadError = validateImageUploads(fileInput?.files, {
          required: false,
        });
        if (uploadError) {
          showSupportStatus("error", uploadError);
          return;
        }

        if (fileInput && fileInput.files.length > 0) {
          formData.delete("documents");
          for (const file of fileInput.files) {
            formData.append("documents", file);
          }
        }

        const response = await fetch("/support", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          supportFormJson.reset();
          supportFormJson.hidden = true;
          showSupportStatus(
            "success",
            "Your query has been submitted successfully. Our team will get back to you shortly."
          );
        } else {
          showSupportStatus(
            "error",
            result.error || result.message || "Failed to submit query."
          );
        }
      } catch (error) {
        console.error(error);
        showSupportStatus(
          "error",
          "An error occurred while sending your query. Please try again."
        );
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Query";
      }
    });
  }

  const verificationForm = document.getElementById("verificationForm");
  const verificationStatus = document.getElementById("verificationStatus");

  function showVerificationStatus(type, message) {
    if (!verificationStatus) {
      alert(message);
      return;
    }
    const icon =
      type === "success"
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg width="3" height="12" viewBox="0 0 4 16" fill="none"><rect x="0" y="0" width="4" height="10" rx="2" fill="#fff"/><rect x="0" y="13" width="4" height="3" rx="1.5" fill="#fff"/></svg>';
    verificationStatus.className = `form-status status-${type}`;
    verificationStatus.innerHTML = `<span class="status-icon">${icon}</span><span>${message}</span>`;
    verificationStatus.hidden = false;
    verificationStatus.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (verificationForm) {
    verificationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton =
        document.getElementById("submitBtn") ||
        verificationForm.querySelector("button");

      if (verificationStatus) verificationStatus.hidden = true;

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        const formData = new FormData(verificationForm);

        const captchaToken = formData.get("g-recaptcha-response");
        if (!captchaToken) {
          showVerificationStatus("error", "Please complete the reCAPTCHA.");
          return;
        }

        const fileInput = document.getElementById("documents");
        const uploadError = validateImageUploads(fileInput?.files, {
          required: true,
        });
        if (uploadError) {
          showVerificationStatus("error", uploadError);
          return;
        }

        formData.delete("documents");
        for (const file of fileInput.files) {
          formData.append("documents", file);
        }

        const response = await fetch("/verification", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          verificationForm.reset();
          verificationForm.hidden = true;
          showVerificationStatus(
            "success",
            "Your verification request has been submitted successfully. Our team will review it and be in touch shortly."
          );
        } else {
          showVerificationStatus(
            "error",
            result.error ||
              result.message ||
              "Failed to submit verification request."
          );
        }
      } catch (error) {
        console.error(error);
        showVerificationStatus(
          "error",
          "An error occurred while sending your verification request. Please try again."
        );
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Verification";
      }
    });
  }
});

document.querySelectorAll(".file-upload-input").forEach((input) => {
  const status = input.parentElement.querySelector("[data-file-status]");
  if (!status) {
    return;
  }

  const idleLabel = status.textContent;

  const updateFileStatus = () => {
    const files = Array.from(input.files || []);
    if (files.length === 0) {
      status.textContent = idleLabel;
    } else if (files.length === 1) {
      status.textContent = files[0].name;
    } else {
      status.textContent = `${files.length} files selected`;
    }
  };

  input.addEventListener("change", () => {
    const err = validateImageUploads(input.files, {
      required: input.hasAttribute("required"),
    });
    if (err) {
      status.textContent = err;
      input.value = "";
      return;
    }
    updateFileStatus();
  });

  if (input.form) {
    input.form.addEventListener("reset", () => {
      setTimeout(updateFileStatus, 0);
    });
  }
});
