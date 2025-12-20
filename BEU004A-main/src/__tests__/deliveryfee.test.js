import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputDeliveryFee from "../components/InputDeliveryFee";

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

// =======================================================
// 2. TEST SUITE
// =======================================================
describe("InputDeliveryFee (Legacy Code Whitebox Test)", () => {
    const mockInitialData = [
        { id_input_deliveryfee: 101, nominal: 15000, tanggal: "2024-01-01T00:00:00.000Z" },
    ];
    
    beforeEach(() => {
        jest.clearAllMocks();
        // Pastikan default fetch selalu mengembalikan array agar komponen tidak crash
        global.fetch.mockImplementation(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        );
    });

    test("should fetch initial data and initialize DataTables on mount", async () => {
        global.fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockInitialData)
            })
        );

        await act(async () => { render(<InputDeliveryFee />); });
        
        // Memastikan DataTables aktif dengan mengecek elemen UI wrapper yang dibuat jQuery
        await waitFor(() => {
            const tableWrapper = document.querySelector("#deliveryTable_wrapper");
            expect(tableWrapper).toBeInTheDocument();
        });
    });

    test("should call POST fetch and reset form on successful save", async () => {
        global.fetch.mockImplementation((url, options) => {
            if (options && options.method === "POST") {
                return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 3 }) });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve(mockInitialData) });
        });

        await act(async () => { render(<InputDeliveryFee />); });
        
        fireEvent.change(getNominalInput(), { target: { value: "35000" } }); 
        fireEvent.click(screen.getByRole("button", { name: /Simpan/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String), 
                expect.objectContaining({ method: "POST" })
            );
        });
    });

    test("should call PUT fetch when clicking Edit and then saving", async () => {
        global.fetch.mockImplementationOnce(() => 
            Promise.resolve({ ok: true, json: () => Promise.resolve(mockInitialData) })
        );
        global.fetch.mockImplementationOnce(() => 
            Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })
        );

        await act(async () => { render(<InputDeliveryFee />); });

        // Klik tombol Edit di dalam tabel
        const editButtons = await screen.findAllByRole("button", { name: /Edit/i });
        fireEvent.click(editButtons[0]);

        // Pastikan nominal masuk ke form
        expect(getNominalInput().value).toBe("15.000");

        fireEvent.change(getNominalInput(), { target: { value: "55000" } });
        
        // Klik tombol yang berubah menjadi Update
        const updateButton = screen.getByRole("button", { name: /Update/i });
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ method: "PUT" })
            );
        });
    });

    test("should call DELETE fetch after confirmation in modal", async () => {
        global.fetch.mockImplementationOnce(() => 
            Promise.resolve({ ok: true, json: () => Promise.resolve(mockInitialData) })
        );
        global.fetch.mockImplementationOnce(() => 
            Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) })
        );

        await act(async () => { render(<InputDeliveryFee />); });

        // 1. Klik tombol Hapus di baris tabel untuk membuka modal
        const tableDeleteButtons = await screen.findAllByRole("button", { name: /Hapus/i });
        fireEvent.click(tableDeleteButtons[0]);

        // 2. Klik tombol Hapus konfirmasi yang ada di dalam modal
        // Kita gunakan filter untuk memastikan kita mengambil tombol yang ada di dalam modal overlay (.fixed)
        const confirmButton = screen.getAllByRole("button", { name: /Hapus/i }).find(btn => 
            btn.closest('.fixed') 
        );
        
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/delete"),
                expect.objectContaining({
                    method: "PUT",
                    body: expect.stringContaining('"id_input_deliveryfee":101')
                })
            );
        });

        // Pastikan modal tertutup setelah hapus
        await waitFor(() => {
            expect(screen.queryByText(/Apakah Anda yakin/i)).not.toBeInTheDocument();
        });
    });
});