import React, { useEffect, useState } from "react";
import axios from "axios";
import { Variables } from "../Variables/Variables";

function AdminItem() {
//     const [itemList, setitemList] = useState([]);
    const API_URL = Variables.API_URL;

  useEffect(() => {
    console.log('render in useEffect');
    axios.get(API_URL + "item").then((res) => {
      console.log(res.data);
    });
  }, []);

  return <div>
    
  </div>;
}

export default AdminItem;
