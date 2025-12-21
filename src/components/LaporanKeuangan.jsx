import React, { useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import $ from "jquery";                  
import "datatables.net-dt";            
import "jquery-highlight/jquery.highlight.js"; 
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

function LaporanKeuangan() {
  const { laporanKeuangan = [] } = useFinance(); // pakai laporanKeuangan dari context

  // Hitung total
  const totalKas = laporanKeuangan.reduce((acc, item) => acc + (item.kas || 0), 0);
  const totalJfs = laporanKeuangan.reduce((acc, item) => acc + (item.jfs || 0), 0);
  const totalTransfer = laporanKeuangan.reduce((acc, item) => acc + (item.transfer || 0), 0);

  // INIT DATATABLES 
  useEffect(() => {
    const tableId = "#laporanTable";
    if (laporanKeuangan.length === 0) return;

    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    const timeout = setTimeout(() => {
      const table = $(tableId).DataTable({
        paging: true,
        searching: true,
        info: true,
        ordering: true,
        scrollX: true,
        autoWidth: false,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Semua"]],
        // l = length, f = filtering, r = processing, t = table, i = info, p = pagination
        dom: '<"flex justify-between items-center mb-4 gap-4"lf>rt<"flex justify-between items-center mt-4 gap-4"ip>',
        language: {
          search: "Cari:",
          lengthMenu: "Tampilkan _MENU_ data",
          info: "Data _START_ - _END_ dari _TOTAL_",
          paginate: { next: "Next", previous: "Prev" },
          emptyTable: "<span class='italic text-slate-400'>Data tidak ditemukan</span>",
          zeroRecords: "<span class='italic text-slate-400'>Data tidak ditemukan</span>"
        },
        columnDefs: [{ targets: "_all", className: "dt-center" }],
      });

      table.on("draw.dt", function () {
        const body = $(table.table().body());
        const searchValue = table.search();
        body.unhighlight();
        if (searchValue) body.highlight(searchValue);
      });
    }, 150);

    return () => {
      clearTimeout(timeout);
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
    };
  }, [laporanKeuangan]);

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Laporan Keuangan</h2>

        {/* TABLE SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Rincian Laporan</h3>

          <div className="overflow-x-auto">
            <table id="laporanTable" className="w-full table-auto border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4 text-center">Tanggal</th>
                  <th className="p-4 text-center">Kas</th>
                  <th className="p-4 text-center">Saldo JFS</th>
                  <th className="p-4 text-center">Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {laporanKeuangan.length > 0 ? (
                  laporanKeuangan.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-center text-slate-700 text-base">{row.tanggal}</td>
                      <td className="p-4 text-center font-medium text-black text-base">
                        Rp {row.kas.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-center font-medium text-black text-base">
                        Rp {row.jfs.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-center font-medium text-black text-base">
                        Rp {row.transfer.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 italic text-gray-500 text-center">
                      Data Tidak Ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
              {laporanKeuangan.length > 0 && (
                <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                  <tr>
                    <td className="p-4 text-center text-slate-800">TOTAL</td>
                    <td className="p-4 text-center text-slate-800">Rp {totalKas.toLocaleString("id-ID")}</td>
                    <td className="p-4 text-center text-slate-800">Rp {totalJfs.toLocaleString("id-ID")}</td>
                    <td className="p-4 text-center text-slate-800">Rp {totalTransfer.toLocaleString("id-ID")}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      <style>{`
        #laporanTable th, #laporanTable td {
          white-space: nowrap !important;
          text-align: center !important;
        }

        .dataTables_wrapper .dataTables_filter input,
        .dataTables_wrapper .dataTables_length select {
          border: 1px solid #e2e8f0 !important;
          border-radius: 6px !important;
          padding: 5px 10px !important;
          outline: none !important;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button.current {
          background: #006400 !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
        }
      `}</style>
    </main>
  );
}

export default LaporanKeuangan;