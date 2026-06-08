const actionButton = document.getElementById("actionButton");

if (actionButton) {
  actionButton.addEventListener("click", () => {
    const message = document.createElement("div");
    message.className = "toast-message";
    message.textContent = "Great! Your JavaScript is working.";
    document.body.appendChild(message);

    setTimeout(() => {
      message.classList.add("visible");
    }, 10);

    setTimeout(() => {
      message.classList.remove("visible");
      setTimeout(() => message.remove(), 300);
    }, 2600);
  });
}

// Example: add more interactive behavior here
