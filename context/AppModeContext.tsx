import React, { createContext, useContext, useState } from "react";

type AppMode = "shipper" | "carrier";

const AppModeContext = createContext<{
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}>({
  mode: "carrier",
  setMode: () => {},
});

export const useAppMode = () => useContext(AppModeContext);

export const AppModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<AppMode>("shipper");
  return (
    <AppModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AppModeContext.Provider>
  );
};
