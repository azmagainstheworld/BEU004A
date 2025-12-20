// InputDfod.jsx
import React, { useState, useEffect, useRef } from "react";
import ButtonModular from "./ButtonModular";
import jwt_decode from "jwt-decode";
import PopupSuccess from "./PopupSuccess";
import $ from "jquery";
import "datatables.net-dt";
import "jquery-highlight/jquery.highlight.js";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";
import { useFinance } from "../context/FinanceContext"; 

function InputDfod() {
  const { dfodList, addDfod, updateDfodById, deleteDfodById, fetchDfod} = useFinance();

  const [userRole, setUserRole] = useState(null);
  const [nominal, setNominal] = useState("");
  const [pembayaran, setPembayaran] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const formRef = useRef(null);



  // GET USER ROLE
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
  }, []);

// DATATABLES RENDER
  useEffect(() => {
    const tableId = "#dfodTable";
    let table;

    const renderTable = () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        table = $(tableId).DataTable();
        table.clear();
        
        if (dfodList && dfodList.length > 0) {
          const rows = dfodList.map(item => {
            const rowData = [
              `<div class="p-4 text-center text-slate-700 text-base">${new Date(item.tanggal).toLocaleDateString("id-ID")}</div>`,
              `<div class="p-4 text-center font-bold text-black text-base">Rp ${item.nominal.toLocaleString("id-ID")}</div>`,
              `<div class="p-4 text-center">
                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  item.jenis_pembayaran.toLowerCase() === "cash" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                }">${item.jenis_pembayaran}</span>
              </div>`
            ];
            
            // Tambahkan kolom aksi HANYA jika bukan Admin
            if (userRole !== "Admin") {
              rowData.push(
                `<div class="p-4 flex justify-center gap-2">
                  <button class="btn-edit px-5 py-2.5 rounded-lg font-semibold text-sm bg-amber-500 text-white" data-id="${item.id_input_dfod}">Edit</button>
                  <button class="btn-delete px-5 py-2.5 rounded-lg font-semibold text-sm bg-rose-500 text-white" data-id="${item.id_input_dfod}">Hapus</button>
                </div>`
              );
            }
            return rowData;
          });
          table.rows.add(rows);
        }
        table.draw(false);
      } else {
        // Inisialisasi awal
        table = $(tableId).DataTable({
          paging: true,
          order: [[0, "desc"]],
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
            emptyTable: "<span class='italic text-slate-400 font-medium'>Data tidak ditemukan</span>",
            zeroRecords: "<span class='italic text-slate-400 font-medium'>Data tidak ditemukan</span>"
          }
        });
        // Panggil kembali untuk mengisi data awal jika ada
        renderTable();
      }
    };

    const timer = setTimeout(() => {
      renderTable();

      // Event handlers
      $(tableId).off("click", ".btn-edit").on("click", ".btn-edit", function () {
        const id = $(this).data("id");
        const item = dfodList.find(d => d.id_input_dfod === id);
        if (item) handleEdit(item);
      });
      $(tableId).off("click", ".btn-delete").on("click", ".btn-delete", function () {
        const id = $(this).data("id");
        setDeleteId(id);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [dfodList, userRole]);

  // LIVE VALIDATION FUNCTIONS
  const validateNominal = (value) => {
    const numericValue = value.replace(/\./g, "");
    if (!numericValue || Number(numericValue) < 1000) return "Nominal minimal Rp 1.000";
    return "";
  };

  const validatePembayaran = (value) => {
    if (!value) return "Pilih jenis pembayaran";
    return "";
  };

  const handleNominalChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 1 && value.startsWith("0")) value = value.replace(/^0+/, "");
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setNominal(formatted);
    setErrors(prev => ({ ...prev, nominal: validateNominal(formatted) })); // LIVE VALIDATION
  };

  const handlePembayaranChange = (e) => {
    const value = e.target.value;
    setPembayaran(value);
    setErrors(prev => ({ ...prev, pembayaran: validatePembayaran(value) })); // LIVE VALIDATION
  };

  const resetForm = () => {
    setNominal(""); setPembayaran(""); setEditId(null); setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericValue = nominal.replace(/\./g, "");

    const newErrors = {
      nominal: validateNominal(nominal),
      pembayaran: validatePembayaran(pembayaran)
    };
    setErrors(newErrors);
    if (newErrors.nominal || newErrors.pembayaran) return;

    try {
      const dfodData = { nominal: Number(numericValue), jenis_pembayaran: pembayaran };
      if (editId) {
        await updateDfodById(editId, dfodData);
        setPopupMessage("DFOD berhasil diupdate!");
      } else {
        await addDfod(dfodData);
        setPopupMessage("DFOD berhasil ditambahkan!");
      }
      setShowPopup(true);
      resetForm();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (item) => {
    setEditId(item.id_input_dfod);
    setNominal(item.nominal.toLocaleString("id-ID"));
    setPembayaran(item.jenis_pembayaran);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async () => {
    try {
      // Panggil fungsi yang ada di context saja
      await deleteDfodById(deleteId); 
      setPopupMessage("DFOD berhasil dihapus!");
      setShowPopup(true);
    } catch (err) { 
      console.error(err); 
    }
    setDeleteId(null);
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Delivery Fee On Delivery</h2>

        {/* FORM SECTION */}
        <div ref={formRef} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8">
          <h3 className="text-lg font-bold mb-4 text-slate-700">{editId ? "Update Data" : "Input Baru"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Nominal DFOD</label>
              <input type="text" value={nominal} onChange={handleNominalChange} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.nominal ? "border-red-500" : "border-slate-200"}`} placeholder="Rp 0" />
              {errors.nominal && <p className="text-red-500 text-xs mt-1">{errors.nominal}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Jenis Pembayaran</label>
              <select value={pembayaran} onChange={handlePembayaranChange} className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.pembayaran ? "border-red-500" : "border-slate-200"}`}>
                <option value="">-- Pilih Pembayaran --</option>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
              </select>
              {errors.pembayaran && <p className="text-red-500 text-xs mt-1">{errors.pembayaran}</p>}
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <ButtonModular type="submit" variant="success" className="bg-[#006400] hover:bg-[#004d00]">{editId ? "Update" : "Simpan"}</ButtonModular>
              <ButtonModular type="button" variant="warning" onClick={resetForm}>Batal</ButtonModular>
            </div>
          </form>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Log DFOD</h3>
          </div>
          <div className="overflow-x-auto">
            <table id="dfodTable" className="w-full text-sm border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4 text-center">Tanggal</th>
                  <th className="p-4 text-center">Nominal</th>
                  <th className="p-4 text-center">Pembayaran</th>
                  {userRole !== "Admin" && <th className="p-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      </div>

      {showPopup && (
        <PopupSuccess 
        message={popupMessage} 
        onClose={() => {
          setShowPopup(false);
          fetchDfod(); // terdefinisi dari context
          }} 
        />
      )}

      {/* MODAL DELETE */}
      {deleteId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-50 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-sharp text-3xl">delete_forever</span></div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Hapus DFOD?</h2>
            <p className="text-slate-500 mb-6">Data akan dipindahkan ke Trash. Lanjutkan?</p>
            <div className="flex gap-3 justify-center">
              <ButtonModular variant="warning" onClick={() => setDeleteId(null)}>Batal</ButtonModular>
              <ButtonModular variant="danger" onClick={handleDelete}>Hapus</ButtonModular>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #dfodTable th, #dfodTable td { white-space: nowrap !important; text-align: center !important; }
        #dfodTable th { text-align: center !important; }
        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_length select { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 6px 12px !important; outline: none !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current { background: #006400 !important; color: white !important; border: none !important; border-radius: 6px !important; }
      `}</style>
    </main>
  );
}

export default InputDfod;
