import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Presensi from "../components/Presensi";
import $ from "jquery";

// 1. MOCK JQUERY PLUGINS (Penting agar tidak error unhighlight)
$.fn.highlight = jest.fn();
$.fn.unhighlight = jest.fn();

global.fetch = jest.fn();

const todayWita = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" });

describe("Presensi Component (Whitebox Test)", () => {
    const mockKaryawan = [
        { id_karyawan: 1, nama_karyawan: "Budi Santoso" },
        { id_karyawan: 2, nama_karyawan: "Siti Aminah" },
    ];

    const mockPresensiToday = [
        { 
            id_presensi: 101, 
            id_karyawan: 1, 
            kehadiran: "Hadir", 
            tanggal_presensi: todayWita, 
            waktu_presensi: "08:00:00" 
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock token agar Bearer tidak null
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === "token") return "fake-jwt-token";
            return null;
        });

        // Mock fetch default
        global.fetch.mockImplementation((url) => {
            if (url.includes("/karyawan")) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockKaryawan) });
            if (url.includes("/presensi")) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockPresensiToday) });
            return Promise.resolve({ ok: true, json: () => Promise.resolve({ message: "Success" }) });
        });
    });

    test("berhasil memuat data karyawan dan merender ringkasan", async () => {
        await act(async () => { render(<Presensi />); });

        await waitFor(() => {
            expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
        });

        expect(screen.getByText("Jumlah Karyawan")).toBeInTheDocument();
        // Menggunakan getAllByText untuk menangani duplikasi angka "2" di summary dan tabel
        expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1);
    });

    test("memanggil API POST saat mencatat kehadiran baru", async () => {
        await act(async () => { render(<Presensi />); });

        // TUNGGU SAMPAI TABEL STABIL
        await screen.findByText("Siti Aminah");

        // 🔥 PERBAIKAN: Cari tombol Hadir khusus di baris "Siti Aminah" 
        // Menggunakan closest('tr') memastikan kita tidak salah baris karena auto-sorting DataTable
        const sitiRow = screen.getByText("Siti Aminah").closest("tr");
        const hadirBtn = sitiRow.querySelector('.bg-green-600') || screen.getAllByRole("button", { name: /Hadir/i }).find(btn => !btn.disabled && btn.closest('tr') === sitiRow);
        
        await act(async () => {
            fireEvent.click(hadirBtn);
        });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/presensi"),
                expect.objectContaining({
                    method: "POST",
                    body: expect.stringContaining('"kehadiran":"Hadir"'),
                    headers: expect.objectContaining({ Authorization: "Bearer fake-jwt-token" })
                })
            );
        });
    });

    test("berhasil masuk mode edit dan update kehadiran", async () => {
        await act(async () => { render(<Presensi />); });

        // 1. Cari baris "Budi Santoso" yang sudah absen (ada tombol Edit)
        const budiRow = await screen.findByText("Budi Santoso");
        const row = budiRow.closest("tr");
        
        // 2. Klik tombol Edit milik Budi
        const editBtn = screen.getAllByRole("button", { name: /Edit/i }).find(btn => !btn.disabled && btn.closest('tr') === row);
        fireEvent.click(editBtn);

        // 3. Klik tombol "Tidak Hadir" di baris yang sama
        const tidakHadirBtn = screen.getAllByRole("button", { name: /Tidak Hadir/i }).find(btn => !btn.disabled && btn.closest('tr') === row);
        fireEvent.click(tidakHadirBtn);

        // 4. Klik Simpan
        const simpanBtn = screen.getByRole("button", { name: /Simpan/i });
        fireEvent.click(simpanBtn);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/presensi"),
                expect.objectContaining({
                    method: "PUT",
                    body: expect.stringContaining('"kehadiran":"Tidak Hadir"')
                })
            );
        });
    });
});