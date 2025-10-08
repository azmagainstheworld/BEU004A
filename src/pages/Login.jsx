import React from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../components/Login";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = ({ username, password }) => {
    // Contoh login sederhana
    if (username === "admin" && password === "12345") {
      localStorage.setItem("user", JSON.stringify({ username }));
      navigate("/dashboard");
    } else {
      alert("Username atau password salah!");
    }
  };

  return <LoginComponent onSubmit={handleLogin} />;
}
