// src/hooks/use-polling.ts
import { useEffect, useRef } from "react";

/**
 * A custom hook that repeatedly calls an async function at a given interval.
 * @param callback The async function to call.
 * @param delay The interval in milliseconds. Null to stop polling.
 */
export const usePolling = (
  callback: () => Promise<void>,
  delay: number | null,
) => {
  // --- THIS IS THE FIX ---
  // Initialize the ref with the callback function provided as an argument.
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = async () => {
      // The ref's current value is guaranteed to be the function.
      await savedCallback.current();
    };

    if (delay !== null) {
      // Call it immediately once when the hook starts
      tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
