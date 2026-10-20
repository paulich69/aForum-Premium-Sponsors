import { apiInitializer } from "discourse/lib/api";

// aForum: place sponsors immediately before the homepage navigation.
// The native welcome banner is expected to appear before that navigation.
export default apiInitializer("1.14.0", (api) => {
  let observer;
  let scheduled = false;
  // Chosen once per page load; DOM updates must not re-roll the ad.
  let mobileChoiceKey = null;
  let mobileChoiceSignature = null;

  const validUrl = (value) => {
    try {
      const url = new URL(value, window.location.origin);
      return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  };
  const safeColor = (value) =>
    /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(value || "") ? value : "#171717";

  function isHome() {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    return path === "/" || (settings.show_on_categories && path === "/categories");
  }

  function render() {
    scheduled = false;
    const old = document.querySelector("#aforum-premium-sponsors");
    if (!isHome()) {
      old?.remove();
      return;
    }

    // Standard Discourse category navigation, located beneath the welcome banner.
    const nav = document.querySelector("#main-outlet .navigation-container");
    if (!nav) {
      old?.remove();
      return;
    }
    const host = nav.parentElement;
    if (!host) return;
    if (old && old.nextElementSibling === nav) return;

    const sponsors = (Array.isArray(settings.sponsors) ? settings.sponsors : [])
      .filter((s) => s.active !== false && validUrl(s.url))
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .slice(0, 3);

    if (!sponsors.length) {
      old?.remove();
      return;
    }
    // Weighted lottery: 3 means three times as likely as 1. Zero excludes
    // a sponsor from mobile selection, but not from desktop display.
    const candidates = sponsors.map((s, index) => ({
      index,
      weight: s.mobile_weight === undefined || s.mobile_weight === null || s.mobile_weight === ""
        ? 1
        : Math.max(0, Math.min(20, Number(s.mobile_weight) || 0)),
    })).filter((entry) => entry.weight > 0);
    const signature = JSON.stringify(sponsors.map((s) => [s.name, s.url, s.mobile_weight]));
    if (signature !== mobileChoiceSignature) {
      mobileChoiceSignature = signature;
      const total = candidates.reduce((sum, item) => sum + item.weight, 0);
      let roll = Math.random() * total;
      mobileChoiceKey = null;
      for (const item of candidates) {
        roll -= item.weight;
        if (roll < 0) {
          mobileChoiceKey = item.index;
          break;
        }
      }
      if (mobileChoiceKey === null && candidates.length) {
        mobileChoiceKey = candidates[candidates.length - 1].index;
      }
    }

    const section = document.createElement("section");
    section.id = "aforum-premium-sponsors";
    section.className = "aforum-sponsors";
    // Global theme settings; keep the CSS values bounded and numeric.
    const height = Math.max(90, Math.min(300, Number(settings.tile_height) || 125));
    const radiusValue = Number(settings.corner_radius);
    const radius = Number.isFinite(radiusValue) ? Math.max(0, Math.min(40, radiusValue)) : 7;
    section.style.setProperty("--aforum-sponsor-height", `${height}px`);
    section.style.setProperty("--aforum-sponsor-radius", `${radius}px`);
    section.style.setProperty("--aforum-sponsor-label-color", safeColor(settings.ad_label_color || "#D6B36A"));
    section.setAttribute("aria-label", "Werbung – Premium-Partner");

    sponsors.forEach((sponsor, index) => {
      const a = document.createElement("a");
      a.className = `aforum-sponsor aforum-sponsor--${sponsor.mode === "logo" ? "logo" : "banner"}`;
      if (index === mobileChoiceKey) a.classList.add("aforum-sponsor--mobile-selected");
      a.href = validUrl(sponsor.url);
      a.target = "_blank";
      a.rel = "noopener noreferrer sponsored";
      a.style.backgroundColor = safeColor(sponsor.background);
      a.setAttribute("aria-label", `Werbepartner: ${sponsor.name} (öffnet in neuem Tab)`);

      const image = sponsor.image || sponsor.image_url;
      const imageSrc = image && validUrl(image);
      if (imageSrc) {
        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = sponsor.name || "";
        img.loading = "lazy";
        a.append(img);
      }
      const label = document.createElement("span");
      label.className = "aforum-sponsor__label";
      label.textContent = "WERBUNG";
      a.append(label);

      const arrow = document.createElement("span");
      arrow.className = "aforum-sponsor__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.innerHTML = '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
      a.append(arrow);
      section.append(a);
    });

    if (old) old.replaceWith(section);
    else host.insertBefore(section, nav);
  }

  function scheduleRender() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }

  api.onPageChange(scheduleRender);
  observer = new MutationObserver((mutations) => {
    // Avoid reacting to changes inside our own sponsor section.
    if (mutations.some((m) => !m.target.closest?.("#aforum-premium-sponsors"))) {
      scheduleRender();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  scheduleRender();
});
