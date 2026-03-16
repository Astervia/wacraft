document.addEventListener("DOMContentLoaded", () => {
  const pageKey = "tasklist:" + location.pathname;

  const checkboxes = document.querySelectorAll(
    ".task-list-item input[type='checkbox']"
  );

  // Restore saved state
  const saved = JSON.parse(localStorage.getItem(pageKey) || "{}");
  checkboxes.forEach((cb, i) => {
    cb.removeAttribute("disabled");
    if (saved[i] !== undefined) cb.checked = saved[i];
  });

  // Save on change
  checkboxes.forEach((cb, i) => {
    cb.addEventListener("change", () => {
      const state = {};
      checkboxes.forEach((c, j) => (state[j] = c.checked));
      localStorage.setItem(pageKey, JSON.stringify(state));
    });
  });
});
