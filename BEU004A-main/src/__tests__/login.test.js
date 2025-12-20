import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Login from "../components/Login";
import { useFinance } from "../context/FinanceContext";

// 1. Mock useFinance context
jest.mock("../context/FinanceContext", () => ({
  useFinance: jest.fn(),
}));

// 2. Mock Global Fetch
global.fetch = jest.fn();

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  const mockSetToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useFinance.mockReturnValue({ setToken: mockSetToken });
    
    // Mocking LocalStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  test("menampilkan pesan error jika username atau password kosong", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole("button", { name: /Masuk/i });
    fireEvent.click(submitButton);

    expect(
      screen.getByText(/Harap mengisi username\/password terlebih dahulu/i)
    ).toBeInTheDocument();
  });

  test("menampilkan pesan error jika login gagal (401/400)", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Unauthorized" }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Masukkan username/i), {
      target: { value: "user_salah" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan password/i), {
      target: { value: "pass_salah" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Masuk/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Username\/password salah, silakan coba lagi/i)
      ).toBeInTheDocument();
    });
  });

  test("berhasil login, menyimpan token, dan navigasi ke dashboard", async () => {
    const fakeToken = "fake-jwt-token";
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: fakeToken }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Masukkan username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Masukkan password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Masuk/i }));

    await waitFor(() => {
      // Pastikan token disimpan di localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith("token", fakeToken);
      // Pastikan setToken di context dipanggil
      expect(mockSetToken).toHaveBeenCalledWith(fakeToken);
      // Pastikan navigasi ke dashboard
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});