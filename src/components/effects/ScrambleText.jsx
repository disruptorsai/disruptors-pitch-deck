import React, { useEffect, useState } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

export default function ScrambleText({
  text,
  className = '',
  delay = 0,
  scrambleDuration = 30,
  autoScramble = false,
  scrambleInterval = 20000
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;

    setIsScrambling(true);

    // Pick a random letter position (excluding spaces)
    const letterIndices = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== ' ') {
        letterIndices.push(i);
      }
    }

    if (letterIndices.length === 0) {
      setIsScrambling(false);
      return;
    }

    const randomIndex = letterIndices[Math.floor(Math.random() * letterIndices.length)];
    let iterations = 0;
    const maxIterations = 8; // Fast scrambles before returning to normal

    const interval = setInterval(() => {
      if (iterations < maxIterations) {
        setDisplayText(current => {
          const chars = current.split('');
          chars[randomIndex] = characters[Math.floor(Math.random() * characters.length)];
          return chars.join('');
        });
        iterations++;
      } else {
        setDisplayText(text);
        clearInterval(interval);
        setIsScrambling(false);
      }
    }, scrambleDuration);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scramble();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!autoScramble) return;

    const interval = setInterval(() => {
      scramble();
    }, scrambleInterval);

    return () => clearInterval(interval);
  }, [autoScramble, scrambleInterval]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}
