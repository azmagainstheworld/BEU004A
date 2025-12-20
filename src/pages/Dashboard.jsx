import React from "react";
import DashboardComponent from "../components/Dashboard";
import { useFinance } from "../context/FinanceContext";

function Dashboard() {
  const { allInputs, insights } = useFinance(); // ambil langsung dari context

  return (
    <main className="flex-1 bg-[#F8FAFC] p-6 min-h-screen">
      <DashboardComponent allInputs={allInputs} insights={insights} />
    </main>
  );
}

export default Dashboard;
