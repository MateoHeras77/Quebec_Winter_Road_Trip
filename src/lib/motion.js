// Decorative movement stays independent from the trip calculator.
// Everything remains visible if JavaScript or browser storage is unavailable.
export function initializeMotion() {
  const root = document.documentElement;
  const toggle = document.getElementById("motionToggle");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;
  try {
    paused = localStorage.getItem("quebec-motion-paused") === "true";
  } catch {
    /* Storage is optional. */
  }

  const snow = document.querySelector(".snowfall");
  for (let index = 0; index < 18; index++) {
    const flake = document.createElement("span");
    flake.style.cssText = `--x:${(index * 37 + 7) % 100}%;--size:${3 + (index % 4)}px;--duration:${9 + (index % 7)}s;--delay:-${index * 1.7}s;--drift:${index % 2 ? 45 : -35}px`;
    snow.append(flake);
  }

  const trail = document.querySelector(".routecard svg > path");
  trail?.classList.add("route-trail");

  let observer;
  const revealAll = () => {
    observer?.disconnect();
    document.querySelectorAll(".reveal-pending").forEach((element) => {
      element.classList.remove("reveal-pending");
    });
  };

  function sync() {
    const stopped = paused || reduced.matches;
    root.dataset.motion = stopped ? "paused" : "running";
    toggle.textContent = reduced.matches
      ? "Reduced motion"
      : paused
        ? "Resume motion"
        : "Pause motion";
    toggle.setAttribute("aria-pressed", String(stopped));
    toggle.disabled = reduced.matches;
    toggle.title = reduced.matches
      ? "Following your device’s reduced-motion preference"
      : "Pause or resume decorative animations";
    if (stopped) revealAll();
  }

  toggle.addEventListener("click", () => {
    paused = !paused;
    try {
      localStorage.setItem("quebec-motion-paused", String(paused));
    } catch {
      /* Keep the current session working without persistence. */
    }
    sync();
  });
  reduced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("motion-idle", document.hidden);
  });
  sync();

  if (!paused && !reduced.matches && "IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 35px 0px" },
    );
    document
      .querySelectorAll(
        ".destination, .day, .town, .carbox, .transport-details, .hotel, .controlpanel, .results, .invitegrid",
      )
      .forEach((element, index) => {
        element.classList.add("reveal-item");
        // Never hide content that is already on screen or the target of a deep link.
        if (
          element.getBoundingClientRect().top > window.innerHeight &&
          !window.location.hash
        ) {
          element.style.setProperty("--reveal-delay", `${(index % 2) * 70}ms`);
          element.classList.add("reveal-pending");
          observer.observe(element);
        }
      });
  }
}
