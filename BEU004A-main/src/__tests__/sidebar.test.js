import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import jwt_decode from "jwt-decode";

// 1. MOCKING DEPENDENCIES
jest.mock("jwt-decode", () => jest.fn());

describe("Sidebar Component (Unit Test)", () => {
  const mockOnLogoutClick = jest.fn();
  const mockSetIsOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage agar token tersedia untuk Sidebar
    Storage.prototype.getItem = jest.fn((key) => {
        if (key === "token") return "fake-token-123";
        return null;
    });
  });

  const renderSidebar = (isOpen = true) => {
    return render(
      <BrowserRouter>
        <Sidebar 
          isOpen={isOpen} 
          setIsOpen={mockSetIsOpen} 
          onLogoutClick={mockOnLogoutClick} 
        />
      </BrowserRouter>
    );
  };

  test("menampilkan menu standar dan menangani teks Delivery Fee yang mirip", async () => {
    // Simulasi Admin Biasa
    jwt_decode.mockReturnValue({ role: "Admin" });
    renderSidebar();

    // Tunggu render selesai
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();

    // 🔥 SOLUSI UNTUK DELIVERY FEE:
    // Gunakan regex yang ketat (^ untuk awal, $ untuk akhir) agar tidak tertukar
    expect(screen.getByText(/^Delivery Fee$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Delivery Fee On Delivery$/i)).toBeInTheDocument();
  });

  test("menampilkan menu khusus Super Admin (Laporan Gaji) saat login sebagai Super Admin", async () => {
    // Simulasi Super Admin
    jwt_decode.mockReturnValue({ role: "Super Admin" });
    renderSidebar();

    // 🔥 SOLUSI: Gunakan waitFor karena menu muncul setelah dekode token asinkron
    await waitFor(() => {
      expect(screen.getByText(/Laporan Gaji/i)).toBeInTheDocument();
      expect(screen.getByText(/Manajemen Gaji/i)).toBeInTheDocument();
      expect(screen.getByText(/Manajemen Karyawan/i)).toBeInTheDocument();
    });
  });

  test("tidak menampilkan menu laporan gaji untuk role selain Super Admin", async () => {
    jwt_decode.mockReturnValue({ role: "Admin" });
    renderSidebar();

    // Tunggu sampai Sidebar stabil
    await screen.findByText(/Dashboard/i);

    // Verifikasi menu tidak ada
    expect(screen.queryByText(/Laporan Gaji/i)).not.toBeInTheDocument();
  });

  test("memanggil onLogoutClick dan menutup sidebar saat tombol Logout diklik", async () => {
    jwt_decode.mockReturnValue({ role: "Admin" });
    renderSidebar();

    const logoutBtn = await screen.findByRole("button", { name: /Logout/i });
    fireEvent.click(logoutBtn);

    // Verifikasi fungsi dipanggil
    expect(mockOnLogoutClick).toHaveBeenCalled();
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  test("menutup sidebar saat salah satu menu Link diklik", async () => {
    jwt_decode.mockReturnValue({ role: "Admin" });
    renderSidebar();

    const dashboardLink = await screen.findByText(/Dashboard/i);
    fireEvent.click(dashboardLink);

    // Verifikasi sidebar otomatis tertutup
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
});