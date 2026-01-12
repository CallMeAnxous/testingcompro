const NEWS_DATA = [
  {
    id: 1,
    title:
      "PT Mili Talenta Inspirasi Luncurkan Program Pelatihan SDM Modern untuk Generasi Siap Kerja",
    excerpt:
      "PT Mili Talenta Inspirasi meluncurkan program pelatihan terbaru yang dirancang secara komprehensif dengan menggabungkan pendekatan praktis, pembelajaran berbasis proyek, dan pemanfaatan teknologi modern. Program ini bertujuan untuk mempersiapkan peserta agar memiliki kompetensi teknis maupun soft skill yang dibutuhkan oleh dunia industri saat ini. Tidak hanya fokus pada peningkatan skill teknis, pelatihan ini juga menekankan kemampuan komunikasi, pemecahan masalah, profesionalisme kerja, serta pemahaman etika industri sehingga peserta benar-benar siap masuk ke lingkungan kerja nyata 。。。",
    thumb: "/assets/img/news/news-1.png",
    date: "24 Nov 2025",
    tags: ["Pelatihan"],
  },
  {
    id: 2,
    title:
      "Sertifikasi Kompetensi Nasional: MTI Dorong Peserta Tingkatkan Daya Saing di Dunia Kerja",
    excerpt:
      "PT Mili Talenta Inspirasi kembali memperkuat komitmennya dalam meningkatkan kualitas dan kesiapan tenaga kerja melalui program Sertifikasi Kompetensi Nasional yang diselenggarakan bekerja sama dengan sejumlah lembaga sertifikasi profesi (LSP) terakreditasi. Program ini dirancang khusus untuk memastikan setiap peserta memiliki standar kemampuan sesuai kebutuhan industri modern 。。。",
    thumb: "/assets/img/news/news-2.png",
    date: "20 Nov 2025",
    tags: ["Sertifikasi"],
  },
  {
    id: 3,
    title:
      "Ekspansi Besar: PT Mili Talenta Inspirasi Resmikan 12 Mitra Industri Baru untuk Mendukung Penyerapan Tenaga Kerja",
    excerpt:
      "PT Mili Talenta Inspirasi resmi mengumumkan penambahan 12 mitra industri baru dari berbagai sektor strategis, mulai dari manufaktur, jasa profesional, logistik, hingga teknologi digital. Langkah ini menjadi salah satu ekspansi kemitraan terbesar dalam sejarah perusahaan dan bertujuan untuk membuka jalur penempatan kerja yang lebih luas bagi peserta pelatihan 。。。",
    thumb: "/assets/img/news/news-3.png",
    date: "15 Nov 2025",
    tags: ["Mitra, Pelatihan"],
  },
  {
    id: 4,
    title:
      "Digitalisasi Pelatihan: Peserta Kini Bisa Mengakses Modul Pembelajaran Melalui Platform Online MTI Academy",
    excerpt:
      "Menjawab kebutuhan fleksibilitas pembelajaran di era digital, PT Mili Talenta Inspirasi secara resmi merilis platform MTI Academy—sebuah sistem pembelajaran online yang dirancang untuk mempermudah peserta mengakses materi kapan saja dan di mana saja 。。。",
    thumb: "/assets/img/news/news-4.png",
    date: "08 Nov 2025",
    tags: ["Digital", "Pelatihan"],
  },
  {
    id: 5,
    title:
      "Peningkatan Kompetensi untuk UMKM: MTI Luncurkan Pelatihan Khusus Digital Marketing & Branding Produk",
    excerpt:
      "Meningkatnya kebutuhan UMKM dalam memperkuat kehadiran digital mendorong PT Mili Talenta Inspirasi untuk meluncurkan program pelatihan Digital Marketing dan Branding Produk khusus bagi pelaku usaha kecil dan menengah. Program ini dirancang untuk membantu UMKM memahami strategi pemasaran modern agar dapat bersaing di pasar yang semakin kompetitif 。。。",
    thumb: "/assets/img/news/news-5.png",
    date: "02 Nov 2025",
    tags: ["UMKM", "Pelatihan"],
  },
  // tambahkan data lebih banyak jika perlu...
];

/***** Config *****/
const PAGE_SIZE = 4;
let currentPage = 1;
let currentView = "grid"; // or 'list'
let currentTag = "all";
let currentQuery = "";

const container = document.getElementById("news-container");
const paginationEl = document.getElementById("news-pagination");
const showCountEl = document.getElementById("show-count");
const noResultsEl = document.getElementById("no-results");

function filterData() {
  let filtered = NEWS_DATA.filter((item) => {
    // normalize tags: support array of strings and comma-separated values
    const tagsArr = (Array.isArray(item.tags) ? item.tags : [item.tags])
      .map((t) => String(t || "").split(",").map((s) => s.trim()))
      .flat()
      .filter(Boolean)
      .map((s) => s.toLowerCase());

    if (currentTag !== "all" && !tagsArr.includes(String(currentTag).toLowerCase())) return false;
    if (currentQuery) {
      const q = currentQuery.toLowerCase();
      const tagsString = tagsArr.join(" ");
      return (
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        tagsString.includes(q)
      );
    }
    return true;
  });
  return filtered;
}

