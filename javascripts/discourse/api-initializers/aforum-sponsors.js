import { apiInitializer } from "discourse/lib/api";

// aForum: place sponsors immediately before the homepage navigation.
// The native welcome banner is expected to appear before that navigation.
export default apiInitializer("1.14.0", (api) => {
  let observer;
  let scheduled = false;

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
    const section = document.createElement("section");
    section.id = "aforum-premium-sponsors";
    section.className = "aforum-sponsors";
    // Global theme settings; keep the CSS values bounded and numeric.
    const height = Math.max(90, Math.min(300, Number(settings.tile_height) || 125));
    const radius = Math.max(0, Math.min(40, Number(settings.corner_radius) || 0));
    section.style.setProperty("--aforum-sponsor-height", `${height}px`);
    section.style.setProperty("--aforum-sponsor-radius", `${radius}px`);
    section.setAttribute("aria-label", "Werbepartner");

    sponsors.forEach((sponsor) => {
      const a = document.createElement("a");
      a.className = `aforum-sponsor aforum-sponsor--${sponsor.mode === "logo" ? "logo" : "banner"}`;
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
      label.textContent = "WERBEPARTNER";
      a.append(label);

      const content = document.createElement("span");
      content.className = "aforum-sponsor__content";
      const name = document.createElement("strong");
      name.textContent = sponsor.name;
      content.append(name);
      if (sponsor.tagline) {
        const tagline = document.createElement("small");
        tagline.textContent = sponsor.tagline;
        content.append(tagline);
      }
      a.append(content);
      const arrow = document.createElement("span");
      arrow.className = "aforum-sponsor__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
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
