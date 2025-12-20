import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LaporanKeuangan from "../components/LaporanKeuangan";
import { useFinance } from "../context/FinanceContext";

// 1. Mock useFinance context
jest.mock("../context/FinanceContext", () => ({
  useFinance: jest.fn(),
}));

describe("LaporanKeuangan Component", () => {
  const mockLaporanData = [
    { tanggal: "2024-01-01", kas: 500000, jfs: 200000, transfer: 300000 },
    { tanggal: "2024-01-02", kas: 100000, jfs: -50000, transfer: 50000 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("menampilkan pesan 'Data Tidak Ditemukan' jika data kosong", () => {
    useFinance.mockReturnValue({ laporanKeuangan: [] });
    render(<LaporanKeuangan />);
    expect(screen.getByText(/Data Tidak Ditemukan/i)).toBeInTheDocument();
  });

  test("berhasil merender baris data dari context", () => {
    useFinance.mockReturnValue({ laporanKeuangan: mockLaporanData });
    render(<LaporanKeuangan />);

    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    // Menggunakan getAllByText karena angka mungkin muncul di baris data dan struktur DataTable
    expect(screen.getAllByText(/500\.000/)[0]).toBeInTheDocument();
  });

  test("menghitung dan menampilkan total akumulasi dengan benar di footer", () => {
    useFinance.mockReturnValue({ laporanKeuangan: mockLaporanData });
    render(<LaporanKeuangan />);

    // Total Kas: 500.000 + 100.000 = 600.000
    // Karena Jest menemukan lebih dari satu (di header/footer), gunakan getAllByText
    const totalKasElements = screen.getAllByText(/600\.000/);
    expect(totalKasElements.length).toBeGreaterThanOrEqual(1);

    const totalJfsElements = screen.getAllByText(/150\.000/);
    expect(totalJfsElements.length).toBeGreaterThanOrEqual(1);

    const totalTransferElements = screen.getAllByText(/350\.000/);
    expect(totalTransferElements.length).toBeGreaterThanOrEqual(1);
  });

  test("menginisialisasi DataTables saat data tersedia", async () => {
    useFinance.mockReturnValue({ laporanKeuangan: mockLaporanData });
    render(<LaporanKeuangan />);

    await waitFor(() => {
      const tableWrapper = document.querySelector("#laporanTable_wrapper");
      expect(tableWrapper).toBeInTheDocument();
    });
  });
});