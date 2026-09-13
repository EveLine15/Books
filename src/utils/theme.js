const THEME_KEY = "app_theme";

/**
 * @typedef {"dark" | "light"} Theme
 */

/**
 * Retrieves the user's preferred theme from local storage or system settings.
 *
 * @returns {Theme} The saved theme if present, otherwise preferred system theme ("dark" or "light").
 */
function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Applies the specified theme to the HTML root element and updates LocalStorage.
 *
 * @param {Theme} theme - The theme to apply ("dark" or "light").
 * @returns {void}
 */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Initializes the application color theme and sets up event listeners.
 * Syncs initial theme on load and binds click handler to the toggle button.
 *
 * @returns {void}
 */
export function initTheme() {
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  const toggleBtn = document.querySelector("#theme-toggle-btn");
  if (!toggleBtn) return;

  const updateButtonState = (theme) => {
    toggleBtn.setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
    );
  };

  updateButtonState(initialTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(newTheme);
    updateButtonState(newTheme);
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
}
