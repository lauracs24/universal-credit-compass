// The need changes the action, not the explanation of what the debt might be.
// An unsure or unsupported need uses the existing explanation route.
export const deductionNeeds = {
  understand: {
    title: 'Understand your deduction',
    nextSteps: [
      'Use the DWP deduction contact finder below to find who can explain the repayment. Have the statement label and any related letter or journal message to hand.',
      'Ask which debt it relates to, how the repayment was worked out and how much remains to be repaid.',
    ],
    resourceIds: ['deductionContacts'],
  },
  wrong: {
    title: 'Check a deduction that looks wrong',
    checks: [
      'Note the amount or detail you think is wrong and why. Compare it with the agreement, decision letter or account record for that debt.',
      'Check any related decision or request for a response date and instructions. Ask for a copy if you cannot find it.',
    ],
    nextSteps: [
      'Use the DWP deduction contact finder below to find who to ask about the amount. Explain the difference and ask for the calculation and relevant decision.',
      'If you disagree with a decision, seek benefits advice promptly and follow its challenge instructions. Asking for an explanation does not itself challenge the decision or extend a deadline.',
    ],
    suggestedMessage: 'I think a detail or amount in this deduction may be wrong. The difference I want checked is [describe it]. Please explain the calculation and provide the relevant decision, including how and when I can challenge it.',
    resourceIds: ['deductionContacts', 'decision'],
  },
  afford: {
    title: 'Get help with an unaffordable repayment',
    checks: [
      'Note the deduction name and repayment amount on your statement. You do not need to enter any amounts here.',
      'Make a short note of essential costs you are struggling to cover, such as food, rent or energy, so you can explain the difficulty.',
    ],
    nextSteps: [
      'Use the DWP deduction contact finder below to reach the right team. Explain the financial difficulty and ask what repayment support is available for this type of debt. Any change depends on the deduction and your circumstances.',
      'If you need help explaining your situation or managing debts, use the MoneyHelper guide below to find further support.',
    ],
    suggestedMessage: 'I am struggling to afford this repayment and cover essential living costs. Please explain what support is available for this deduction and whether I can ask for a financial hardship decision. What information do you need from me?',
    resourceIds: ['deductions', 'deductionContacts', 'moneyHelper'],
  },
};
