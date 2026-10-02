import test from 'node:test';
import assert from 'node:assert/strict';
import { resources } from '../data/resources.js';
import { contactGuidance } from '../data/contactGuidance.js';
import { getNextScreen, getPaymentRecommendations, getPreviousScreen, updatePaymentAnswer } from './paymentRules.js';

test('choosing wages after repayments clears repayment details and skips repayment questions', () => {
  const previous = { statement: 'yes', changes: ['deductions'], deduction: 'advance', deductionNeed: 'afford' };
  const answers = updatePaymentAnswer(previous, 'changes', 'earnings');
  assert.deepEqual(answers.changes, ['earnings']);
  assert.equal(answers.deduction, '');
  assert.equal(answers.deductionNeed, '');
  assert.equal(getNextScreen('changes', answers), 'results');
  assert.equal(getPaymentRecommendations(answers).contactHelpId, 'payment');
  assert.deepEqual(previous.changes, ['deductions']);
  const repayment = updatePaymentAnswer(answers, 'changes', 'deductions');
  assert.deepEqual(repayment.changes, ['deductions']);
  assert.equal(getNextScreen('changes', repayment), 'deduction');
});

test('people without a statement skip questions about its contents', () => {
  for (const statement of ['no', 'unsure', '']) {
    const answers = { situation: 'payment', statement, changes: ['earnings'] };
    assert.equal(getNextScreen('statement', answers), 'results');
    assert.equal(getPreviousScreen('results', answers), 'statement');
    const result = getPaymentRecommendations(answers);
    assert.equal(result.primaryActionId, statement === 'unsure' ? 'account' : 'contact');
    assert.ok(!result.resourceIds.includes('earnings'), 'Stale answers must not produce an earnings explanation');
  }
});

test('statement directions lead to sign-in while access problems lead to contact support', () => {
  const directions = getPaymentRecommendations({ statement: 'unsure' });
  const access = getPaymentRecommendations({ statement: 'no' });
  assert.equal(directions.primaryActionId, 'account');
  assert.match(directions.nextSteps[0], /open Payments/);
  assert.match(directions.nextSteps[1], /go Back/);
  assert.equal(access.primaryActionId, 'contact');
  assert.match(access.nextSteps[0], /help you access/);
  for (const result of [directions, access]) {
    assert.ok(result.resourceIds.includes(result.primaryActionId));
  }
});

test('the statement route has a reversible question sequence', () => {
  const answers = { situation: 'payment', statement: 'yes' };
  assert.equal(getNextScreen('statement', answers), 'changes');
  assert.equal(getNextScreen('changes', answers), 'results');
  assert.equal(getPreviousScreen('results', answers), 'changes');
  assert.equal(getPreviousScreen('changes', answers), 'statement');
  assert.equal(getPreviousScreen('statement', answers), 'home');
});

test('every combination of specific areas produces the matching explanations', () => {
  const areas = ['earnings', 'deductions', 'otherBenefits'];
  for (let mask = 1; mask < 8; mask += 1) {
    const changes = areas.filter((area, index) => mask & (1 << index));
    const answers = { situation: 'payment', statement: 'yes', changes };
    const originalAnswers = JSON.stringify(answers);
    const result = getPaymentRecommendations(answers);
    assert.deepEqual(result.explanations.map((item) => item.sourceId), changes);
    assert.equal(result.checks.length, changes.length * 2);
    assert.equal(new Set(result.resourceIds).size, result.resourceIds.length);
    assert.equal(JSON.stringify(answers), originalAnswers, 'Generating results must not change answers');
  }
});

test('uncertain, missing and unsupported choices fall back without inventing a cause', () => {
  for (const changes of [[], ['unsure'], ['unknown'], undefined, 'earnings']) {
    const result = getPaymentRecommendations({ statement: 'yes', changes });
    assert.equal(result.explanations.length, 1);
    assert.equal(result.explanations[0].fact, undefined);
    assert.match(result.explanations[0].possibility, /not enough information/);
  }
  assert.equal(getPaymentRecommendations().title, 'Get help with your statement');
});

test('not-sure and specific selections replace each other without mutating prior state', () => {
  for (const previous of ['earnings', 'deductions', 'otherBenefits', 'unsure']) {
    for (const value of ['earnings', 'deductions', 'otherBenefits', 'unsure']) {
      const answers = { changes: [previous] };
      assert.deepEqual(updatePaymentAnswer(answers, 'changes', value).changes, [value]);
      assert.deepEqual(answers.changes, [previous]);
    }
  }
});

