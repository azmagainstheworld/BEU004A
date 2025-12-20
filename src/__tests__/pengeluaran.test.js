import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputPengeluaranKas from "../components/InputPengeluaranKas";
import { useFinance } from "../context/FinanceContext";

// 1. Mocking Global
global.fetch = jest.fn();
jest.mock("jwt-decode", () => jest.fn(() => ({ role: "Non-Admin" })));

// 2. Mock useFinance Context
jest.mock("../context/FinanceContext", () => ({
  useFinance: jest.fn(),
}));

const mockKaryawanList = [
  { id_karyawan: 1, nama_karyawan: "Budi" },
  { id_karyawan: 2, nama_karyawan: "Siti" },
];

describe("InputPengeluaranKas (Whitebox Test)", () => {
  const mockContext = {
    addPengeluaran: jest.fn(),
    updatePengeluaranById: jest.fn(),
    fetchTodayInputs: jest.fn(),
    fetchLaporanKeuangan: jest.fn(),
  };

  const mockInitialData = [
    {
      id_input_pengeluaran: 501,
      nominal_pengeluaran: 50000,
      tanggal_pengeluaran: new Date().toISOString(),
      jenis_pembayaran: "Cash",
      jenis_pengeluaran: "Operasional",
      deskripsi: "Beli bensin",
      nama_karyawan: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useFinance.mockReturnValue(mockContext);
    
    // Default mock untuk fetch data lokal (GET)
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockInitialData),
      })
    );
  });

  // --- Path 1: Rendering & Fetch Data ---
  test("should fetch data and initialize DataTables on mount", async () => {
    await act(async () => {
      render(<InputPengeluaranKas karyawanList={mockKaryawanList} />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      // Pastikan wrapper DataTable muncul
      const tableWrapper = document.querySelector("#pengeluaranTable_wrapper");
      expect(tableWrapper).toBeInTheDocument();
    });
  });

  // --- Path 2: Validasi Form ---
  test("should show validation errors for incomplete form", async () => {
    await act(async () => {
      render(<InputPengeluaranKas karyawanList={mockKaryawanList} />);
    });

    const simpanBtn = screen.getByRole("button", { name: /Simpan/i });
    fireEvent.click(simpanBtn);

    await waitFor(() => {
      expect(screen.getByText(/Nominal minimal 1.000/i)).toBeInTheDocument();
      expect(screen.getByText(/Jenis pembayaran wajib dipilih/i)).toBeInTheDocument();
    });
  });

    // --- Path 3: Simulasikan Tambah Data (POST via Context) ---
    test("should call addPengeluaran from context on valid submit", async () => {
    await act(async () => {
        render(<InputPengeluaranKas karyawanList={mockKaryawanList} />);
    });

    // 1. Masukkan Nominal
    fireEvent.change(screen.getByPlaceholderText(/Masukkan nominal/i), {
        target: { value: "15000" },
    });

    // 2. Pilih Jenis Pembayaran (Dropdown ke-1)
    const selects = screen.getAllByRole("combobox");
    
    // selects[0] biasanya adalah Jenis Pembayaran (Cash/Transfer)
    fireEvent.change(selects[0], {
        target: { value: "Cash" },
    });

    // 3. Pilih Jenis Pengeluaran (Dropdown ke-2)
    // selects[1] biasanya adalah Jenis Pengeluaran (Operasional/Kasbon/dll)
    fireEvent.change(selects[1], { 
        target: { value: "Operasional" } 
    });

    // 4. Klik Simpan
    fireEvent.click(screen.getByRole("button", { name: /Simpan/i }));

    await waitFor(() => {
        expect(mockContext.addPengeluaran).toHaveBeenCalledWith(
        expect.objectContaining({
            nominal_pengeluaran: 15000,
            jenis_pengeluaran: "Operasional",
            jenis_pembayaran: "Cash"
        })
        );
    });
})
  // --- Path 4: Simulasikan Klik Edit (jQuery Delegation) ---
  test("should enter edit mode when edit button in table is clicked", async () => {
    await act(async () => {
      render(<InputPengeluaranKas karyawanList={mockKaryawanList} />);
    });

    // Karena DataTable merender HTML mentah, kita gunakan event delegation manual atau mencari button
    await waitFor(() => {
      const editBtn = document.querySelector(".btn-edit-pengeluaran");
      expect(editBtn).toBeInTheDocument();
      fireEvent.click(editBtn);
    });

    // Cek apakah form terisi data dari mockInitialData
    expect(screen.getByPlaceholderText(/Masukkan nominal/i).value).toBe("50.000");
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });

  // --- Path 5: Hapus Data ---
  test("should show confirmation modal and call fetch delete", async () => {
    await act(async () => {
      render(<InputPengeluaranKas karyawanList={mockKaryawanList} />);
    });

    // Klik tombol hapus di tabel
    await waitFor(() => {
      const deleteBtn = document.querySelector(".btn-delete-pengeluaran");
      fireEvent.click(deleteBtn);
    });

    // Cek modal muncul
    expect(screen.getByText(/Apakah Anda yakin ingin menghapus Pengeluaran ini/i)).toBeInTheDocument();

    // Klik Hapus di dalam modal (tombol dengan class variant-danger/bg-red-500)
    const confirmBtn = screen.getAllByRole("button", { name: /Hapus/i }).find(btn => 
        btn.closest('.fixed')
    );
    
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      // Verifikasi fetch manual ke endpoint /delete
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/delete"),
        expect.objectContaining({ method: "PUT" })
      );
    });
  });
});