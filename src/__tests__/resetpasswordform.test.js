import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPassword from "../pages/ResetPassword"; 
import { BrowserRouter } from "react-router-dom";

// 1. MOCK GLOBAL FETCH
global.fetch = jest.fn();

// 2. MOCK NAVIGATE
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ResetPassword Feature (Unit Test)", () => {
  const mockToken = "valid-token-123";

  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = new URL(`http://localhost/reset-password?token=${mockToken}`);
  });

  test("menampilkan form reset jika token valid", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ valid: true }),
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      // 🔥 PERBAIKAN: Gunakan string eksak alih-alih regex /Password Baru/i
      expect(screen.getByPlaceholderText("Password Baru")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Konfirmasi Password Baru")).toBeInTheDocument();
    });
  });

  test("menunjukkan kekuatan password 'Kuat' jika memenuhi kriteria", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await act(async () => {
      render(
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      );
    });

    // 🔥 PERBAIKAN: Gunakan string eksak
    const passwordInput = await screen.findByPlaceholderText("Password Baru");
    fireEvent.change(passwordInput, { target: { value: "Admin123!" } });

    expect(screen.getByText(/Password: Kuat/i)).toBeInTheDocument();
  });

  test("menampilkan error jika password dan konfirmasi tidak cocok", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await act(async () => {
      render(
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      );
    });

    // 🔥 PERBAIKAN: Gunakan string eksak
    const passwordInput = await screen.findByPlaceholderText("Password Baru");
    const confirmInput = screen.getByPlaceholderText("Konfirmasi Password Baru");

    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmInput, { target: { value: "Beda123" } });

    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    expect(screen.getByText(/Password dan konfirmasi tidak cocok/i)).toBeInTheDocument();
  });

  test("berhasil mereset password dan navigasi ke halaman login", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      );
    });

    // 🔥 PERBAIKAN: Gunakan string eksak
    fireEvent.change(screen.getByPlaceholderText("Password Baru"), { target: { value: "Baru123!" } });
    fireEvent.change(screen.getByPlaceholderText("Konfirmasi Password Baru"), { target: { value: "Baru123!" } });

    await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Password berhasil diubah/i)).toBeInTheDocument();
    });
  });
});