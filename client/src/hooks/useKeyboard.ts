import { useEffect } from 'react';

// A Set to keep track of currently pressed keys, useful for continuous movement
// but for Pong, usually, a single key press is enough to send an event.
// For this example, we'll just use a simple callback on keydown.

export const useKeyboard = (
    callback: (key: string) => void, // Called on keydown
    // onKeyUpCallback?: (key: string) => void // Optional: if you need keyup
    dependencies: React.DependencyList = [] // To control when the effect re-runs
    ) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // event.preventDefault(); // Uncomment if you want to prevent default browser actions for these keys
      callback(event.key);
    };

    // const handleKeyUp = (event: KeyboardEvent) => {
    //   if (onKeyUpCallback) {
    //     onKeyUpCallback(event.key);
    //   }
    // };

    window.addEventListener('keydown', handleKeyDown);
    // window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // window.removeEventListener('keyup', handleKeyUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies]); // Include callback and any other dependencies
};