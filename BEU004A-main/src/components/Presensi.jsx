import React, { useState, useEffect } from "react";
import ButtonModular from "../components/ButtonModular";
import PopupSuccess from "../components/PopupSuccess";
import $ from "jquery";                
import "datatables.net-dt";            
import "jquery-highlight/jquery.highlight.js"; 
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

export default function Presensi() {
  const [presensiList, setPresensiList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [backupRow, setBackupRow] = useState(null);
  const [summary, setSummary] = useState({ total: 0, hadir: 0, tidak: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // === TANGGAL WITA (Asia/Makassar) ===
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Makassar",
  });

  // === PARSING TANGGAL KE WITA ===
  const getLocalDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-CA", {
      timeZone: "Asia/Makassar",
    });
  };

  const fetchKaryawan = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/karyawan", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  };

  const fetchPresensiToday = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/presensi", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.filter((p) => getLocalDate(p.tanggal_presensi) === today);
  };

  // INIT DATATABLES 
  useEffect(() => {
    const tableId = "#presensiTable";
    if (presensiList.length === 0) {
        if ($.fn.DataTable.isDataTable(tableId)) $(tableId).DataTable().clear().destroy();
        return;
    }

    if ($.fn.DataTable.isDataTable(tableId)) $(tableId).DataTable().destroy();

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
          info: "Data _START_ - _END_ dari _TOTAL_",
          paginate: { next: "Next", previous: "Prev" }
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
        if ($.fn.DataTable.isDataTable(tableId)) $(tableId).DataTable().destroy();
    };
  }, [presensiList]);

  const loadData = async () => {
    const karyawan = await fetchKaryawan();
    const presensiToday = await fetchPresensiToday();

    const merged = karyawan.map((k) => {
      const p = presensiToday.find((x) => x.id_karyawan === k.id_karyawan);
      if (p) {
        return {
          id: k.id_karyawan,
          nama: k.nama_karyawan,
          tanggal: today,
          waktu: p.waktu_presensi,
          status: p.kehadiran,
          locked: true,
          autoSaved: true,
          aksiActive: true,
          id_presensi: p.id_presensi,
          backupStatus: p.kehadiran,
          backupWaktu: p.waktu_presensi,
        };
      }
      return {
        id: k.id_karyawan,
        nama: k.nama_karyawan,
        tanggal: today,
        waktu: "-",
        status: "-",
        locked: false,
        autoSaved: false,
        aksiActive: false,
        id_presensi: null,
        backupStatus: "-",
        backupWaktu: "-",
      };
    });

    setPresensiList(merged);
    updateSummary(merged);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateSummary = (list) => {
    setSummary({
      total: list.length,
      hadir: list.filter((p) => p.status === "Hadir").length,
      tidak: list.filter((p) => p.status === "Tidak Hadir").length,
    });
  };

  const saveNewPresensi = async (id, status) => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/presensi", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id_karyawan: id, kehadiran: status }),
    });
    return await res.json();
  };

  const updatePresensi = async (id_presensi, status) => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/presensi", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id_presensi, kehadiran: status }),
    });
    return await res.json();
  };

  const handleStatus = async (id, status) => {
    const row = presensiList.find((p) => p.id === id);
    if (!row.id_presensi) {
      await saveNewPresensi(id, status);
      await loadData();
      setPopupMessage("Kehadiran berhasil ditambahkan");
      setShowPopup(true);
    } else if (editingId === id) {
      setPresensiList((prev) =>
        prev.map((p) =>
          p.id === id
            ? { 
                ...p, 
                status, 
                waktu: new Date().toLocaleTimeString("en-GB", { 
                  hour12: false, 
                  timeZone: "Asia/Makassar" 
                }) 
              }
            : p
        )
      );
    }
  };

  const handleEdit = (id) => {
    const row = presensiList.find((p) => p.id === id);
    setBackupRow({ ...row });
    setPresensiList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, locked: false } : p))
    );
    setEditingId(id);
  };

  const handleSave = async (id) => {
    const row = presensiList.find((p) => p.id === id);
    if (row.id_presensi) {
      await updatePresensi(row.id_presensi, row.status);
      setPopupMessage("Kehadiran berhasil diedit");
    } else {
      await saveNewPresensi(row.id, row.status);
      setPopupMessage("Kehadiran berhasil ditambahkan");
    }
    setShowPopup(true);
    setEditingId(null);
    setBackupRow(null);
    await loadData();
  };

  const handleCancel = (id) => {
    if (backupRow) {
      setPresensiList((prev) =>
        prev.map((p) => (p.id === id ? { ...backupRow, locked: true } : p))
      );
    }
    setEditingId(null);
    setBackupRow(null);
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Presensi Karyawan</h2>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl p-6 shadow-md border bg-white border-l-4 border-l-blue-500">
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Karyawan</h3>
            <h1 className="text-3xl font-black text-slate-800 mt-2">{summary.total}</h1>
          </div>
          <div className="rounded-xl p-6 shadow-md border bg-white border-l-4 border-l-[#006400]">
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest">Hadir</h3>
            <h1 className="text-3xl font-black text-[#006400] mt-2">{summary.hadir}</h1>
          </div>
          <div className="rounded-xl p-6 shadow-md border bg-white border-l-4 border-l-rose-500">
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest">Tidak Hadir</h3>
            <h1 className="text-3xl font-black text-rose-600 mt-2">{summary.tidak}</h1>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Log Presensi</h3>

          <div className="overflow-x-auto">
            <table id="presensiTable" className="w-full border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] text-center font-bold tracking-widest border-b border-slate-200">
                  <th className="p-6 text-center">No</th>
                  <th className="p-6 text-center">Nama Karyawan</th>
                  <th className="p-6 text-center">Tanggal</th>
                  <th className="p-6 text-center">Waktu</th>
                  <th className="p-5 text-center">Input Kehadiran</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {presensiList.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center text-slate-400 text-base">{idx + 1}</td>
                    <td className="p-4 text-slate-700 text-base font-medium">{p.nama}</td>
                    <td className="p-4 text-center text-slate-600 text-base">{p.tanggal}</td>
                    <td className="p-4 text-center text-slate-600 text-base">{p.waktu}</td>
                    
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <ButtonModular
                          variant="success"
                          disabled={p.locked && editingId !== p.id}
                          onClick={() => handleStatus(p.id, "Hadir")}
                          className="px-5 py-2.5 text-lg"
                        >
                          Hadir
                        </ButtonModular>
                        <ButtonModular
                          variant="danger"
                          disabled={p.locked && editingId !== p.id}
                          onClick={() => handleStatus(p.id, "Tidak Hadir")}
                          className="px-5 py-2.5 text-lg"
                        >
                          Tidak hadir
                        </ButtonModular>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      {p.status !== "-" && (
                        <span className={`px-5 py-2.5 text-lg rounded text-[10px] font-bold uppercase ${
                          p.status === 'Hadir' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {p.status}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        {(!editingId || editingId !== p.id) ? (
                          <ButtonModular
                            variant="warning"
                            onClick={() => handleEdit(p.id)}
                            disabled={!p.aksiActive}
                            className="px-5 py-2.5 text-lg"
                          >
                            Edit
                          </ButtonModular>
                        ) : (
                          <>
                            <ButtonModular variant="success" onClick={() => handleSave(p.id)} className="px-5 py-2.5 text-lg">Simpan</ButtonModular>
                            <ButtonModular variant="danger" onClick={() => handleCancel(p.id)} className="px-5 py-2.5 text-lg">Batal</ButtonModular>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPopup && <PopupSuccess message={popupMessage} onClose={() => setShowPopup(false)} />}

      <style>{`
        #presensiTable th, #presensiTable td { white-space: nowrap !important; text-align: center !important; }
        #presensiTable th { text-align: center !important; }
        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_length select { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 6px 12px !important; outline: none !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current { background: #006400 !important; color: white !important; border: none !important; border-radius: 6px !important; }
      `}</style>
    </main>
  );
}