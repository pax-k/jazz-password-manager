import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createJazzReactContext, PasskeyAuth } from "jazz-react";
import { PasswordManagerAccount } from "./schema.ts";
import { PrettyAuthUI } from "./components/Auth.tsx";

const auth = PasskeyAuth<PasswordManagerAccount>({
  appName: "Jazz Password Manager",
  Component: PrettyAuthUI,
  accountSchema: PasswordManagerAccount,
});

const Jazz = createJazzReactContext<PasswordManagerAccount>({
  auth,
  peer: "wss://mesh.jazz.tools/?key=you@example.com",
});

export const { useAccount, useCoState, useAcceptInvite } = Jazz;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Jazz.Provider>
      <App />
    </Jazz.Provider>
  </React.StrictMode>
);
