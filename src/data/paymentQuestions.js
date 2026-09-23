export const paymentQuestions = {
  statement: {
    title: 'Can you see your latest Universal Credit statement?',
    hint: 'It shows how your payment was worked out. In your UC account, look under Payments. You do not need to share it here.',
    multiple: false,
    options: [
      { value: 'yes', label: 'Yes, I can see it' },
      { value: 'no', label: 'No, I cannot access it' },
      { value: 'unsure', label: 'I’m not sure where to look' },
    ],
  },
  changes: {
    title: 'What would you like help checking first?',
    hint: 'Choose one option. You can go back to check something else afterwards.',
    multiple: false,
    options: [
      { value: 'earnings', label: 'Wages or earnings', detail: 'The amount from work shown on your statement.' },
      { value: 'deductions', label: 'Repayments or money taken off', detail: 'For example, a payment towards an advance or a debt.' },
      { value: 'otherBenefits', label: 'Another benefit', detail: 'A separate benefit payment is included in the calculation.' },
      { value: 'unsure', label: 'Something else, or I’m not sure' },
    ],
  },
  deduction: {
    title: 'What does the repayment line say it is for?',
    hint: 'If there is more than one, choose the one you want to check first. You can go back and check another.',
    multiple: false,
    options: [
      { value: 'advance', label: 'An advance repayment' },
      { value: 'overpayment', label: 'A benefit or tax credit overpayment' },
      { value: 'rentArrears', label: 'Rent or service-charge arrears', detail: 'Money owed from an earlier period.' },
      { value: 'other', label: 'Another type of deduction' },
      { value: 'unsure', label: 'I’m not sure' },
    ],
  },
  deductionNeed: {
    title: 'What do you need help with?',
    hint: 'Think about the deduction you just chose. Pick what matters most right now. You can go back to check something else.',
    multiple: false,
    options: [
      { value: 'understand', label: 'Understanding the deduction' },
      { value: 'wrong', label: 'Checking something that looks wrong' },
      { value: 'afford', label: 'Struggling to afford the repayment' },
      { value: 'unsure', label: 'I’m not sure' },
    ],
  },
  message: {
    title: 'Does the message ask you to do something by a date?',
    hint: 'Look at the message and your to-do list in your UC account. You do not need to paste the message here.',
    multiple: false,
    options: [
      { value: 'yes', label: 'Yes, there is a date or deadline' },
      { value: 'no', label: 'No, I cannot see one' },
      { value: 'unsure', label: 'I’m not sure what it means' },
    ],
  },
};
