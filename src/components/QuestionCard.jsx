import { useRef, useState } from 'react';

export default function QuestionCard({ question, answer, onAnswer, onContinue, buttonLabel }) {
  const [showError, setShowError] = useState(false);
  const errorRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    const hasAnswer = question.multiple ? answer.length > 0 : Boolean(answer);
    if (!hasAnswer) {
      setShowError(true);
      // Focus after React has rendered the error text.
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    onContinue();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p id="question-hint" className="introduction">{question.hint}</p>
      {showError && (
        <p id="answer-error" className="error-message" ref={errorRef} tabIndex={-1}>
          Choose an answer to continue. You can choose “I’m not sure”.
        </p>
      )}
      <fieldset aria-describedby={`question-hint${showError ? ' answer-error' : ''}`}>
        <legend className="visually-hidden">{question.title}</legend>
        <div className="answer-options">
          {question.options.map((option) => (
            <label className="answer-option" key={option.value}>
              <input
                type={question.multiple ? 'checkbox' : 'radio'}
                name="answer"
                value={option.value}
                checked={question.multiple ? answer.includes(option.value) : answer === option.value}
                onChange={() => { setShowError(false); onAnswer(option.value); }}
              />
              <span>
                <span className="answer-label">{option.label}</span>
                {option.detail && <span className="answer-detail">{option.detail}</span>}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <button className="primary-button" type="submit">{buttonLabel}</button>
    </form>
  );
}
