import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PopupSuccess from "../components/PopupSuccess";

// Mocking ButtonModular jika komponen tersebut memiliki logika internal yang kompleks
// Namun jika ButtonModular hanya tombol biasa, tidak perlu di-mock agar testing lebih akurat
jest.mock("../components/ButtonModular", () => {
    return ({ children, onClick, className }) => (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
});

describe("PopupSuccess (UI Component Test)", () => {
    const mockMessage = "Data berhasil disimpan!";
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render success message and title correctly", () => {
        render(<PopupSuccess message={mockMessage} onClose={mockOnClose} />);
        
        // Memastikan judul "Berhasil!" muncul
        expect(screen.getByText(/Berhasil!/i)).toBeInTheDocument();
        
        // Memastikan pesan dinamis muncul
        expect(screen.getByText(mockMessage)).toBeInTheDocument();
    });

    test("should call onClose when 'Selesai' button is clicked", () => {
        render(<PopupSuccess message={mockMessage} onClose={mockOnClose} />);
        
        // Mencari tombol 'Selesai' yang merujuk pada ButtonModular
        const confirmButton = screen.getByRole("button", { name: /Selesai/i });
        fireEvent.click(confirmButton);
        
        // Memastikan callback onClose terpanggil
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("should call onClose when clicking the backdrop overlay", () => {
        render(<PopupSuccess message={mockMessage} onClose={mockOnClose} />);
        
        // Mengambil elemen backdrop (div hitam terawang)
        // Div pertama adalah backdrop dengan class bg-black/60
        const backdrop = document.querySelector(".bg-black\\/60");
        
        fireEvent.click(backdrop);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("should have correct animation classes for entrance", () => {
        render(<PopupSuccess message={mockMessage} onClose={mockOnClose} />);
        
        const modalContent = screen.getByText(/Berhasil!/i).closest('.animate-scaleIn');
        const backdrop = document.querySelector(".animate-fadeIn");

        // Memverifikasi class animasi sesuai kode komponen
        expect(modalContent).toBeInTheDocument();
        expect(backdrop).toBeInTheDocument();
    });
});