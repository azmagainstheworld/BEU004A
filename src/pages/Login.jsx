import React from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../components/Login";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = ({ username, password }) => {
    // Kosong atau salah tetap return false
    if (username === "admin" && password === "12345") {
      localStorage.setItem("user", JSON.stringify({ username }));
      navigate("/dashboard");
      return true; // login berhasil
    }
    return false; // login gagal
  };

  return <LoginComponent onSubmit={handleLogin} />;
}
