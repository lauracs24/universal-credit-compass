import { followUpGuidance } from '../data/followUpGuidance.js';

export default function FollowUpHelp({ choice, onSelect }) {
  const guidance = followUpGuidance[choice];

  return (
    <details className="result-detail follow-up-help">
      <summary>{guidance ? 'Following up: ' + guidance.label : 'Already asked? Get help following up'}</summary>
      <div className="result-detail-content">
        <fieldset>
          <legend className="answer-label">What happened?</legend>
          <div className="answer-options">
            {Object.entries(followUpGuidance).map(([value, option]) => (
              <label className="answer-option" key={value}>
                <input type="radio" name="follow-up" value={value} checked={choice === value} onChange={() => onSelect(value)} aria-controls="next-action-content message-draft" />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {guidance && <button type="button" className="text-button" onClick={() => onSelect('')}>Return to my original step and message</button>}
      </div>
    </details>
  );
}
