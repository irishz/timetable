import React from "react";
import { useParams } from "react-router-dom";

function FormulaEdit() {
  const {id} = useParams();
  return <div>FormulaEdit : {id}</div>;
}

export default FormulaEdit;
