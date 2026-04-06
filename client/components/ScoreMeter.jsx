'use client';
import { useEffect, useState } from 'react';

export default function ScoreMeter({ score }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(score / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const color =
    score >= 70 ? '#16a34a' : score >= 40 ? '#f59e0b' : '#ea580c';

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="rgba(24,24,27,0.15)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-zinc-900 leading-none">{displayed}</span>
          <span className="text-xs text-zinc-600">/100</span>
        </div>
      </div>
      <p className="text-xs text-zinc-600 uppercase tracking-widest mt-3">Profitability Score</p>
    </div>
  );
}