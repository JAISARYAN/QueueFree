import React from "react";
import { AuthProvider, ThemeProvider, ToastProvider } from "@/contexts";
import { AppRoutes } from "@/routes/AppRoutes";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
