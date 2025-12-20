import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// --- CONTEXT ---
const FinanceContext = createContext();
export const useFinance = () => useContext(FinanceContext);

// --- PROVIDER ---
export const FinanceProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // --- STATE ---
  const [allInputs, setAllInputs] = useState([]);
  const [insights, setInsights] = useState([
    { title: "Kas", value: 0, bgColor: "bg-green-500" },
    { title: "Saldo JFS", value: 0, bgColor: "bg-blue-500" },
    { title: "Transfer", value: 0, bgColor: "bg-yellow-500" },
  ]);
  const [laporanKeuangan, setLaporanKeuangan] = useState([]);
  const [dfodList, setDfodList] = useState([]);
  const [deliveryFeeList, setDeliveryFeeList] = useState([]);
  const [outgoingList, setOutgoingList] = useState([]);
  const [pengeluaranList, setPengeluaranList] = useState([]);

  // --- FETCH LAPORAN KEUANGAN ---
  const fetchLaporanKeuangan = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/laporan-keuangan",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mapped = res.data.laporan.map((item) => ({
        tanggal: item.tanggal,
        kas: Number(item.Kas) || 0,
        jfs: Number(item.Saldo_JFS) || 0,
        transfer: Number(item.Transfer) || 0,
      }));

      setLaporanKeuangan(mapped);

      // --- Update insight card otomatis ---
      const totalKas = mapped.reduce((acc, cur) => acc + cur.kas, 0);
      const totalJfs = mapped.reduce((acc, cur) => acc + cur.jfs, 0);
      const totalTransfer = mapped.reduce((acc, cur) => acc + cur.transfer, 0);

      setInsights([
        { title: "Kas", value: totalKas, bgColor: "bg-green-500" },
        { title: "Saldo JFS", value: totalJfs, bgColor: "bg-blue-500" },
        { title: "Transfer", value: totalTransfer, bgColor: "bg-yellow-500" },
      ]);
    } catch (err) {
      console.error("Error fetching laporan keuangan:", err);
    }
  }, [token]);

  // --- FETCH TODAY INPUTS ---
  const fetchTodayInputs = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/today",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mappedData = res.data.map((item) => ({
        id: item.id_log_input_dashboard,
        jenis: item.jenis,
        nominal: Number(item.nominal) || 0,
        tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
        jenisPembayaran: item.jenis_pembayaran || "-",
        namaKaryawan: item.nama_karyawan || "-",
        deskripsi: item.deskripsi || "-",
        jenisPengeluaran: item.jenis_pengeluaran || "-",
      }));

      setAllInputs(mappedData);
    } catch (err) {
      console.error(" ERROR FETCH TODAY INPUTS");
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
      console.error("Message:", err.message);
    }
  }, [token]);

  const fetchDfod = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/dfod",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mapped = Array.isArray(res.data)
        ? res.data.map(item => ({
            id_input_dfod: item.id_input_dfod,
            nominal: Number(item.nominal),
            tanggal: item.tanggal_dfod || new Date().toISOString(),
            jenis_pembayaran: item.jenis_pembayaran || "",
          }))
        : [];

      setDfodList(mapped);
    } catch (err) {
      console.error("Error fetch DFOD:", err);
      setDfodList([]);
    }
  }, [token]);

  const fetchDeliveryFee = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/deliveryfee",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mapped = Array.isArray(res.data)
        ? res.data.map(item => ({
            id_input_deliveryfee: item.id_input_deliveryfee,
            nominal: Number(item.nominal),
            tanggal: item.tanggal ? new Date(item.tanggal) : new Date(), // pastikan selalu Date object
          }))
        : [];

      setDeliveryFeeList(mapped);
    } catch (err) {
      console.error("Error fetch delivery fee:", err);
      setDeliveryFeeList([]);
    }
  }, [token]);

  const fetchOutgoing = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://beu004a-backend-production.up.railway.app/beu004a/users/outgoing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutgoingList(res.data);
    } catch (err) {
      console.error("Error fetch outgoing:", err);
    }
  }, [token]);

  const fetchPengeluaran = useCallback(async () => {
      if (!token) return;
      try {
        const res = await axios.get("https://beu004a-backend-production.up.railway.app/beu004a/users/pengeluaran", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPengeluaranList(res.data);
      } catch (err) {
        console.error("Error fetch pengeluaran:", err);
        setPengeluaranList([]);
      }
    }, [token]);

  // --- AUTO FETCH SAAT TOKEN TERSEDIA (SPA FRIENDLY) ---
  useEffect(() => {
    if (token) {
      fetchTodayInputs();
      fetchLaporanKeuangan();
      fetchDfod();
      fetchDeliveryFee();
      fetchOutgoing();
      fetchPengeluaran();
    }
  }, [token, fetchTodayInputs, fetchLaporanKeuangan, fetchDfod, fetchDeliveryFee, fetchOutgoing, fetchPengeluaran]);

  // --- CRUD Helper Functions ---
  const createInput = async (endpoint, data) => {
    if (!token) return;
    try {
      await axios.post(
        `https://beu004a-backend-production.up.railway.app/beu004a/users/${endpoint}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error(`Error creating ${endpoint}:`, err);
    }
  };

  const updateInput = async (endpoint, id, data) => {
    if (!token) return;
    try {
      await axios.patch(
        `https://beu004a-backend-production.up.railway.app/beu004a/users/${endpoint}/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error(`Error updating ${endpoint}:`, err);
    }
  };

  const deleteInput = async (endpoint, id) => {
    if (!token) return;
    try {
      // Alamat URL dibuat statis sesuai router backend: .../users/dfod/delete
      const url = `https://beu004a-backend-production.up.railway.app/beu004a/users/${endpoint}/delete`;
      
      // ID dikirim di dalam objek body (parameter kedua axios.put)
      const body = { 
        [`id_input_${endpoint}`]: id 
      };

      await axios.put(url, body, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error(`Error deleting ${endpoint}:`, err);
      throw err;
    }
  };

  // --- CRUD Functions ---
  const addDfod = async (data) => {
  await createInput("dfod", data);
  await fetchDfod();
};

  const updateDfodById = async (id, data) => {
    if (!token) return;
    try {
      await axios.put(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/dfod",
        {
          id_input_dfod: id,
          ...data,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // WAJIB urutan ini
      await fetchDfod();
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error("Error updating DFOD:", err);
    }
  };

  const deleteDfodById = async (id) => {
  await deleteInput("dfod", id);
  await fetchDfod();
};
// FinanceContext.jsx

  const addOutgoing = async (data) => {
    if (!token) return;
    try {
      // Sesuai rute: router.post("/outgoing/insert", ...)
      await axios.post("https://beu004a-backend-production.up.railway.app/beu004a/users/outgoing/insert", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Auto-refresh semua data terkait setelah sukses
      await fetchOutgoing(); 
      await fetchLaporanKeuangan();
      await fetchTodayInputs(); 
    } catch (err) {
      console.error("Error add outgoing:", err);
      throw err;
    }
  };

  const updateOutgoingById = async (id, data) => {
    if (!token) return;
    try {
      // Sesuai rute: router.put("/outgoing", ...)
      await axios.put(`https://beu004a-backend-production.up.railway.app/beu004a/users/outgoing`, 
        { id_input_outgoing: id, ...data }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOutgoing();
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error("Error update outgoing:", err);
    }
  };

  const deleteOutgoingById = async (id) => {
    if (!token) return;
    try {
      // Sesuai rute: router.put("/outgoing/delete", ...)
      await axios.put("https://beu004a-backend-production.up.railway.app/beu004a/users/outgoing/delete", 
        { id_input_outgoing: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOutgoing();
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error("Error delete outgoing:", err);
    }
  };

  const addDeliveryFee = async (data) => {
    await createInput("deliveryfee", data);
    await fetchDeliveryFee();
    await fetchLaporanKeuangan();
    await fetchTodayInputs();
  };

  const updateDeliveryFeeById = async (id, data) => {
    if (!token) return;
    try {
      await axios.put(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/deliveryfee",
        { id_input_deliveryfee: id, ...data }, // data hanya nominal
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchDeliveryFee();
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error("Error update delivery fee:", err);
    }
  };

  const deleteDeliveryFeeById = async (id) => {
    if (!token) return;
    try {
      await axios.put(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/deliveryfee/delete",
        { id_input_deliveryfee: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchDeliveryFee();
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error("Error delete delivery fee:", err);
    }
  };

const addPengeluaran = async (data) => {
    if (!token) return;
    try {
      await axios.post("https://beu004a-backend-production.up.railway.app/beu004a/users/pengeluaran", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Auto Refresh
      await fetchPengeluaran();
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error("Error add pengeluaran:", err);
      throw err;
    }
  };

  // Update (router.put("/pengeluaran"))
  const updatePengeluaranById = async (id, data) => {
    if (!token) return;
    try {
      await axios.put(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/pengeluaran",
        { id_pengeluaran: id, ...data }, // Menyesuaikan body request backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Auto Refresh
      await fetchPengeluaran();
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error("Error update pengeluaran:", err);
      throw err;
    }
  };

  // Delete (Sesuai rute yang Anda miliki, biasanya soft delete menggunakan PUT)
  const deletePengeluaranById = async (id) => {
    if (!token) return;
    try {
      await axios.put(
        "https://beu004a-backend-production.up.railway.app/beu004a/users/pengeluaran/delete",
        { id_pengeluaran: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Auto Refresh
      await fetchPengeluaran();
      await fetchLaporanKeuangan();
      await fetchTodayInputs();
    } catch (err) {
      console.error("Error delete pengeluaran:", err);
    }
  };

  // --- PROVIDER VALUE ---
  return (
    <FinanceContext.Provider
      value={{
        allInputs,
        insights,
        laporanKeuangan,
        dfodList,
        fetchDfod,
        deliveryFeeList,
        fetchDeliveryFee,
        outgoingList,
        fetchOutgoing,
        pengeluaranList,
        fetchPengeluaran,
        setToken,
        fetchTodayInputs,
        fetchLaporanKeuangan,
        addDfod,
        updateDfodById,
        deleteDfodById,
        addOutgoing,
        updateOutgoingById,
        deleteOutgoingById,
        addDeliveryFee,
        updateDeliveryFeeById,
        deleteDeliveryFeeById,
        addPengeluaran, 
        updatePengeluaranById,
        deletePengeluaranById,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