test('a message does not become a finding that the payment has changed', () => {
  for (const message of ['yes', 'no', 'unsure']) {
    const answers = { situation: 'message', message, statement: 'yes', changes: ['deductions'] };
    const result = getPaymentRecommendations(answers);
    assert.equal(getNextScreen('message', answers), 'results');
    assert.equal(getPreviousScreen('results', answers), 'message');
    assert.doesNotMatch(result.explanations[0].possibility, /your payment (has|will) (changed|change|decrease)/);
    assert.ok(!result.resourceIds.includes('deductions'));
    if (message === 'yes') assert.match(result.nextSteps[0], /promptly/);
    else assert.match(result.checks[1], /action or response date/);
  }
});

test('message answers have distinct explanations, actions and drafts without declaring no deadline', () => {
  const results = ['yes', 'no', 'unsure'].map((message) => getPaymentRecommendations({ situation: 'message', message }));
  for (const select of [(r) => r.title, (r) => r.explanations[0].possibility, (r) => r.nextSteps[0], (r) => r.suggestedMessage]) {
    assert.equal(new Set(results.map(select)).size, 3);
  }
  assert.match(results[1].explanations[0].possibility, /cannot see a date/);
  assert.match(results[1].nextSteps[0], /to-do list/);
  assert.match(results[1].suggestedMessage, /whether I need to reply/);
  assert.match(results[2].nextSteps[0], /plain language/);
  assert.match(results[2].suggestedMessage, /not sure whether/);
  for (const message of ['', undefined, 'unknown', 'toString']) {
    assert.deepEqual(getPaymentRecommendations({ situation: 'message', message }), results[2]);
  }
});

