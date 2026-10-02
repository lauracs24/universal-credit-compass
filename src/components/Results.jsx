import MessageDraft from './MessageDraft.jsx';
import FollowUpHelp from './FollowUpHelp.jsx';
import ResultDetails from './ResultDetails.jsx';
import { resources } from '../data/resources.js';
import { contactGuidance } from '../data/contactGuidance.js';
import { followUpGuidance } from '../data/followUpGuidance.js';

export default function Results({ recommendations, draftMessage, onDraftChange, followUp, onFollowUpChange }) {
  const contact = contactGuidance[recommendations.contactHelpId];
  const followUpAdvice = followUpGuidance[followUp.choice];

  return (
    <div className="results">
      <section aria-labelledby="explanation-heading" className="result-introduction">
        <h2 id="explanation-heading">What this means</h2>
        {recommendations.explanations.map((explanation) => (
          <p key={explanation.title}>{explanation.possibility}</p>
        ))}
        <p className="small-text">{recommendations.accountHelpId === 'message'
          ? 'Universal Credit can confirm what the message means for your claim.'
          : 'This guide cannot decide whether your payment is correct.'}</p>
      </section>

      <section aria-labelledby="actions-heading" className="next-action">
        <div id="next-action-content" aria-live="polite" aria-atomic="true">
          <h2 id="actions-heading">{followUpAdvice ? 'Your follow-up step' : 'What to do next'}</h2>
          <p>{followUpAdvice ? followUpAdvice.nextStep : recommendations.nextSteps[0]}</p>
        </div>
        <p className="small-text">{contact.shortRoute}</p>
        <a className="action-link" href={resources[contact.actionId].url} target="_blank" rel="noopener noreferrer">
          {contact.actionLabel}<span className="link-note"> (opens in a new tab)</span>
        </a>
        {contact.actionId !== 'contact' && <p className="contact-alternative small-text">
          <a href={resources.contact.url} target="_blank" rel="noopener noreferrer">Cannot use this route? Get UC contact options (opens in a new tab)</a>
        </p>}
      </section>

      {/* Time-sensitive guidance stays outside both optional sections. */}
      {(recommendations.deadlineNote || followUpAdvice) && <div className="deadline-note small-text">
        {recommendations.deadlineNote && <p>{recommendations.deadlineNote}</p>}
        {followUpAdvice && <p>If a response date is near or you cannot meet it, contact the team promptly. This follow-up does not challenge a decision or extend any deadline.</p>}
      </div>}

      <FollowUpHelp choice={followUp.choice} onSelect={(choice) => onFollowUpChange((previous) => ({ ...previous, choice }))} />

      <MessageDraft
        key={followUp.choice || 'original'}
        title={followUpAdvice ? 'Follow-up: ' + followUpAdvice.label : 'A message you can use'}
        message={followUpAdvice ? (followUp.drafts[followUp.choice] ?? followUpAdvice.message) : draftMessage}
        onChange={followUpAdvice
          ? (message) => onFollowUpChange((previous) => ({ ...previous, drafts: { ...previous.drafts, [previous.choice]: message } }))
          : onDraftChange}
        destination={contact.draftDestination}
      />

      <ResultDetails recommendations={recommendations} contact={contact} followUpAdvice={followUpAdvice} />
    </div>
  );
}
