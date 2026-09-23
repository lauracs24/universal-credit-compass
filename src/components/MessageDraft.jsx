import { useRef, useState } from 'react';

export default function MessageDraft({ message, onChange, destination, title = 'A message you can use' }) {
  const [status, setStatus] = useState('');
  const [copying, setCopying] = useState(false);
  const messageRef = useRef(null);

  async function copyMessage() {
    if (!message.trim()) return;
    if (/\[[^\]]*\]/.test(message)) {
      setStatus('Replace the text in square brackets with your own words before copying.');
      messageRef.current?.focus();
      return;
    }
    setCopying(true);
    setStatus('');
    try {
      await navigator.clipboard.writeText(message);
      setStatus('Message copied. Review it before pasting it into the right place. Nothing has been sent.');
    } catch {
      messageRef.current?.focus();
      messageRef.current?.select();
      setStatus('Automatic copying is unavailable. Your message is selected: use your device’s Copy option.');
    } finally {
      setCopying(false);
    }
  }

  return (
    <section className="message-draft" aria-labelledby="draft-heading">
      <h2 id="draft-heading">{title}</h2>
      <p id="draft-destination" className="small-text">
        {destination}
      </p>
      <label className="answer-label" htmlFor="message-draft">Edit your message</label>
      <textarea
        id="message-draft"
        ref={messageRef}
        rows={5}
        value={message}
        readOnly={copying}
        aria-describedby="draft-destination draft-privacy"
        onChange={(event) => { onChange(event.target.value); setStatus(''); }}
      />
      <p id="draft-privacy" className="small-text">Do not include passwords, bank details or National Insurance numbers. Refreshing or starting again clears your edits.</p>
      <button type="button" className="primary-button" disabled={copying || !message.trim()} onClick={copyMessage}>
        {copying ? 'Copying…' : 'Copy message'}
      </button>
      <p className="copy-status small-text" role="status" aria-live="polite">{status}</p>
      <p className="small-text">Check the wording before sending. Copying does not send it.</p>
    </section>
  );
}
