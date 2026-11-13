// Play only the selected clip to avoid overlapping audio.
document.querySelectorAll('video').forEach(video => {
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
  });
});
// Gallery filters and an accessible, keyboard-friendly artwork viewer.
(() => {
  const cards = [...document.querySelectorAll('.work-card')];
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(other => {
        const selected = other === button;
        other.classList.toggle('active', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      cards.forEach(card => { card.hidden = category !== 'Semua' && card.dataset.category !== category; });
      const status = document.querySelector('.gallery-hint');
      if (status) status.textContent = `${cards.filter(card => !card.hidden).length} karya ditampilkan`;
    });
  });
  const links = [...document.querySelectorAll('[data-artwork]')];
  if (!links.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'art-viewer';
  dialog.setAttribute('aria-labelledby', 'art-title');
  dialog.setAttribute('aria-describedby', 'art-description');
  dialog.innerHTML = `<div class="viewer-toolbar"><span class="viewer-counter"></span><button type="button" class="viewer-close" aria-label="Tutup gambar">Tutup <span aria-hidden="true">×</span></button></div><div class="viewer-stage"><button type="button" class="viewer-prev" aria-label="Karya sebelumnya">←</button><img class="viewer-image" alt=""><button type="button" class="viewer-next" aria-label="Karya berikutnya">→</button></div><div class="viewer-caption"><div><h2 id="art-title"></h2><p id="art-description"></p></div><a class="viewer-original" target="_blank" rel="noopener noreferrer">Buka gambar asli ↗</a></div>`;
  document.body.append(dialog);
  let collection = [], position = 0, opener;
  const render = () => {
    const current = collection[position];
    const image = dialog.querySelector('.viewer-image');
    image.src = current.href;
    image.alt = current.querySelector('img').alt;
    dialog.querySelector('#art-title').textContent = current.dataset.title;
    dialog.querySelector('#art-description').textContent = current.dataset.description;
    dialog.querySelector('.viewer-original').href = current.href;
    dialog.querySelector('.viewer-counter').textContent = `${String(position + 1).padStart(2, '0')} / ${String(collection.length).padStart(2, '0')}`;
  };
  const move = delta => { position = (position + delta + collection.length) % collection.length; render(); };
  links.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    collection = links.filter(item => !item.closest('.work-card').hidden);
    position = collection.indexOf(link);
    render();
    dialog.showModal();
    document.body.classList.add('viewer-open');
  }));
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.viewer-prev').addEventListener('click', () => move(-1));
  dialog.querySelector('.viewer-next').addEventListener('click', () => move(1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    opener?.focus();
  });
})();
