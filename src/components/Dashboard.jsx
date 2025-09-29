import React from "react";
import { useFinance } from "../context/FinanceContext";

function Dashboard() {
  const { allInputs, insights } = useFinance();

  const getCardClasses = (title) => {
    switch (title.toLowerCase()) {
      case "kas":
        return "bg-yellow-glass animate-glass-yellow border-yellow-glow hover:shadow-yellow-glow";
      case "saldo jfs":
        return "bg-green-glass animate-glass-green border-green-glow hover:shadow-green-glow";
      case "transfer":
        return "bg-pink-glass animate-glass-pink border-pink-glow hover:shadow-pink-glow";
      default:
        return "bg-white";
    }
  };

  const getTextGlow = (title) => {
    switch (title.toLowerCase()) {
      case "kas":
        return "animate-text-yellow";
      case "saldo jfs":
        return "animate-text-green";
      case "transfer":
        return "animate-text-pink";
      default:
        return "";
    }
  };

  return (
    <main className="flex-1 bg-[#EDFFEC] p-6 min-h-screen ">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Insights cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl p-6 shadow transform transition duration-300 ${getCardClasses(item.title)} sm:hover:scale-105`}
          >
            {/* Refleksi light overlay */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-white/20 via-white/10 to-transparent animate-reflection"></div>

            <div className="relative flex justify-between items-center mb-4">
              <h3 className="text-gray-700 font-semibold">{item.title}</h3>
              <span className="material-symbols-sharp text-black rounded-full p-2 glow-icon">
                monetization_on
              </span>
            </div>
            <h1 className={`text-3xl font-bold text-gray-800 glow-text ${getTextGlow(item.title)}`}>
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
                  <th className="p-2 min-w-[100px]">Tanggal</th>
                  <th className="p-2 min-w-[140px]">Nominal</th>
                  <th className="p-2 min-w-[140px]">Jenis Pembayaran</th>
                  <th className="p-2 min-w-[140px]">Jenis Input</th>
                  <th className="p-2 min-w-[140px]">Nama Karyawan</th>
                  <th className="p-2 min-w-[180px]">Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {allInputs.map((item, index) => (
                  <tr key={item.id || index} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.tanggal}</td>
                    <td className="p-2">Rp {item.nominal.toLocaleString("id-ID")}</td>
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

      {/* CSS Ultra Premium Terintegrasi */}
      <style>{`
        /* Glassy Pastel Backgrounds */
        .bg-yellow-glass { background: linear-gradient(135deg, #FFE680, #FFF4B2); backdrop-filter: blur(10px); border-radius: 1rem; }
        .bg-green-glass { background: linear-gradient(135deg, #90EE90, #C6F6C6); backdrop-filter: blur(10px); border-radius: 1rem; }
        .bg-pink-glass { background: linear-gradient(135deg, #FFC0CB, #FFD6E0); backdrop-filter: blur(10px); border-radius: 1rem; }

        /* Gradient Glow & Reflection Animations */
        @keyframes gradient-yellow {0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes gradient-green {0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes gradient-pink {0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

        .animate-glass-yellow { background-size: 200% 200%; animation: gradient-yellow 6s ease infinite; }
        .animate-glass-green { background-size: 200% 200%; animation: gradient-green 6s ease infinite; }
        .animate-glass-pink { background-size: 200% 200%; animation: gradient-pink 6s ease infinite; }

        /* Refleksi light overlay */
        @keyframes reflection {0%{background-position: -150% 0}100%{background-position: 150% 0}}
        .animate-reflection { background-size: 200% 200%; animation: reflection 6s linear infinite; }

        /* Text Glow */
        @keyframes text-glow-yellow {0%,100%{text-shadow:0 0 4px rgba(255,223,0,0.4);}50%{text-shadow:0 0 14px rgba(255,223,0,0.7);}}
        @keyframes text-glow-green {0%,100%{text-shadow:0 0 4px rgba(144,238,144,0.4);}50%{text-shadow:0 0 14px rgba(144,238,144,0.7);}}
        @keyframes text-glow-pink {0%,100%{text-shadow:0 0 4px rgba(255,182,193,0.4);}50%{text-shadow:0 0 14px rgba(255,182,193,0.7);}}

        .animate-text-yellow { animation: text-glow-yellow 4s ease-in-out infinite; }
        .animate-text-green { animation: text-glow-green 4s ease-in-out infinite; }
        .animate-text-pink { animation: text-glow-pink 4s ease-in-out infinite; }

        /* Border Glow */
        @keyframes border-glow-yellow {0%,100%{border:2px solid rgba(255,223,0,0.3);}50%{border:2px solid rgba(255,223,0,0.6);}}
        @keyframes border-glow-green {0%,100%{border:2px solid rgba(144,238,144,0.3);}50%{border:2px solid rgba(144,238,144,0.6);}}
       @keyframes border-glow-pink {0%,100%{border:2px solid rgba(255,182,193,0.3);}50%{border:2px solid rgba(255,182,193,0.6);}}

        .border-yellow-glow { animation: border-glow-yellow 4s ease-in-out infinite; }
        .border-green-glow { animation: border-glow-green 4s ease-in-out infinite; }
        .border-pink-glow { animation: border-glow-pink 4s ease-in-out infinite; }

        /* Hover Shadow Glow */
        .hover\\:shadow-yellow-glow:hover { box-shadow: 0 0 40px rgba(255,223,0,0.5); }
        .hover\\:shadow-green-glow:hover { box-shadow: 0 0 40px rgba(144,238,144,0.5); }
        .hover\\:shadow-pink-glow:hover { box-shadow: 0 0 40px rgba(255,182,193,0.5); }
        
        /* Icon Glow */
        .glow-icon { box-shadow: 0 0 12px rgba(0,0,0,0.6); }

        /* Scrollbar */
        div.overflow-x-auto::-webkit-scrollbar { height: 8px; }
        div.overflow-x-auto::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
        div.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #c0c0c0; border-radius: 4px; border: 2px solid #f0f0f0; }
        div.overflow-x-auto::-webkit-scrollbar-thumb:hover { background-color: #a0a0a0; }

        /* Responsive adjustments */
        @media (max-width: 640px){
          .animate-glass-yellow, .animate-glass-green, .animate-glass-blue { animation-duration: 10s; }
          .animate-reflection { animation-duration: 12s; }
          .glow-icon { box-shadow: 0 0 8px rgba(0,0,0,0.4); }
        }
      `}</style>
    </main>
  );
}

export default Dashboard;
