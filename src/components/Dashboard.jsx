import React, { useEffect, useState } from "react";
import { useFinance } from "../context/FinanceContext";
import $ from "jquery";
import "datatables.net-dt";
import "jquery-highlight/jquery.highlight.js";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

function Dashboard() {
  const { allInputs, insights, fetchTodayInputs, fetchLaporanKeuangan } = useFinance();
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch data saat pertama kali mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await fetchTodayInputs();
        await fetchLaporanKeuangan();
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []); // Array kosong agar hanya jalan sekali

  // 2. Inisialisasi DataTable (Gunakan dependency array yang konstan)
  useEffect(() => {
    // Jangan inisialisasi jika data masih loading atau kosong
    if (isLoading || !allInputs || allInputs.length === 0) return;

    const tableId = "#dashboardTable";

    // Bersihkan instance lama jika ada
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
        dom: '<"flex justify-between items-center mb-4 gap-4"lf>rt<"flex justify-between items-center mt-4 gap-4"ip>',
        language: {
          search: "Cari:",
          lengthMenu: "Tampilkan _MENU_ data",
          info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
          paginate: { next: "Next", previous: "Prev" },
          emptyTable: "<span class='italic text-slate-400'>Data tidak ditemukan</span>",
          zeroRecords: "<span class='italic text-slate-400'>Data tidak ditemukan</span>"
        }
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
  }, [allInputs, isLoading]); 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-lg font-medium animate-pulse text-slate-400 italic">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Dashboard</h2>

        {/* INSIGHTS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {insights.map((item, i) => (
            <div key={i} className="rounded-xl p-6 shadow-md border bg-white border-l-4" style={{ borderLeftColor: '#006400' }}>
              <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest">{item.title}</h3>
              <h1 className="text-2xl font-black mt-2 text-slate-800">
                Rp {item.value.toLocaleString("id-ID")}
              </h1>
            </div>
          ))}
        </div>

        {/* RECENT INPUT TABLE */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Recent Input</h3>

          <div className="overflow-x-auto">
            <table id="dashboardTable" className="w-full text-sm text-center border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4">No</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Nominal</th>
                  <th className="p-4">Pembayaran</th>
                  <th className="p-4">Jenis</th>
                  <th className="p-4">Pengeluaran</th>
                  <th className="p-4">Karyawan</th>
                  <th className="p-4">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allInputs.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-400 text-base">{idx + 1}</td>
                    <td className="p-4 text-slate-700 text-base">{item.tanggal}</td>
                    <td className="p-4 font-bold text-slate-900 text-base">Rp {item.nominal.toLocaleString("id-ID")}</td>
                    <td className="p-4 text-slate-600 text-base">{item.jenisPembayaran || "-"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        item.jenis === 'Pengeluaran' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {item.jenis}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{item.jenis === "Pengeluaran" ? item.jenisPengeluaran : "-"}</td>
                    <td className="p-4 text-slate-600">{item.namaKaryawan || "-"}</td>
                    <td className="p-4 text-slate-500 italic text-xs">{item.deskripsi || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        #dashboardTable th, #dashboardTable td {
          white-space: nowrap !important;
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

export default Dashboard;