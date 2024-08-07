import React from "react";
import { Navigate, createHashRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "./hooks/use-auth";
import AuthPage from "./pages/auth";
import VaultPage from "./pages/vault";

const App: React.FC = () => {
  const isLoggedIn = useAuth();

  const router = createHashRouter([
    {
      path: "/auth",
      element: isLoggedIn ? <Navigate to="/vault" /> : <AuthPage />,
    },
    {
      path: "/vault",
      element: isLoggedIn ? <VaultPage /> : <Navigate to="/auth" />,
    },
    {
      path: "/invite/*",
      element: <p>Accepting invite...</p>,
    },
    {
      path: "*",
      element: <Navigate to={isLoggedIn ? "/vault" : "/auth"} />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
