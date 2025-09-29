import React, { useState } from "react";
import InputDfodComponent from "../components/InputDfod";

function InputDfod() {
  const [dfodList, setDfodList] = useState([]);

  return (
    <InputDfodComponent
      dfodList={dfodList}
      setDfodList={setDfodList}
    />
  );
}

export default InputDfod;
