document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const revealItems = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-counter]");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitButton = form ? form.querySelector(".btn-submit") : null;
  const submitButtonText = submitButton
    ? submitButton.querySelector(".btn-submit-text")
    : null;

  const setHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (revealItems.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          counters.forEach((counter) => animateCounter(counter));
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.35,
      }
    );

    const impactSection = document.getElementById("impacto");

    if (impactSection) {
      counterObserver.observe(impactSection);
    }
  } else {
    counters.forEach((counter) => animateCounter(counter));
  }

  if (form && submitButton && submitButtonText && formStatus) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      form.classList.add("was-validated");
      resetFormStatus();

      if (!form.checkValidity()) {
        showFormStatus(
          "Revise os campos destacados e tente novamente.",
          "error"
        );
        return;
      }

      setLoadingState(true);

      window.setTimeout(() => {
        form.reset();
        form.classList.remove("was-validated");
        setLoadingState(false);
        showFormStatus("Mensagem enviada com sucesso!", "success");
      }, 1200);
    });
  }

  function animateCounter(element) {
    if (element.dataset.counted === "true") {
      return;
    }

    element.dataset.counted = "true";

    const target = Number(element.dataset.target || "0");
    const duration = Number(element.dataset.duration || "1600");
    const suffix = element.dataset.suffix || "";
    const prefix = element.dataset.prefix || "";
    const decimals = Number(element.dataset.decimals || "0");
    const formatter = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const rawValue = target * eased;
      const displayValue =
        decimals > 0
          ? rawValue.toFixed(decimals)
          : Math.round(rawValue).toString();

      element.textContent = `${prefix}${formatter.format(Number(displayValue))}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
        return;
      }

      element.textContent = `${prefix}${formatter.format(target)}${suffix}`;
    };

    window.requestAnimationFrame(step);
  }

  function setLoadingState(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.classList.toggle("is-loading", isLoading);
    submitButtonText.textContent = isLoading
      ? "Enviando..."
      : "Enviar";
  }

  function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status is-visible is-${type}`;
  }

  function resetFormStatus() {
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }
});
