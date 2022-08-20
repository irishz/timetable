import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";

function ItemFormular(props) {
  useEffect(() => {
    // console.log(props.itemData);
  }, [props.itemData]);

  return (
    <Box>
      <table>
        <thead>
          <tr>
            <td>ดูสูตรที่ใช้ในการผลิต</td>
          </tr>
          <tr>
            <td>เครื่อง</td>
            <td>สูตรที่</td>
            <td>ชื่อ</td>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </table>
    </Box>
  );
}

export default ItemFormular;
