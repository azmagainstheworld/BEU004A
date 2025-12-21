import React, { useState, useEffect } from "react";
import ButtonModular from "./ButtonModular";
import PopupSuccess from "./PopupSuccess";
import $ from "jquery";
import "datatables.net-dt";
import "jquery-highlight/jquery.highlight.js";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

const formatRupiah = (value) => {
  if (value === null || value === undefined || value === "") return "Rp 0";
  const number = Number(String(value).replace(/\D/g, "")) || 0;
  return "Rp " + number.toLocaleString("id-ID");
};

const formatInputRibuan = (value) => {
  if (value === null || value === undefined) return "";
  const onlyNumbers = String(value).replace(/\D/g, "");
  return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseNumber = (value) => (value ? value.replace(/\./g, "") : "");

const ManajemenGaji = ({
  karyawanList,
  manajemenGaji,
  tempData,
  editingRow,
  errors,
  onChange,
  onEdit,
  onSave,
  onCancel
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [localInput, setLocalInput] = useState({});

  useEffect(() => {
    const newLocal = {};
    manajemenGaji.forEach(({ id_karyawan }) => {
      if (editingRow[id_karyawan]) {
        newLocal[id_karyawan] = {
          upah_perhari: formatInputRibuan(tempData[id_karyawan]?.upah_perhari ?? ""),
          bonus: formatInputRibuan(tempData[id_karyawan]?.bonus ?? ""),
        };
      }
    });
    setLocalInput(newLocal);
  }, [editingRow, manajemenGaji, tempData]);

  useEffect(() => {
    const tableId = "#manajemenGajiTable";
    if (manajemenGaji.length === 0) {
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
      if ($.fn.DataTable.isDataTable(tableId)) $(tableId).DataTable().destroy();
    };
  }, [manajemenGaji]);

  const handleInputChange = (id, field, value) => {
    const formatted = formatInputRibuan(value);
    setLocalInput((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: formatted },
    }));
    onChange(id, field, parseNumber(formatted));
  };

  const handleSave = async (id) => {
    // 1. Cek validasi lokal sebelum memanggil onSave
    if (errors[id]) {
      console.warn("Simpan dibatalkan: Terdapat error validasi pada ID", id);
      return;
    }

    const upah = tempData[id]?.upah_perhari;
    if (!upah || String(upah).trim() === "") {
      console.warn("Simpan dibatalkan: Upah kosong");
      return;
    }

    // 2. Jalankan fungsi simpan dari parent
    // Pastikan fungsi onSave di parent mengembalikan 'true' jika API berhasil
    const result = await onSave(id);

    // 3. Popup muncul HANYA jika validasi lolos dan proses simpan sukses
    if (result === true) {
      setShowPopup(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <h3 className="text-xl font-bold mb-6 text-slate-800">Daftar Gaji Karyawan</h3>
      <div className="overflow-x-auto">
        <table id="manajemenGajiTable" className="w-full border-collapse display nowrap">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
              <th className="p-4 text-center">Nama Karyawan</th>
              <th className="p-4 text-center">Upah per Hari</th>
              <th className="p-4 text-center">Bonus</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {manajemenGaji.map((item) => {
              const id = item.id_karyawan;
              const karyawan = karyawanList.find((k) => k.id_karyawan === id);
              const isEditing = editingRow[id] === true;
              return (
                <tr key={id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 text-base font-medium text-center">{karyawan?.nama_karyawan}</td>
                  <td className="p-4 text-center relative">
                    {isEditing ? (
                      <div className="max-w-[200px] mx-auto">
                        <input
                          type="text"
                          value={localInput[id]?.upah_perhari ?? ""}
                          onChange={(e) => handleInputChange(id, "upah_perhari", e.target.value)}
                          className={`border rounded p-2 w-full focus:ring-2 focus:ring-[#006400] outline-none ${errors[id] ? 'border-red-500' : 'border-slate-200'}`}
                        />
                        {errors[id] && (
                          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 text-red-600 text-[10px] font-bold whitespace-nowrap bg-white px-1">
                            {errors[id]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-800 text-base font-semibold">{formatRupiah(item.upah_perhari)}</span>
                    )}
                  </td>
                  <td className="p-4 text-center relative">
                    {isEditing ? (
                      <input
                        type="text"
                        value={localInput[id]?.bonus ?? ""}
                        onChange={(e) => handleInputChange(id, "bonus", e.target.value)}
                        className="border border-slate-200 rounded p-2 w-[150px] mx-auto focus:ring-2 focus:ring-[#006400] outline-none"
                      />
                    ) : (
                      <span className="text-emerald-700 text-base font-medium">{formatRupiah(item.bonus ?? 0)}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {isEditing ? (
                        <>
                          <ButtonModular variant="success" onClick={() => handleSave(id)} className="px-5 py-2.5 text-lg">Simpan</ButtonModular>
                          <ButtonModular variant="danger" onClick={() => onCancel(id)} className="px-5 py-2.5 text-lg">Batal</ButtonModular>
                        </>
                      ) : (
                        <ButtonModular 
                          variant="warning" 
                          onClick={() => onEdit(id)} 
                          className="px-5 py-2.5 text-lg"
                        >
                          Edit
                        </ButtonModular>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showPopup && <PopupSuccess message="Data gaji berhasil disimpan" onClose={() => setShowPopup(false)} />}
      <style>{`
        #manajemenGajiTable th, #manajemenGajiTable td { white-space: nowrap !important; text-align: center !important; }
        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_length select { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 6px 12px !important; outline: none !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current { background: #006400 !important; color: white !important; border: none !important; border-radius: 6px !important; }
      `}</style>
    </div>
  );
};

export default ManajemenGaji;