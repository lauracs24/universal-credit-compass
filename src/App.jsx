import { useEffect, useRef, useState } from 'react';
import QuestionCard from './components/QuestionCard.jsx';
import Results from './components/Results.jsx';
import { paymentQuestions } from './data/paymentQuestions.js';
import { guidanceReview, resources } from './data/resources.js';
import { getNextScreen, getPaymentRecommendations, getPreviousScreen, updatePaymentAnswer } from './rules/paymentRules.js';

const emptyAnswers = { situation: '', statement: '', changes: [], deduction: '', deductionNeed: '', message: '' };

export default function App() {
  const [screen, setScreen] = useState('home');
  const [answers, setAnswers] = useState(emptyAnswers);
  const [messageDraft, setMessageDraft] = useState(null);
  const [followUp, setFollowUp] = useState({ choice: '', drafts: {} });
  const headingRef = useRef(null);
  const question = paymentQuestions[screen];
  const recommendations = screen === 'results' ? getPaymentRecommendations(answers) : null;
  const title = question?.title || recommendations?.title || 'What’s happening with your Universal Credit?';

  function clearDrafts() {
    setMessageDraft(null);
    setFollowUp({ choice: '', drafts: {} });
  }

  useEffect(() => {
    document.title = `${title} — Universal Credit Compass`;
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [screen, title]);

  function startGuide(situation) {
    clearDrafts();
    setAnswers({ ...emptyAnswers, situation });
    setScreen(situation === 'message' ? 'message' : 'statement');
  }

  function updateAnswer(value) {
    clearDrafts();
    setAnswers((previous) => updatePaymentAnswer(previous, screen, value));
  }

  function startAgain() {
    clearDrafts();
    setAnswers(emptyAnswers);
    setScreen('home');
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="site-header">
        <div className="content-width">
          <p className="site-name">Universal Credit Compass</p>
          <p className="independent-label">An independent guide</p>
        </div>
      </header>

      <main id="main-content" className="content-width" tabIndex={-1}>
        <p className="prototype-notice">Testing version · Try the guide using fictional details and check the linked guidance.</p>
        {screen !== 'home' && (
          <nav className="journey-navigation" aria-label="Guide navigation">
            <button type="button" className="text-button" onClick={() => setScreen(getPreviousScreen(screen, answers))}>Back</button>
            <button type="button" className="text-button" onClick={startAgain}>Start again</button>
          </nav>
        )}
        {question && <p className="section-label">{screen === 'deductionNeed' ? 'One last question' : 'Let’s take it one step at a time'}</p>}
        <h1 ref={headingRef} tabIndex={-1}>{title}</h1>

        {screen === 'home' && (
          <>
            <p className="introduction">Find out what to check and where to get help. You do not need to enter amounts or personal details.</p>
            <div className="home-options">
              <button type="button" className="situation-button" onClick={() => startGuide('payment')}>
                <span className="situation-title">My payment is lower than expected</span>
                <span>Help me understand what to check on my statement.</span>
              </button>
              <button type="button" className="situation-button" onClick={() => startGuide('message')}>
                <span className="situation-title">I’m worried about a message</span>
                <span>I’m not sure what it means for my payment.</span>
              </button>
            </div>
            <p className="scope-note">This first guide covers {guidanceReview.scope}. For Northern Ireland, <a href={resources.northernIreland.url} target="_blank" rel="noopener noreferrer">find local UC support (opens in a new tab)</a>.</p>
          </>
        )}
        {question && (
          <QuestionCard
            key={screen}
            question={question}
            answer={screen === 'changes' ? (answers.changes[0] || '') : answers[screen]}
            onAnswer={updateAnswer}
            onContinue={() => setScreen(getNextScreen(screen, answers))}
            buttonLabel={getNextScreen(screen, answers) === 'results' ? 'Show my next steps' : 'Continue'}
          />
        )}
        {recommendations && (
          <div id="selected-result" className="result-container">
            <Results
              recommendations={recommendations}
              draftMessage={messageDraft ?? recommendations.suggestedMessage}
              onDraftChange={setMessageDraft}
              followUp={followUp}
              onFollowUpChange={setFollowUp}
            />
          </div>
        )}

        <details className="about-guide">
          <summary>About this guide and your privacy</summary>
          <div className="about-content">
            <p>
              This is an independent project. It is not a DWP or GOV.UK service
              and does not replace advice from a welfare-rights adviser.
            </p>
            <p>
              Your choices and draft edits stay in this page’s memory. Refreshing the page or choosing Start again clears them.
              There are no accounts, uploads or analytics, and your answers and draft are not sent to a server.
            </p>
            <p>Links take you to other websites, which have their own privacy policies. Do not share your UC password or personal documents with this guide.</p>
          </div>
        </details>
      </main>

      <footer className="site-footer content-width">
        <p>Independent information, not an official government service.</p>
      </footer>
    </div>
  );
}
