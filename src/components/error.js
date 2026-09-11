/**
 * Render error component
 * @param {HTMLElement} container - Container for an object
 * @param {string} message - Error message
 * @param {Function} onRetry - Callback for a button
 */
export function createError(container, message, onRetry) {
  container.innerHTML = `
    <div class="error-state">
      <h3 class="error-title">Упс! Что-то пошло не так</h3>
      <p class="error-message">${message}</p>

    </div>
  `;
  if (onRetry) {
    const retryBtn = document.createElement("button");
    retryBtn.className = "btn btn-primary btn-retry";
    retryBtn.id = "retry-btn";
    retryBtn.innerText = "Попробовать снова";
    document.querySelector(".error-state").appendChild(retryBtn);
    retryBtn.addEventListener("click", onRetry);
  }
}
