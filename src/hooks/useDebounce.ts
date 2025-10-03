import { useEffect, useState } from 'react'

function useDebounce(value: string, delay: number) {
  const [deboncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay);

    return () => clearTimeout(timeOutId);
  }, [value, delay])

  return { deboncedValue };
}

export default useDebounce