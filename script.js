document.addEventListener('DOMContentLoaded', () => {
    // =================  ALERT   =================
  window.onload = function() {
    alert("⚠️ Sedang dalam pengembangan. Beberapa fitur mungkin belum berfungsi dan belum sempurna.");
  }
  // ================= CAROUSEL =================
  const track = document.querySelector('.carousel-track');
  let slides = Array.from(track.children);

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  slides = Array.from(track.children);
  let index = 1;
  let slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = `translateX(${-slideWidth * index}px)`;

  setInterval(() => moveSlide(1), 3500);

  function moveSlide(direction) {
    index += direction;
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(${-slideWidth * index}px)`;
  }

  track.addEventListener('transitionend', () => {
    if(slides[index] === firstClone) index = 1;
    else if(slides[index] === lastClone) index = slides.length - 2;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-slideWidth * index}px)`;
  });

  window.addEventListener('resize', () => {
    slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-slideWidth * index}px)`;
  });

  // ================= BUTTON ACTIVE =================
  const container = document.querySelector('.categories');
  if(container) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if(!btn || !container.contains(btn)) return;

      container.querySelectorAll('button').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed','false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
    });
  }

  // ================= SWITCH MENU + LOAD MORE =================
  const buttons = document.querySelectorAll('.categories button');
  const grids = document.querySelectorAll('.topup-grid');
  const loadMoreBtn = document.getElementById('loadMore');
  let visibleCount = 9;

  function updateLoadMore(grid) {
    const activeGrid = grid || Array.from(grids).find(g => g.style.display === 'grid');
    if(!activeGrid) return;
    const items = activeGrid.querySelectorAll('.grid-item');
    loadMoreBtn.style.display = visibleCount < items.length ? 'inline-block' : 'none';
  }

  function showItems(grid, count, animateNewOnly = true) {
    const items = grid.querySelectorAll('.grid-item');
    const prevVisible = visibleCount;
    visibleCount = Math.min(count, items.length);

    items.forEach((item, i) => {
      if(i < visibleCount) {
        item.style.display = 'flex';
        if(!animateNewOnly || !item.classList.contains('show')) {
          setTimeout(() => item.classList.add('show'), (i - prevVisible >= 0 ? i - prevVisible : 0) * 100);
        }
      } else {
        item.style.display = 'none';
      }
    });

    updateLoadMore(grid);
  }

  // ================= INISIALISASI PERTAMA =================
  const firstGrid = document.querySelector('.topup-grid');
  if(firstGrid) {
    grids.forEach(g => {
      if(g !== firstGrid) showItems(g, 0, false);
      else g.style.display = 'grid';
    });
    showItems(firstGrid, visibleCount, false); // grid awal 3x3 langsung muncul tanpa animasi
  }

  // ================= TOMBOL KATEGORI =================
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const activeGrid = document.getElementById(target);
      if(!activeGrid) return;

      grids.forEach(g => showItems(g, 0, false)); // sembunyikan semua grid tanpa animasi
      activeGrid.style.display = 'grid';
      showItems(activeGrid, 9, true); // animasi muncul grid body {
    });
  });

  // ================= TOMBOL LOAD MORE =================
  loadMoreBtn.addEventListener('click', () => {
    const activeGrid = Array.from(grids).find(g => g.style.display === 'grid');
    if(!activeGrid) return;

    const nextCount = visibleCount + 9;
    showItems(activeGrid, nextCount, true); // animasi hanya untuk item baru
  });
});


// ================= DROPDOWN MENU =================
const menuBtn = document.querySelector('.box2');
const dropdown = document.getElementById('dropdownMenu');

menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
});

// Tutup dropdown kalau klik di luar
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});
