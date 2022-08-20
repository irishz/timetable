import React from "react";
import { useParams } from "react-router-dom";

function FormularEdit() {
  const {id} = useParams();
  return <div>FormularEdit : {id}</div>;
}

export default FormularEdit;
