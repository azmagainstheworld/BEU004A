import React, { useState } from "react";
import InputOutgoing from "../components/InputOutgoing";
import { useFinance } from "../context/FinanceContext";

export default function OutgoingPage() {
  const [outgoingList, setOutgoingList] = useState([]);
  const { addOutgoing } = useFinance();

  const handleSaveToDashboard = (data) => {
    addOutgoing(data);
  };

  return (
    <div className="flex-1 bg-[#EDFFEC] min-h-screen">
      <InputOutgoing
        outgoingList={outgoingList}
        setOutgoingList={setOutgoingList}
        onSaveToDashboard={handleSaveToDashboard}
      />
    </div>
  );
}
