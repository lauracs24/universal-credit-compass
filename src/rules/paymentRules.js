import { generalPaymentGuidance, paymentGuidance } from '../data/paymentGuidance.js';
import { deductionGuidance } from '../data/deductionGuidance.js';
import { deductionNeeds } from '../data/deductionNeeds.js';
import { messageGuidance } from '../data/messageGuidance.js';

export function getNextScreen(screen, answers) {
  if (screen === 'statement' && answers.statement === 'yes') return 'changes';
  if (screen === 'changes' && answers.changes?.includes('deductions')) return 'deduction';
  if (screen === 'deduction') return 'deductionNeed';
  return 'results';
}

export function getPreviousScreen(screen, answers) {
  if (screen === 'changes') return 'statement';
  if (screen === 'deduction') return 'changes';
  if (screen === 'deductionNeed') return 'deduction';
  if (screen === 'results') {
    if (answers.situation === 'message') return 'message';
    if (answers.statement === 'yes' && answers.changes?.includes('deductions')) return 'deductionNeed';
    return answers.statement === 'yes' ? 'changes' : 'statement';
  }
  return 'home';
}

export function updatePaymentAnswer(previous, screen, value) {
  if (screen === 'changes') {
    const changes = [value];
    return {
      ...previous, changes,
      deduction: changes.includes('deductions') ? previous.deduction : '',
      deductionNeed: changes.includes('deductions') ? previous.deductionNeed : '',
    };
  }
  // An earlier change must not leave a hidden deduction answer influencing results.
  if (screen === 'statement' && value !== previous.statement) {
    return { ...previous, statement: value, changes: [], deduction: '', deductionNeed: '' };
  }
  if (screen === 'deduction' && value !== previous.deduction) {
    return { ...previous, deduction: value, deductionNeed: '' };
  }
  return { ...previous, [screen]: value };
}

export function getPaymentRecommendations(answers = {}) {
  if (answers.situation === 'message') {
    const guidance = Object.hasOwn(messageGuidance, answers.message) ? messageGuidance[answers.message] : messageGuidance.unsure;
    return {
      title: guidance.title,
      accountHelpId: 'message',
      contactHelpId: 'message',
      deadlineNote: 'Check the message and to-do list for a response date. Do not assume it changes while you wait. If you disagree with a decision, check its challenge instructions and seek advice promptly.',
      explanations: [{
        title: 'A message needs its own explanation',
        possibility: guidance.explanation,
      }],
      checks: [
        'Read what the message asks for and check whether it refers to a decision, a request for information or a change you reported.',
        guidance.check,
      ],
      nextSteps: [
        guidance.nextStep,
        'If it is a decision you disagree with, seek benefits advice promptly and check the decision notice for how and when to challenge it.',
      ],
      suggestedMessage: guidance.message,
      resourceIds: ['account', 'contact', 'decision', 'moneyHelper'],
    };
  }

  if (answers.statement !== 'yes') {
    const needsDirections = answers.statement === 'unsure';
    return {
      title: needsDirections ? 'Find your payment statement' : 'Get help with your statement',
      primaryActionId: needsDirections ? 'account' : 'contact',
      contactHelpId: needsDirections ? 'statement' : 'access',
      accountHelpId: 'payment',
      explanations: [{
        title: 'We need the payment breakdown to understand more',
        possibility: 'Your statement shows how your payment was worked out, including the amounts included and money taken off. It is the starting point for checking a lower payment.',
      }],
      checks: [
        'If you can use your UC account, open Payments and look for your latest statement.',
        'If you cannot find it or sign in, use the official contact options below. You can ask for help understanding your payment.',
      ],
      nextSteps: [
        needsDirections
          ? 'In your UC account, open Payments and choose the dated statement you want to check.'
          : 'Ask Universal Credit to help you access your statement and explain how your latest payment was worked out.',
        needsDirections
          ? 'Once you have the statement, go Back and choose “Yes, I can see it” to continue checking it. If you still cannot find it or sign in, use the message and contact options below.'
          : 'If you still need help, use MoneyHelper’s guide below to find further support.',
      ],
      suggestedMessage: 'My payment is lower than I expected and I cannot check the breakdown. Please help me access my statement and explain how this payment was worked out.',
      resourceIds: ['account', 'contact', 'moneyHelper'],
    };
  }

  const selectedChanges = Array.isArray(answers.changes) ? answers.changes : [];
  const deduction = selectedChanges.includes('deductions')
    ? (Object.hasOwn(deductionGuidance, answers.deduction) ? deductionGuidance[answers.deduction] : paymentGuidance.deductions)
    : null;
  const explanations = Object.keys(paymentGuidance)
    .filter((key) => selectedChanges.includes(key))
    .map((key) => key === 'deductions' ? deduction : paymentGuidance[key]);
  if (explanations.length === 0) explanations.push(generalPaymentGuidance);

  const need = deduction && Object.hasOwn(deductionNeeds, answers.deductionNeed)
    ? deductionNeeds[answers.deductionNeed] : null;
  const contactHelpId = deduction
    ? (Object.hasOwn(deductionGuidance, answers.deduction) ? answers.deduction : 'deduction')
    : 'payment';
  const hasOtherPaymentQuestions = Boolean(deduction && explanations.some((item) => item !== deduction));
  const deadlineNote = contactHelpId === 'rentArrears'
    ? 'Check any UC request about rent arrears promptly and follow its response date. If you disagree with a decision, seek advice promptly about challenging it.'
    : (need === deductionNeeds.wrong || !need)
      ? 'If you disagree with a decision, check its challenge instructions and deadlines and seek advice promptly. Asking for an explanation does not challenge it.'
      : null;
  if (need) {
    const otherChecks = explanations.filter((item) => item !== deduction).flatMap((item) => item.checks);
    return {
      title: need.title,
      accountHelpId: 'payment',
      contactHelpId,
      hasOtherPaymentQuestions,
      deadlineNote,
      explanations,
      checks: [...(need.checks || deduction.checks), ...otherChecks],
      nextSteps: need.nextSteps,
      suggestedMessage: need.suggestedMessage || deduction.suggestedMessage,
      resourceIds: [...new Set([...need.resourceIds, ...explanations.map((item) => item.sourceId), 'contact', 'moneyHelper'])],
    };
  }

  return {
    title: 'Here is what to check next',
    accountHelpId: 'payment',
    contactHelpId,
    hasOtherPaymentQuestions,
    deadlineNote,
    explanations,
    checks: explanations.flatMap((explanation) => explanation.checks),
    nextSteps: [
      ...(deduction ? [deduction.nextStep] : []),
      'Ask Universal Credit to explain any amount you do not recognise. Refer to the statement’s dates and the part you want checked.',
      'If you think a decision is wrong, seek benefits advice promptly. Check the decision notice for challenge instructions and deadlines; asking for an explanation is not the same as challenging a decision.',
    ],
    suggestedMessage: deduction
      ? deduction.suggestedMessage
      : 'My payment is lower than I expected. Please explain what changed in this assessment period and how the amounts on my statement were worked out. What evidence would help if an amount is incorrect?',
    resourceIds: [...new Set([...explanations.map((item) => item.sourceId), ...(deduction ? ['deductionContacts'] : []), 'contact', 'decision', 'moneyHelper'])],
  };
}
