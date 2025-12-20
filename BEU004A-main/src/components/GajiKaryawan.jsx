import React, { useEffect } from "react";
import $ from "jquery";                   
import "datatables.net-dt";              
import "jquery-highlight/jquery.highlight.js"; 
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

function GajiKaryawan({ gajiData, daysInMonth }) {
  useEffect(() => {
    const tableId = "#laporanGajiTable";
    if (gajiData.length === 0) {
      if ($.fn.DataTable.isDataTable(tableId)) $(tableId).DataTable().clear().destroy();
      return;
    }

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
        // l = length, f = filtering, rt = table, ip = info & pagination
        dom: '<"flex justify-between items-center mb-4 gap-4"lf>rt<"flex justify-between items-center mt-4 gap-4"ip>',
        language: {
          search: "Cari:",
          lengthMenu: "Tampilkan _MENU_ data",
          info: "Data _START_ - _END_ dari _TOTAL_",
          paginate: { next: "Next", previous: "Prev" }
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
  }, [gajiData]);

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Laporan Gaji</h2>

        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-xl font-medium mb-6 text-slate-800">Rincian Gaji Karyawan</h3>

          <div className="overflow-x-auto">
            <table id="laporanGajiTable" className="w-full table-auto border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4 text-center">No</th>
                  <th className="p-4 text-center">Nama</th>
                  <th className="p-4 text-center">Kehadiran</th>
                  <th className="p-4 text-center">Upah / Hari</th>
                  <th className="p-4 text-center">Kasbon</th>
                  <th className="p-4 text-center">Bonus</th>
                  <th className="p-4 text-center">Total Gaji</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gajiData.length > 0 ? (
                  gajiData.map((g) => (
                    <tr key={g.no} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-center text-slate-400 text-base">{g.no}</td>
                      <td className="p-4 text-center text-slate-700 text-base font-medium">{g.nama}</td>
                      <td className="p-4 text-center text-slate-600 text-base">
                        {g.hadir}/{daysInMonth}
                      </td>
                      <td className="p-4 text-center text-slate-700 text-base">
                        Rp {(g.upahPerHari ?? 0).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-center text-red-500 text-base">
                        Rp {(g.kasbon ?? 0).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-center text-emerald-600 text-base">
                        Rp {(g.bonus ?? 0).toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-center font-bold text-black text-base">
                        Rp {(g.totalGaji ?? 0).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 italic text-gray-500 text-center">
                      Belum ada data gaji
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        #laporanGajiTable th, #laporanGajiTable td {
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

export default GajiKaryawan;