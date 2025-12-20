import React, { useState, useEffect, useRef } from "react";
import { useFinance } from "../context/FinanceContext";
import ButtonModular from "../components/ButtonModular";
import jwt_decode from "jwt-decode";
import PopupSuccess from "../components/PopupSuccess";
import $ from "jquery";
import "datatables.net-dt";
import "jquery-highlight/jquery.highlight.js";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "../index.css";

function InputOutgoing() {
  const { outgoingList, addOutgoing, updateOutgoingById, deleteOutgoingById } = useFinance();
  
  const [userRole, setUserRole] = useState(null);
  const [nominal, setNominal] = useState("");
  const [potongan, setPotongan] = useState("");
  const [pembayaran, setPembayaran] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const formRef = useRef(null);

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

  useEffect(() => {
    const tableId = "#outgoingTable";
    
    const renderTable = () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        const table = $(tableId).DataTable();
        table.clear();
        
        if (outgoingList && outgoingList.length > 0) {
          const rows = outgoingList.map(item => {
            const rowData = [
              `<div class="p-4 text-center text-slate-700 text-base">${new Date(item.tanggal_outgoing).toLocaleDateString("id-ID")}</div>`,
              `<div class="p-4 text-center text-black text-base font-medium">Rp ${item.nominal.toLocaleString("id-ID")}</div>`,
              `<div class="p-4 text-center text-red-500 text-base">Rp ${item.potongan_outgoing.toLocaleString("id-ID")}</div>`,
              `<div class="p-4 text-center font-bold text-black text-base">Rp ${(item.nominal - item.potongan_outgoing).toLocaleString("id-ID")}</div>`,
              `<div class="p-4 text-center">
                <span class="px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  item.jenis_pembayaran.toLowerCase() === 'cash' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }">${item.jenis_pembayaran}</span>
              </div>`
            ];
            
            if (userRole !== "Admin") {
              rowData.push(
                `<div class="p-4 flex justify-center gap-2">
                  <button class="btn-edit px-5 py-2.5 rounded-lg font-semibold text-sm bg-amber-500 text-white" data-id="${item.id_input_outgoing}">Edit</button>
                  <button class="btn-delete px-5 py-2.5 rounded-lg font-semibold text-sm bg-rose-500 text-white" data-id="${item.id_input_outgoing}">Hapus</button>
                </div>`
              );
            }
            return rowData;
          });
          table.rows.add(rows);
        }
        table.draw(false);
      } else {
        $(tableId).DataTable({
          paging: true,
          searching: true,
          info: true,
          ordering: true,
          order: [[0, "desc"]], 
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
            emptyTable: "<span class='italic text-slate-400 font-medium'>Data tidak ditemukan</span>", // Teks abu-abu miring
            zeroRecords: "<span class='italic text-slate-400 font-medium'>Data tidak ditemukan</span>"
          }
        });
        renderTable();
      }
    };

    const timer = setTimeout(() => {
      renderTable();

      $(tableId).off("click", ".btn-edit").on("click", ".btn-edit", function () {
        const id = $(this).data("id");
        const item = outgoingList.find(o => o.id_input_outgoing === id);
        if (item) handleEdit(item);
      });
      
      $(tableId).off("click", ".btn-delete").on("click", ".btn-delete", function () {
        setDeleteId($(this).data("id"));
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [outgoingList, userRole]);

  // 3. Validasi & Handlers
  const validate = (name, value) => {
    if (name === "nominal") {
      const num = parseInt(value.replace(/\./g, ""));
      return (!num || num < 1000) ? "Nominal minimal Rp 1.000" : "";
    }
    if (name === "pembayaran") return !value ? "Pilih jenis pembayaran" : "";
    return "";
  };

  const handleInputChange = (e, setter, name) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 1 && val.startsWith("0")) val = val.replace(/^0+/, "");
    const formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setter(formatted);
    // Live validation
    setErrors(prev => ({ ...prev, [name]: validate(name, formatted) }));
  };

  const resetForm = () => {
    setNominal(""); setPotongan(""); setPembayaran(""); setEditingId(null); setErrors({});
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi nominal dan pembayaran 
    const errNom = validate("nominal", nominal);
    const errPay = validate("pembayaran", pembayaran);
    
    if (errNom || errPay) {
        setErrors({ nominal: errNom, pembayaran: errPay });
        return;
    }

    const payload = {
        nominal: parseInt(nominal.replace(/\./g, "")),
        // Jika potongan kosong, otomatis dikirim 0
        potongan: parseInt(potongan.replace(/\./g, "")) || 0, 
        jenis_pembayaran: pembayaran
    };

    try {
        if (editingId) {
        await updateOutgoingById(editingId, payload);
        setPopupMessage("Data berhasil diupdate!");
        } else {
        await addOutgoing(payload);
        setPopupMessage("Data berhasil ditambahkan!");
        }
        
        // Reset dan tampilkan popup sukses
        resetForm();
        setShowPopup(true);
    } catch (error) {
        // Error ditangani oleh catch di context
        console.error("Gagal menyimpan data outgoing", error);
    }
    };

  const handleEdit = (item) => {
    setEditingId(item.id_input_outgoing);
    setNominal(item.nominal.toLocaleString("id-ID"));
    setPotongan(item.potongan_outgoing.toLocaleString("id-ID"));
    setPembayaran(item.jenis_pembayaran.toLowerCase());
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async () => {
    try {
      await deleteOutgoingById(deleteId); // Auto-refresh via Context
      setPopupMessage("Data berhasil dihapus!");
      setShowPopup(true);
    } catch (error) {
      console.error(error);
    }
    setDeleteId(null);
  };

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <div className="max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Input Outgoing</h2>

        {/* FORM SECTION */}
        <div ref={formRef} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8">
          <h3 className="text-lg font-bold mb-4 text-slate-700">{editingId ? "Update Data" : "Input Baru"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Nominal Outgoing</label>
              <input type="text" value={nominal} onChange={(e) => handleInputChange(e, setNominal, "nominal")} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.nominal ? "border-red-500" : "border-slate-200"}`} placeholder="Rp 0" />
              {errors.nominal && <p className="text-red-500 text-xs mt-1">{errors.nominal}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Potongan Harga</label>
              <input type="text" value={potongan} onChange={(e) => handleInputChange(e, setPotongan, "potongan")} 
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition" placeholder="Rp 0" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Jenis Pembayaran</label>
              <select value={pembayaran} onChange={(e) => { setPembayaran(e.target.value); setErrors(prev => ({...prev, pembayaran: validate("pembayaran", e.target.value)})); }} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#006400] outline-none transition ${errors.pembayaran ? "border-red-500" : "border-slate-200"}`}>
                <option value="">-- Pilih Pembayaran --</option>
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
              </select>
              {errors.pembayaran && <p className="text-red-500 text-xs mt-1">{errors.pembayaran}</p>}
            </div>
            <div className="md:col-span-3 flex gap-3 mt-2">
              <ButtonModular type="submit" variant="success" className="bg-[#006400] hover:bg-[#004d00]">{editingId ? "Update" : "Simpan"}</ButtonModular>
              <ButtonModular type="button" variant="warning" onClick={resetForm}>Batal</ButtonModular>
            </div>
          </form>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Log Outgoing</h3>
          </div>

          <div className="overflow-x-auto">
            <table id="outgoingTable" className="w-full text-sm border-collapse display nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-600 uppercase text-[13px] font-bold tracking-widest border-b border-slate-200">
                  <th className="p-4 text-center">Tanggal</th>
                  <th className="p-4 text-center">Outgoing</th>
                  <th className="p-4 text-center">Potongan</th>
                  <th className="p-4 text-center">Bersih</th>
                  <th className="p-4 text-center">Pembayaran</th>
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
              <ButtonModular variant="warning" onClick={() => setDeleteId(null)}>Batal</ButtonModular>
              <ButtonModular variant="danger" onClick={handleDelete}>Hapus</ButtonModular>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #outgoingTable th, #outgoingTable td { white-space: nowrap !important; text-align: center !important; }
        .dataTables_wrapper .dataTables_filter input, .dataTables_wrapper .dataTables_length select { border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 6px 12px !important; outline: none !important; }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current { background: #006400 !important; color: white !important; border: none !important; border-radius: 6px !important; }
      `}</style>
    </main>
  );
}

export default InputOutgoing;