import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

// 🔥 GUNAKAN ALIAS UNTUK MEMBEDAKAN KEDUANYA
import LogoutComponent from "../components/Logout";
import LogoutPage from "../pages/Logout"; 

// 1. MOCK NAVIGATE
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Logout Feature (Unit Test)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock LocalStorage
    Storage.prototype.removeItem = jest.fn();
    
    // Set token palsu untuk simulasi awal
    localStorage.setItem("token", "fake-jwt-token");
  });

  // --- TESTING COMPONENT (MODAL) ---
  describe("Logout Component (Modal)", () => {
    test("menampilkan modal konfirmasi logout", () => {
      render(
        <BrowserRouter>
          <LogoutComponent onClose={jest.fn()} />
        </BrowserRouter>
      );

      expect(screen.getByText(/Konfirmasi Logout/i)).toBeInTheDocument();
      expect(screen.getByText(/Apakah Anda yakin ingin keluar/i)).toBeInTheDocument();
    });

    test("menghapus token dan navigasi ke login saat tombol 'Ya' diklik", () => {
      render(
        <BrowserRouter>
          <LogoutComponent onClose={jest.fn()} />
        </BrowserRouter>
      );

      const confirmButton = screen.getByRole("button", { name: /Ya/i });
      fireEvent.click(confirmButton);

      // Verifikasi token dihapus
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      // Verifikasi redirect ke login
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test("memanggil fungsi onClose saat tombol 'Batal' diklik", () => {
      const mockOnClose = jest.fn();
      render(
        <BrowserRouter>
          <LogoutComponent onClose={mockOnClose} />
        </BrowserRouter>
      );

      const cancelButton = screen.getByRole("button", { name: /Batal/i });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // --- TESTING PAGE (DIRECT LOGOUT) ---
  describe("Logout Page (Direct)", () => {
    test("langsung menghapus token dan redirect saat page dimuat", () => {
      render(
        <BrowserRouter>
          <LogoutPage />
        </BrowserRouter>
      );

      // Verifikasi token langsung dihapus di useEffect
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      // Verifikasi navigasi otomatis ke login
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});