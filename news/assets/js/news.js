// Share function: handle multiple platform names, use Web Share API when tersedia
function shareTo(platform) {
  const url = window.location.href;
  // Prefer .article-title, fallback to document.title or first h2
  const titleEl =
    document.querySelector(".article-title") || document.querySelector("h2");
  const title = encodeURIComponent(
    titleEl && titleEl.innerText ? titleEl.innerText : document.title
  );

  // If Web Share API available and platform === 'native' or on mobile, use it
  if (navigator.share) {
    // you can choose to call this for any platform or add a "Bagikan" generic button
    navigator.share({ title: decodeURIComponent(title), url }).catch((err) => {
      // user cancelled or error — fall back to constructing URL
      // continue to fallback below
      console.log("Web Share API failed or canceled:", err);
    });
    // For devices with native share this is fine; but still continue to fallback for specific platforms:
  }

  let shareUrl = "";

  switch (platform) {
    case "whatsapp":
      // whatsapp web: text param usually contains title + url
      shareUrl =
        "https://wa.me/?text=" + title + "%20" + encodeURIComponent(url);
      break;
    case "telegram":
      shareUrl =
        "https://t.me/share/url?url=" +
        encodeURIComponent(url) +
        "&text=" +
        title;
      break;
    case "facebook":
      shareUrl =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(url);
      break;
    case "twitter":
    case "x":
    case "twitter-x":
    case "twitter_x":
      // handle old/new names
      shareUrl =
        "https://twitter.com/intent/tweet?text=" +
        title +
        "&url=" +
        encodeURIComponent(url);
      break;
    case "linkedin":
      shareUrl =
        "https://www.linkedin.com/shareArticle?mini=true&url=" +
        encodeURIComponent(url) +
        "&title=" +
        title;
      break;
    default:
      // fallback: open generic share page (or do nothing)
      shareUrl =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(url);
  }

  // Open in new window/tab — only if shareUrl is not empty
  if (shareUrl) {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  } else {
    console.warn("No share URL generated for platform:", platform);
  }
}

// helper: show toast (type: 'success' | 'info' | 'warn')
function showToast({ type = "success", title = "Berhasil", message = "" }) {
  const toastEl = document.getElementById("siteToast");
  const titleEl = document.getElementById("siteToastTitle");
  const msgEl = document.getElementById("siteToastMessage");
  const iconEl = document.getElementById("siteToastIcon");

  toastEl.classList.remove("success", "info", "warn");
  toastEl.classList.add(type);
  titleEl.textContent = title;
  msgEl.textContent = message;

  if (type === "success") {
    iconEl.textContent = "✓";
    iconEl.style.background = "#e9f7ef";
    iconEl.style.color = "#0f7a34";
  } else if (type === "info") {
    iconEl.textContent = "i";
    iconEl.style.background = "#e8f4ff";
    iconEl.style.color = "#0a66d6";
  } else if (type === "warn") {
    iconEl.textContent = "!";
    iconEl.style.background = "#fff7e6";
    iconEl.style.color = "#b86b00";
  }

  try {
    const bsToast = new bootstrap.Toast(toastEl);
    bsToast.show();
  } catch (e) {
    // fallback: console log
    console.log(title, message);
  }
}

// Utility: generate storage key unique per article/page
function savedKey() {
  // gunakan pathname + search supaya unik bila ada query string
  return (
    "saved_article::" + (window.location.pathname + window.location.search)
  );
}

// Toggle Simpan
function toggleRead(event) {
  // pastikan tombol benar diambil
  const btn = event && event.currentTarget ? event.currentTarget : null;
  if (!btn) return;

  const isSaved = btn.classList.toggle("is-saved");
  btn.setAttribute("aria-pressed", isSaved ? "true" : "false");

  // icon toggle
  const icon = btn.querySelector("i");
  if (icon) {
    if (isSaved) {
      icon.classList.remove("bi-book");
      icon.classList.add("bi-book-fill");
    } else {
      icon.classList.remove("bi-book-fill");
      icon.classList.add("bi-book");
    }
  }

  // label
  const label = btn.querySelector(".label-text");
  if (label) label.textContent = isSaved ? "Disimpan" : "Simpan";
  else {
    const span = document.createElement("span");
    span.className = "label-text";
    span.textContent = isSaved ? "Disimpan" : "Simpan";
    btn.appendChild(span);
  }

  // simpan status ke localStorage
  try {
    const key = savedKey();
    if (isSaved) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch (e) {
    console.warn("localStorage error", e);
  }

  // feedback
  if (typeof showToast === "function") {
    showToast({
      type: "success",
      title: isSaved ? "Disimpan" : "Dibatalkan",
      message: isSaved
        ? "Berita ditambahkan ke daftar bacaan Anda."
        : "Berita dihapus dari daftar bacaan.",
    });
  }
}

// Restore state saat load — hanya target .btn-save
(function restoreSavedState() {
  try {
    const key = savedKey();
    if (!localStorage.getItem(key)) return;

    // temukan tombol simpan (hanya .btn-save)
    const btn = document.querySelector(".btn-save");
    if (!btn) return;

    btn.classList.add("is-saved");
    btn.setAttribute("aria-pressed", "true");

    const icon = btn.querySelector("i");
    if (icon) {
      icon.classList.remove("bi-book");
      icon.classList.add("bi-book-fill");
    }

    const label = btn.querySelector(".label-text");
    if (label) label.textContent = "Disimpan";
    else
      btn.insertAdjacentHTML(
        "beforeend",
        '<span class="label-text">Disimpan</span>'
      );
  } catch (e) {
    console.warn("restoreSavedState error", e);
  }
})();

// Copy URL (tetap seperti implementasimu)
function copyURL() {
  const url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(
      () => {
        showToast({
          type: "success",
          title: "Link Tersalin",
          message: "Alamat berita berhasil disalin ke clipboard.",
        });
      },
      () => {
        prompt("Salin link ini:", url);
        showToast({
          type: "info",
          title: "Salin Manual",
          message: "Salin link dengan menekan Ctrl+C lalu Enter.",
        });
      }
    );
  } else {
    prompt("Salin link ini:", url);
    showToast({
      type: "info",
      title: "Salin Manual",
      message: "Salin link dengan menekan Ctrl+C lalu Enter.",
    });
  }
}
//