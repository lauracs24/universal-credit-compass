import { paymentQuestions } from '../data/paymentQuestions.js';
import { getNextScreen } from './paymentRules.js';

// Old Forward entries must use the current answers, never an abandoned branch.
export function resolveJourneyScreen(requested, answers) {
  if (requested === 'home') return 'home';
  let screen = answers.situation === 'message' ? 'message'
    : answers.situation === 'payment' ? 'statement' : 'home';
  if (screen === 'home') return screen;
  while (screen !== 'results') {
    if (screen === requested) return screen;
    const answer = screen === 'changes' ? answers.changes?.[0] : answers[screen];
    if (!paymentQuestions[screen].options.some((option) => option.value === answer)) return screen;
    screen = getNextScreen(screen, answers);
  }
  return screen;
}

export function createJourneyHistory(browser, onScreen, resolveScreen = (screen) => screen) {
  let session;
  let current;
  let depth;

  function state(screen) {
    // Browsers may save history.state to disk. Never put answers or drafts here.
    return { compass: { session, screen, depth } };
  }

  function reset() {
    session = crypto.randomUUID();
    current = 'home';
    depth = 0;
    browser.history.replaceState(state(current), '');
    onScreen(current);
  }

  function pop(event) {
    const entry = event.state?.compass;
    if (entry?.session !== session) {
      reset();
      return;
    }
    depth = entry.depth;
    current = resolveScreen(entry.screen);
    if (current !== entry.screen) browser.history.replaceState(state(current), '');
    onScreen(current);
  }

  reset();
  browser.addEventListener('popstate', pop);
  return {
    go(screen) {
      if (screen === current) return;
      current = screen;
      depth += 1;
      browser.history.pushState(state(screen), '');
      onScreen(screen);
    },
    back() {
      if (depth > 0) browser.history.back();
      else reset();
    },
    reset,
    dispose() { browser.removeEventListener('popstate', pop); },
  };
}
