import { guidanceReview, resources } from '../data/resources.js';
import { accountGuidance, accountGuidanceSourceIds } from '../data/accountGuidance.js';
import { followUpSourceIds } from '../data/followUpGuidance.js';

export default function ResultDetails({ recommendations, contact, followUpAdvice }) {
  const accountSteps = accountGuidance[recommendations.accountHelpId];
  const sourceIds = [...new Set([...recommendations.resourceIds, ...contact.sourceIds, ...followUpSourceIds, ...(accountSteps ? accountGuidanceSourceIds : [])])];

  return (
    <details className="result-detail more-help">
      <summary>More help and details</summary>
      <div className="result-detail-content">
        <section>
          <h3>Who can help</h3>
          <p>{contact.instructions}</p>
          {recommendations.hasOtherPaymentQuestions && <p>For the other parts of your UC calculation, use your Journal’s payment category. The debt contact may only be able to help with the deduction.</p>}
          {recommendations.nextSteps.slice(1).map((step) => <p key={step}>{step}</p>)}
          <p><a href={resources.contact.url} target="_blank" rel="noopener noreferrer">UC helpline and accessible contact options (opens in a new tab)</a></p>
        </section>
        {accountSteps && <section>
          <h3>Where to go in your UC account</h3>
          <p><a href={resources.account.url} target="_blank" rel="noopener noreferrer">Sign in through GOV.UK (opens in a new tab)</a>.</p>
          <ol>{accountSteps.map((step) => <li key={step}>{step}</li>)}</ol>
          <p className="account-help-note">Journal replies can take a few days. Do not assume a response date has changed while you wait.</p>
        </section>}
        <section>
          <h3>What to check</h3>
          <ul>{recommendations.checks.map((check) => <li key={check}>{check}</li>)}</ul>
        </section>
        {recommendations.explanations.filter((item) => item.fact).map((explanation) => (
          <section key={explanation.title}>
            <h3>{explanation.title}</h3>
            <p>{explanation.fact}</p>
            <a href={resources[explanation.sourceId].url} target="_blank" rel="noopener noreferrer">{resources[explanation.sourceId].title} (opens in a new tab)</a>
          </section>
        ))}
        {followUpAdvice && <section>
          <h3>Preparing your follow-up</h3>
          <ol>{followUpAdvice.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </section>}
        <section>
          <h3>If you still need help</h3>
          <p><a href={resources.moneyHelper.url} target="_blank" rel="noopener noreferrer">Find independent help through MoneyHelper (opens in a new tab)</a>.</p>
          <p>For an unresolved problem with DWP’s service, such as delays or poor communication, <a href={resources.complaints.url} target="_blank" rel="noopener noreferrer">read the DWP complaints procedure (opens in a new tab)</a>. A service complaint is separate from challenging a benefit decision. If you already made a formal complaint, follow its update instructions.</p>
        </section>
        <section>
          <h3>Sources and guidance dates</h3>
          <ul className="resource-list">
            {sourceIds.map((id) => <li key={id}>
              <a href={resources[id].url} target="_blank" rel="noopener noreferrer">{resources[id].title} (opens in a new tab)</a>
              <span className="answer-detail">Source checked {resources[id].displayDate || guidanceReview.displayDate}</span>
            </li>)}
          </ul>
        </section>
      </div>
    </details>
  );
}
