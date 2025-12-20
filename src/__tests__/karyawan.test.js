import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManajemenKaryawanComponent from "../components/ManajemenKaryawan";
import { useKaryawan } from "../context/KaryawanContext";

// 1. Mocking Context
jest.mock("../context/KaryawanContext", () => ({
  useKaryawan: jest.fn(),
}));

describe("ManajemenKaryawanComponent (Unit Test)", () => {
  const mockKaryawanList = [
    {
      id_karyawan: 1,
      nama_karyawan: "Budi Santoso",
      ttl: "1995-05-10",
      jenis_kelamin: "Laki-laki",
      alamat: "Jl. Merdeka No. 1",
    },
  ];

  const mockAddKaryawan = jest.fn();
  const mockUpdateKaryawan = jest.fn();
  const mockDeleteKaryawan = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default return value untuk mock context
    useKaryawan.mockReturnValue({
      karyawanList: mockKaryawanList,
      addKaryawan: mockAddKaryawan,
      updateKaryawan: mockUpdateKaryawan,
      deleteKaryawan: mockDeleteKaryawan,
    });
  });

  test("berhasil merender tabel dengan data karyawan dari context", async () => {
    render(<ManajemenKaryawanComponent />);

    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("Jl. Merdeka No. 1")).toBeInTheDocument();
    
    // Verifikasi DataTable wrapper muncul
    await waitFor(() => {
      expect(document.querySelector("#manajemenKaryawanTable_wrapper")).toBeInTheDocument();
    });
  });

  test("menampilkan modal tambah karyawan saat tombol 'Tambah Karyawan' diklik", () => {
    render(<ManajemenKaryawanComponent />);

    const btnTambah = screen.getByRole("button", { name: /Tambah Karyawan/i });
    fireEvent.click(btnTambah);

    expect(screen.getByPlaceholderText("Nama Karyawan")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Tambah Karyawan/i })).toBeInTheDocument();
  });

  test("memanggil addKaryawan dengan data yang benar saat form diisi dan disimpan", async () => {
    render(<ManajemenKaryawanComponent />);

    // Buka Form
    fireEvent.click(screen.getByRole("button", { name: /Tambah Karyawan/i }));

    // Isi Form
    fireEvent.change(screen.getByPlaceholderText("Nama Karyawan"), { target: { value: "Ani Wijaya", name: "nama_karyawan" } });
    fireEvent.change(screen.getByPlaceholderText("Tanggal Lahir"), { target: { value: "1998-12-12", name: "ttl" } });

    // --- PERBAIKAN DI SINI ---
    // Cari dropdown berdasarkan teks defaultnya atau labelnya agar lebih spesifik
    const genderSelect = screen.getByDisplayValue(/-- Pilih Jenis Kelamin --/i);
    fireEvent.change(genderSelect, { target: { value: "Perempuan", name: "jenis_kelamin" } });
    // -------------------------

    fireEvent.change(screen.getByPlaceholderText("Alamat"), { target: { value: "Jl. Mawar No. 5", name: "alamat" } });

    // Klik Simpan
    fireEvent.click(screen.getByRole("button", { name: /Simpan/i }));

    await waitFor(() => {
      expect(mockAddKaryawan).toHaveBeenCalledWith(expect.objectContaining({
        nama_karyawan: "Ani Wijaya",
        jenis_kelamin: "Perempuan"
      }));
    });
  });

  test("masuk ke mode edit dan memanggil updateKaryawan saat menyimpan perubahan", async () => {
    render(<ManajemenKaryawanComponent />);

    // Klik tombol Edit di baris tabel
    const btnEdit = screen.getByRole("button", { name: /Edit/i });
    fireEvent.click(btnEdit);

    // Cek apakah judul modal berubah jadi Edit
    expect(screen.getByText(/Edit Karyawan/i)).toBeInTheDocument();
    
    // Pastikan nilai awal terisi
    const inputNama = screen.getByPlaceholderText("Nama Karyawan");
    expect(inputNama.value).toBe("Budi Santoso");

    // Ubah Nama
    fireEvent.change(inputNama, { target: { value: "Budi Santoso Update", name: "nama_karyawan" } });
    fireEvent.click(screen.getByRole("button", { name: /Simpan/i }));

    await waitFor(() => {
      expect(mockUpdateKaryawan).toHaveBeenCalledWith(1, expect.objectContaining({
        nama_karyawan: "Budi Santoso Update"
      }));
    });
  });

  test("menampilkan modal konfirmasi dan memanggil deleteKaryawan saat hapus dikonfirmasi", async () => {
    render(<ManajemenKaryawanComponent />);

    // Klik tombol Hapus di tabel
    fireEvent.click(screen.getByRole("button", { name: /Hapus/i }));

    // Cek Modal Konfirmasi muncul
    expect(screen.getByText(/Apakah Anda yakin ingin menghapus karyawan ini/i)).toBeInTheDocument();

    // Klik tombol Hapus di dalam modal konfirmasi
    // Gunakan filter .closest('.fixed') untuk memastikan mengambil tombol di modal, bukan di tabel
    const confirmButtons = screen.getAllByRole("button", { name: /Hapus/i });
    const modalDeleteBtn = confirmButtons.find(btn => btn.closest('.fixed'));
    
    fireEvent.click(modalDeleteBtn);

    await waitFor(() => {
      expect(mockDeleteKaryawan).toHaveBeenCalledWith(1);
    });
  });
});