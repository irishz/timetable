import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import moment from "moment";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
function Time() {
  const item = [
    {
      id: 1,
      item: "RP-300S",
      init: 10,
    },
  ];

  const [startTime, setstartTime] = useState(moment().format());
  const [timeDisplay, settimeDisplay] = useState([]);

  function handleDatetimeChange(time) {
    setstartTime(moment(time).format());
  }

  function handleDisplayTimeClick() {
    let timeList = [
      {
        start: "08:15",
        kneader: "08:36",
        out_kneader: "08:48",
        out_prepress: "08:51",
      },
      {
        start: "00:00",
        kneader: "00:00",
        out_kneader: "00:00",
        out_prepress: "10:18",
      },
      {
        start: "09:42",
        kneader: "10:03",
        out_kneader: "10:15",
        out_prepress: "00:00",
      },
      {
        start: "00:00",
        kneader: "00:00",
        out_kneader: "00:00",
        out_prepress: "11:45",
      },
      {
        start: "12:36",
        kneader: "12:57",
        out_kneader: "13:09",
        out_prepress: "13:12",
      },
      {
        start: "00:00",
        kneader: "00:00",
        out_kneader: "00:00",
        out_prepress: "14:39",
      },
      {
        start: "14:03",
        kneader: "14:24",
        out_kneader: "14:36",
        out_prepress: "00:00",
      },
      {
        start: "00:00",
        kneader: "00:00",
        out_kneader: "00:00",
        out_prepress: "16:06",
      },
    ];

    settimeDisplay(timeList);
  }

  return (
    <div>
      <div className="">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="วัน/เวลา เริ่มงาน : "
            value={startTime}
            onChange={(time) => handleDatetimeChange(time)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleDisplayTimeClick}
      >
        แสดงเวลา
      </Button>
      <h3>{startTime}</h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Batch No.</TableCell>
              <TableCell>Run No.</TableCell>
              <TableCell>เครื่อง</TableCell>
              <TableCell>เริ่มเดินงาน</TableCell>
              <TableCell>เวลาผสมเสร็จ</TableCell>
              <TableCell>ออกจากเอ็กทรูดเดอร์ [Extruder]</TableCell>
              <TableCell>ออกจากพรีเพลส [Pre-Press]</TableCell>
              <TableCell>เริ่มอบที่ไพรมารี่ เพลส [Primary Press]</TableCell>
              <TableCell>ออกจากไพรมารี่ เพลส[Primary Press]</TableCell>
              <TableCell>กด สตีม อิน Steam in</TableCell>
              <TableCell>
                เริ่มอบที่ เซกันดารี่ เพลส [Secondary Press]
              </TableCell>
              <TableCell>
                เริ่มอบรอบที่ 2 เซกันดารี่ เพลส [Secondary Press]
              </TableCell>
              <TableCell>
                เริ่มอบรอบที่ 2 เซกันดารี่ เพลส [Secondary Press]
              </TableCell>
              <TableCell>คูลลิ่ง [Cooling]</TableCell>
              <TableCell>
                จดอุณภูมิรอบที่ 1 เซกันดารี่ เพลส [Secondary Press]
              </TableCell>
              <TableCell>
                จดอุณภูมิรอบที่ 2 เซกันดารี่ เพลส [Secondary Press]
              </TableCell>
              <TableCell>ออกจาก เซกันดารี่ เพลส [Secondary Press]</TableCell>
              <TableCell>หมายเหตุ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* #1 */}
            <TableRow>
              <TableCell rowSpan={2}>B 1</TableCell>
              <TableCell>R 1</TableCell>
              <TableCell>M 1</TableCell>
              <TableCell>08:15</TableCell>
              <TableCell>08:36</TableCell>
              <TableCell>08:48</TableCell>
              <TableCell>08:51</TableCell>
            </TableRow>
            {/* #2 */}
            <TableRow>
              <TableCell rowSpan={2}>R 2</TableCell>
              <TableCell rowSpan={2}>M 2</TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell rowSpan={2}>10:18</TableCell>
            </TableRow>
            {/* #3 */}
            <TableRow>
              <TableCell rowSpan={2}>B 2</TableCell>
              <TableCell>09:42</TableCell>
              <TableCell>10:03</TableCell>
              <TableCell>10:15</TableCell>
            </TableRow>
            {/* #4 */}
            <TableRow>
              <TableCell>R 3</TableCell>
              <TableCell>M 3</TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell>11:45</TableCell>
            </TableRow>
            {/* #5 */}
            <TableRow>
              <TableCell rowSpan={2}>B 3</TableCell>
              <TableCell>R 4</TableCell>
              <TableCell>M 4</TableCell>
              <TableCell>12:36</TableCell>
              <TableCell>12:57</TableCell>
              <TableCell>13:09</TableCell>
              <TableCell>13:12</TableCell>
            </TableRow>
            {/* #6 */}
            <TableRow>
              <TableCell rowSpan={2}>R 5</TableCell>
              <TableCell rowSpan={2}>M 1</TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell rowSpan={2}>14:39</TableCell>
            </TableRow>
            {/* #7 */}
            <TableRow>
              <TableCell rowSpan={2}>B 4</TableCell>
              <TableCell>14:03</TableCell>
              <TableCell>14:24</TableCell>
              <TableCell>14:36</TableCell>
            </TableRow>
            {/* #8 */}
            <TableRow>
              <TableCell>R 6</TableCell>
              <TableCell>M 2</TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell style={{ backgroundColor: "#c00000" }}> </TableCell>
              <TableCell>16:06</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Time;
