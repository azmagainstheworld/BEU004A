import React from "react";

function Footer() {
  return (
    <footer className="bg-[#006400] text-white w-full text-center py-3 mt-4 rounded-none">
      <p className="font-semibold text-sm">J&T Cargo BEU004A</p>
      <p className="text-xs">
        Jl. Pembangunan I, Gunung Panjang, Tanjung Redeb, Berau, Kalimantan Timur (77315)
      </p>
      <p className="text-xs mt-1">
        © {new Date().getFullYear()} J&T Cargo. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
