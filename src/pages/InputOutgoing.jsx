import React, { useState } from "react";
import InputOutgoing from "../components/InputOutgoing";

function Outgoing() {
  const [outgoingList, setOutgoingList] = useState([]);

  return (
    <InputOutgoing
      outgoingList={outgoingList}
      setOutgoingList={setOutgoingList}
    />
  );
}

export default Outgoing;
