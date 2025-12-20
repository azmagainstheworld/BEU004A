import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManajemenGajiPages from "../pages/ManajemenGaji";
import { useKaryawanContext } from "../context/KaryawanContext";
import $ from "jquery";

// 1. MOCK JQUERY PLUGINS
$.fn.highlight = jest.fn();
$.fn.unhighlight = jest.fn();

// 2. MOCK CONTEXT & GLOBAL FETCH
global.fetch = jest.fn();

jest.mock("../context/KaryawanContext", () => ({
  useKaryawanContext: jest.fn(),
}));

describe("ManajemenGaji Feature (Whitebox Test)", () => {
  const mockKaryawanList = [
    { id_karyawan: 1, nama_karyawan: "Budi Santoso" },
  ];

  const mockGajiBackend = [
    { id_karyawan: 1, upah_perhari: 100000, bonus: 5000 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage token
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return "fake-jwt-token";
      return null;
    });

    // Mock Context
    useKaryawanContext.mockReturnValue({
      karyawanList: mockKaryawanList,
    });

    // Mock Fetch Default (Data Gaji)
    global.fetch.mockImplementation((url) => {
      if (url.includes("/manajemen-gaji")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGajiBackend),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  test("berhasil memuat data karyawan dan menggabungkannya dengan data gaji", async () => {
    await act(async () => {
      render(<ManajemenGajiPages />);
    });

    // Tunggu data muncul di tabel
    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
      // Nominal 100.000 terformat (Rp 100.000)
      expect(screen.getByText(/Rp 100\.000/i)).toBeInTheDocument();
    });

    // Cek inisialisasi DataTables
    expect(document.querySelector("#manajemenGajiTable_wrapper")).toBeInTheDocument();
  });

  test("masuk ke mode edit saat tombol 'Edit' diklik", async () => {
    await act(async () => {
      render(<ManajemenGajiPages />);
    });

    const editBtn = await screen.findByRole("button", { name: /Edit/i });
    fireEvent.click(editBtn);

    // Pastikan input muncul
    const inputUpah = screen.getByPlaceholderText(/Masukkan upah/i);
    expect(inputUpah).toBeInTheDocument();
    expect(inputUpah.value).toBe("100.000"); // Format ribuan di input
  });

  test("menampilkan pesan error jika nominal upah kurang dari 1.000", async () => {
    await act(async () => {
      render(<ManajemenGajiPages />);
    });

    // Klik Edit
    fireEvent.click(await screen.findByRole("button", { name: /Edit/i }));

    // Masukkan angka 500
    const inputUpah = screen.getByPlaceholderText(/Masukkan upah/i);
    fireEvent.change(inputUpah, { target: { value: "500" } });

    // Klik Simpan
    fireEvent.click(screen.getByRole("button", { name: /Simpan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Masukkan nominal minimal 1\.000/i)).toBeInTheDocument();
    });
  });

  test("memanggil API POST dengan data yang benar saat menyimpan perubahan", async () => {
    await act(async () => {
      render(<ManajemenGajiPages />);
    });

    // Klik Edit
    fireEvent.click(await screen.findByRole("button", { name: /Edit/i }));

    // Ubah Upah dan Bonus
    const inputUpah = screen.getByPlaceholderText(/Masukkan upah/i);
    const inputBonus = screen.getByPlaceholderText(/Masukkan bonus/i);

    fireEvent.change(inputUpah, { target: { value: "150.000" } });
    fireEvent.change(inputBonus, { target: { value: "10.000" } });

    // Klik Simpan
    fireEvent.click(screen.getByRole("button", { name: /Simpan/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/manajemen-gaji"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            id_karyawan: 1,
            upah_perhari: 150000,
            bonus: 10000,
          }),
        })
      );
    });

    // Pastikan modal sukses muncul (PopupSuccess)
    expect(screen.getByText(/Data berhasil disimpan/i)).toBeInTheDocument();
  });

  test("membatalkan perubahan saat tombol 'Batal' diklik", async () => {
    await act(async () => {
      render(<ManajemenGajiPages />);
    });

    fireEvent.click(await screen.findByRole("button", { name: /Edit/i }));
    
    const inputUpah = screen.getByPlaceholderText(/Masukkan upah/i);
    fireEvent.change(inputUpah, { target: { value: "200.000" } });

    // Klik Batal
    fireEvent.click(screen.getByRole("button", { name: /Batal/i }));

    // Input harus hilang dan kembali ke text biasa (Rp 100.000)
    expect(screen.queryByPlaceholderText(/Masukkan upah/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Rp 100\.000/i)).toBeInTheDocument();
  });
});