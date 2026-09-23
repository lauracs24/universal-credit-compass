// Facts describe general guidance. Possibilities never decide an individual's entitlement.
export const paymentGuidance = {
  earnings: {
    title: 'Earnings may be part of the change',
    possibility: 'The earnings amount or pay dates used for this payment may help explain why it is lower.',
    fact: 'How much you earn and when you are paid can affect Universal Credit. It is worked out over monthly periods called assessment periods.',
    checks: [
      'Compare the earnings shown with your payslips and the dates covered by the statement, including your partner’s earnings on a joint claim.',
      'Check whether more paydays fell within those dates. If you are self-employed, ask for advice about the earnings calculation used for you.',
    ],
    sourceId: 'earnings',
  },
  deductions: {
    title: 'Identify the deduction before drawing a conclusion',
    possibility: 'We cannot identify this deduction from your answer. There are several kinds, and the name on your statement matters.',
    checks: [
      'Make a note of the exact deduction name and amount. You do not need to enter them here.',
      'Look for a matching journal message or letter. If none is available, ask what the deduction is for.',
    ],
    nextStep: 'Use the DWP contact finder below to identify who can explain the deduction. Tell them if it is difficult to afford.',
    suggestedMessage: 'I do not recognise a deduction on my statement. Please explain what it is for, who it is paid to and who I should contact about it.',
    sourceId: 'deductions',
  },
  otherBenefits: {
    title: 'Another benefit may be included in the calculation',
    possibility: 'If another benefit is listed, the amount taken into account may help explain the change. Receiving another benefit does not, by itself, show that this payment is wrong.',
    fact: 'Certain benefits, including New Style ESA and Carer’s Allowance, reduce Universal Credit. This does not apply to every benefit.',
    checks: [
      'Check the exact benefit name and amount shown on the statement against the award letter for that benefit.',
      'Ask how the amount for the statement’s dates was calculated, especially if the other benefit is paid on a different schedule.',
    ],
    sourceId: 'otherBenefits',
  },
};

export const generalPaymentGuidance = {
  title: 'Start with how the payment was worked out',
  possibility: 'There is not enough information here to identify a reason for the lower payment. A lower amount alone does not show whether a mistake has happened.',
  checks: [
    'Find the dates and total amount on your latest statement. Compare them with the previous statement if one is available.',
    'Look for changes to the amounts included, such as housing costs, and the amounts taken off. Make a note of anything you do not understand.',
  ],
  sourceId: 'account',
};
