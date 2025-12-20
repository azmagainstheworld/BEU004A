import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManajemenAkunPage from "../pages/ManajemenAkun";
import { BrowserRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import $ from "jquery";

// 1. MOCKING EXTERNAL LIBRARIES
$.fn.highlight = jest.fn();
$.fn.unhighlight = jest.fn();
global.fetch = jest.fn();

jest.mock("jwt-decode", () => jest.fn());

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ManajemenAkun Feature (Whitebox Test)", () => {
  const mockSuperAdminToken = "token-super-admin";
  const mockDecodedSuperAdmin = {
    userId: 1,
    username: "super_boss",
    email: "super@mail.com",
    role: "Super Admin",
  };

  const mockAdminList = [
    { id_user_jntcargobeu004a: 2, username: "admin_outlet", email: "admin@mail.com", roles: "Admin" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock LocalStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return mockSuperAdminToken;
      return null;
    });

    // Mock JWT Decode untuk memberikan role Super Admin
    jwtDecode.mockReturnValue(mockDecodedSuperAdmin);

    // Mock Fetch Default
    global.fetch.mockImplementation((url) => {
      if (url.includes("/superadmin")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAdminList) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  const renderComponent = () => 
    render(
      <BrowserRouter>
        <ManajemenAkunPage />
      </BrowserRouter>
    );

  test("berhasil memuat profil Super Admin dan daftar admin", async () => {
    await act(async () => { renderComponent(); });

    // Cek Profil
    expect(screen.getByText(/super_boss/i)).toBeInTheDocument();
    expect(screen.getByText(/Super Admin/i)).toBeInTheDocument();

    // Cek Tabel Admin
    await waitFor(() => {
      expect(screen.getByText("admin_outlet")).toBeInTheDocument();
    });

    // Cek DataTables
    expect(document.querySelector("#adminTable_wrapper")).toBeInTheDocument();
  });

  test("menunjukkan kekuatan password 'Lemah' jika kurang dari 6 karakter", async () => {
    await act(async () => { renderComponent(); });

    // Klik Tambah Admin
    fireEvent.click(screen.getByRole("button", { name: /Tambah Admin/i }));

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { name: "password", value: "123" } });

    expect(screen.getByText(/Lemah/i)).toBeInTheDocument();
  });

  test("berhasil memvalidasi email yang tidak valid", async () => {
    await act(async () => { renderComponent(); });

    fireEvent.click(screen.getByRole("button", { name: /Tambah Admin/i }));

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { name: "email", value: "email-salah" } });

    expect(screen.getByText(/Format email tidak valid/i)).toBeInTheDocument();
  });

  test("memanggil API POST saat menambah admin baru dengan sukses", async () => {
    global.fetch.mockImplementationOnce((url, options) => {
      if (options?.method === "POST") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 99 }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAdminList) });
    });

    await act(async () => { renderComponent(); });

    fireEvent.click(screen.getByRole("button", { name: /Tambah Admin/i }));

    // Isi Form
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { name: "username", value: "admin_baru" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { name: "email", value: "baru@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { name: "password", value: "Password123" } });
    fireEvent.change(screen.getByPlaceholderText("Konfirmasi Password"), { target: { name: "confirmPassword", value: "Password123" } });

    // Klik Simpan
    const saveBtn = screen.getByRole("button", { name: /Simpan/i });
    await act(async () => { fireEvent.click(saveBtn); });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tambah-admin"),
        expect.objectContaining({ method: "POST" })
      );
      expect(screen.getByText(/berhasil ditambahkan/i)).toBeInTheDocument();
    });
  });

  test("berhasil memanggil API DELETE saat menghapus admin", async () => {
    await act(async () => { renderComponent(); });

    // Klik tombol Hapus di baris admin (gunakan find karena di-render dinamis)
    const deleteBtn = await screen.findByRole("button", { name: /Hapus/i });
    fireEvent.click(deleteBtn);

    // Klik Hapus di Modal Konfirmasi
    const confirmDeleteBtn = screen.getAllByRole("button", { name: /Hapus/i }).find(btn => 
        btn.closest('.relative.z-50')
    );
    
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Deleted" }) });
    
    await act(async () => { fireEvent.click(confirmDeleteBtn); });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/delete"),
        expect.objectContaining({ method: "PUT" })
      );
    });
  });
});