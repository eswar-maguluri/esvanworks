(function () {
  "use strict";

  const WHATSAPP_NUMBER = "917995722627";

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(
      "form[data-whatsapp-form][data-contact-form]"
    );

    if (!form) return;

    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector('button[type="submit"]');

    let isSubmitting = false;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (isSubmitting) return;

      if (!form.reportValidity()) return;

      // Ignore automated spam submissions.
      const honeypot = form.elements.namedItem("website_url");

      if (honeypot && honeypot.value.trim() !== "") {
        if (status) {
          status.textContent = "Thank you.";
        }
        return;
      }

      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const business = String(formData.get("business") || "").trim();
      const service = String(formData.get("type") || "").trim();
      const details = String(formData.get("message") || "").trim();

      // Additional checks before preparing the message.
      if (!name || !business || !service || details.length < 10) {
        if (status) {
          status.textContent =
            "Please complete all required fields before continuing.";
        }
        return;
      }

      const messageLines = [
        "Hi Eswar, I'd like to discuss a project with Esvan Works.",
        "",
        "Name: " + name
      ];

      if (phone) {
        messageLines.push("Phone: " + phone);
      }

      messageLines.push(
        "Business: " + business,
        "Service needed: " + service,
        "Project details: " + details
      );

      const whatsappUrl =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(messageLines.join("\n"));

      isSubmitting = true;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }

      if (status) {
        status.textContent =
          "Opening WhatsApp. You can review your message before sending.";
      }

      // Open WhatsApp directly from the form submission interaction.
      const whatsappWindow = window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      if (whatsappWindow) {
        if (status) {
          status.textContent =
            "WhatsApp opened. Review your message and press Send.";
        }
      } else {
        // Fallback for browsers that block new windows.
        window.location.assign(whatsappUrl);
      }

      // Allow another attempt if the visitor returns to this page.
      window.setTimeout(function () {
        isSubmitting = false;

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }, 2500);
    });
  });
})();