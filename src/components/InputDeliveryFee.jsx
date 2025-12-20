// InputDeliveryFee.jsx
import React, { useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import $ from "jquery";
import "datatables.net-dt";
import "jquery-highlight/jquery.highlight.js";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";
import PopupSuccess from "./PopupSuccess";
import { useFinance } from "../context/FinanceContext";

function InputDeliveryFee() {
  const { deliveryFeeList, addDeliveryFee, updateDeliveryFeeById, deleteDeliveryFeeById } = useFinance();
  const [userRole, setUserRole] = useState(null);
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
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
    const tableId = "#deliveryTable";
    let table;

    const initDataTable = () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        table = $(tableId).DataTable();
        table.clear();
        
        if (deliveryFeeList && deliveryFeeList.length > 0) {
          const rows = deliveryFeeList.map(item => {
            const rowData = [
              `<div class="p-4 text-center text-slate-700 text-base">${new Date(item.tanggal).toLocaleDateString("id-ID")}</div>`,
              `<div class="p-4 text-center font-bold text-black text-base">Rp ${parseInt(item.nominal).toLocaleString("id-ID")}</div>`
            ];
            
            if (userRole !== "Admin") {
              rowData.push(
                `<div class="p-4 flex justify-center gap-2">
                  <button class="btn-edit px-5 py-2.5 rounded-lg font-semibold text-sm bg-amber-500 text-white" data-id="${item.id_input_deliveryfee}">Edit</button>
                  <button class="btn-delete px-5 py-2.5 rounded-lg font-semibold text-sm bg-rose-500 text-white" data-id="${item.id_input_deliveryfee}">Hapus</button>
                </div>`
              );
            }
            return rowData;
          });
          table.rows.add(rows);
        }
        table.draw();
      } else {
        // Inisialisasi pertama kali
        $(tableId).DataTable({
          paging: true,
          order: [[0, "desc"]],
          searching: true,
          info: true,
          ordering: true,
          scrollX: true,
          autoWidth: false,
          language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data",
            info: "Data _START_ - _END_ dari _TOTAL_",
            paginate: { next: "Next", previous: "Prev" },
            emptyTable: "<span class='italic text-slate-400'>Data tidak ditemukan</span>",
            zeroRecords: "<span class='italic text-slate-400'>Data tidak ditemukan</span>"
          }
        });

        // Panggil ulang setelah inisialisasi untuk mengisi data jika ada
        initDataTable(); 
      }
    };

    // Gunakan timeout kecil agar DOM table sudah siap di render React
    const timer = setTimeout(() => {
      initDataTable();
      
      // Event listener button
      $(tableId).off("click", ".btn-edit").on("click", ".btn-edit", function () {
        const id = $(this).data("id");
        const item = deliveryFeeList.find(d => d.id_input_deliveryfee === id);
        if (item) handleEdit(item);
      });
      $(tableId).off("click", ".btn-delete").on("click", ".btn-delete", function () {
        const id = $(this).data("id");
        setDeleteId(id);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [deliveryFeeList, userRole]);

  // FORM LOGIC
  const validateAmount = (value) => {
    const numericValue = value.replace(/\./g, "");
    if (!numericValue || Number(numericValue) < 1000) return "Nominal minimal Rp 1.000";
    return "";
  };

  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 1 && value.startsWith("0")) value = value.replace(/^0+/, "");
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formatted);
    setErrors(prev => ({ ...prev, amount: validateAmount(formatted) }));
  };

  const resetForm = () => { setAmount(""); setEditingId(null); setErrors({}); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericValue = amount.replace(/\./g, "");
    const newError = validateAmount(amount);
    setErrors({ amount: newError });
    if (newError) return;

    try {
      if (editingId) {
        // Hanya kirim nominal untuk update
        await updateDeliveryFeeById(editingId, { nominal: parseInt(numericValue) });
        setPopupMessage("Data berhasil diupdate");
      } else {
        // Untuk tambah baru, sertakan tanggal
        await addDeliveryFee({ nominal: parseInt(numericValue) });
        setPopupMessage("Data berhasil ditambahkan");
      }
      setShowPopup(true);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };


  const handleEdit = (item) => {
    setEditingId(item.id_input_deliveryfee);
    setAmount(parseInt(item.nominal).toLocaleString("id-ID"));
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async () => {
    try {
      await deleteDeliveryFeeById(deleteId);
      setPopupMessage("Data berhasil dihapus");
      setShowPopup(true);
    } catch (err) { console.error(err); }
    setDeleteId(null);
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Delivery Fee</h2>

        {/* FORM */}
        <div ref={formRef} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8">
          <h3 className="text-lg font-bold mb-4 text-slate-700">{editingId ? "Update Data" : "Input Baru"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Nominal Delivery Fee</label>
              <input type="text" value={amount} onChange={handleAmountChange} placeholder="Contoh: 50.000"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.amount ? "border-red-500" : "border-slate-200"}`} />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#006400] hover:bg-[#004d00] text-white font-semibold py-2 px-4 rounded-lg">Simpan</button>
              <button type="button" onClick={resetForm} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg">Batal</button>
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Log Delivery Fee</h3>
          </div>
          <div className="overflow-x-auto">
            <table id="deliveryTable" className="w-full text-sm border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4 text-center">Tanggal</th>
                  <th className="p-4 text-center">Nominal</th>
                  {userRole !== "Admin" && <th className="p-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      </div>

      {showPopup && <PopupSuccess message={popupMessage} onClose={() => setShowPopup(false)} />}

      {deleteId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-50 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-sharp text-3xl">delete_forever</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Hapus Data?</h2>
            <p className="text-slate-500 mb-6">Data akan dipindahkan ke Trash. Lanjutkan?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg">Batal</button>
              <button onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg">Hapus</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #deliveryTable th, #deliveryTable td { white-space: nowrap !important; text-align: center !important; }
        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_length select { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 6px 12px !important; outline: none !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current { background: #006400 !important; color: white !important; border: none !important; border-radius: 6px !important; }
      `}</style>
    </main>
  );
}

export default InputDeliveryFee;
