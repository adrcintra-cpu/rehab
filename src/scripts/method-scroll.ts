import { selectPillar } from './pillars';
/** REHAB unfolds from a word into the five-pillar orbit, driven by native scroll. */
const stage = document.querySelector<HTMLElement>('.method-scroll-stage');
const explorer = stage?.querySelector<HTMLElement>('.method-explorer');
const wheel = stage?.querySelector<HTMLElement>('.method-wheel');
const panels = stage?.querySelector<HTMLElement>('.pillar-panels');
const timelineDot = wheel?.querySelector<SVGCircleElement>('.wheel-timeline-dot');
const nodes = [...(wheel?.querySelectorAll<HTMLButtonElement>('.pillar-button') || [])];
const desktop = matchMedia('(min-width: 901px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
let enabled = false;
let lastProgress = -1;
let lastReadingIndex = -1;
const mobileCards = [...document.querySelectorAll<HTMLDetailsElement>('.method-mobile details')];
function paintMobile() {
  const visible = mobileCards.map((card,index) => ({ index, rect: card.getBoundingClientRect() }))
    .filter(({rect}) => rect.bottom > 90 && rect.top < innerHeight);
  if (!visible.length) return;
  const active = visible.reduce((best, card) => Math.abs(card.rect.top + card.rect.height / 2 - innerHeight * .5) < Math.abs(best.rect.top + best.rect.height / 2 - innerHeight * .5) ? card : best).index;
  mobileCards.forEach((card,index) => card.classList.toggle('is-reading', index === active));
}

function paint() {
  frame = 0;
  if (!desktop.matches && !enabled) { paintMobile(); return; }
  if (!enabled) {
    if (reduced.matches && desktop.matches) {
      const visible = [...document.querySelectorAll<HTMLElement>('.pillar-panel')].map((panel,index) => ({index,rect:panel.getBoundingClientRect()})).filter(({rect}) => rect.bottom > 90 && rect.top < innerHeight);
      if (visible.length) {
        const active = visible.reduce((best,panel) => Math.abs(panel.rect.top + panel.rect.height / 2 - innerHeight * .5) < Math.abs(best.rect.top + best.rect.height / 2 - innerHeight * .5) ? panel : best).index;
        if (active !== lastReadingIndex) { selectPillar(active); lastReadingIndex = active; }
      }
    }
    return;
  }
  if (!stage || !explorer || !wheel) return;
  const bounds = stage.getBoundingClientRect();
  const pinTop = parseFloat(getComputedStyle(explorer).top) || 110;
  const travel = Math.max(1, bounds.height - explorer.getBoundingClientRect().height);
  const raw = Math.max(0, Math.min(1, (pinTop - bounds.top) / travel));
  // Keep keyboard targets stable and fully visible as soon as the wheel is focused.
  const formationEnd = desktop.matches ? .30 : .18;
  const formation = Math.min(1, raw / formationEnd);
  const progress = wheel.contains(document.activeElement) ? 1 : formation;
  const reading = Math.max(0, Math.min(1, (raw - formationEnd) / (1 - formationEnd)));
  // One fifth of the orbital path corresponds to each reading interval.
  // At 20%, 40%, 60% and 80%, the head reaches E, H, A and B exactly.
  wheel.style.setProperty('--timeline-offset', String((1 - reading) * 2 * Math.PI * 38));
  const timelineAngle = (reading * 360 - 90) * Math.PI / 180;
  timelineDot?.setAttribute('cx', String(50 + Math.cos(timelineAngle) * 38));
  timelineDot?.setAttribute('cy', String(50 + Math.sin(timelineAngle) * 38));
  const focusedIndex = nodes.indexOf(document.activeElement as HTMLButtonElement);
  const readingIndex = focusedIndex >= 0 ? focusedIndex : Math.min(nodes.length - 1, Math.floor(reading * nodes.length));
  if (readingIndex !== lastReadingIndex) {
    selectPillar(readingIndex);
    lastReadingIndex = readingIndex;
  }
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const smooth = (value: number) => value * value * (3 - 2 * value);
  const eased = smooth(clamp(progress / .65));
  const alignment = smooth(clamp((progress - .65) / .35));
  const wheelBounds = wheel.getBoundingClientRect();
  const explorerBounds = explorer.getBoundingClientRect();
  const size = wheelBounds.width;
  const stageWidth = explorerBounds.width;
  const wheelSlotCenter = wheel.offsetLeft + wheel.offsetWidth / 2;
  const centerShift = desktop.matches ? stageWidth / 2 - wheelSlotCenter : 0;
  wheel.style.setProperty('--wheel-shift', `${(centerShift * (1 - alignment)).toFixed(2)}px`);
  const startDiameter = Math.min(170, stageWidth * .135);
  const endDiameter = Math.min(96, Math.max(58, size * .17));
  const diameter = startDiameter + (endDiameter - startDiameter) * eased;
  wheel.style.setProperty('--node-size', `${diameter.toFixed(2)}px`);
  wheel.style.setProperty('--letter-size', `${(diameter * .43).toFixed(2)}px`);
  const ready = progress > .985;
  stage.classList.toggle('orbit-ready', ready);
  if (panels) panels.inert = !ready;
  wheel.style.setProperty('--orbit-progress', String(eased));
  wheel.style.setProperty('--orbit-reveal', String(Math.max(0, Math.min(1, (eased - .25) / .55))));
  nodes.forEach((node, index) => {
    const angle = (index * 72 - 90) * Math.PI / 180;
    const fromX = (index - 2) * stageWidth * .185;
    const toX = Math.cos(angle) * size * .38;
    const toY = Math.sin(angle) * size * .38;
    node.style.setProperty('--node-x', `${(fromX + (toX - fromX) * eased).toFixed(2)}px`);
    const arc = Math.sin(Math.PI * eased) * size * [-.10, -.25, .20, .45, .05][index];
    node.style.setProperty('--node-y', `${(toY * eased + arc).toFixed(2)}px`);
  });
  // Useful diagnostic state, without triggering layout or announcing every frame.
  if (Math.abs(progress - lastProgress) > .001) {
    wheel.dataset.formation = progress < .01 ? 'word' : progress > .99 ? 'circle' : 'unfolding';
    lastProgress = progress;
  }
}
function schedule() {
  if (stage && !frame && !document.hidden) frame = requestAnimationFrame(paint);
}
function sync() {
  enabled = !reduced.matches;
  stage?.classList.toggle('orbit-scroll-enabled', enabled);
  const mobile = !desktop.matches;
  stage?.classList.toggle('method-static-reading', desktop.matches && reduced.matches);
  document.querySelector('.method-mobile')?.classList.toggle('auto-reading', mobile);
  mobileCards.forEach(card => { if (mobile) card.open = true; });
  if (!enabled) {
    cancelAnimationFrame(frame); frame = 0;
    ['--orbit-progress', '--orbit-reveal', '--wheel-shift', '--node-size', '--letter-size', '--timeline-offset'].forEach(property => wheel?.style.removeProperty(property));
    stage?.classList.add('orbit-ready');
    if (panels) panels.inert = false;
    nodes.forEach(node => { node.style.removeProperty('--node-x'); node.style.removeProperty('--node-y'); });
    if (wheel) delete wheel.dataset.formation;
    lastProgress = -1;
  } else paint();
  if (mobile || reduced.matches) schedule();
}
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });
wheel?.addEventListener('click', schedule);
wheel?.addEventListener('keydown', schedule);
wheel?.addEventListener('focusin', schedule);
wheel?.addEventListener('focusout', schedule);
document.addEventListener('visibilitychange', schedule);
desktop.addEventListener('change', sync);
reduced.addEventListener('change', sync);
document.fonts.ready.then(schedule);
sync();

// Resume scroll reading after an explicit pointer selection.
window.addEventListener('wheel', () => {
  if (wheel?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
}, { passive: true });
