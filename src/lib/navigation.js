export function initializeNavigation() {
  const links = [...document.querySelectorAll(".mobile-nav a")];
  function markCurrent(href) {
    links.forEach((link) => {
      if (link.getAttribute("href") === href)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  links.forEach((link) =>
    link.addEventListener("click", () =>
      markCurrent(link.getAttribute("href")),
    ),
  );
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) markCurrent(`#${entry.target.id}`);
        else {
          const link = links.find(
            (link) => link.getAttribute("href") === `#${entry.target.id}`,
          );
          link?.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-10% 0px -60% 0px" },
  );
  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) observer.observe(section);
  });
}
