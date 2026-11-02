"use strict";

/* =========================================
   Esvan Works — Main JavaScript
   ========================================= */

const WHATSAPP_NUMBER = "917995722627";
const CONTACT_EMAIL = "contact@esvanworks.com";

const DEFAULT_AUDIT =
  "Hi Eswar, I found Esvan Works. I'd like a free website audit for my business.";

/*
 * Keep these prices aligned with pricing.html.
 * Update both files whenever you change a package price.
 */
const PACKAGE_PRICES = {
  starter: "₹5,999 one-time",
  websiteSeo: "₹11,999 one-time",
  care: "₹1,499 per month",
  localSeo: "₹4,999 one-time"
};

/* =========================================
   Shared WhatsApp helpers
   ========================================= */

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

/* =========================================
   Main page initialisation
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const isLocalPreview =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const localPageRoutes = new Set([
    "/services",
    "/work",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/website-for-clinics",
    "/website-for-real-estate",
    "/website-for-business"
  ]);

  /* -----------------------------------------
     Local preview links
     ----------------------------------------- */

  function localizeLink(link) {
    if (!isLocalPreview || !link) return;

    const rawHref = link.getAttribute("href");

    if (
      !rawHref ||
      rawHref.startsWith("#") ||
      /^(mailto:|tel:|javascript:|https?:|\/\/)/i.test(rawHref)
    ) {
      return;
    }

    let url;

    try {
      url = new URL(rawHref, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;

    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (localPageRoutes.has(path)) {
      url.pathname = path + ".html";

      link.setAttribute(
        "href",
        url.pathname + url.search + url.hash
      );
    }
  }

  if (isLocalPreview) {
    document.querySelectorAll("a[href]").forEach(localizeLink);
  }

  /* -----------------------------------------
     WhatsApp links
     ----------------------------------------- */

  document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
    setWhatsAppLink(link, link.dataset.message || DEFAULT_AUDIT);
  });

  /* -----------------------------------------
     Language button
     ----------------------------------------- */

  const languageToggle = document.querySelector(
    "[data-language-toggle]"
  );

  if (languageToggle) {
    /*
     * A complete Telugu translation has not yet
     * been added. Do not pretend that this button
     * translates the page.
     */

    languageToggle.textContent = "తెలుగు soon";
    languageToggle.disabled = true;

    languageToggle.setAttribute("aria-pressed", "false");

    languageToggle.setAttribute(
      "aria-label",
      "Telugu translation is not available yet"
    );

    languageToggle.title =
      "The Telugu version of this website is being prepared.";
  }

  /* -----------------------------------------
     Mobile navigation
     ----------------------------------------- */

  const menuButton = document.querySelector(".menu-toggle");

  const nav = document.querySelector(
    ".nav-links, .site-nav, #primary-navigation, #primary-nav"
  );

  if (menuButton && nav) {

    const mobileBreakpoint = 900;

    function closeMenu(returnFocus = false) {
      nav.classList.remove("is-open");

      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");

      if (returnFocus) {
        menuButton.focus();
      }
    }

    function openMenu() {
      nav.classList.add("is-open");

      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation menu");
    }

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");

    menuButton.addEventListener("click", function () {

      if (menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
      } else {
        openMenu();
      }

    });

    nav.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {
        closeMenu();
      });

    });

    document.addEventListener("keydown", function (event) {

      if (
        event.key === "Escape" &&
        menuButton.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu(true);
      }

    });

    window.addEventListener("resize", function () {

      if (window.innerWidth > mobileBreakpoint) {
        closeMenu();
      }

    });

  }

  /* -----------------------------------------
     Current navigation page
     ----------------------------------------- */

  function normalizePath(path) {

    const normalized = path.replace(/\/+$/, "") || "/";

    if (normalized === "/" || normalized === "/index.html") {
      return "/";
    }

    return normalized.replace(/\.html$/i, "") || "/";

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
        // Ignore invalid or unsupported navigation URLs.
      }

    });

  /* -----------------------------------------
     Business listing demonstration
     ----------------------------------------- */

  const searchDemo = document.querySelector("[data-search-demo]");
  const demoToggle = document.querySelector("[data-demo-toggle]");

  if (searchDemo && demoToggle) {

    const businessItem = searchDemo.querySelector(
      ".demo-your-business, [data-your-business]"
    );

    const initialButtonText = "See a complete listing";
    const promotedButtonText = "Show your business first";

    demoToggle.textContent = initialButtonText;
    demoToggle.setAttribute("aria-pressed", "false");

    demoToggle.addEventListener("click", function () {

      const isPromoted =
        demoToggle.getAttribute("aria-pressed") === "true";

      if (businessItem) {
        businessItem.classList.toggle("is-promoted", !isPromoted);
      }

      searchDemo.classList.toggle("is-promoted", !isPromoted);

      demoToggle.setAttribute("aria-pressed", String(!isPromoted));

      demoToggle.textContent = isPromoted
        ? initialButtonText
        : promotedButtonText;

    });

  }

  /* -----------------------------------------
     Website health self-check
     ----------------------------------------- */

  document
    .querySelectorAll("[data-health-check]")
    .forEach(function (checker) {

      const answers = Array.from(
        checker.querySelectorAll("select[data-health-answer]")
      );

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
              "Answer all " +
              answers.length +
              " questions to see your result.";
          }

          if (note) {
            note.textContent =
              "Choose Yes or No for each item. This is a self-check, " +
              "not an automated website, Google Maps, or technical audit.";
          }

          if (result) {
            result.hidden = true;
          }

          return;
        }

        const yesCount = answers.filter(function (select) {
          return select.value === "yes";
        }).length;

        if (output) {
          output.textContent =
            "You have " +
            yesCount +
            " of " +
            answers.length +
            " checks covered.";
        }

        if (note) {

          if (yesCount <= 2) {

            note.textContent =
              "Several basics may need attention. Start with contact details, " +
              "mobile usability, and accurate business information.";

          } else if (yesCount <= 4) {

            note.textContent =
              "Some basics are in place. Review the remaining gaps to make " +
              "your business easier to find and contact.";

          } else {

            note.textContent =
              "Most of these basics are covered. A closer review may still " +
              "identify opportunities for improvement.";

          }

        }

        const details = answers.map(function (select, index) {

          const label =
            select.dataset.question ||
            (
              select.labels && select.labels[0]
                ? select.labels[0].textContent.trim()
                : "Check " + (index + 1)
            );

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
              "Website health self-check: " +
                yesCount +
                "/" +
                answers.length,
              ...details
            ].join("\n")
          );

        }

        if (result) {
          result.hidden = false;
        }

      }

      answers.forEach(function (select) {
        select.addEventListener("change", updateHealthCheck);
      });

    });

  /* -----------------------------------------
     Package finder
     ----------------------------------------- */

  const finder = document.querySelector("[data-package-finder]");

  if (finder) {

    const websiteSelect = finder.querySelector("#finder-website");
    const mapsSelect = finder.querySelector("#finder-maps");
    const careSelect = finder.querySelector("#finder-care");

    const result = finder.querySelector("[data-finder-result]");
    const action = finder.querySelector("[data-finder-cta]");

    function updatePackageFinder() {

      if (
        !websiteSelect ||
        !mapsSelect ||
        !careSelect ||
        !result
      ) {
        return;
      }

      const website = websiteSelect.value;
      const maps = mapsSelect.value;
      const care = careSelect.value;

      /*
       * Wait until all three questions are answered.
       */

      if (!website || !maps || !care) {

        result.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = "Your recommendation will appear here.";

        const paragraph = document.createElement("p");
        paragraph.textContent =
          "Answer the questions above to find a suitable package.";

        result.append(heading, paragraph);

        if (action) {
          setWhatsAppLink(action, DEFAULT_AUDIT);
        }

        return;
      }

      let packageName;
      let packagePrice;
      let explanation;

      /*
       * Correct recommendation logic:
       *
       * website = yes means the customer needs a new website.
       * website = no means the customer already has a website.
       *
       * maps = yes means local SEO setup is required.
       */

      if (website === "yes" && maps === "yes") {

        packageName = "Website + Local SEO";
        packagePrice = PACKAGE_PRICES.websiteSeo;

        explanation =
          "You need a new website and local SEO setup. " +
          "This package combines both services.";

      } else if (website === "yes" && maps === "no") {

        packageName = "Starter Website";
        packagePrice = PACKAGE_PRICES.starter;

        explanation =
          "A mobile-friendly website with clear service information " +
          "and contact options is a practical starting point.";

      } else if (website === "no" && maps === "yes") {

        packageName = "Local SEO setup";
        packagePrice = PACKAGE_PRICES.localSeo;

        explanation =
          "You already have a website and want help with local search. " +
          "The existing website and Google Business Profile will need " +
          "to be reviewed before the work is confirmed.";

      } else {

        packageName = "Website review";
        packagePrice = "Custom recommendation";

        explanation =
          "You already have a website and do not currently need local SEO. " +
          "Let's review your existing website before deciding what work " +
          "is necessary.";

      }

      /*
       * Monthly Care is a separate ongoing service.
       * It is not automatically included in the project price.
       */

      if (care === "yes") {

        explanation +=
          " Monthly Care is also worth considering for ongoing updates " +
          "and maintenance at " +
          PACKAGE_PRICES.care +
          ".";

      }

      /*
       * Build the result safely using textContent.
       */

      result.replaceChildren();

      const heading = document.createElement("h3");
      heading.textContent = packageName;

      const price = document.createElement("p");
      price.className = "finder-price";
      price.textContent = packagePrice;

      const paragraph = document.createElement("p");
      paragraph.textContent = explanation;

      result.append(heading, price, paragraph);

      /*
       * Prepare a WhatsApp enquiry with the visitor's answers.
       */

      if (action) {

        setWhatsAppLink(
          action,
          [
            "Hi Eswar, please recommend a package for my business.",
            "",
            "Recommended option: " + packageName,
            "Indicative price: " + packagePrice,
            "I need a new website: " + website,
            "I need Google Maps / local SEO help: " + maps,
            "I need monthly website care: " + care
          ].join("\n")
        );

      }

    }

    [websiteSelect, mapsSelect, careSelect].forEach(function (select) {

      if (select) {
        select.addEventListener("change", updatePackageFinder);
      }

    });

    updatePackageFinder();

  }

  /* -----------------------------------------
     Email enquiry form
     ----------------------------------------- */

  const enquiryForm = document.querySelector("[data-enquiry-form]");

  if (enquiryForm) {

    const status = enquiryForm.querySelector("[data-form-status]");

    const submitButton = enquiryForm.querySelector(
      'button[type="submit"]'
    );

    enquiryForm.addEventListener("submit", function (event) {

      event.preventDefault();

      /*
       * Honeypot anti-spam check.
       */

      const honeypot = enquiryForm.querySelector(
        'input[name="website"]'
      );

      if (honeypot && honeypot.value.trim() !== "") {

        if (status) {
          status.textContent = "Unable to process this enquiry.";
        }

        return;
      }

      /*
       * Form validation.
       */

      if (!enquiryForm.reportValidity()) {
        return;
      }

      const name = enquiryForm.elements.name.value.trim();
      const phone = enquiryForm.elements.phone.value.trim();

      const businessType =
        enquiryForm.elements.businessType.value.trim();

      const message = enquiryForm.elements.message.value.trim();

      if (name.length < 2) {

        if (status) {
          status.textContent =
            "Please enter your name using at least 2 characters.";
        }

        enquiryForm.elements.name.focus();

        return;
      }

      if (message.length < 10) {

        if (status) {
          status.textContent =
            "Please provide a little more detail about your requirements.";
        }

        enquiryForm.elements.message.focus();

        return;
      }

      /*
       * Prepare email.
       * This opens the visitor's email application.
       * It does not submit information to a server.
       */

      const subject = "Website enquiry from " + name;

      const body = [
        "Hello Eswar,",
        "",
        "I would like to enquire about Esvan Works services.",
        "",
        "Name: " + name,
        "Phone / WhatsApp: " + phone,
        "Business type: " + businessType,
        "",
        "Requirements:",
        message,
        "",
        "Sent from: " + window.location.href
      ].join("\n");

      const mailtoUrl =
        "mailto:" +
        CONTACT_EMAIL +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      if (status) {

        status.textContent =
          "Opening your email app. Please review the prepared message " +
          "and send it from your email account.";

      }

      if (submitButton) {
        submitButton.textContent = "Open email app";
      }

      window.location.href = mailtoUrl;

    });

  }

  /* -----------------------------------------
     External links safety
     ----------------------------------------- */

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach(function (link) {

      const relValues = new Set(
        (link.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean)
      );

      relValues.add("noopener");
      relValues.add("noreferrer");

      link.setAttribute(
        "rel",
        Array.from(relValues).join(" ")
      );

    });

});