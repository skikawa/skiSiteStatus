import { useCallback, useEffect, useRef, useState } from "react";

const COUNTDOWN_SECONDS = 300;

/**
 * Countdown hook for auto-refresh.
 * Starts at 300s (5min), counts down to 0.
 * When reaching 0, calls onExpire callback and resets.
 * @returns [remaining, reset] - remaining seconds and reset function
 */
export const useCountdown = (onExpire: () => void): [number, () => void] => {
  const [remaining, setRemaining] = useState<number>(COUNTDOWN_SECONDS);
  const onExpireRef = useRef(onExpire);

  // Keep callback ref up-to-date without resetting timer
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const reset = useCallback(() => {
    setRemaining(COUNTDOWN_SECONDS);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          onExpireRef.current();
          return COUNTDOWN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return [remaining, reset];
};

// Format remaining seconds to mm:ss
export const formatCountdown = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};