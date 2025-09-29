import React from "react";
import { useFinance } from "../context/FinanceContext";

function LaporanKeuangan() {
  const { laporan = [] } = useFinance();


  const totalKas = laporan.reduce((acc, item) => acc + (item.kas || 0), 0);
  const totalJfs = laporan.reduce((acc, item) => acc + (item.jfs || 0), 0);
  const totalTransfer = laporan.reduce((acc, item) => acc + (item.transfer || 0), 0);


  return (
    <main className="flex-1 bg-[#EDFFEC] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Laporan Keuangan</h2>

      <div className="bg-white p-5 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr className="bg-[#E1F1DD] text-black">
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Kas</th>
              <th className="p-2 border">Saldo JFS</th>
              <th className="p-2 border">Transfer</th>
            </tr>
          </thead>
          <tbody>
            {laporan.length > 0 ? (
              laporan.map((row, index) => (
                <tr key={row.id || index} className="border-b">
                  <td className="p-2 border">{row.tanggal}</td>
                  <td className="p-2 border">
                    Rp {row.kas.toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 border">
                    Rp {row.jfs.toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 border">
                    Rp {row.transfer.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 italic text-gray-500">
                  Data Tidak Ditemukan
                </td>
              </tr>
            )}
          </tbody>
          {laporan.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="p-2 border">Total</td>
                <td className="p-2 border">
                  Rp {totalKas.toLocaleString("id-ID")}
                </td>
                <td className="p-2 border">
                  Rp {totalJfs.toLocaleString("id-ID")}
                </td>
                <td className="p-2 border">
                  Rp {totalTransfer.toLocaleString("id-ID")}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </main>
  );
}

export default LaporanKeuangan;
