import { useEffect, useState } from 'react';

const useDebounce = <T>(input: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(input);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(input);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [input, delay]);

  return debouncedValue;
};

export default useDebounce;
