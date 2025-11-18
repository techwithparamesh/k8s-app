import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface NamespaceContextType {
  selectedNamespace: string;
  setSelectedNamespace: (namespace: string) => void;
  namespaces: string[];
}

const NamespaceContext = createContext<NamespaceContextType | undefined>(undefined);

export function NamespaceProvider({ children }: { children: ReactNode }) {
  const [selectedNamespace, setSelectedNamespaceState] = useState<string>(() => {
    return localStorage.getItem("selectedNamespace") || "all";
  });

  const [namespaces] = useState<string[]>([
    "all",
    "default",
    "kube-system",
    "production",
    "staging",
  ]);

  const setSelectedNamespace = (namespace: string) => {
    setSelectedNamespaceState(namespace);
    localStorage.setItem("selectedNamespace", namespace);
  };

  return (
    <NamespaceContext.Provider
      value={{
        selectedNamespace,
        setSelectedNamespace,
        namespaces,
      }}
    >
      {children}
    </NamespaceContext.Provider>
  );
}

export function useNamespace() {
  const context = useContext(NamespaceContext);
  if (context === undefined) {
    throw new Error("useNamespace must be used within a NamespaceProvider");
  }
  return context;
}
