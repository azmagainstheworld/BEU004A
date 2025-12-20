import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../components/Dashboard";
import { useFinance } from "../context/FinanceContext";

// 1. Mock useFinance context
jest.mock("../context/FinanceContext", () => ({
  useFinance: jest.fn(),
}));

describe("Dashboard Component", () => {
  const mockAllInputs = [
    {
      id: 1,
      jenis: "DFOD",
      nominal: 50000,
      tanggal: "18/12/2024",
      jenisPembayaran: "Cash",
      namaKaryawan: "-",
      deskripsi: "Input DFOD baru",
      jenisPengeluaran: "-",
    },
  ];

  const mockInsights = [
    { title: "Kas", value: 1000000, bgColor: "bg-green-500" },
    { title: "Saldo JFS", value: 500000, bgColor: "bg-blue-500" },
    { title: "Transfer", value: 250000, bgColor: "bg-yellow-500" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("menampilkan pesan loading saat data sedang dimuat", async () => {
    useFinance.mockReturnValue({
      allInputs: [],
      insights: [],
      fetchTodayInputs: jest.fn().mockImplementation(() => new Promise(() => {})), // Biarkan menggantung supaya tetap loading
      fetchLaporanKeuangan: jest.fn(),
    });

    render(<Dashboard />);
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  test("berhasil merender kartu insight dengan nominal yang benar", async () => {
    useFinance.mockReturnValue({
      allInputs: mockAllInputs,
      insights: mockInsights,
      fetchTodayInputs: jest.fn().mockResolvedValue(),
      fetchLaporanKeuangan: jest.fn().mockResolvedValue(),
    });

    // Gunakan act untuk membungkus render karena ada useEffect load() didalamnya
    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("Kas")).toBeInTheDocument();
    // Gunakan getAllByText karena angka mungkin duplikat di DOM virtual DataTables
    expect(screen.getAllByText(/1\.000\.000/)[0]).toBeInTheDocument();
  });

  test("menampilkan data tabel 'Recent Input' dengan benar", async () => {
    useFinance.mockReturnValue({
      allInputs: mockAllInputs,
      insights: mockInsights,
      fetchTodayInputs: jest.fn().mockResolvedValue(),
      fetchLaporanKeuangan: jest.fn().mockResolvedValue(),
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Gunakan getAllByText untuk mengatasi error "multiple elements found"
    await waitFor(() => {
      const nominalElements = screen.getAllByText(/50\.000/);
      expect(nominalElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("DFOD")).toBeInTheDocument();
    });
  });

  test("menginisialisasi DataTables pada elemen #dashboardTable", async () => {
    useFinance.mockReturnValue({
      allInputs: mockAllInputs,
      insights: mockInsights,
      fetchTodayInputs: jest.fn().mockResolvedValue(),
      fetchLaporanKeuangan: jest.fn().mockResolvedValue(),
    });

    await act(async () => {
      render(<Dashboard />);
    });

    // Dashboard.jsx punya timeout 80ms, jadi kita tunggu sedikit lebih lama
    await waitFor(() => {
      const tableWrapper = document.querySelector("#dashboardTable_wrapper");
      expect(tableWrapper).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});