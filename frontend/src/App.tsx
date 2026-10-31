import React from "react";
import { ThemeProvider, ToastProvider } from "@/contexts";
import { AppRoutes } from "@/routes/AppRoutes";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