test('all result routes have checks, actions and working resource references', () => {
  const cases = [
    {},
    { situation: 'message', message: 'yes' },
    { situation: 'message', message: 'no' },
    { statement: 'yes', changes: ['unsure'] },
    { statement: 'yes', changes: ['earnings', 'deductions', 'otherBenefits'] },
  ];
  for (const answers of cases) {
    const result = getPaymentRecommendations(answers);
    assert.ok(result.explanations.length && result.checks.length && result.nextSteps.length);
    for (const id of result.resourceIds) {
      assert.ok(resources[id]?.title, `Missing resource: ${id}`);
      assert.match(resources[id].url, /^https:\/\//);
    }
    assert.ok(result.resourceIds.includes('contact'));
  }
});

test('only selecting deductions adds the type and need questions, including alongside earnings', () => {
  for (const changes of [['deductions'], ['earnings', 'deductions']]) {
    const answers = { situation: 'payment', statement: 'yes', changes };
    assert.equal(getNextScreen('changes', answers), 'deduction');
    assert.equal(getNextScreen('deduction', answers), 'deductionNeed');
    assert.equal(getNextScreen('deductionNeed', answers), 'results');
    assert.equal(getPreviousScreen('results', answers), 'deductionNeed');
    assert.equal(getPreviousScreen('deductionNeed', answers), 'deduction');
    assert.equal(getPreviousScreen('deduction', answers), 'changes');
  }
  for (const changes of [[], ['unsure'], ['earnings'], ['otherBenefits']]) {
    const answers = { situation: 'payment', statement: 'yes', changes, deduction: 'advance' };
    assert.equal(getNextScreen('changes', answers), 'results');
    assert.equal(getPreviousScreen('results', answers), 'changes');
    assert.ok(!getPaymentRecommendations(answers).resourceIds.includes('advances'));
  }
});

test('each deduction need changes the action without deciding whether the debt is correct', () => {
  for (const deduction of ['advance', 'overpayment', 'rentArrears', 'other', 'unsure']) {
    const answers = { statement: 'yes', changes: ['deductions'], deduction };
    const understand = getPaymentRecommendations({ ...answers, deductionNeed: 'understand' });
    const wrong = getPaymentRecommendations({ ...answers, deductionNeed: 'wrong' });
    const afford = getPaymentRecommendations({ ...answers, deductionNeed: 'afford' });
    assert.deepEqual(understand.explanations, wrong.explanations);
    assert.deepEqual(wrong.explanations, afford.explanations);
    assert.match(understand.nextSteps.join(' '), /which debt/);
    assert.match(wrong.nextSteps.join(' '), /does not itself challenge/);
    assert.match(afford.nextSteps.join(' '), /depends on the deduction/);
    assert.match(afford.suggestedMessage, /essential living costs/);
    assert.ok(wrong.resourceIds.includes('decision'));
    assert.ok(afford.resourceIds.includes('deductions'));
    for (const result of [understand, wrong, afford]) {
      assert.equal(result.checks.length, 2);
      assert.equal(result.nextSteps.length, 2);
      for (const id of result.resourceIds) assert.ok(resources[id]?.url);
    }
  }
});

test('unsure and unsupported needs fall back safely and stale needs cannot affect other routes', () => {
  const answers = { statement: 'yes', changes: ['deductions'], deduction: 'other' };
  for (const deductionNeed of ['unsure', '', undefined, 'toString', 'unsupported']) {
    assert.deepEqual(getPaymentRecommendations({ ...answers, deductionNeed }), getPaymentRecommendations(answers));
  }
  for (const changes of [['earnings'], ['otherBenefits'], ['unsure']]) {
    const otherAnswers = { statement: 'yes', changes };
    assert.deepEqual(getPaymentRecommendations({ ...otherAnswers, deductionNeed: 'afford' }), getPaymentRecommendations(otherAnswers));
  }
});

test('need-specific results preserve checks for every other selected area', () => {
  for (const deductionNeed of ['understand', 'wrong', 'afford']) {
    const result = getPaymentRecommendations({ statement: 'yes', changes: ['earnings', 'deductions', 'otherBenefits'], deduction: 'advance', deductionNeed });
    assert.equal(result.explanations.length, 3);
    assert.ok(result.checks.some((check) => check.includes('payslips')));
    assert.ok(result.checks.some((check) => check.includes('award letter')));
    assert.equal(result.hasOtherPaymentQuestions, true);
    assert.doesNotMatch(result.suggestedMessage, /other parts of my payment/);
  }
});

test('earlier changes reset the deduction need, while Back and unrelated choices can retain it', () => {
  const answers = { statement: 'yes', changes: ['deductions'], deduction: 'advance', deductionNeed: 'afford' };
  const original = structuredClone(answers);
  for (const [screen, value] of [['statement', 'no'], ['changes', 'earnings'], ['changes', 'unsure'], ['deduction', 'rentArrears']]) {
    assert.equal(updatePaymentAnswer(answers, screen, value).deductionNeed, '');
  }
  assert.equal(updatePaymentAnswer(answers, 'changes', 'deductions').deductionNeed, 'afford');
  assert.equal(updatePaymentAnswer(answers, 'deduction', 'advance').deductionNeed, 'afford');
  assert.equal(updatePaymentAnswer(answers, 'deductionNeed', 'wrong').deductionNeed, 'wrong');
  assert.deepEqual(answers, original);
});

test('each recognised deduction supplies its own checks and sources without losing other explanations', () => {
  const sourceForDeduction = { advance: 'advances', overpayment: 'overpayments', rentArrears: 'deductions' };
  for (const [deduction, sourceId] of Object.entries(sourceForDeduction)) {
    const answers = { situation: 'payment', statement: 'yes', changes: ['earnings', 'deductions'], deduction };
    const result = getPaymentRecommendations(answers);
    assert.deepEqual(result.explanations.map((item) => item.sourceId), ['earnings', sourceId]);
    assert.equal(result.checks.length, 4);
    assert.equal(result.nextSteps.length, 3);
    assert.ok(result.resourceIds.includes('deductionContacts'));
    for (const id of result.resourceIds) assert.ok(resources[id]?.url);
    const singleResult = getPaymentRecommendations({ ...answers, changes: ['deductions'] });
    assert.equal(singleResult.suggestedMessage, result.suggestedMessage, 'A debt contact should receive a deduction-specific draft even when other areas are selected');
  }
});

test('contact destinations follow the current issue, not stale deduction answers', () => {
  const stale = { deduction: 'overpayment', deductionNeed: 'afford', changes: ['deductions'] };
  for (const [answers, expected] of [
    [{ ...stale, situation: 'message', statement: 'yes' }, 'message'],
    [{ ...stale, statement: 'no' }, 'access'],
    [{ ...stale, statement: 'unsure' }, 'statement'],
    [{ ...stale, statement: 'yes', changes: ['earnings'] }, 'payment'],
    [{ ...stale, statement: 'yes', changes: ['otherBenefits'] }, 'payment'],
    [{ ...stale, statement: 'yes', changes: ['unsure'] }, 'payment'],
  ]) {
    assert.equal(getPaymentRecommendations(answers).contactHelpId, expected);
  }
  for (const deduction of ['advance', 'overpayment', 'rentArrears', 'other', 'unsure', 'toString', undefined]) {
    for (const deductionNeed of ['understand', 'wrong', 'afford', 'unsure']) {
      const result = getPaymentRecommendations({ statement: 'yes', changes: ['deductions'], deduction, deductionNeed });
      const expected = ['advance', 'overpayment', 'rentArrears'].includes(deduction) ? deduction : 'deduction';
      assert.equal(result.contactHelpId, expected);
      assert.equal(contactGuidance[result.contactHelpId].actionId, 'deductionContacts');
    }
  }
});

test('contact guidance has official destinations, sources and matching draft instructions', () => {
  for (const contact of Object.values(contactGuidance)) {
    assert.ok(contact.title && contact.shortRoute && contact.instructions && contact.actionLabel && contact.draftDestination);
    assert.ok(resources[contact.actionId]?.url);
    for (const id of contact.sourceIds) assert.ok(resources[id]?.url);
  }
  assert.equal(contactGuidance.payment.actionId, 'account');
  assert.equal(contactGuidance.access.actionId, 'contact');
  assert.match(contactGuidance.overpayment.instructions, /decision letter/);
  assert.match(contactGuidance.rentArrears.instructions, /landlord/);
});

test('simplified results keep deadline guidance for messages, disputed deductions and rent requests', () => {
  for (const message of ['yes', 'no', 'unsure']) {
    assert.match(getPaymentRecommendations({ situation: 'message', message }).deadlineNote, /response date/);
  }
  for (const deductionNeed of ['understand', 'wrong', 'afford', 'unsure']) {
    const result = getPaymentRecommendations({ statement: 'yes', changes: ['deductions'], deduction: 'rentArrears', deductionNeed });
    assert.match(result.deadlineNote, /response date/);
  }
  const wrong = getPaymentRecommendations({ statement: 'yes', changes: ['deductions'], deduction: 'overpayment', deductionNeed: 'wrong' });
  assert.match(wrong.deadlineNote, /challenge instructions and deadlines/);
  const access = getPaymentRecommendations({ statement: 'no', deduction: 'rentArrears', deductionNeed: 'wrong' });
  assert.equal(access.deadlineNote, undefined, 'Stale answers must not introduce an unrelated deadline notice');
});

test('unrecognised deduction types never invent a debt explanation', () => {
  for (const deduction of ['other', 'unsure', '', undefined, 'unsupported', 'toString']) {
    const result = getPaymentRecommendations({ statement: 'yes', changes: ['deductions'], deduction });
    assert.match(result.explanations[0].possibility, /cannot identify/);
    assert.equal(result.explanations[0].fact, undefined);
    assert.equal(result.resourceIds.includes('advances'), false);
  }
});

test('changing earlier answers clears obsolete deduction details without mutating prior state', () => {
  const answers = { situation: 'payment', statement: 'yes', changes: ['deductions'], deduction: 'advance' };
  const withoutDeduction = updatePaymentAnswer(answers, 'changes', 'earnings');
  assert.equal(withoutDeduction.deduction, '');
  assert.deepEqual(withoutDeduction.changes, ['earnings']);
  const unsure = updatePaymentAnswer(answers, 'changes', 'unsure');
  assert.equal(unsure.deduction, '');
  const noStatement = updatePaymentAnswer(answers, 'statement', 'no');
  assert.equal(noStatement.deduction, '');
  assert.deepEqual(noStatement.changes, []);
  assert.equal(getNextScreen('statement', noStatement), 'results');
  assert.ok(!getPaymentRecommendations(noStatement).resourceIds.includes('advances'));
  assert.deepEqual(answers, { situation: 'payment', statement: 'yes', changes: ['deductions'], deduction: 'advance' });
});

test('keeping deductions selected preserves its details', () => {
  const answers = { statement: 'yes', changes: ['deductions'], deduction: 'advance' };
  assert.equal(updatePaymentAnswer(answers, 'changes', 'deductions').deduction, 'advance');
  assert.equal(updatePaymentAnswer(answers, 'statement', 'yes').deduction, 'advance');
  assert.equal(updatePaymentAnswer(answers, 'deduction', 'rentArrears').deduction, 'rentArrears');
});
