(function () {
  var WA_E164 = "905071450507";

  function initForm(form) {
    if (form.dataset.rsvpWaInit === "1") return;
    form.dataset.rsvpWaInit = "1";

    var nameInput = form.querySelector('[name="rsvp_name"]');
    var guestsInput = form.querySelector('[name="rsvp_guests"]');
    var guestsHint = form.querySelector(".js-rsvp-guests-hint");
    var errEl = form.querySelector(".js-rsvp-error");

    if (!nameInput || !guestsInput || !errEl) return;

    var guestsLabel = guestsInput.id
      ? form.querySelector('label[for="' + guestsInput.id + '"]')
      : null;

    function hideError() {
      errEl.textContent = "";
      errEl.setAttribute("hidden", "");
      errEl.style.display = "none";
    }

    function showError(msg) {
      errEl.textContent = msg;
      errEl.removeAttribute("hidden");
      errEl.style.display = "";
    }

    function setGuestsRowDisabled(disabled) {
      guestsInput.disabled = disabled;
      guestsInput.setAttribute("aria-disabled", disabled ? "true" : "false");
      if (guestsLabel) {
        guestsLabel.textContent = "Toplam kişi sayısı";
      }
      if (guestsHint) {
        guestsHint.classList.toggle("opacity-40", disabled);
        guestsHint.textContent = disabled
          ? "Katılamıyorsanız kişi sayısı mesaja eklenmez."
          : "Lütfen yazan kişi dahil toplam kişi sayısını yazın.";
      }
    }

    function selectedAttendance() {
      var r = form.querySelector('input[name="attendance"]:checked');
      return r ? r.value : "yes";
    }

    form.querySelectorAll('input[name="attendance"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        setGuestsRowDisabled(selectedAttendance() === "no");
        hideError();
      });
    });

    setGuestsRowDisabled(selectedAttendance() === "no");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideError();

      var name = (nameInput.value || "").trim();
      if (!name) {
        showError("Lütfen ad soyad yazın.");
        nameInput.focus();
        return;
      }

      var attending = selectedAttendance() === "yes";
      var msg;

      if (attending) {
        var n = parseInt(String(guestsInput.value), 10);
        if (!Number.isFinite(n) || n < 1) {
          showError("Lütfen geçerli bir kişi sayısı girin (en az 1).");
          guestsInput.focus();
          return;
        }
        msg =
          "Merhaba, " +
          name +
          " olarak katılım bildiriyorum. Yazan kişi dahil toplam kişi sayımız: " +
          n +
          ".";
      } else {
        msg = name + " - Maalesef katılamıyorum";
      }

      var url =
        "https://wa.me/" + WA_E164 + "?text=" + encodeURIComponent(msg);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  function scan() {
    document.querySelectorAll("form.js-rsvp-wa").forEach(initForm);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }
})();
