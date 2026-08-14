/* Lead-capture form: emails go to the Formspree endpoint set in data-endpoint,
   and regardless of whether that succeeds, the visitor's guide download fires
   immediately via data-download so nobody is ever stuck waiting on the email
   integration. */
document.querySelectorAll(".lead-form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const endpoint = form.getAttribute("data-endpoint");
    const downloadUrl = form.getAttribute("data-download");
    const statusEl = form.querySelector(".lead-status");
    const formData = new FormData(form);

    function triggerDownload() {
      if (downloadUrl) {
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.setAttribute("download", "");
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      if (statusEl) statusEl.textContent = "Thanks! Your download should start automatically.";
      form.reset();
    }

    if (endpoint && endpoint !== "#") {
      fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .catch(() => {})
        .finally(triggerDownload);
    } else {
      triggerDownload();
    }
  });
});
