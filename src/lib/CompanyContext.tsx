"use client";

import { createContext, useContext, useState } from "react";

type CompanyContextType = {
  company: string | null;
  setCompany: (company: string) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [company, setCompany] = useState<string | null>(null);
  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context)
    throw new Error("useCompany must be used within CompanyProvider");
  return context;
};
