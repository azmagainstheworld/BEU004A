import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputOutgoing from "../components/InputOutgoing";

// =======================================================
// 1. MOCKING GLOBAL
// =======================================================
global.fetch = jest.fn();

const localStorageMock = (() => {
    let store = { token: "fake-jwt-token" }; 
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock });

jest.mock("jwt-decode", () => jest.fn(() => ({ role: "Non-Admin" })));

const getNominalInput = () => screen.getByPlaceholderText(/Masukkan nominal/i);
const getPotonganInput = () => screen.getByPlaceholderText(/Masukkan potongan/i);

// =======================================================
// 2. TEST SUITE
// =======================================================
describe("InputOutgoing (Whitebox Test)", () => {
    const mockInitialData = [
        { 
            id_input_outgoing: 301, 
            nominal: 100000, 
            potongan_outgoing: 10000, 
            tanggal_outgoing: new Date().toISOString(), 
            jenis_pembayaran: "cash" 
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Default fetch return data awal
        global.fetch.mockImplementation(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockInitialData)
            })
        );
    });

    // --- Path 1: Render Awal ---
    test("should fetch initial data and initialize DataTable", async () => {
        await act(async () => { render(<InputOutgoing />); });

        // Verifikasi data muncul di tabel (Rp 100.000)
        await waitFor(() => {
            expect(screen.getByText(/Rp 100\.000/i)).toBeInTheDocument();
        });

        // Cek apakah DataTable wrapper muncul
        expect(document.querySelector("#outgoingTable_wrapper")).toBeInTheDocument();
    });

    // --- Path 2: Validasi Live ---
    test("should show validation error for nominal < 1000 and potongan > nominal", async () => {
        await act(async () => { render(<InputOutgoing />); });

        // Test Nominal < 1000
        fireEvent.change(getNominalInput(), { target: { value: "500" } });
        expect(screen.getByText(/Nominal minimal Rp 1\.000/i)).toBeInTheDocument();

        // Test Potongan > Nominal
        fireEvent.change(getNominalInput(), { target: { value: "10000" } });
        fireEvent.change(getPotonganInput(), { target: { value: "15000" } });
        expect(screen.getByText(/Potongan tidak boleh lebih besar dari nominal/i)).toBeInTheDocument();
    });

    // --- Path 3: Simulasikan Tambah Data (POST) ---
    test("should call POST fetch on successful save", async () => {
        global.fetch.mockImplementation((url, options) => {
            if (options?.method === "POST") {
                return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve(mockInitialData) });
        });

        await act(async () => { render(<InputOutgoing />); });

        fireEvent.change(getNominalInput(), { target: { value: "50000" } });
        fireEvent.change(getPotonganInput(), { target: { value: "5000" } });
        
        const selects = screen.getAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "transfer" } });

        fireEvent.click(screen.getByRole("button", { name: /Simpan/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/insert"),
                expect.objectContaining({
                    method: "POST",
                    body: expect.stringContaining('"nominal":50000')
                })
            );
        });
    });

    // --- Path 4: Simulasikan Edit (Klik tombol di DataTable) ---
    test("should fill form when Edit button is clicked", async () => {
        await act(async () => { render(<InputOutgoing />); });

        // Tunggu tombol edit muncul (dibuat oleh jQuery dtRows)
        await waitFor(() => {
            const editBtn = document.querySelector(".btn-edit-outgoing");
            expect(editBtn).not.toBeNull();
            fireEvent.click(editBtn);
        });

        // Verifikasi form terisi data mock (Rp 100.000 menjadi format 100.000)
        expect(getNominalInput().value).toBe("100.000");
        expect(getPotonganInput().value).toBe("10.000");
        expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
    });

    // --- Path 5: Hapus Data (PUT /delete) ---
    test("should call delete fetch after confirmation", async () => {
        await act(async () => { render(<InputOutgoing />); });

        // Klik Hapus di tabel
        await waitFor(() => {
            const deleteBtn = document.querySelector(".btn-delete-outgoing");
            fireEvent.click(deleteBtn);
        });

        // Klik Hapus di Modal Konfirmasi
        const confirmBtn = screen.getAllByRole("button", { name: /Hapus/i }).find(btn => 
            btn.closest('.fixed')
        );
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/delete"),
                expect.objectContaining({
                    method: "PUT",
                    body: expect.stringContaining('"id_input_outgoing":301')
                })
            );
        });
    });
});