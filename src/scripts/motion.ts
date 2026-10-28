/** Motion enhancement: native scroll, no animation library or continuous idle loop. */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const headings = [...document.querySelectorAll<HTMLElement>('.hero h1, main h2, .quote blockquote p')];

// Preserve semantic headings, inline emphasis, whitespace and screen-reader text.
for (const heading of headings) {
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  let index = 0;
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of (node.textContent || '').split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { fragment.append(document.createTextNode(part)); continue; }
      const word = document.createElement('span');
      word.className = 'motion-word';
      const inner = document.createElement('span');
      inner.className = 'motion-word-inner'; inner.textContent = part;
      inner.style.setProperty('--word-delay', `${Math.min(index * 45, 500)}ms`);
      word.append(inner); fragment.append(word); index++;
    }
    node.replaceWith(fragment);
  }
  heading.classList.add('motion-text');
}

const textObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add('text-entered'); textObserver?.unobserve(entry.target);
  }
}, { threshold: .12, rootMargin: '0px 0px -20px 0px' }) : null;
headings.forEach(heading => textObserver ? textObserver.observe(heading) : heading.classList.add('text-entered'));

const layers = [
  ...document.querySelectorAll<HTMLElement>('.hero-logo, .hero-photo, .hero-art .art-orbit, .mentor-portrait img:not(.mentor-photo), .quote-mark'),
].map(element => ({ element, host: element.closest<HTMLElement>('.hero-art, .mentor-portrait, .quote')!, depth: element.classList.contains('hero-photo') ? -.04 : element.classList.contains('hero-logo') ? -.12 : element.classList.contains('orbit-two') ? -.07 : .09 }));
const quote = document.querySelector<HTMLElement>('.quote');
const quoteWords = [...document.querySelectorAll<HTMLElement>('.quote .motion-word-inner')];
let frame = 0;
function renderMotion() {
  frame = 0;
  if (reducedMotion.matches || document.hidden) return;
  const height = window.innerHeight;
  const mobileFactor = window.innerWidth <= 900 ? .45 : 1;
  // Read geometry in one phase before updating compositor-friendly properties.
  const positions = layers.map(layer => ({ ...layer, rect: layer.host.getBoundingClientRect() }));
  const quoteRect = quote?.getBoundingClientRect();
  for (const { element, rect, depth } of positions) {
    if (rect.bottom < -100 || rect.top > height + 100) continue;
    const distance = Math.max(-65, Math.min(65, (height / 2 - rect.top - rect.height / 2) * depth * mobileFactor));
    element.style.setProperty('--parallax-y', `${distance.toFixed(2)}px`);
  }
  if (quoteRect && quoteRect.bottom > 0 && quoteRect.top < height) {
    const progress = Math.max(0, Math.min(1, (height * .9 - quoteRect.top) / (height * .75)));
    quoteWords.forEach((word, index) => {
      const active = Math.max(0, Math.min(1, progress * (quoteWords.length + 3) - index));
      word.style.setProperty('--reading-opacity', String(.4 + active * .6));
    });
  }
}
function scheduleMotion() {
  if (!frame && !reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(renderMotion);
}
function syncPreference() {
  document.documentElement.classList.toggle('motion-enabled', !reducedMotion.matches);
  if (reducedMotion.matches) {
    cancelAnimationFrame(frame); frame = 0;
    layers.forEach(({ element }) => element.style.removeProperty('--parallax-y'));
    quoteWords.forEach(word => word.style.removeProperty('--reading-opacity'));
    headings.forEach(heading => heading.classList.add('text-entered'));
  } else scheduleMotion();
}
window.addEventListener('scroll', scheduleMotion, { passive: true });
window.addEventListener('resize', scheduleMotion, { passive: true });
document.addEventListener('visibilitychange', scheduleMotion);
reducedMotion.addEventListener('change', syncPreference);
document.fonts.ready.then(scheduleMotion);
syncPreference();

// Pointer effects remain confined to decorative layers; no cursor replacement.
const heroArt = document.querySelector<HTMLElement>('.hero-art');
let pointerFrame = 0;
let pointerX = 0;
let pointerY = 0;
heroArt?.addEventListener('pointermove', event => {
  if (!finePointer.matches || reducedMotion.matches) return;
  const rect = heroArt.getBoundingClientRect();
  pointerX = ((event.clientX - rect.left) / rect.width - .5) * 12;
  pointerY = ((event.clientY - rect.top) / rect.height - .5) * 10;
  if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
    heroArt.style.setProperty('--pointer-x', `${pointerX.toFixed(2)}px`);
    heroArt.style.setProperty('--pointer-y', `${pointerY.toFixed(2)}px`);
    pointerFrame = 0;
  });
});
function resetPointer() {
  cancelAnimationFrame(pointerFrame); pointerFrame = 0;
  heroArt?.style.removeProperty('--pointer-x'); heroArt?.style.removeProperty('--pointer-y');
}
heroArt?.addEventListener('pointerleave', resetPointer);
finePointer.addEventListener('change', resetPointer);
reducedMotion.addEventListener('change', resetPointer);
