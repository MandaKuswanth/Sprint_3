import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [loginData, setLoginData] = useState(null);

  const goToRegister = () => {
    setCurrentScreen("register");
  };

  const goToLogin = () => {
    setCurrentScreen("login");
  };

  const goToHome = (data) => {
    setLoginData(data);

    Toast.show({
      type: "success",
      text1: "Home",
      text2: "Login completed",
    });

    console.log("LOGIN DATA:", data);

    setCurrentScreen("home");
  };

  return (
    <SafeAreaProvider>
      {currentScreen === "login" && (
        <LoginScreen
          goToRegister={goToRegister}
          goToHome={goToHome}
        />
      )}

      {currentScreen === "register" && (
        <RegisterScreen
          goToLogin={goToLogin}
        />
      )}

      {currentScreen === "home" && (
        <LoginScreen
          goToRegister={goToRegister}
          goToHome={goToHome}
        />
      )}

      <StatusBar style="auto" />
      <Toast />
    </SafeAreaProvider>
  );
}