"use strict";
const WHATSAPP_NUMBER = "917995722627";
const DEFAULT_AUDIT =
  "Hi Eswar, I found Esvan Works. I'd like a free website audit for my business.";
function whatsappUrl(message = DEFAULT_AUDIT) {
  return (
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message)
  );
}
function setWhatsAppLink(link, message = DEFAULT_AUDIT) {
  if (!link) return;
  link.href = whatsappUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}
document.addEventListener("DOMContentLoaded", function () {
  /* 1. WhatsApp links */
  document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
    setWhatsAppLink(link, link.dataset.message || DEFAULT_AUDIT);
  });

  /* 2. Mobile navigation */
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(
    ".nav-links, .site-nav, #primary-navigation, #primary-nav"
  );
  if (menuButton && nav) {
    function closeMenu() {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
    }
    function openMenu() {
      nav.classList.add("is-open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation menu");
    }
    menuButton.addEventListener("click", function () {
      const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        menuButton.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu();
        menuButton.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  /* 3. Current-page navigation */
  function normalizePath(path) {
    const normalized = path.replace(/\/+$/, "") || "/";

    // Treat / and /index.html as the homepage.
    if (normalized === "/" || normalized === "/index.html") {
      return "/";
    }
    return normalized;
  }
  const currentPath = normalizePath(window.location.pathname);
  document
    .querySelectorAll(".nav-links a, .site-nav a")
    .forEach(function (link) {
      try {
        const linkPath = normalizePath(
          new URL(link.href, window.location.origin).pathname
        );
        if (linkPath === currentPath) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      } catch (error) {
        // Leave invalid or non-navigation links unchanged.
      }
    });

  /* 4. Homepage search demonstration */
  const searchDemo = document.querySelector("[data-search-demo]");
  const demoToggle = document.querySelector("[data-demo-toggle]");
  if (searchDemo && demoToggle) {
    const businessItem = searchDemo.querySelector(
      ".demo-your-business, [data-your-business]"
    );
    demoToggle.setAttribute("aria-pressed", "false");
    demoToggle.addEventListener("click", function () {
      const isPromoted =
        demoToggle.getAttribute("aria-pressed") === "true";
      if (businessItem) {
        businessItem.classList.toggle("is-promoted", !isPromoted);
      }
      demoToggle.setAttribute("aria-pressed", String(!isPromoted));
      demoToggle.textContent = isPromoted
        ? "See it with Esvan Works setup"
        : "Show the example before setup";
    });
  }

  /* 5. Website health checker */
  document.querySelectorAll("[data-health-check]").forEach(function (checker) {
    const answers = Array.from(
      checker.querySelectorAll("select[data-health-answer]")
    );

    // This version handles the six-question dropdown checker.
    if (!answers.length) return;
    const output = checker.querySelector(
      "[data-health-output], [data-health-score]"
    );
    const note = checker.querySelector("[data-health-note]");
    const result = checker.querySelector("[data-health-result]");
    const action = checker.querySelector("[data-health-whatsapp]");
    function updateHealthCheck() {
      const completed = answers.filter(function (select) {
        return select.value === "yes" || select.value === "no";
      }).length;
      if (completed < answers.length) {
        if (output) {
          output.textContent =
            "Answer all " + answers.length + " questions to see your result.";
        }
        if (note) {
          note.textContent =
            "Choose Yes or No for each item. This is a self-check, not an automated technical test.";
        }
        if (result) result.hidden = true;
        return;
      }
      const yesCount = answers.filter(function (select) {
        return select.value === "yes";
      }).length;
      if (output) {
        output.textContent =
          "You have " + yesCount + " of " + answers.length + " checks covered.";
      }
      if (note) {
        if (yesCount <= 2) {
          note.textContent =
            "Several basics may need attention. Start with contact details, mobile usability, and accurate business information.";
        } else if (yesCount <= 4) {
          note.textContent =
            "Some basics are in place. Review the remaining gaps to make your business easier to find and contact.";
        } else {
          note.textContent =
            "Most of these basics are covered. A closer review may still identify opportunities for improvement.";
        }
      }
      const details = answers.map(function (select, index) {
        const label =
          select.dataset.question ||
          (select.labels && select.labels[0]
            ? select.labels[0].textContent.trim()
            : "Check " + (index + 1));
        return (
          label +
          ": " +
          (select.value === "yes" ? "Yes" : "No")
        );
      });
      if (action) {
        setWhatsAppLink(
          action,
          [
            "Hi Eswar, I'd like a free website audit.",
            "",
            "Website health check: " + yesCount + "/" + answers.length,
            ...details
          ].join("\n")
        );
      }
      if (result) result.hidden = false;
    }
    answers.forEach(function (select) {
      select.addEventListener("change", updateHealthCheck);
    });
  });

  /* 6. Pricing package finder */
  const finder = document.querySelector("[data-package-finder]");
  if (finder) {
    const websiteSelect = finder.querySelector("#finder-website");
    const mapsSelect = finder.querySelector("#finder-maps");
    const careSelect = finder.querySelector("#finder-care");
    const result = finder.querySelector("[data-finder-result]");
    const action = finder.querySelector("[data-finder-cta]");
    function updatePackageFinder() {
      if (!websiteSelect || !mapsSelect || !careSelect || !result) {
        return;
      }
      const website = websiteSelect.value;
      const maps = mapsSelect.value;
      const care = careSelect.value;
      if (!website || !maps || !care) {
        result.replaceChildren();
        const heading = document.createElement("h3");
        heading.textContent = "Your recommendation will appear here.";
        const paragraph = document.createElement("p");
        paragraph.textContent =
          "Answer all three questions to get a starting package suggestion.";
        result.append(heading, paragraph);
        if (action) {
          setWhatsAppLink(
            action,
            "Hi Eswar, please help me choose a website package."
          );
        }
        return;
      }
      let packageName;
      let packagePrice;
      let reason;

      // "yes" means the visitor needs a new website.
      if (website === "yes" && maps === "yes") {
        packageName = "Website + Local SEO";
        packagePrice = "₹12,999 one-time";
        reason =
          "You need a new website and want local search setup included.";
      } else if (website === "yes") {
        packageName = "Starter Website";
        packagePrice = "₹6,999 one-time";
        reason =
          "Start with a mobile-friendly website and clear contact options.";
      } else if (care === "yes") {
        packageName = "Monthly Care";
        packagePrice = "₹1,999 per month";
        reason =
          "You already have a website and want ongoing maintenance. The final scope should be confirmed before work starts.";
      } else if (maps === "yes") {
        packageName = "Local SEO review";
        packagePrice = "Price confirmed after review";
        reason =
          "You already have a website and want local search help. Your current setup should be reviewed before confirming the work.";
      } else {
        packageName = "Website review";
        packagePrice = "Price confirmed after review";
        reason =
          "You already have a website. Let's review it before deciding what changes are needed.";
      }
      result.replaceChildren();
      const heading = document.createElement("h3");
      heading.textContent = packageName;
      const paragraph = document.createElement("p");
      paragraph.textContent = packagePrice + ". " + reason;
      result.append(heading, paragraph);
      result.hidden = false;
      if (action) {
        setWhatsAppLink(
          action,
          [
            "Hi Eswar, please help me choose a package.",
            "I need a new website: " + (website === "yes" ? "Yes" : "No"),
            "I want local SEO / Google Maps setup: " + maps,
            "I want monthly help: " + care,
            "Suggested starting point: " + packageName
          ].join("\n")
        );
      }
    }
    [websiteSelect, mapsSelect, careSelect].forEach(function (select) {
      if (select) {
        select.addEventListener("change", updatePackageFinder);
      }
    });
  }

  /* 7. Contact form → WhatsApp */
  document
    .querySelectorAll("[data-whatsapp-form], [data-contact-form]")
    .forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const name = String(data.get("name") || "").trim();
        const phone = String(data.get("phone") || "").trim();
        const business = String(data.get("business") || "").trim();
        const businessType = String(
          data.get("type") ||
          data.get("business-type") ||
          ""
        ).trim();
        const messageText = String(data.get("message") || "").trim();
        const message = [
          "Hi Eswar, I'd like to discuss a website or local SEO project.",
          "",
          "Name: " + name,
          "Phone: " + (phone || "Not provided"),
          "Business: " + business,
          "Business type / service: " + (businessType || "Not specified"),
          "Message: " + messageText
        ].join("\n");

        // Direct navigation keeps the form interaction simple.
        window.location.href = whatsappUrl(message);
      });
    });

  /* 8. Testimonial slider */
  document.querySelectorAll(".testimonial-slider-controls").forEach(
    function (controls) {
      const parent = controls.parentElement;
      if (!parent) return;
      const items = Array.from(
        parent.querySelectorAll(
          ":scope > [data-testimonial], :scope > .testimonial"
        )
      );
      if (items.length < 2) return;
      let current = items.findIndex(function (item) {
        return !item.hidden;
      });
      if (current < 0) current = 0;
      function showTestimonial(index) {
        current = (index + items.length) % items.length;
        items.forEach(function (item, itemIndex) {
          const active = itemIndex === current;
          item.hidden = !active;
          item.setAttribute("aria-hidden", String(!active));
        });
      }
      const previous = controls.querySelector("[data-testimonial-prev]");
      const next = controls.querySelector("[data-testimonial-next]");
      if (previous) {
        previous.addEventListener("click", function () {
          showTestimonial(current - 1);
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          showTestimonial(current + 1);
        });
      }
      showTestimonial(current);
    }
  );

  /* 9. Before / after slider */
  document.querySelectorAll("[data-before-after]").forEach(
    function (container) {
      const before = container.querySelector("[data-before]");
      const after = container.querySelector("[data-after]");
      const slider = container.querySelector("[data-slider]");
      const afterLayer = container.querySelector("[data-after-layer]");
      if (!before || !after || !slider || !afterLayer) {
        container.hidden = true;
        return;
      }
      let failed = false;
      let loadedCount = 0;
      let activated = false;
      function updateSlider() {
        const value = Number(slider.value);
        afterLayer.style.clipPath =
          "inset(0 " + (100 - value) + "% 0 0)";
      }
      function activate() {
        if (failed || activated || loadedCount !== 2) return;
        activated = true;
        container.hidden = false;
        updateSlider();
        slider.addEventListener("input", updateSlider);
      }
      function onLoad() {
        loadedCount += 1;
        activate();
      }
      function onError() {
        failed = true;
        container.hidden = true;
      }
      [before, after].forEach(function (image) {
        if (image.complete) {
          if (image.naturalWidth > 0) {
            onLoad();
          } else {
            onError();
          }
        } else {
          image.addEventListener("load", onLoad, { once: true });
          image.addEventListener("error", onError, { once: true });
        }
      });
    }
  );

  /* 10. Project image fallbacks */
  document.querySelectorAll(".work-frame img").forEach(function (image) {
    function showPlaceholder() {
      image.hidden = true;
      const next = image.nextElementSibling;
      if (next && next.classList.contains("placeholder-box")) {
        next.hidden = false;
        return;
      }
      const frame = image.closest(".work-frame");
      if (!frame) return;
      const fallback = document.createElement("div");
      fallback.className = "placeholder-box image-fallback";
      fallback.textContent = "Project preview unavailable";
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", "Project preview unavailable");
      frame.appendChild(fallback);
    }
    image.addEventListener("error", showPlaceholder);
    if (image.complete && image.naturalWidth === 0) {
      showPlaceholder();
    }
  });

  /* 11. Optional PageSpeed score */
  document.querySelectorAll("[data-pagespeed-score]").forEach(
    function (element) {
      const score = String(element.dataset.pagespeedScore || "").trim();
      const valid =
        /^\d{1,3}$/.test(score) &&
        Number(score) >= 0 &&
        Number(score) <= 100;
      if (!valid) {
        element.hidden = true;
        return;
      }
      element.hidden = false;
      const output = element.querySelector("[data-score-output]");
      if (output) {
        output.textContent = score;
      }
    }
  );

  /* 12. Hide empty or unverified result placeholders */
  document.querySelectorAll("[data-result-line]").forEach(
    function (element) {
      const text = element.textContent.trim();
      if (!text || /^\[.*\]$/.test(text)) {
        element.hidden = true;
      }
    }
  );

  /* 13. Copyright year */
  document.querySelectorAll("[data-year]").forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });
});