import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Hapus semua data login
    localStorage.removeItem("user");

    // Redirect ke halaman login
    navigate("/login");
  }, [navigate]);

  return null; // Tidak perlu tampilan apa pun
}
