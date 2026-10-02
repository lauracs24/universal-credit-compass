import test from 'node:test';
import assert from 'node:assert/strict';
import { createJourneyHistory, resolveJourneyScreen } from './journeyHistory.js';

function browserHistory() {
  const entries = [null];
  const listeners = new Set();
  let index = 0;
  function move(delta) {
    if (index + delta < 0 || index + delta >= entries.length) return;
    index += delta;
    for (const listener of listeners) listener({ state: structuredClone(entries[index]) });
  }
  return {
    entries,
    history: {
      replaceState(value) { entries[index] = structuredClone(value); },
      pushState(value) { entries.splice(index + 1); entries.push(structuredClone(value)); index += 1; },
      back() { move(-1); },
      forward() { move(1); },
    },
    addEventListener(type, listener) { listeners.add(listener); },
    removeEventListener(type, listener) { listeners.delete(listener); },
  };
}

test('browser Back, in-page Back and Forward share one journey without duplicate steps', () => {
  const browser = browserHistory();
  let visible;
  const navigation = createJourneyHistory(browser, (screen) => { visible = screen; });
  for (const screen of ['statement', 'changes', 'deduction', 'deductionNeed', 'results']) navigation.go(screen);
  browser.history.back();
  assert.equal(visible, 'deductionNeed');
  navigation.back();
  assert.equal(visible, 'deduction');
  browser.history.forward();
  assert.equal(visible, 'deductionNeed');
  navigation.go('results');
  assert.equal(browser.entries.length, 6);
  navigation.go('results');
  assert.equal(browser.entries.length, 6);
  navigation.dispose();
});

test('Start again and reload never resurrect screens from cleared journeys', () => {
  const browser = browserHistory();
  let visible;
  let navigation = createJourneyHistory(browser, (screen) => { visible = screen; });
  navigation.go('message');
  navigation.go('results');
  navigation.reset();
  browser.history.back();
  assert.equal(visible, 'home');
  browser.history.forward();
  assert.equal(visible, 'home');
  navigation.go('statement');
  navigation.dispose();
  navigation = createJourneyHistory(browser, (screen) => { visible = screen; });
  browser.history.back();
  assert.equal(visible, 'home');
  navigation.dispose();
});

test('Forward after editing an earlier answer uses the current branch and requires missing answers', () => {
  const browser = browserHistory();
  let answers = { situation: 'payment', statement: 'yes', changes: ['deductions'], deduction: 'advance', deductionNeed: 'afford' };
  let visible;
  const navigation = createJourneyHistory(browser, (screen) => { visible = screen; }, (screen) => resolveJourneyScreen(screen, answers));
  for (const screen of ['statement', 'changes', 'deduction', 'deductionNeed', 'results']) navigation.go(screen);
  for (let n = 0; n < 3; n += 1) browser.history.back();
  answers = { ...answers, changes: ['earnings'], deduction: '', deductionNeed: '' };
  browser.history.forward();
  assert.equal(visible, 'results');
  browser.history.back();
  answers = { ...answers, changes: ['deductions'] };
  browser.history.forward();
  assert.equal(visible, 'deduction');
  assert.equal(resolveJourneyScreen('results', { situation: 'message', message: '' }), 'message');
  assert.equal(resolveJourneyScreen('results', {}), 'home');
  assert.equal(resolveJourneyScreen('deduction', { situation: 'payment', statement: 'no' }), 'results');
  assert.equal(resolveJourneyScreen('results', { situation: 'payment', statement: 'yes', changes: [] }), 'changes');
  navigation.dispose();
});

test('history stores navigation metadata only, not answers or editable drafts', () => {
  const browser = browserHistory();
  const navigation = createJourneyHistory(browser, () => {});
  navigation.go('message');
  navigation.go('results');
  for (const entry of browser.entries) {
    assert.deepEqual(Object.keys(entry), ['compass']);
    assert.deepEqual(Object.keys(entry.compass).sort(), ['depth', 'screen', 'session']);
  }
  navigation.dispose();
});
