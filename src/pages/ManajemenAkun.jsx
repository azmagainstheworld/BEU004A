import React, { useState, useEffect, useCallback } from "react";
import ManajemenAkunUI from "../components/ManajemenAkun";
import jwtDecode from "jwt-decode";
import PopupSuccess from "../components/PopupSuccess";
import { useNavigate } from "react-router-dom";

export default function ManajemenAkunPage() {
  const navigate = useNavigate();

  const [superAdmin, setSuperAdmin] = useState(null);
  const [adminList, setAdminList] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [shouldLogoutAfterSuccess, setShouldLogoutAfterSuccess] = useState(false);

  // AMBIL USER DARI TOKEN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setSuperAdmin({
        id: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      });
    } catch (err) {
      console.error("decode token error:", err);
    }
  }, []);

  // AMBIL LIST ADMIN
  const fetchAdmins = useCallback(async () => {
    if (!superAdmin || superAdmin.role !== "Super Admin") return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/superadmin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Langsung update state list dari data server terbaru
        setAdminList(data.filter((u) => u.roles === "Admin"));
      }
    } catch (err) {
      console.error("Gagal mengambil data admin:", err);
    }
  }, [superAdmin]);

  // 2. Panggil fetchAdmins saat pertama kali mount
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };


  // HANDLE INPUT FORM 
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset error field saat user mengetik
    setErrors((prev) => ({ ...prev, [name]: "" }));
    
    // Ambil nilai terbaru 
    const currentPassword = name === 'password' ? value : formData.password;
    const currentConfirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;

    // 3. Validasi Kekuatan Password
    if (name === "password") {
      setPasswordStrength(checkStrength(value));
    }
    
    // 4. Validasi Email
    if (name === "email" && value.trim() !== "" && !validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: "Format email tidak valid" }));
    }

    // 5. Validasi Konfirmasi Password (Live Validation)
    if (name === 'password' || name === 'confirmPassword') {
        const pw = name === 'password' ? value : currentPassword;
        const confPw = name === 'confirmPassword' ? value : currentConfirmPassword;

        if (pw !== confPw && confPw.length > 0) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Password tidak sama" }));
        } else if (pw === confPw && pw.length > 0) {
            setErrors((prev) => {
                const newErr = { ...prev };
                delete newErr.confirmPassword;
                return newErr;
            });
        }
    }
  };


  const checkStrength = (pw) => {
    if (pw.length < 6) return "Lemah";
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/) && pw.length >= 8) return "Kuat";
    return "Sedang";
  };

  // VALIDASI TAMBAH ADMIN
  const validateForm = () => {
    const err = {};

    if (!formData.username) err.username = "Username wajib diisi";
    if (!formData.email) err.email = "Email wajib diisi";
    else if (!validateEmail(formData.email)) err.email = "Format email tidak valid";

    if (modalType === "add" && !formData.password)
      err.password = "Password wajib diisi";

    if (formData.password && formData.password !== formData.confirmPassword)
      err.confirmPassword = "Password tidak sama";

    setErrors(err);
    return Object.keys(err).length === 0;
  };


  // VALIDASI EDIT PASSWORD
  const validateEditForm = () => {
    const err = {};

    if (!formData.password) {
      err.password = "Password tidak boleh kosong";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      err.confirmPassword = "Password tidak sama";
    }

    // Gabungkan dengan errors lama agar live validation tidak hilang
    setErrors((prev) => ({ ...prev, ...err }));

    return Object.keys(err).length === 0;
  };

  // SUBMIT TAMBAH ADMIN
  const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://beu004a-backend-production.up.railway.app/beu004a/users/superadmin/tambah-admin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              username: formData.username,
              email: formData.email,
              password: formData.password,
              roles: "Admin",
            }),
          }
        );

        const data = await res.json();

        // HANDLE ERROR 409 
        if (res.status === 409) {
          if (data.errors && Array.isArray(data.errors)) {
            const updatedErrors = {};
            data.errors.forEach((err) => {
              // Periksa field apa yang bermasalah dari respons backend
              if (err.field === 'username') {
                updatedErrors.username = "Username telah tersedia"; 
              } else if (err.field === 'email') {
                updatedErrors.email = "Email telah tersedia";    
              } else {
                // Jika ada error field lain dari backend
                updatedErrors[err.field] = err.message;
              }
            });
            setErrors((prev) => ({ ...prev, ...updatedErrors }));
          } else {
            // Jika 409, tetapi format error tidak sesuai, tampilkan alert umum.
            alert(data.message || data.error || "Gagal menambahkan admin");
          }
          return; // Stop eksekusi jika ada error field
        }

        // HANDLE ERROR NON-200/NON-409
        if (!res.ok) {
          // Tampilkan error umum jika status bukan 200 dan bukan 409
          alert(data.message || data.error || "Gagal menambahkan admin karena alasan yang tidak diketahui.");
          return; 
        }

        // SUKSES TAMBAH 
        if (res.ok) {
          await fetchAdmins(); 
          setModalType(null); 
          setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        
          
          // 3. Tampilkan pesan sukses
          setSuccessMessage(`Admin ${formData.username} berhasil ditambahkan.`);
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan koneksi atau server internal.");
      }
    };

  // EDIT PASSWORD ADMIN
  const handleConfirmEdit = async () => {
    if (!validateEditForm()) return;

    const token = localStorage.getItem("token");
    if (!token) return setSuccessMessage("Token tidak ditemukan.");

    const isSuperAdmin = superAdmin.role === "Super Admin";
    const isEditingSelf = selectedAdmin.id === superAdmin.id;

    try {
      let url = "";
      let body = {};

      if (isSuperAdmin && isEditingSelf) {
        url = "https://beu004a-backend-production.up.railway.app/beu004a/auth/change-password";
        body = {
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword,
        };

      } else if (isSuperAdmin && !isEditingSelf) {
        url = "https://beu004a-backend-production.up.railway.app/beu004a/auth/superadmin/change-password";
        body = {
          targetUserId: selectedAdmin.id,
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword,
        };
      } else {
        url = "https://beu004a-backend-production.up.railway.app/beu004a/auth/change-password";
        body = {
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword,
        };
      }

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // HANDLE ERROR BACKEND
      if (!res.ok) {
        if (data.errors) {
          const updatedErrors = {};
          data.errors.forEach((err) => {
            updatedErrors[err.field] = err.message;
          });
          setErrors(updatedErrors);
          return;
        }
        setErrors({ general: data.message });
        return;
      }

      // SUKSES - POPUP EDIT ADMIN BERHASIL
      if (isSuperAdmin && isEditingSelf) {
        setSuccessMessage("Password berhasil diubah. Silakan login kembali dengan password baru");
        setShouldLogoutAfterSuccess(true);
        closeModal();
        return;
      }

      setSuccessMessage(`Password admin ${selectedAdmin.username} berhasil diubah.`);
      closeModal();

    } catch (err) {
      console.error(err);
    }
  };

  // DELETE ADMIN
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://beu004a-backend-production.up.railway.app/beu004a/users/superadmin/delete", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_user_jntcargobeu004a: id }),
      });

      const data = await res.json();
      if (!res.ok) return setSuccessMessage(data.error);

      // setAdminList((prev) =>
      //   prev.filter((a) => a.id_user_jntcargobeu004a !== id)
      // );

      await fetchAdmins();
      setSuccessMessage("Admin berhasil dihapus.");
    } catch (err) {
      console.error(err);
    }
  };

  // MODAL CONTROL
  const openAddModal = () => {
    setModalType("add");
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setPasswordStrength("");
  };

  const openEditModal = (admin) => {
    setModalType("edit");
    setSelectedAdmin(admin);
    // Saat edit, kita hanya perlu id dan data tampilan
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setPasswordStrength("");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedAdmin(null);
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setPasswordStrength("");
  };

  return (
    <>
      <ManajemenAkunUI
        superAdmin={superAdmin}
        adminList={superAdmin?.role === "Super Admin" ? adminList : []}
        formData={formData}
        errors={errors}
        passwordStrength={passwordStrength}
        modalType={modalType}
        selectedAdmin={selectedAdmin}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        onFormChange={handleChange}
        onPasswordChange={(pw) => {
            // Ini hanya dipanggil oleh field password di UI
            handleChange({ target: { name: 'password', value: pw } });
        }}
        onAddAdmin={openAddModal}
        onEditPassword={openEditModal}
        onDeleteAdmin={(admin) => {
          setSelectedAdmin(admin);
          setModalType("delete");
        }}
        onConfirmAdd={handleSubmit}
        onConfirmEdit={handleConfirmEdit}
        onConfirmDelete={async () => {
          if (!selectedAdmin) return;
          await handleDelete(selectedAdmin.id_user_jntcargobeu004a);
          closeModal();
        }}
        onCloseModal={closeModal}
      />

      {successMessage && (
        <PopupSuccess
          message={successMessage}
          onClose={() => {
            setSuccessMessage("");

            if (shouldLogoutAfterSuccess) {
              localStorage.removeItem("token");
              navigate("/login");
              window.location.reload();
            }
          }}
        />
      )}
    </>
  );
}