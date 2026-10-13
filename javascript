/* ================================================================
   SCRIPT.JS — Portfolio Pribadi
   Daftar fitur:
   1.  Loader
   2.  Dark / Light Mode
   3.  Navbar (scroll, hamburger, active link)
   4.  Back to Top
   5.  Typing Animation
   6.  Scroll Reveal + Skill Bar
   7.  Filter Portfolio
   8.  Modal Detail Portfolio
   9.  Lightbox Galeri (foto & video)
   10. Slider Testimoni
   11. Form Kontak → WhatsApp
   12. Tahun Otomatis di Footer
   ================================================================ */

/* ================================================================
   KONFIGURASI — GANTI BAGIAN INI
   ================================================================ */
const CONFIG = {
  // Nomor WhatsApp tujuan (format internasional tanpa "+" dan tanpa spasi)
  waNumber: "6285218788877",

  // Email tujuan (untuk fallback form kontak)
  email: "syarwanhamid372@gmail.com",

  // Kata-kata untuk animasi typing di hero
  typingWords: [
    "Web Developer",
    "Desainer Grafis",
    "Editor Video",
    "Pelajar SMKN 42 Jakarta",
  ],
};

/* ================================================================
   1. LOADER
   ================================================================ */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    // Beri sedikit delay agar animasi terlihat halus
    setTimeout(() => {
      loader.classList.add("hide");
      // Hapus dari alur dokumen setelah transisi selesai
      setTimeout(() => (loader.style.display = "none"), 500);
    }, 600);
  }
});

/* ================================================================
   2. DARK / LIGHT MODE
   ================================================================ */
const themeToggle = document.getElementById("themeToggle");
const rootEl = document.documentElement;

// Ambil tema tersimpan, atau gunakan preferensi sistem
function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Terapkan tema
function applyTheme(theme) {
  rootEl.setAttribute("data-theme", theme);
  const icon = themeToggle.querySelector("i");
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  localStorage.setItem("theme", theme);
}

// Inisialisasi
applyTheme(getInitialTheme());

// Klik tombol toggle
themeToggle.addEventListener("click", () => {
  const current = rootEl.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ================================================================
   3. NAVBAR
   ================================================================ */
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// --- 3a. Efek navbar saat di-scroll ---
function handleNavbarScroll() {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// --- 3b. Hamburger menu ---
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("open");
});

// Tutup menu saat link diklik (khusus mobile)
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
  });
});

// Tutup menu saat klik di luar area navbar (mobile)
document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("open") &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
  }
});

// --- 3c. Active link saat scroll ---
const sections = document.querySelectorAll("section[id]");

