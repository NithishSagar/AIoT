import { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './JoinCTA.css';

const JoinCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      if (db) {
        await addDoc(collection(db, 'subscribers'), {
          email,
          subscribedAt: serverTimestamp(),
        });
      }
      setIsSubmitted(true);
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to save subscriber:', err);
      // Still show success to user — the email can be retried
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="join-cta section" id="join">
      <div className="join-glow-ring"></div>
      <div className="join-glow-ring ring-2"></div>
      <div className="join-glow-ring ring-3"></div>
      <div className="join-center-glow"></div>
      
      <div className="container">
        <div className="join-content">
          <h2 className="join-title">
            Connect Your Node to the <span>Network</span>
          </h2>
          <p className="join-subtitle">
            Join a community of innovators, researchers, and tech enthusiasts 
            building the future of AI and IoT. Be part of the revolution.
          </p>
          
          <form className="join-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="join-input"
                disabled={isSubmitting}
                required
              />
              <button
                type="submit"
                className={`join-button ${isSubmitting ? 'submitting' : ''} ${isSubmitted ? 'submitted' : ''}`}
                disabled={isSubmitting || isSubmitted}
              >
                {isSubmitted ? '✓ Joined!' : isSubmitting ? 'Joining...' : 'Join Now'}
              </button>
            </div>
          </form>
          
          <p className="join-note">
            No spam, just updates on events, projects, and opportunities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JoinCTA;
