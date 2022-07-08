import React, { useEffect, useState } from "react";
import axios from "axios";
import { variables } from "../../Variables";

import moment from "moment";
import {
  Button,
  ButtonGroup,
  Container,
  Form,
  FormControl,
  ToggleButton,
} from "react-bootstrap";
import "./AdminTime.css";

function CreateTime() {
  const [itemList, setitemList] = useState([]);
  const [selectedItemId, setselectedItemId] = useState(0);
  const [startTime, setstartTime] = useState(
    moment().format("MM/DD/YYYY hh:mm A")
  );
  const [workDays, setworkDays] = useState(1);

  useEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      setitemList(res.data);
    });
  }, []);

  function handleSelectItemChange(e) {
    setselectedItemId(parseInt(e.target.value));
  }

  function handleDatetimeChange(e) {
    let time = e.target.value;
    setstartTime(time);
  }

  function handleWorkDayChange(e) {
    setworkDays(parseInt(e.target.value));
  }

  function handlePreviewClick() {
    let batch_no,
      run_no,
      mc_no,
      block_qty,
      start_time,
      kneader_time,
      end_extruder_time,
      end_prepress_time,
      start_prim_press_time,
      end_prim_press_time,
      steam_in_time,
      start_sec_press_time,
      start_sec_press2_time,
      cooling_time,
      record_sec_press_time,
      record_sec_press2_time,
      end_sec_press_time;
    let lotList = [];
    let item_data = itemList.find((item) => item.item_id === selectedItemId);
    let lastWorkDay = moment(startTime).add(workDays, "day").format();
    let currDateTime = moment(startTime).format();
    let i = 1;
    let mc_idx = 1;
    // while (i <= 10) {
    //   if (i % 2 === 1) {
    //     batch_no = (i + 1) / 2;
    //   } else {
    //     batch_no = 0;
    //   }
    //   run_no = i;
    //   if (mc_idx > 4) {
    //     mc_idx = 1;
    //     mc_no = mc_idx;
    //   } else {
    //     mc_no = mc_idx;
    //   }
    //   switch (mc_idx) {
    //     case 1:
    //       block_qty = 6
    //       break;
    //     case 2:
    //       block_qty = 3
    //       break;
    //     case 3:
    //       block_qty = 3
    //       break;
    //     case 4:
    //       block_qty = 6
    //       break;
    //     default:
    //       break;
    //   }

    while (moment(currDateTime).diff(moment(lastWorkDay), "days") <= 0) {
      if ((i = 1)) {
        start_time = moment(startTime).format();
      } else {
        // start_time = moment(lotList[i - 1].end_prim_press_time).format();
        start_time = moment(start_time).add(40, "minutes").format();
      }
      // kneader_time = moment(start_time)
      //   .add(item_data.kneader, "minutes")
      //   .format();

      let lotObj = {
        start_time: start_time,
      };
      lotList.push(lotObj);
      currDateTime = start_time;
      console.log(lotList);
      i++;
    }
  }

  return (
    <Container>
      <div>
        <div className="d-flex flex-row gap-4">
          <Form.Select
            value={selectedItemId}
            onChange={(e) => handleSelectItemChange(e)}
          >
            <option value="">เลือก Item</option>
            {itemList.map((item) => (
              <option key={item.item_id} value={item.item_id}>
                {item.item}
              </option>
            ))}
          </Form.Select>
          <FormControl
            type="datetime-local"
            value={moment(startTime).format("MM/DD/YYYY hh:mm t")}
            onChange={(e) => handleDatetimeChange(e)}
            placeholder="วัน/เวลา เริ่มงาน"
          />
          <FormControl
            type="number"
            min={1}
            max={6}
            value={workDays}
            onChange={(e) => handleWorkDayChange(e)}
          />
          <Button variant="outline-info" onClick={() => handlePreviewClick()}>
            ดูข้อมูล
          </Button>
          <Button variant="outline-success">วางแผน</Button>
        </div>
        <p>
          Item: <strong>{selectedItemId}</strong> | StartDate :
          <strong> {moment(startTime).format("DD/MM/YYYY hh:mm")}</strong> |
          WorkDay : <strong>{workDays}</strong> | LastWeekDay :{" "}
          <strong>
            {moment(startTime).add(workDays, "days").format("DD/MM/YYYY hh:mm")}
          </strong>
        </p>
      </div>
    </Container>
  );
}

export default CreateTime;
