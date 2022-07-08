import React, { useState } from "react";
import { Button, FormControl, Table } from "react-bootstrap";
import moment from "moment";
function Time() {
  const [startTime, setstartTime] = useState(moment().format());
  const [timeDisplay, settimeDisplay] = useState([]);

  function handleDatetimeChange(e) {
    let time = e.target.value;
    setstartTime(time);
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
      <td style={process === "00:00" ? { backgroundColor: "#c00000" } : {}}>
        {process === "00:00" ? " " : process}
      </td>
    );
  }

  return (
    <div>
      <div>
        <Button variant="primary" onClick={() => handleDisplayTimeClick()}>
          แสดงเวลา
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <td>Batch No.</td>
            <td>Run No.</td>
            <td>เครื่อง</td>
            <td>เริ่มเดินงาน</td>
            <td>เวลาผสมเสร็จ</td>
            <td>ออกจากเอ็กทรูดเดอร์ [Extruder]</td>
            <td>ออกจากพรีเพลส [Pre-Press]</td>
            <td>เริ่มอบที่ไพรมารี่ เพลส [Primary Press]</td>
            <td>ออกจากไพรมารี่ เพลส[Primary Press]</td>
            <td>กด สตีม อิน Steam in</td>
            <td>เริ่มอบที่ เซกันดารี่ เพลส [Secondary Press]</td>
            <td>เริ่มอบรอบที่ 2 เซกันดารี่ เพลส [Secondary Press]</td>
            <td>เริ่มอบรอบที่ 2 เซกันดารี่ เพลส [Secondary Press]</td>
            <td>คูลลิ่ง [Cooling]</td>
            <td>จดอุณภูมิรอบที่ 1 เซกันดารี่ เพลส [Secondary Press]</td>
            <td>จดอุณภูมิรอบที่ 2 เซกันดารี่ เพลส [Secondary Press]</td>
            <td>ออกจาก เซกันดารี่ เพลส [Secondary Press]</td>
            <td>หมายเหตุ</td>
          </tr>
        </thead>
        <tbody>
          {timeDisplay.map((time, idx, elements) => (
            <tr key={idx}>
              {/* render batch number */}
              {(idx + 1) % 2 === 1 ? (
                <td rowSpan={2}>B {(idx + 2) / 2}</td>
              ) : null}
              {/* render run number & machine number */}
              {idx + 1 === elements.length ? (
                <>
                  <td>R {time.run_no}</td>
                  <td>M {time.mc_no}</td>
                </>
              ) : time.block_qty + elements[idx + 1].block_qty === 6 ? (
                <>
                  <td rowSpan={2}>R {time.run_no}</td>
                  <td rowSpan={2}>M {time.mc_no}</td>
                </>
              ) : time.block_qty === 3 &&
                elements[idx + 1].block_qty === 6 ? null : (
                <>
                  <td>R {time.run_no}</td>
                  <td>M {time.mc_no}</td>
                </>
              )}
              {/* render start, kneader, out_kneader */}
              {renderCell(time.start)}
              {renderCell(time.kneader)}
              {renderCell(time.out_kneader)}
              {idx + 1 === elements.length ? (
                <td>{time.out_prepress}</td>
              ) : time.block_qty + elements[idx + 1].block_qty === 6 ? (
                <td rowSpan={2}>{time.out_prepress}</td>
              ) : time.block_qty === 3 &&
                elements[idx + 1].block_qty === 6 ? null : (
                <td>{time.out_prepress}</td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Time;
