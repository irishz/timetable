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
function Time() {
  const [startTime, setstartTime] = useState(moment().format());
  const [timeDisplay, settimeDisplay] = useState([]);

  function handleDatetimeChange(time) {
    setstartTime(moment(time).format());
  }

  function handleDisplayTimeClick() {
    let timeList = [
      {
        run_no: 1,
        mc_no: 1,
        start: "08:15",
        kneader: "08:36",
        out_kneader: "08:48",
        out_prepress: "08:51",
        block_qty: 6,
      },
      {
        run_no: 2,
        mc_no: 2,
        start: "00:00",
        kneader: "00:00",
        out_kneader: "00:00",
        out_prepress: "10:18",
        block_qty: 3,
      },
      {
        run_no: 0,
        mc_no: 0,
        start: "09:42",
        kneader: "10:03",
        out_kneader: "10:15",
        out_prepress: "00:00",
        block_qty: 3,
      },
      {
        run_no: 3,
        mc_no: 3,
        start: "00:00",
        kneader: "00:00",
        out_kneader: "00:00",
        out_prepress: "11:45",
        block_qty: 6,
      },
      {
        run_no: 4,
        mc_no: 4,
        start: "12:36",
        kneader: "12:57",
        out_kneader: "13:09",
        out_prepress: "13:12",
        block_qty: 6,
      },
      {
        run_no: 5,
        mc_no: 1,
        start: "00:00",
        kneader: "00:00",
        out_kneader: "00:00",
        out_prepress: "14:39",
        block_qty: 3,
      },
      {
        run_no: 0,
        mc_no: 0,
        start: "14:03",
        kneader: "14:24",
        out_kneader: "14:36",
        out_prepress: "00:00",
        block_qty: 3,
      },
      {
        run_no: 6,
        mc_no: 2,
        start: "00:00",
        kneader: "00:00",
        out_kneader: "00:00",
        out_prepress: "16:06",
        block_qty: 6,
      },
    ];
    settimeDisplay(timeList);
  }

  function renderCell(process) {
    return (
      <TableCell
        style={process === "00:00" ? { backgroundColor: "#c00000" } : {}}
      >
        {process === "00:00" ? " " : process}
      </TableCell>
    );
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleDisplayTimeClick()}>แสดงเวลา</Button>
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
            {timeDisplay.map((time, idx, elements) => (
              <TableRow key={idx}>
                {/* render batch number */}
                {(idx + 1) % 2 === 1 ? (
                  <TableCell rowSpan={2}>B {time.run_no}</TableCell>
                ) : null}
                {/* render run number & machine number */}
                {idx + 1 === elements.length ? (
                  <>
                    <TableCell>R {time.run_no}</TableCell>
                    <TableCell>M {time.mc_no}</TableCell>
                  </>
                ) : time.block_qty + elements[idx + 1].block_qty === 6 ? (
                  <>
                    <TableCell rowSpan={2}>R {time.run_no}</TableCell>
                    <TableCell rowSpan={2}>M {time.mc_no}</TableCell>
                  </>
                ) : time.block_qty === 3 &&
                  elements[idx + 1].block_qty === 6 ? null : (
                  <>
                    <TableCell>R {time.run_no}</TableCell>
                    <TableCell>M {time.mc_no}</TableCell>
                  </>
                )}
                {/* render start, kneader, out_kneader */}
                {renderCell(time.start)}
                {renderCell(time.kneader)}
                {renderCell(time.out_kneader)}
                {idx + 1 === elements.length ? (
                  <TableCell>{time.out_prepress}</TableCell>
                ) : time.block_qty + elements[idx + 1].block_qty === 6 ? (
                  <TableCell rowSpan={2}>{time.out_prepress}</TableCell>
                ) : time.block_qty === 3 &&
                  elements[idx + 1].block_qty === 6 ? null : (
                  <TableCell>{time.out_prepress}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Time;