function renderList() {
  const filtered = filterData();
  const total = filtered.length;
  const pages = Math.ceil(total / PAGE_SIZE) || 1;
  if (currentPage > pages) currentPage = pages;

  // pagination slice
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  // update show count
  showCountEl.textContent = `Menampilkan ${Math.min(
    total,
    PAGE_SIZE
  )} dari ${total} berita`;

  // clear
  container.innerHTML = "";

  if (pageItems.length === 0) {
    noResultsEl.style.display = "block";
    paginationEl.innerHTML = "";
    return;
  } else {
    noResultsEl.style.display = "none";
  }

  // add class for view
  if (currentView === "list") {
    container.classList.add("list-view");
    container.style.display = "block";
  } else {
    container.classList.remove("list-view");
    container.style.display = "grid";
  }

  // render cards
  pageItems.forEach((it) => {
    const card = document.createElement("article");
    card.className = "news-card";

    // card inner HTML differs slightly between grid and list
    if (currentView === "list") {
      card.innerHTML = `
            <img class="thumb" src="${it.thumb}" alt="${escapeHtml(
        it.title
      )}" loading="lazy" />
            <div class="card-body">
              <div class="card-title">${escapeHtml(it.title)}</div>
              <div class="card-meta"><span><i class="bi bi-calendar"></i> ${
                it.date
              }</span><span>•</span><span>${it.tags.join(", ")}</span></div>
              <div class="card-excerpt mt-2">${escapeHtml(it.excerpt)}</div>
              <div class="card-actions">
                <a class="btn btn-sm btn-primary btn-no-outline" href="news-${
                  it.id
                }.html">Baca Selengkapnya</a>
                <button class="btn btn-sm btn-outline-secondary btn-no-outline" onclick="openShareMenu(event)">Bagikan</button>
              </div>
            </div>
          `;
    } else {
      // grid
      card.innerHTML = `
            <img class="thumb" src="${it.thumb}" alt="${escapeHtml(
        it.title
      )}" loading="lazy" />
            <div class="card-body">
              <div class="card-title">${escapeHtml(it.title)}</div>
              <div class="card-meta"><span><i class="bi bi-calendar"></i> ${
                it.date
              }</span><span>•</span><span>${it.tags.join(", ")}</span></div>
              <div class="card-excerpt mt-2">${escapeHtml(it.excerpt)}</div>
              <div class="card-actions">
                <a class="btn btn-sm btn-primary btn-no-outline" href="news-${
                  it.id
                }.html">Baca Selengkapnya</a>
                <button class="btn btn-sm btn-outline-secondary btn-no-outline" onclick="openShareMenu(event)"><i class="bi bi-share-fill"></i> Bagikan</button>
              </div>
            </div>
          `;
    }
//
    container.appendChild(card);
  });

  // pagination
  renderPagination(pages);
}

function renderPagination(pages) {
  paginationEl.innerHTML = "";
  if (pages <= 1) return;
  // prev
  const prev = document.createElement("button");
  prev.className = "btn btn-outline-secondary btn-no-outline";
  prev.textContent = "<";
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    renderList();
  };
  paginationEl.appendChild(prev);

  for (let p = 1; p <= pages; p++) {
    const b = document.createElement("button");
    b.className = "btn btn-outline-secondary btn-no-outline";
    if (p === currentPage) b.className = "btn btn-primary btn-no-outline";
    b.textContent = p;
    b.onclick = () => {
      currentPage = p;
      renderList();
    };
    paginationEl.appendChild(b);
  }

  const next = document.createElement("button");
  next.className = "btn btn-outline-secondary btn-no-outline";
  next.textContent = ">";
  next.disabled = currentPage === pages;
  next.onclick = () => {
    currentPage++;
    renderList();
  };
  paginationEl.appendChild(next);
}

/* helpers */
function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
    }[m];
  });
}

/* events */
document.getElementById("grid-view").addEventListener("click", () => {
  currentView = "grid";
  renderList();
});
document.getElementById("list-view").addEventListener("click", () => {
  currentView = "list";
  renderList();
});

document.getElementById("news-search").addEventListener("input", (e) => {
  currentQuery = e.target.value.trim();
  currentPage = 1;
  renderList();
});

// tag filter
document.querySelectorAll("#tag-filter .tag").forEach((el) => {
  el.addEventListener("click", () => {
    document
      .querySelectorAll("#tag-filter .tag")
      .forEach((x) => x.classList.remove("active"));
    el.classList.add("active");
    currentTag = el.dataset.tag;
    currentPage = 1;
    renderList();
  });
});

// expose helper so external scripts (eg. on-load URL tag handler) can trigger filter
window.filterNewsByTag = function (tag) {
  currentTag = tag || 'all';
  currentPage = 1;
  renderList();
};

// initial render
renderList();

/* openShareMenu fallback (uses Web Share API or custom) */
function openShareMenu(e) {
  const url = window.location.href;
  const title =
    document.querySelector(".card-title")?.innerText || document.title;
  if (navigator.share) {
    navigator.share({ title: title, text: title, url: url }).catch(() => {
      /* ignore */
    });
    return;
  }
  // fallback simple: copy url and notify
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link artikel disalin ke clipboard (fallback)."));
  } else {
    prompt("Salin link ini:", url);
  }
}
