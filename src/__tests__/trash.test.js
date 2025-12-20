import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import TrashGlobal from "../pages/TrashGlobal"; 
import jwt_decode from "jwt-decode";
import $ from "jquery";

// 1. MOCKING DEPENDENCIES
jest.mock("jwt-decode", () => jest.fn());
global.fetch = jest.fn();

// 🔥 PERBAIKAN UTAMA: Mock DataTable dengan isDataTable
const mockDataTableInstance = {
  destroy: jest.fn(),
  on: jest.fn(),
  table: () => ({ body: () => ({ unhighlight: jest.fn(), highlight: jest.fn() }) }),
  search: () => "",
};

const mockDataTableMain = jest.fn().mockReturnValue(mockDataTableInstance);
// Tambahkan fungsi isDataTable ke objek mock
mockDataTableMain.isDataTable = jest.fn().mockReturnValue(false);

$.fn.DataTable = mockDataTableMain;
$.fn.highlight = jest.fn();
$.fn.unhighlight = jest.fn();

describe("Trash Feature (Whitebox Test)", () => {
  const mockToken = "fake-super-admin-token";
  
  const mockTrashData = [
    {
      id_input_deliveryfee: 1,
      modul_sumber: "DeliveryFee",
      nominal: 50000,
      tanggal: "2023-10-01",
      keterangan: "Paket Terhapus",
      id_unik: 1
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "token") return mockToken;
      return null;
    });

    jwt_decode.mockReturnValue({ role: "Super Admin" });

    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTrashData),
      })
    );
  });

  test("berhasil memuat data trash dari API", async () => {
    await act(async () => {
      render(<TrashGlobal />);
    });

    await waitFor(() => {
      // Pastikan minimal satu modul dipanggil
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(screen.getByText("Trash")).toBeInTheDocument();
  });

  test("menampilkan kolom Aksi khusus untuk Super Admin", async () => {
    await act(async () => {
      render(<TrashGlobal />);
    });

    expect(screen.getByText("Aksi")).toBeInTheDocument();
  });

  test("menyembunyikan kolom Aksi jika login sebagai Admin biasa", async () => {
    jwt_decode.mockReturnValue({ role: "Admin" });

    await act(async () => {
      render(<TrashGlobal />);
    });

    // Kolom aksi tidak boleh ada di header
    expect(screen.queryByText("Aksi")).not.toBeInTheDocument();
  });

  test("mengubah judul log saat filter modul diganti", async () => {
    await act(async () => {
      render(<TrashGlobal />);
    });

    const filterSelect = screen.getByLabelText(/Filter Sumber Data:/i);
    
    await act(async () => {
      fireEvent.change(filterSelect, { target: { value: "DFOD" } });
    });

    expect(screen.getByText(/Log Data Terhapus \(DFOD\)/i)).toBeInTheDocument();
  });

  test("menangani kondisi data trash kosong", async () => {
    // Mock isDataTable agar mengembalikan true untuk mensimulasikan redraw
    $.fn.DataTable.isDataTable.mockReturnValue(true);
    
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    await act(async () => {
      render(<TrashGlobal />);
    });

    await waitFor(() => {
        // Teks ini disuntikkan langsung ke innerHTML oleh logic komponen
        expect(document.body.innerHTML).toContain("Data terhapus tidak ditemukan");
    });
  });
});