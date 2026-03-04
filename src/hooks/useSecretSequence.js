import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Custom hook to detect a secret keyboard sequence
 * @param {string[]} sequence - Array of key codes to match (e.g., ['ArrowUp', 'ArrowUp', 'KeyB', 'KeyA'])
 * @param {number} timeout - Milliseconds before sequence resets (default: 5000)
 * @returns {boolean} - True when sequence is successfully completed
 */
const useSecretSequence = (sequence, timeout = 5000) => {
  const [activated, setActivated] = useState(false);
  const progressRef = useRef(0);
  const timeoutRef = useRef(null);
  const lastKeyTimeRef = useRef(null);

  const resetProgress = useCallback(() => {
    progressRef.current = 0;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentTime = Date.now();
      const expectedKey = sequence[progressRef.current];
      
      // Use e.code for consistency (KeyA, ArrowUp, etc.)
      const pressedKey = e.code;

      // Check if enough time has passed since first key
      if (progressRef.current > 0 && lastKeyTimeRef.current) {
        const elapsed = currentTime - lastKeyTimeRef.current;
        if (elapsed > timeout) {
          resetProgress();
        }
      }

      // Check if the pressed key matches the expected key
      if (pressedKey === expectedKey) {
        progressRef.current += 1;
        lastKeyTimeRef.current = currentTime;

        // Reset timeout on each correct key
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          resetProgress();
        }, timeout);

        // Check if sequence is complete
        if (progressRef.current === sequence.length) {
          resetProgress();
          setActivated(true);
        }
      } else {
        // Wrong key - reset progress
        resetProgress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sequence, timeout, resetProgress]);

  return activated;
};

export default useSecretSequence;
