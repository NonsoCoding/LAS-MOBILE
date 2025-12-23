import React, { createContext, useContext, useState } from "react";

type AppMode = "user" | "rider";

const AppModeContext = createContext<{
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}>({
  mode: "user",
  setMode: () => {},
});

export const useAppMode = () => useContext(AppModeContext);

export const AppModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<AppMode>("user");
  return (
    <AppModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AppModeContext.Provider>
  );
};
