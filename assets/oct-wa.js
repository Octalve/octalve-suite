// /assets/oct-wa.js
(function () {
  const PHONE = "2348073459090";
  const STORAGE_KEY = "oct_wa_draft_v1";

  function pageName() {
    const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
    return path === "/" ? "Home" : path.split("/").filter(Boolean).slice(-1)[0];
  }

  function defaultMessage() {
    return `Hello Octalve Suite 👋
I’m a Founder / Business Owner / NGO based in Abuja.

I’d like to learn more about your services and the best next step for my project.

Page: ${pageName()}
Service: (Branding / Website / Launch / Impact / Growth)
Timeline: (This week / This month)
Budget range: (Optional)`;
  }

  function waUrl(msg) {
    const t = encodeURIComponent(msg || "");
    return `https://wa.me/${PHONE}?text=${t}`;
  }

  // Wait until the widget exists (works for injected footers)
  function initWhenReady() {
    const btn = document.getElementById("octWaBtn");
    const card = document.getElementById("octWaCard");
    const close = document.getElementById("octWaClose");
    const send = document.getElementById("octWaSend");
    const text = document.getElementById("octWaText");
    const reset = document.getElementById("octWaReset");
    const badge = document.getElementById("octWaBadge");

    if (!btn || !card || !close || !send || !text || !reset) return false;

    function openCard() {
      const saved = localStorage.getItem(STORAGE_KEY);
      text.value = saved && saved.trim() ? saved : defaultMessage();
      send.href = waUrl(text.value);

      card.classList.remove("hidden");
      card.setAttribute("aria-hidden", "false");
    }

    function closeCard() {
      card.classList.add("hidden");
      card.setAttribute("aria-hidden", "true");
      if (badge) badge.classList.remove("hidden");
    }

    function syncDraft() {
      localStorage.setItem(STORAGE_KEY, text.value);
      send.href = waUrl(text.value);
    }

    function doReset(e) {
      e.preventDefault();
      text.value = defaultMessage();
      localStorage.setItem(STORAGE_KEY, text.value);
      send.href = waUrl(text.value);
      if (badge) badge.classList.remove("hidden");
      text.focus();
    }

    function sendNow(e) {
      e.preventDefault();
      const msg =
        text.value && text.value.trim() ? text.value : defaultMessage();
      localStorage.setItem(STORAGE_KEY, msg);

      const url = waUrl(msg);
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win) location.href = url;

      if (badge) badge.classList.add("hidden");
    }

    // Handlers
    btn.addEventListener("click", function () {
      if (card.classList.contains("hidden")) openCard();
      else closeCard();
    });

    close.addEventListener("click", function (e) {
      e.preventDefault();
      closeCard();
    });

    reset.addEventListener("click", doReset);
    text.addEventListener("input", syncDraft);
    send.addEventListener("click", sendNow);

    // Ensure href always valid once initialized
    const saved = localStorage.getItem(STORAGE_KEY);
    const msg = saved && saved.trim() ? saved : defaultMessage();
    send.href = waUrl(msg);

    return true;
  }

  // Try immediately, then observe DOM (for injected footer)
  if (initWhenReady()) return;

  const obs = new MutationObserver(function () {
    if (initWhenReady()) obs.disconnect();
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
