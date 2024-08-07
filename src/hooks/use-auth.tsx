import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginState = () => {
      const loginState = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(loginState === "true");
    };

    const handleLoginStateChange = (event: CustomEvent<boolean>) => {
      setIsLoggedIn(event.detail);
    };

    checkLoginState();

    window.addEventListener(
      "loginStateChanged",
      handleLoginStateChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "loginStateChanged",
        handleLoginStateChange as EventListener
      );
    };
  }, []);

  return isLoggedIn;
};
