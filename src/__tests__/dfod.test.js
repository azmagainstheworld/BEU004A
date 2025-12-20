import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputDfod from "../components/InputDfod";
import { useFinance } from "../context/FinanceContext"; 

global.fetch = jest.fn();
jest.mock("jwt-decode", () => jest.fn(() => ({ role: "Non-Admin" })));

jest.mock("../context/FinanceContext", () => ({
  useFinance: jest.fn()
}));

const getNominalInput = () => screen.getByPlaceholderText(/Masukkan nominal DFOD/i);

describe("InputDfod (Whitebox Test)", () => {
    const mockFinanceValues = {
        addDfod: jest.fn().mockResolvedValue({}),
        updateDfodById: jest.fn().mockResolvedValue({}),
        fetchTodayInputs: jest.fn(),
        fetchLaporanKeuangan: jest.fn(),
    };

    const mockInitialData = [
        { 
          id_input_dfod: 1, 
          nominal: 5000, 
          tanggal_dfod: new Date().toISOString(), 
          jenis_pembayaran: "cash" 
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        useFinance.mockReturnValue(mockFinanceValues);
        
        // PASTIKAN default fetch mengembalikan data agar tidak terjebak di state null
        global.fetch.mockImplementation(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockInitialData)
            })
        );
    });

    test("should fetch initial DFOD data and initialize DataTable", async () => {
        render(<InputDfod />);

        // 1. Tunggu sampai data masuk ke DOM (teks nominal dari data mock kita)
        await waitFor(() => {
            expect(screen.queryByText(/Rp 5\.000/i)).toBeInTheDocument();
        }, { timeout: 3000 });

        // 2. Sekarang cek apakah DataTable wrapper sudah dibuat oleh jQuery
        await waitFor(() => {
            const wrapper = document.querySelector("#dfodTable_wrapper");
            expect(wrapper).toBeInTheDocument();
        });
    });

    test("should call addDfod via context when adding new DFOD", async () => {
        render(<InputDfod />);

        fireEvent.change(getNominalInput(), { target: { value: "25000" } });
        
        const selects = screen.getAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "transfer" } });
        
        fireEvent.click(screen.getByRole("button", { name: /Simpan/i }));

        await waitFor(() => {
            expect(mockFinanceValues.addDfod).toHaveBeenCalled();
        });
    });

    test("should enter edit mode when clicking edit button", async () => {
        render(<InputDfod />);

        // 1. Tunggu data muncul di tabel
        await waitFor(() => {
            expect(screen.queryByText(/Rp 5\.000/i)).toBeInTheDocument();
        }, { timeout: 3000 });

        // 2. Cari tombol edit melalui class CSS (karena di-render via string HTML jQuery)
        await waitFor(() => {
            const editBtn = document.querySelector(".btn-edit-dfod");
            expect(editBtn).not.toBeNull();
            fireEvent.click(editBtn);
        });

        // 3. Cek apakah form terisi
        await waitFor(() => {
            expect(getNominalInput().value).toBe("5.000");
        });
    });
});