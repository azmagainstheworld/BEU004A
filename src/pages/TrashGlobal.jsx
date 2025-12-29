import React, { useState, useEffect, useCallback } from "react";
import { useKaryawan } from "../context/KaryawanContext";
import { useFinance } from "../context/FinanceContext";
import ButtonModular from "../components/ButtonModular";
import jwt_decode from "jwt-decode";
import PopupSuccess from "../components/PopupSuccess";
import $ from "jquery";
import "datatables.net-dt";
import "jquery-highlight/jquery.highlight.js";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

const API_BASE = "https://beu004a-backend-production.up.railway.app/beu004a/users";
const MODULE_CONFIG = {
  DeliveryFee: {
    fetch: `${API_BASE}/deliveryfee/trash`,
    restore: `${API_BASE}/deliveryfee/restore`,
    delete: `${API_BASE}/deliveryfee/delete-permanent`,
    idKey: "id_input_deliveryfee",
    dateKey: "tanggal",
  },
  DFOD: {
    fetch: `${API_BASE}/dfod/trash`,
    restore: `${API_BASE}/dfod/restore`,
    delete: `${API_BASE}/dfod/delete-permanent`,
    idKey: "id_input_dfod",
    dateKey: "tanggal_dfod",
  },
  Outgoing: {
    fetch: `${API_BASE}/outgoing/trash`,
    restore: `${API_BASE}/outgoing/restore`,
    delete: `${API_BASE}/outgoing/delete-permanent`,
    idKey: "id_input_outgoing",
    dateKey: "tanggal_outgoing",
  },
  Pengeluaran: {
    fetch: `${API_BASE}/pengeluaran/trash`,
    restore: `${API_BASE}/pengeluaran/restore`,
    delete: `${API_BASE}/pengeluaran/delete-permanent`,
    idKey: "id_input_pengeluaran",
    dateKey: "tanggal_pengeluaran",
  },
  Karyawan: {
    fetch: `${API_BASE}/karyawan/trash`,
    restore: `${API_BASE}/karyawan/restore`,
    delete: `${API_BASE}/karyawan/delete-permanent`,
    idKey: "id_karyawan",
    dateKey: "ttl", 
  },
  User: {
    fetch: `${API_BASE}/superadmin/trash`,
    restore: `${API_BASE}/superadmin/restore`,
    delete: `${API_BASE}/superadmin/delete-permanent`,
    idKey: "id_user_jntcargobeu004a",
    dateKey: null,
  },
};

