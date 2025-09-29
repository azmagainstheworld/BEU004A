import React, { useState, useEffect } from "react";
import ButtonModular from "./ButtonModular";

const ManajemenGaji = ({
  karyawanList = [],
  manajemenGaji = [],
  setManajemenGaji,
  isLocked,
  setIsLocked,
}) => {
  const [tempData, setTempData] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [errors, setErrors] = useState({});

  // ambil nilai input
  const getInputValue = (item, field) => {
    const id = item.idKaryawan;
    if (tempData[id] && tempData[id][field] !== undefined) {
      return tempData[id][field];
    }
    // default kosong → placeholder yang muncul
    return "";
  };

  const handleInputChange = (idKaryawan, field, value) => {
    setTempData((prev) => ({
      ...prev,
      [idKaryawan]: {
        ...prev[idKaryawan],
        [field]: value,
      },
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[idKaryawan];
      return copy;
    });
  };

  // klik SIMPAN (isLocked = true dari Pages)
  useEffect(() => {
    if (!isLocked) return;

    const newErrors = {};
    let hasError = false;

    const updated = manajemenGaji.map((g) => {
      const id = g.idKaryawan;
      const temp = tempData[id] || {};

      // UPH WAJIB
      const rawUpah = temp.upahPerHari ?? g.upahPerHari ?? "";
      const upahNum = rawUpah === "" ? NaN : Number(rawUpah);

      if (rawUpah === "" || Number.isNaN(upahNum) || upahNum <= 0) {
        newErrors[id] = "Upah per hari wajib diisi";
        hasError = true;
        return g;
      }

      // KASBON optional → kalau kosong simpan 0
      const rawBonus = temp.bonus ?? g.bonus ?? "";
      const bonusNum = rawBonus === "" ? 0 : Number(rawBonus);

      return {
        ...g,
        upahPerHari: Number(upahNum),
        bonus: Number(bonusNum),
      };
    });

    if (hasError) {
      setErrors(newErrors);
      setIsLocked(false);
      return;
    }

    // simpan data terbaru
    setManajemenGaji(updated);
    setTempData({});
    setErrors({});
    setEditingRow(null);
  }, [isLocked]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRowEdit = (idKaryawan) => {
    setEditingRow(idKaryawan);
    const current =
      manajemenGaji.find((m) => m.idKaryawan === idKaryawan) || {};
    setTempData((prev) => ({
      ...prev,
      [idKaryawan]: {
        upahPerHari: current.upahPerHari ?? "",
        bonus: current.bonus ?? "",
      },
    }));
  };

  const handleRowCancel = (idKaryawan) => {
    setTempData((prev) => {
      const copy = { ...prev };
      delete copy[idKaryawan];
      return copy;
    });
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[idKaryawan];
      return copy;
    });
    setEditingRow(null);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md overflow-x-auto">
      <table className="w-full min-w-[800px] table-auto text-center border-collapse">
        <thead>
          <tr className="bg-[#E1F1DD] text-black">
            <th className="p-2 w-64 text-left">Nama Karyawan</th>
            <th className="p-2 w-48">Upah per Hari</th>
            <th className="p-2 w-48">Kasbon</th>
            <th className="p-2 w-48">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {manajemenGaji.length > 0 ? (
            manajemenGaji.map((item) => {
              const id = item.idKaryawan;
              const namaKaryawan =
                karyawanList.find((k) => k.id === id)?.nama ||
                "Belum ada data";

              const isEditing = editingRow === id || !isLocked;

              return (
                <tr key={id} className="border-b">
                  <td className="p-2 text-left">{namaKaryawan}</td>

                  {/* Upah */}
                  <td className="p-2 relative">
                    {isEditing ? (
                      <>
                        <input
                          type="number"
                          placeholder="Isi upah"
                          value={getInputValue(item, "upahPerHari")}
                          onChange={(e) =>
                            handleInputChange(id, "upahPerHari", e.target.value)
                          }
                          className="border rounded p-2 w-full"
                        />
                        {errors[id] && (
                          <span className="absolute left-0 -bottom-4 text-red-600 text-xs">
                            {errors[id]}
                          </span>
                        )}
                      </>
                    ) : (
                      <span>{item.upahPerHari}</span>
                    )}
                  </td>

                  {/* Kasbon */}
                  <td className="p-2 relative">
                    {isEditing ? (
                      <input
                        type="number"
                        placeholder="Isi kasbon"
                        value={getInputValue(item, "bonus")}
                        onChange={(e) =>
                          handleInputChange(id, "bonus", e.target.value)
                        }
                        className="border rounded p-2 w-full"
                      />
                    ) : (
                      <span>{item.bonus ?? 0}</span>
                    )}
                  </td>

                  <td className="p-2 flex justify-center gap-2">
                    <ButtonModular
                      variant="warning"
                      onClick={() => handleRowEdit(id)}
                    >
                      Edit
                    </ButtonModular>
                    <ButtonModular
                      variant="danger"
                      onClick={() => handleRowCancel(id)}
                    >
                      Batal
                    </ButtonModular>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={4}
                className="p-3 text-center italic text-gray-500"
              >
                Data Tidak Ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManajemenGaji;
