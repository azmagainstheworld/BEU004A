import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ButtonModular from "../components/ButtonModular";

describe("ButtonModular (UI Atom Test)", () => {
    
    test("harus me-render teks children dengan benar", () => {
        render(<ButtonModular>Klik Saya</ButtonModular>);
        expect(screen.getByText("Klik Saya")).toBeInTheDocument();
    });

    test("harus memanggil fungsi onClick saat tombol diklik", () => {
        const mockOnClick = jest.fn();
        render(<ButtonModular onClick={mockOnClick}>Simpan</ButtonModular>);
        
        const button = screen.getByRole("button", { name: /Simpan/i });
        fireEvent.click(button);
        
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test("harus menerapkan class warna success (#006400) saat variant success digunakan", () => {
        const { container } = render(
            <ButtonModular variant="success">Berhasil</ButtonModular>
        );
        
        const button = container.firstChild;
        // Memverifikasi keberadaan class HEX warna success sesuai kode
        expect(button).toHaveClass("bg-[#006400]");
        expect(button).toHaveClass("text-white");
    });

    test("harus menerapkan class danger saat variant danger digunakan", () => {
        const { container } = render(
            <ButtonModular variant="danger">Hapus</ButtonModular>
        );
        
        const button = container.firstChild;
        expect(button).toHaveClass("bg-rose-500");
    });

    test("harus dalam keadaan disabled dan tidak memanggil onClick saat props disabled aktif", () => {
        const mockOnClick = jest.fn();
        render(
            <ButtonModular onClick={mockOnClick} disabled={true}>
                Kirim
            </ButtonModular>
        );
        
        const button = screen.getByRole("button", { name: /Kirim/i });
        
        // Memverifikasi status disabled
        expect(button).toBeDisabled();
        expect(button).toHaveClass("cursor-not-allowed");
        
        fireEvent.click(button);
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    test("harus bisa menerima class tambahan melalui props className", () => {
        const customClass = "mt-10 mx-auto";
        const { container } = render(
            <ButtonModular className={customClass}>Custom</ButtonModular>
        );
        
        const button = container.firstChild;
        expect(button).toHaveClass("mt-10");
        expect(button).toHaveClass("mx-auto");
    });

    test("harus memiliki type button secara default", () => {
        render(<ButtonModular>Default Type</ButtonModular>);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("type", "button");
    });
});