import React from "react";
import { useFinance } from "../context/FinanceContext";

function Dashboard() {
  const { allInputs, insights } = useFinance();

  return (
    <main className="flex-1 bg-[#EDFFEC] p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Insights cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl p-6 shadow-md border border-gray-200 bg-white transform transition duration-200 hover:scale-[1.01]"
          >
            <div className="relative flex justify-between items-center mb-4">
              <h3 className="text-gray-800 font-semibold">{item.title}</h3>
              <span className="material-symbols-sharp text-4xl text-[#009C4C] rounded-full">
                monetization_on
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Rp {item.value.toLocaleString("id-ID")}
            </h1>
          </div>
        ))}
      </div>

      {/* Recent Input */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
        <h3 className="text-xl font-bold mb-4">Recent Input</h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-[800px]">
            <table className="w-full table-auto border-collapse text-center">
              <thead>
                <tr className="bg-[#E1F1DD] text-black">
                  <th className="p-2 min-w-[40px]">No</th>
                  <th className="p-2 min-w-[120px]">Tanggal</th>
                  <th className="p-2 min-w-[180px]">Nominal</th>
                  <th className="p-2 min-w-[190px]">Jenis Pembayaran</th>
                  <th className="p-2 min-w-[190px]">Jenis Input</th>
                  <th className="p-2 min-w-[180px]">Nama Karyawan</th>
                  <th className="p-2 min-w-[180px]">Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {allInputs.map((item, index) => (
                  <tr key={item.id || index} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.tanggal}</td>
                    <td className="p-2">
                      Rp {item.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="p-2">{item.jenisPembayaran || "-"}</td>
                    <td className="p-2">{item.jenis}</td>
                    <td className="p-2">{item.namaKaryawan || "-"}</td>
                    <td className="p-2">{item.deskripsi || "-"}</td>
                  </tr>
                ))}
                {allInputs.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-4 italic text-gray-500">
                      Belum ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        /* Scrollbar */
        div.overflow-x-auto::-webkit-scrollbar { height: 8px; }
        div.overflow-x-auto::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
        div.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #c0c0c0; border-radius: 4px; border: 2px solid #f0f0f0; }
        div.overflow-x-auto::-webkit-scrollbar-thumb:hover { background-color: #a0a0a0; }
      `}</style>
    </main>
  );
}

export default Dashboard;
