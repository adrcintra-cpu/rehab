import { selectPillar } from './pillars';
import './method-scroll';
import './motion';
import { challenges } from '../data/content';
const root = document.documentElement;
root.classList.add('js');
const header = document.querySelector<HTMLElement>('.site-header');
const menu = document.querySelector<HTMLElement>('#main-nav');
const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const closeMenu = (focus = false) => {
  menu?.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false');
  if (focus) toggle?.focus();
};
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open)); menu?.classList.toggle('open', open);
});
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(true); });
document.addEventListener('click', e => { if (e.target instanceof Node && !header?.contains(e.target)) closeMenu(); });
header?.addEventListener('focusout', () => { setTimeout(() => { if (!header.contains(document.activeElement)) closeMenu(); }, 0); });
const desktop = window.matchMedia('(min-width: 901px)');
desktop.addEventListener('change', () => closeMenu());
const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 25);
window.addEventListener('scroll', updateHeader, { passive: true }); updateHeader();
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-pillar]')];
buttons.forEach((button, index) => {
  button.addEventListener('click', () => selectPillar(index));
  button.addEventListener('keydown', e => {
    let next = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % buttons.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = buttons.length - 1;
    else return;
    e.preventDefault(); selectPillar(next); buttons[next]?.focus();
  });
});
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); reveals.unobserve(e.target); } }), { threshold: .08 });
  document.querySelectorAll('[data-reveal]').forEach(el => reveals.observe(el));
  const progress = new IntersectionObserver(entries => entries.forEach(e => { e.target.classList.toggle('in-view', e.isIntersecting); }), { threshold: .45 });
  document.querySelectorAll('[data-step]').forEach(el => progress.observe(el));
  const fixedCTA = document.querySelector('.mobile-cta');
  const formSection = document.querySelector('#participar');
  if (formSection) new IntersectionObserver(entries => entries.forEach(e => fixedCTA?.classList.toggle('is-hidden', e.isIntersecting)), { threshold: .05 }).observe(formSection);
} else document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
const form = document.querySelector<HTMLFormElement>('#lead-form');
if (form) {
  const phone = form.elements.namedItem('phone') as HTMLInputElement;
  phone.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '').slice(0, 11);
    phone.value = digits.length > 2 ? `(${digits.slice(0, 2)}) ${digits.slice(2, digits.length > 10 ? 7 : 6)}${digits.length > 6 ? '-' + digits.slice(digits.length > 10 ? 7 : 6) : ''}` : digits;
  });
  const status = form.querySelector<HTMLElement>('#form-status')!;
  const submit = form.querySelector<HTMLButtonElement>('[type=submit]')!;
  const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
  let pending = false;
  let requestKey = '';
  let lastPayload = '';
  const setStatus = (text: string, state: string) => { status.textContent = text; status.className = `form-status ${state}`; };
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (pending) return;
    const data = new FormData(form);
    let firstInvalid: HTMLElement | null = null;
    const rules: Record<string, string> = {
      name: String(data.get('name') || '').trim().length >= 3 ? '' : 'Informe seu nome completo.',
      clinic: String(data.get('clinic') || '').trim().length >= 2 ? '' : 'Informe o nome da clínica.',
      email: (form.elements.namedItem('email') as HTMLInputElement).validity.valid ? '' : 'Informe um e-mail válido.',
      phone: /^\(?[1-9]{2}\)?\s?\d{4,5}-?\d{4}$/.test(phone.value) ? '' : 'Informe o WhatsApp com DDD.',
      challenge: challenges.includes(String(data.get('challenge'))) ? '' : 'Selecione o principal desafio.',
      consent: data.get('consent') ? '' : 'O consentimento é necessário para solicitar contato.',
    };
    for (const [name, message] of Object.entries(rules)) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
      field.setAttribute('aria-invalid', String(Boolean(message)));
      const error = document.getElementById(`${name}-error`); if (error) error.textContent = message;
      if (message && !firstInvalid) firstInvalid = field;
    }
    if (firstInvalid) { setStatus('Revise os campos indicados.', 'error'); firstInvalid.focus(); return; }
    if (data.get('website')) { setStatus('Não foi possível enviar. Revise o formulário.', 'error'); return; }
    const endpoint = form.dataset.endpoint;
    if (!endpoint) { setStatus('O envio ainda não está disponível. O canal de contato e a Política de Privacidade estão em preparação. Nenhum dado foi enviado.', 'error'); return; }
    const payload: Record<string, unknown> = {
      name: String(data.get('name')).trim(), clinic: String(data.get('clinic')).trim(),
      email: String(data.get('email')).trim(), phone: phone.value.replace(/\D/g, ''),
      challenge: data.get('challenge'), consent: true,
      consentText: form.querySelector('label[for="consent"]')?.textContent?.trim(),
      source: window.location.origin + window.location.pathname,
    };
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const value = params.get(key); if (value) utm[key] = value.slice(0, 200);
    }
    if (Object.keys(utm).length) payload.utm = utm;
    const serialized = JSON.stringify(payload);
    if (serialized !== lastPayload) { requestKey = crypto.randomUUID(); lastPayload = serialized; }
    pending = true; submit.disabled = true; form.setAttribute('aria-busy', 'true'); label.textContent = 'Enviando solicitação…'; setStatus('Enviando seus dados com segurança…', '');
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const url = new URL(endpoint, window.location.origin);
      if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') throw new Error('Invalid endpoint');
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey }, body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }), signal: controller.signal });
      if (!response.ok) throw new Error('Submission failed');
      const receipt: unknown = await response.json();
      if (!receipt || typeof receipt !== 'object' || !('success' in receipt) || receipt.success !== true) throw new Error('Missing confirmation');
      setStatus('Solicitação recebida. A equipe entrará em contato com você.', 'success');
      form.reset(); form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
      form.dispatchEvent(new CustomEvent('rehab:lead-confirmed', { bubbles: true }));
      requestKey = ''; lastPayload = '';
    } catch {
      setStatus('Não foi possível confirmar o envio. Tente novamente em instantes. Seus dados permanecem no formulário.', 'error');
    } finally {
      clearTimeout(timeout); pending = false; submit.disabled = false; form.removeAttribute('aria-busy'); label.textContent = 'Fazer minha aplicação'; status.focus();
    }
  });
}

// Program cards enter in sequence; all content remains available without motion.
const programCards = [...document.querySelectorAll<HTMLElement>('[data-program-card]')];
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const programObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('program-entered');
        programObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  programCards.forEach(card => { card.classList.add('program-pending'); programObserver.observe(card); });
}

// Mentor portraits and captions enter as a single composition from each side.
const mentorProfiles = [...document.querySelectorAll<HTMLElement>('[data-mentor-reveal]')];
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const mentorObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('mentor-entered');
        mentorObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .05, rootMargin: '0px 0px -30px 0px' });
  mentorProfiles.forEach(profile => { profile.classList.add('mentor-pending'); mentorObserver.observe(profile); });
}
