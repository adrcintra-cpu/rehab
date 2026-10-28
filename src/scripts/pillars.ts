/** Shared state for scroll progression and optional keyboard/pointer navigation. */
export function selectPillar(index: number) {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-pillar]')];
  if (!Number.isInteger(index) || index < 0 || index >= buttons.length) return;
  const explorer = document.querySelector<HTMLElement>('[data-method]');
  const previous = Number(explorer?.dataset.activePillar || 0);
  if (explorer) {
    explorer.dataset.readingDirection = index < previous ? 'backward' : 'forward';
    explorer.dataset.activePillar = String(index);
    explorer.classList.add('has-pillar-selection');
  }
  const panels = document.querySelector<HTMLElement>('.pillar-panels');
  if (panels) panels.hidden = false;
  buttons.forEach((button, i) => {
    button.classList.toggle('active', i === index);
    button.setAttribute('aria-expanded', String(i === index));
  });
  document.querySelectorAll('.pillar-panel').forEach((panel, i) => panel.classList.toggle('selected', i === index));
}