function TrashGlobal() {
  const { fetchKaryawan } = useKaryawan();
  const { 
    fetchDfod, 
    fetchDeliveryFee, 
    fetchOutgoing, 
    fetchPengeluaran, 
    fetchTodayInputs, 
    fetchLaporanKeuangan 
  } = useFinance();
  const [userRole, setUserRole] = useState(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [trashData, setTrashData] = useState([]);
  const [filterModul, setFilterModul] = useState("Semua");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState(null); 

  const availableModules = ["Semua", ...Object.keys(MODULE_CONFIG)];

useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Token tidak valid:", err);
      }
    }
    setIsCheckingRole(false);
  }, []);

  // --- PROTEKSI HALAMAN TRASH ---
  if (!isCheckingRole && userRole !== "Super Admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2>
        <p className="text-slate-500 mt-2">Maaf, menu Trash hanya dapat diakses oleh Super Admin.</p>
        <button 
           onClick={() => window.location.href = "/dashboard"}
           className="mt-6 px-6 py-2 bg-[#006400] text-white rounded-lg shadow-md"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  if (isCheckingRole) return <div className="p-10 text-center">Memverifikasi akses...</div>;

// Gunakan dependensi kosong [] agar fungsi ini HANYA dibuat sekali
  const fetchAllTrash = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let combinedData = [];
    const promises = [];

    for (const [modulName, config] of Object.entries(MODULE_CONFIG)) {
      const promise = fetch(config.fetch, { headers })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            return data.map((item) => {
              let rawNominalValue = 0;
              let detailTambahan = "";
              let displayDate;

              if (modulName === "Outgoing") {
                rawNominalValue = item.nominal_bersih;
              } else if (modulName === "Pengeluaran") {
                rawNominalValue = item.nominal_pengeluaran;
              } else if (modulName !== "Karyawan" && modulName !== "User") {
                rawNominalValue = item.nominal;
              } 
              
              const displayNominal = Number(rawNominalValue) || 0;

              if (modulName === "Karyawan") {
                detailTambahan = item.nama_karyawan;
                displayDate = item[config.dateKey];
              } else if (modulName === "User") {
                detailTambahan = item.username || "Admin Terhapus";
                displayDate = null;
              } else {
                detailTambahan = item.keterangan || item.nama_pengeluaran || "-";
                displayDate = item[config.dateKey];
              }

              return {
                ...item,
                id_unik: item[config.idKey],
                modul_sumber: modulName,
                nominal: displayNominal,
                tanggal: displayDate,
                detail_tambahan: detailTambahan,
              };
            });
          }
          return [];
        })
        .catch((err) => {
          console.error(`Gagal fetch trash ${modulName}:`, err);
          return [];
        });
      promises.push(promise);
    }

    const results = await Promise.all(promises);
    results.forEach((data) => {
      combinedData = combinedData.concat(data);
    });

    setTrashData(combinedData);
  }, []); // <--- PASTIKAN INI KOSONG []

  useEffect(() => {
    fetchAllTrash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tableId = "#trashTable";
    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }

    const dataToDisplay = filterModul === "Semua"
      ? trashData
      : trashData.filter((item) => item.modul_sumber === filterModul);

    if (dataToDisplay.length === 0) {
      $("#trashTable tbody").html(`
        <tr>
          <td colspan="${userRole !== "Admin" ? 5 : 4}" class="p-10 italic text-slate-400 text-center">
            Data terhapus tidak ditemukan
          </td>
        </tr>
      `);
      return;
    }

    const dataFormatted = dataToDisplay.map(item => [ 
      item.modul_sumber,
      item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID") : "-",
      item.modul_sumber === "Karyawan" || item.modul_sumber === "User" ? "-" : `Rp ${Number(item.nominal).toLocaleString("id-ID")}`,
      item.detail_tambahan,
      item, 
    ]);

    const timeout = setTimeout(() => {
      const table = $(tableId).DataTable({
        destroy: true, 
        data: dataFormatted,
        columns: [
          { title: "Sumber", className: "dt-center" },
          { title: "Tanggal", className: "dt-center" },
          { title: "Nominal", className: "dt-center" },
          { title: "Detail", className: "dt-center" },
          {
            title: "Aksi",
            className: "dt-center",
            orderable: false,
            searchable: false,
            visible: userRole !== "Admin", 
            render: function (data, type) {
              if (type === 'display') {
                return `
                  <div class="flex justify-center items-center gap-3">
                  <button 
                    data-id="${data.id_unik}" 
                    data-modul="${data.modul_sumber}"
                    class="btn-restore px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm active:scale-95 flex items-center justify-center gap-2 bg-[#006400] text-white hover:bg-[#004d00] hover:shadow-md shadow-[#006400]/20"
                  >
                    Restore
                  </button>

                  <button 
                    data-id="${data.id_unik}" 
                    data-modul="${data.modul_sumber}"
                    class="btn-delete px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm active:scale-95 flex items-center justify-center gap-2 bg-rose-500 text-white hover:bg-rose-600 hover:shadow-md"
                  >
                    Hapus Permanen
                  </button>
                  </div>
                `;
              }
              return data;
            }
          },
        ].slice(0, userRole !== "Admin" ? 5 : 4),
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
          info: "Data _START_ - _END_ dari _TOTAL_",
          paginate: { next: "Next", previous: "Prev" }
        }
      });

      const findItem = (id, modul) => trashData.find(item => String(item.id_unik) === String(id) && item.modul_sumber === modul);

      $('#trashTable tbody').off('click', '.btn-restore, .btn-delete'); 
      $('#trashTable tbody').on('click', '.btn-restore', function () {
        const item = findItem($(this).data('id'), $(this).data('modul'));
        if (item) openConfirm(item, "restore");
      });
      $('#trashTable tbody').on('click', '.btn-delete', function () {
        const item = findItem($(this).data('id'), $(this).data('modul'));
        if (item) openConfirm(item, "delete");
      });

      table.on("draw.dt", function () {
        const body = $(table.table().body());
        const searchValue = table.search();
        body.unhighlight();
        if (searchValue) body.highlight(searchValue);
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [trashData, filterModul, userRole]);

  const openConfirm = (item, actionType) => {
    setConfirmData({ item, actionType });
    setConfirmOpen(true);
  };

const confirmYes = async () => {
    if (!confirmData) return;
    const { item, actionType } = confirmData;
    const config = MODULE_CONFIG[item.modul_sumber];
    const endpoint = actionType === "restore" ? config.restore : config.delete;
    const method = actionType === "restore" ? "PUT" : "DELETE";
    const body = { [config.idKey]: item.id_unik };
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        // 1. Refresh data di halaman Trash itu sendiri
        await fetchAllTrash();

        // 3. REFRESH SEMUA TABEL LOG TERKAIT JIKA AKSI ADALAH RESTORE
        if (actionType === "restore") {
          if (item.modul_sumber === "DFOD") await fetchDfod();
          if (item.modul_sumber === "DeliveryFee") await fetchDeliveryFee();
          if (item.modul_sumber === "Outgoing") await fetchOutgoing();
          if (item.modul_sumber === "Pengeluaran") await fetchPengeluaran();
          
          // refresh dashboard & laporan karena restore mengubah saldo
          await fetchTodayInputs();
          await fetchLaporanKeuangan();
        }

        // Refresh data Karyawan
        if (item.modul_sumber === "Karyawan" && actionType === "restore") {
          await fetchKaryawan();
        }

        setPopupMessage(`${item.modul_sumber} berhasil di${actionType === "restore" ? "kembalikan" : "hapus permanen"}`);
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Gagal melakukan aksi trash:", err);
    } finally {
      setConfirmOpen(false);
      setConfirmData(null);
    }
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Trash</h2>

        {/* FILTER CARD */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-sharp">delete_sweep</span>
            </div>
            <div>
              <label htmlFor="modulFilter" className="block text-sm font-semibold text-slate-600 mb-1">Filter Sumber Data</label>
              <select
                id="modulFilter"
                className="p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#006400] transition min-w-[200px] text-sm"
                value={filterModul}
                onChange={(e) => setFilterModul(e.target.value)}
              >
                {availableModules.map((modul) => (
                  <option key={modul} value={modul}>{modul}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Log Data Terhapus ({filterModul})</h3>

          <div className="overflow-x-auto">
            <table id="trashTable" className="w-full border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[12px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4 text-center">Sumber</th>
                  <th className="p-4 text-center">Tanggal</th>
                  <th className="p-4 text-center">Nominal</th>
                  <th className="p-4 text-center">Detail</th>
                  {userRole !== "Admin" && <th className="p-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPopup && <PopupSuccess message={popupMessage} onClose={() => setShowPopup(false)} />}

      {/* CONFIRMATION MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={() => setConfirmOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-50 text-center animate-scaleIn">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmData?.actionType === "restore" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
              <span className="material-symbols-sharp text-3xl">
                {confirmData?.actionType === "restore" ? "settings_backup_restore" : "warning"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Aksi</h2>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Apakah Anda yakin ingin melakukan <strong>{confirmData?.actionType === "restore" ? "Restore" : "Hapus Permanen"}</strong> data dari <strong>{confirmData?.item?.modul_sumber}</strong>?
            </p>
            <div className="flex gap-3 justify-center">
              <ButtonModular variant="warning" onClick={() => setConfirmOpen(false)} className="min-w-[100px]">Batal</ButtonModular>
              <ButtonModular 
                variant={confirmData?.actionType === "restore" ? "success" : "danger"} 
                onClick={confirmYes}
                className="min-w-[120px]"
              >
                Ya, Lanjutkan
              </ButtonModular>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #trashTable th, #trashTable td { white-space: nowrap !important; text-align: center !important; }
        #trashTable td { font-size: 0.95rem; color: #334155; }
        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_length select { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 6px 12px !important; outline: none !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current { background: #006400 !important; color: white !important; border: none !important; border-radius: 6px !important; }
      `}</style>
    </main>
  );
}

export default TrashGlobal;