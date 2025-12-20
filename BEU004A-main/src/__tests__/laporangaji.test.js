import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
// 🔥 PERBAIKAN: Nama import disesuaikan dengan fail Page anda
import GajiKaryawan from "../pages/GajiKaryawan"; 
import $ from "jquery";

// 1. MOCK JQUERY PLUGINS
$.fn.highlight = jest.fn();
$.fn.unhighlight = jest.fn();

// 2. MOCK GLOBAL FETCH
global.fetch = jest.fn();

describe("LaporanGaji Feature (Whitebox Test)", () => {
  const mockGajiData = {
    success: true,
    data: [
      {
        nama_karyawan: "Budi Santoso",
        total_presensi: 25,
        upah_perhari: 100000,
        kasbon: 50000,
        bonus: 10000,
        gaji_bersih: 2460000, 
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage token
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return "fake-jwt-token";
      return null;
    });

    // Mock Fetch untuk API Laporan Gaji
    global.fetch.mockImplementation((url) => {
      if (url.includes("/laporan-gaji")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGajiData),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  test("menampilkan pesan 'Belum ada data gaji' jika API kosong", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      })
    );

    await act(async () => {
      render(<GajiKaryawan />);
    });

    expect(screen.getByText(/Belum ada data gaji/i)).toBeInTheDocument();
  });

  test("berhasil merender data gaji karyawan dengan format Rupiah", async () => {
    await act(async () => {
      render(<GajiKaryawan />);
    });

    await waitFor(() => {
      expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    });

    // Semak format mata wang di dalam komponen GajiKaryawan.jsx
    expect(screen.getByText(/Rp 100\.000/i)).toBeInTheDocument();
    expect(screen.getByText(/Rp 50\.000/i)).toBeInTheDocument();
    expect(screen.getByText(/Rp 2\.460\.000/i)).toBeInTheDocument();
  });

  test("menampilkan nisbah kehadiran (Hadir/Total Hari)", async () => {
    await act(async () => {
      render(<GajiKaryawan />);
    });

    await waitFor(() => {
      // DaysInMonth default di state GajiKaryawan Page adalah 30
      expect(screen.getByText("25/30")).toBeInTheDocument();
    });
  });

  test("menginisialisasi DataTables pada elemen #laporanGajiTable", async () => {
    await act(async () => {
      render(<GajiKaryawan />);
    });

    // Tunggu sehingga elemen wrapper yang dibuat oleh jQuery muncul
    await waitFor(() => {
      const tableWrapper = document.querySelector("#laporanGajiTable_wrapper");
      expect(tableWrapper).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test("memastikan token dihantar dalam header Authorization", async () => {
    await act(async () => {
      render(<GajiKaryawan />);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/laporan-gaji"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-jwt-token",
        }),
      })
    );
  });
});