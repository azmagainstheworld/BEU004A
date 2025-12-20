import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import LupaPassword from "../pages/LupaPassword"; // Sesuaikan path page Anda

// 1. MOCK GLOBAL FETCH
global.fetch = jest.fn();

describe("LupaPassword Feature (Unit Test)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("menampilkan pesan error jika email kosong", async () => {
    render(<LupaPassword />);

    const submitButton = screen.getByRole("button", { name: /Kirim/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Email harus diisi/i)).toBeInTheDocument();
  });

  test("menampilkan pesan error jika format email tidak valid", async () => {
    render(<LupaPassword />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "email-salah" } });

    const submitButton = screen.getByRole("button", { name: /Kirim/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Format email tidak valid/i)).toBeInTheDocument();
  });

  test("menampilkan pesan error jika email tidak terdaftar di database (404/400)", async () => {
    // Mock response error dari backend
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email tidak ditemukan" }),
    });

    render(<LupaPassword />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "admin@mail.com" } });

    fireEvent.click(screen.getByRole("button", { name: /Kirim/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email tidak ditemukan/i)).toBeInTheDocument();
    });
  });

  test("berhasil mengirim permintaan reset password dan menampilkan pesan sukses", async () => {
    const successMsg = "Link reset password telah dikirim ke email Anda";
    
    // Mock response sukses dari backend
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: successMsg }),
    });

    render(<LupaPassword />);

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });

    await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /Kirim/i }));
    });

    await waitFor(() => {
      // Pastikan fetch dipanggil ke endpoint yang benar
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/beu004a/auth/request-reset-password",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "user@example.com" }),
        })
      );
      // Pastikan pesan sukses muncul
      expect(screen.getByText(successMsg)).toBeInTheDocument();
    });
  });
});