function updateActiveLink() {
  const scrollPos = window.scrollY + 120; // offset navbar
  let currentId = "";

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentId}`) {
      link.classList.add("active");
    }
  });
}

// Gabungkan handler scroll (agar lebih hemat performa)
window.addEventListener("scroll", () => {
  handleNavbarScroll();
  updateActiveLink();
  handleBackToTop();
});

// Jalankan sekali saat load
handleNavbarScroll();
updateActiveLink();

/* ================================================================
   4. BACK TO TOP
   ================================================================ */
const backToTop = document.getElementById("backToTop");

function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ================================================================
   5. TYPING ANIMATION
   ================================================================ */
const typingEl = document.getElementById("typing");
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typingEl) return;

  const currentWord = CONFIG.typingWords[wordIndex];
  const speed = isDeleting ? 55 : 110;

  if (!isDeleting) {
    // Mengetik
    typingEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      // Selesai mengetik, tunggu lalu hapus
      isDeleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    // Menghapus
    typingEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % CONFIG.typingWords.length;
    }
  }

  setTimeout(typeLoop, speed);
}

// Mulai animasi typing
setTimeout(typeLoop, 900);

/* ================================================================
   6. SCROLL REVEAL + SKILL BAR
   ================================================================ */
const revealEls = document.querySelectorAll(".reveal");
const skillEls = document.querySelectorAll(".skill");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        // Hentikan observasi setelah muncul (sekali saja)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

// Observer khusus untuk skill bar
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

skillEls.forEach((el) => skillObserver.observe(el));

/* ================================================================
   7. FILTER PORTFOLIO
   ================================================================ */
const filterBtns = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll(".portfolio-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update tombol aktif
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    portfolioCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;

      if (shouldShow) {
        card.classList.remove("hide");
        // Animasi masuk ulang
        card.style.animation = "none";
        // Paksa reflow agar animasi bisa diulang
        void card.offsetWidth;
        card.style.animation = "zoomIn 0.4s ease";
      } else {
        card.classList.add("hide");
      }
    });
  });
});

/* ================================================================
   8. MODAL DETAIL PORTFOLIO
   ================================================================ */
const detailModal = document.getElementById("detailModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalClose = document.getElementById("modalClose");

document.querySelectorAll(".open-detail").forEach((btn) => {
  btn.addEventListener("click", () => {
    modalImg.src = btn.dataset.img || "";
    modalTitle.textContent = btn.dataset.title || "";
    modalDesc.textContent = btn.dataset.desc || "";
    detailModal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

function closeModal() {
  detailModal.classList.remove("open");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) closeModal();
});

/* ================================================================
   9. LIGHTBOX GALERI (FOTO & VIDEO)
   ================================================================ */
const lightbox = document.getElementById("lightbox");
const lbContent = document.getElementById("lbContent");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
let currentGalleryIndex = 0;

// Cek apakah URL video adalah YouTube
function isYouTube(url) {
  return /youtube\.com|youtu\.be/i.test(url);
}

// Bangun konten lightbox berdasarkan tipe
function buildLightboxContent(item) {
  const type = item.dataset.type;

  if (type === "video") {
    const src = item.dataset.video || "";

    if (isYouTube(src)) {
      // Embed YouTube
      const iframe = document.createElement("iframe");
      iframe.src = src + (src.includes("?") ? "&autoplay=1" : "?autoplay=1");
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      lbContent.innerHTML = "";
      lbContent.appendChild(iframe);
    } else {
      // Video lokal (file .mp4, .webm, dll)
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      lbContent.innerHTML = "";
      lbContent.appendChild(video);
    }
  } else {
    // Gambar
    const img = document.createElement("img");
    img.src = item.dataset.src || item.querySelector("img").src;
    img.alt = item.querySelector("img")?.alt || "Foto galeri";
    lbContent.innerHTML = "";
    lbContent.appendChild(img);
  }
}

// Buka lightbox
function openLightbox(index) {
  currentGalleryIndex = index;
  buildLightboxContent(galleryItems[currentGalleryIndex]);
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

// Tutup lightbox
function closeLightbox() {
  lightbox.classList.remove("open");
  lbContent.innerHTML = ""; // Hentikan video yang sedang berjalan
  document.body.style.overflow = "";
}

// Navigasi lightbox
function navigateLightbox(step) {
  currentGalleryIndex =
    (currentGalleryIndex + step + galleryItems.length) % galleryItems.length;
  buildLightboxContent(galleryItems[currentGalleryIndex]);
}

// Event listener galeri
galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => navigateLightbox(-1));
lbNext.addEventListener("click", () => navigateLightbox(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation & Escape
document.addEventListener("keydown", (e) => {
  // Tutup lightbox
  if (e.key === "Escape") {
    if (lightbox.classList.contains("open")) closeLightbox();
    if (detailModal.classList.contains("open")) closeModal();
  }
  // Navigasi lightbox dengan arrow key
  if (lightbox.classList.contains("open")) {
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  }
});

/* ================================================================
   10. SLIDER TESTIMONI
   ================================================================ */
const testiTrack = document.getElementById("testiTrack");
const testiCards = document.querySelectorAll(".testi-card");
const testiPrev = document.getElementById("testiPrev");
const testiNext = document.getElementById("testiNext");
const testiDots = document.getElementById("testiDots");
const testiWrapper = document.querySelector(".testi-wrapper");

let testiIndex = 0;
let testiTimer = null;

// Buat titik navigasi (dots) otomatis
function buildDots() {
  testiDots.innerHTML = "";
  testiCards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Testimoni ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToTesti(i));
    testiDots.appendChild(dot);
  });
}

// Pindah ke slide tertentu
function goToTesti(index) {
  testiIndex = (index + testiCards.length) % testiCards.length;
  testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;

  // Update dots
  const dots = testiDots.querySelectorAll("button");
  dots.forEach((d, i) => d.classList.toggle("active", i === testiIndex));
}

// Auto play
function startTestiAutoplay() {
  stopTestiAutoplay();
  testiTimer = setInterval(() => goToTesti(testiIndex + 1), 6000);
}

function stopTestiAutoplay() {
  if (testiTimer) clearInterval(testiTimer);
}

// Event listener
testiNext.addEventListener("click", () => {
  goToTesti(testiIndex + 1);
  startTestiAutoplay();
});

testiPrev.addEventListener("click", () => {
  goToTesti(testiIndex - 1);
  startTestiAutoplay();
});

// Pause saat hover
testiWrapper.addEventListener("mouseenter", stopTestiAutoplay);
testiWrapper.addEventListener("mouseleave", startTestiAutoplay);

// Swipe support (mobile)
let touchStartX = 0;
let touchEndX = 0;

testiWrapper.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopTestiAutoplay();
  },
  { passive: true }
);

testiWrapper.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToTesti(testiIndex + 1);
      else goToTesti(testiIndex - 1);
    }
    startTestiAutoplay();
  },
  { passive: true }
);

// Inisialisasi slider
buildDots();
startTestiAutoplay();

/* ================================================================
   11. FORM KONTAK → WHATSAPP
   ================================================================ */
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const pesan = document.getElementById("pesan").value.trim();

  // Validasi sederhana
  if (!nama || !email || !pesan) {
    formNote.style.color = "#ef4444";
    formNote.textContent = "Mohon lengkapi semua kolom terlebih dahulu.";
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    formNote.style.color = "#ef4444";
    formNote.textContent = "Format email tidak valid.";
    return;
  }

  // Susun pesan WhatsApp
  const teksPesan =
    `Halo, saya ${nama}.\n\n` +
    `Email: ${email}\n\n` +
    `Pesan:\n${pesan}`;

  const waURL = `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(
    teksPesan
  )}`;

  // Buka WhatsApp di tab baru
  window.open(waURL, "_blank", "noopener");

  // Tampilkan notifikasi ke pengguna
  formNote.style.color = "";
  formNote.textContent =
    "Membuka WhatsApp... Jika tidak terbuka, silakan hubungi langsung.";

  // Reset form
  contactForm.reset();

  setTimeout(() => {
    formNote.textContent = "";
  }, 6000);
});

/* ================================================================
   12. TAHUN OTOMATIS DI FOOTER
   ================================================================ */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ================================================================
   SMOOTH SCROLL (fallback untuk browser lama)
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80; // tinggi navbar
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});
