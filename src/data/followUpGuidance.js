// Reviewed follow-up prompts, not AI-generated advice or formal challenges.
export const followUpGuidance = {
  noReply: {
    nextStep: 'Refer to your earlier question and its date, then ask when you can expect an update. If you already made a formal complaint, follow its update instructions instead.',
    label: 'I have not had a reply',
    title: 'Ask for an update on the unanswered question',
    steps: [
      'Check for a reply in your journal, letters or the channel you used. UC journal replies can take a few days; this is not a guaranteed reply time.',
      'Refer to when you contacted them and the question still unanswered. Ask whether they need anything from you and when you can expect an update. Use the contact route above if you contacted the wrong team.',
    ],
    message: 'I contacted you on [date] about [issue] and have not received a reply. Please confirm whether my question has reached the right team, whether you need anything from me and when I can expect an update.',
  },
  unclear: {
    nextStep: 'Point to the sentence, amount or instruction you did not understand and ask for a plain-language explanation.',
    label: 'The reply did not explain it',
    title: 'Ask about the part that is still unclear',
    steps: [
      'Find the reply date and the specific sentence, amount or instruction you do not understand.',
      'Ask them to explain that part in plain language. For a payment calculation, ask which amounts and dates were used; for a task, ask what you need to provide or do.',
    ],
    message: 'Thank you for your reply on [date]. I still do not understand [the specific point]. Please explain this in plain language, including any amounts or dates used and any action I need to take.',
  },
  conflicting: {
    nextStep: 'Give both answers and their dates. Ask the team to confirm in writing which applies to you and why.',
    label: 'I have been told different things',
    title: 'Ask them to resolve the difference',
    steps: [
      'Keep both messages or make a note of the calls, including dates and which teams you spoke to.',
      'Set out the two different answers and ask for a written explanation of which applies and why. If they concern different debts, periods or teams, ask them to make that distinction clear.',
    ],
    message: 'On [first date], I was told [first answer]. On [second date], I was told [second answer]. Please check this difference and confirm in writing which information applies to my situation, why, and what I need to do next.',
  },
};

export const followUpSourceIds = ['manageAccount', 'contact', 'decision', 'complaints', 'moneyHelper'];
