import { useState, useCallback } from 'react';

export default function useToast() {
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, showToast, dismissToast };
}
