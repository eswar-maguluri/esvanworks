
(function () {
  "use strict";

  const WHATSAPP_NUMBER = "917995722627";

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(
      "form[data-whatsapp-form][data-contact-form]"
    );

    if (!form) return;

    const status = form.querySelector("[data-form-status]");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) return;

      // Ignore automated spam submissions.
      const honeypot = form.elements.namedItem("website_url");

      if (honeypot && honeypot.value.trim() !== "") {
        if (status) status.textContent = "Thank you.";
        return;
      }

      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const business = String(formData.get("business") || "").trim();
      const service = String(formData.get("type") || "").trim();
      const details = String(formData.get("message") || "").trim();

      const messageLines = [
        "Hi Eswar, I'd like to discuss a project with Esvan Works.",
        "",
        "Name: " + name,
        "Business: " + business,
        "Service needed: " + service,
        "Project details: " + details
      ];

      if (phone) {
        messageLines.splice(3, 0, "Phone: " + phone);
      }

      const whatsappUrl =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(messageLines.join("\n"));

      const whatsappWindow = window.open(
        whatsappUrl,
        "_blank"
      );

      if (whatsappWindow) {
        whatsappWindow.opener = null;

        if (status) {
          status.textContent =
            "WhatsApp opened. Review your message and press Send.";
        }
      } else {
        window.location.assign(whatsappUrl);
      }
    });
  });
})();
