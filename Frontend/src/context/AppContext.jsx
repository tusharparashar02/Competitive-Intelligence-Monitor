import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [competitors, setCompetitors] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertCount,  setAlertCount]  = useState(0);
  const [toast,       setToast]       = useState(null); // { message, type: 'success' | 'error' }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return (
    <AppContext.Provider value={{
      competitors, setCompetitors,
      sidebarOpen, setSidebarOpen,
      alertCount,  setAlertCount,
      toast, showToast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
