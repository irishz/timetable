import React, { useEffect, useState } from "react";
import axios from "axios";
import { variables } from "../../Variables";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";

function CreateTime() {
  const [itemList, setitemList] = useState([]);
  const [activeItem, setactiveItem] = useState("");
  const [startTime, setstartTime] = useState(moment());

  useEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      setitemList(res.data);
    });
  }, []);

  function handleButtonItemClick(item_id) {
    setactiveItem(item_id);
  }

  function handleDateTimeChange(newValue) {
    setstartTime(newValue);
  }

  return (
    <div>
      <div>
        <ToggleButtonGroup color="primary">
          {itemList.map((item) => (
            <ToggleButton
              key={item.item_id}
              value={item.item_id}
              onClick={() => handleButtonItemClick(item.item_id)}
            >
              {item.item}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <p>{activeItem}</p>

        <div>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              label="วัน/เวลา เริ่มงาน"
              value={startTime}
              onChange={handleDateTimeChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}

export default CreateTime;
