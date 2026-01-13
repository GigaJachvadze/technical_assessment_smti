import { createContext, useContext, useState } from "react";

type LoaderContextType = {
  loading: boolean;
  start: () => void;
  stop: () => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const start = () => setLoading(true);
  const stop = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, start, stop }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used inside LoaderProvider");
  return ctx;
}
