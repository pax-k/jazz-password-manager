import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/use-auth";
import AuthPage from "./pages/auth";
import VaultPage from "./pages/vault";

const App: React.FC = () => {
  const isLoggedIn = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/auth"
            element={isLoggedIn ? <Navigate to="/vault" /> : <AuthPage />}
          />
          <Route
            path="/vault"
            element={isLoggedIn ? <VaultPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/vault" : "/auth"} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
