/* Scroll reveal: adds "in-view" class once an element scrolls into the viewport.
   Elements need class "reveal" (fades/slides in as a whole) or "reveal-stagger"
   wrapping children with class "reveal-item" (each child staggers in with a delay). */
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");

        if (entry.target.classList.contains("reveal-stagger")) {
          const items = entry.target.querySelectorAll(".reveal-item");
          items.forEach((item, i) => {
            item.style.transitionDelay = (i * 90) + "ms";
          });
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  targets.forEach((el) => observer.observe(el));
});
