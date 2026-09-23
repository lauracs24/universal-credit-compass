// Each entry explains a statement label, not whether the debt is correct.
export const deductionGuidance = {
  advance: {
    title: 'An advance may be being repaid',
    possibility: 'The line you selected may be a repayment of money paid to you earlier as a UC advance.',
    fact: 'Universal Credit advances are usually repaid automatically from later Universal Credit payments.',
    checks: [
      'Find the advance agreement or journal message. Check which advance the repayment relates to.',
      'Compare the repayment shown with that agreement. Ask how much remains to be repaid if this is unclear.',
    ],
    nextStep: 'Ask Universal Credit about any difference. If the repayment is difficult to afford, explain this and ask what help is available for your type of advance.',
    suggestedMessage: 'Please explain which advance this repayment relates to, how the repayment amount was set and how much remains to be repaid.',
    sourceId: 'advances',
  },
  overpayment: {
    title: 'A benefit overpayment may be being recovered',
    possibility: 'This label may refer to money the benefit office says was paid in excess. Compass cannot confirm that the overpayment is correct.',
    fact: 'The benefit office sends a letter when it identifies an overpayment. You can ask for a decision to be looked at again if you think it is a mistake. The process depends on which benefit is involved.',
    checks: [
      'Find the letter or journal message and check which benefit and dates it covers.',
      'Check the explanation and how to challenge it if you disagree. Ask for a copy if you cannot find the decision.',
    ],
    nextStep: 'Use the DWP contact finder below to ask about the debt or repayment. If you dispute the decision, get benefits advice promptly about challenging it.',
    suggestedMessage: 'Please explain which benefit and period this overpayment relates to and provide the decision explaining how it was calculated.',
    sourceId: 'overpayments',
  },
  rentArrears: {
    title: 'The repayment may be towards rent arrears',
    possibility: 'This may be money towards rent owed from an earlier period. The label alone does not establish that the amount owed is correct.',
    fact: 'A landlord can request deductions for rent or service-charge arrears. Universal Credit notifies you about the request.',
    checks: [
      'Compare the deduction with your rent account and any journal message about the arrears.',
      'Check whether the line is for arrears or current rent paid to your landlord. Ask if you cannot tell.',
    ],
    nextStep: 'Check the journal request promptly for a response date. If the arrears seem wrong, ask for advice about how to respond and what evidence is needed.',
    suggestedMessage: 'Please explain whether this payment to my landlord is for current rent or arrears, and which rent account entries it relates to.',
    sourceId: 'deductions',
  },
};
