import React, { useEffect, useLayoutEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { variables } from "./Variables";
function Time() {
  const [timeDisplay, settimeDisplay] = useState([]);
  const [itemList, setitemList] = useState([]);
  const [currTime, setcurrTime] = useState(moment().format());
  const [selectedDate, setselectedDate] = useState(moment().format());
  const [selectedItem, setselectedItem] = useState(0);

  useLayoutEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      setitemList(res.data);
    });
  }, []);

  useEffect(() => {
    setInterval(() => {
      setcurrTime(moment().format());
    }, 1000);
  }, [currTime]);

  function handleBtnDateClick(type) {
    if (type === "prev") {
      setselectedDate(moment(selectedDate).add(-1, "day").format());
    } else {
      setselectedDate(moment(selectedDate).add(1, "day").format());
    }
  }

  useEffect(() => {
    axios.get(variables.API_URL + "lotitem/" + selectedItem).then((res) => {
      settimeDisplay(res.data);
    });
  }, [selectedItem]);

  function renderCell(process) {
    return (
      <td
        className={
          process === "Invalid date"
            ? "table-cell bg-red-600 text-red-600"
            : "table-cell"
        }
      >
        {process === "Invalid date" ? "null" : process}
      </td>
    );
  }

  return (
    <div className="m-3">
      <div className="flex justify-between">
        <button
          type="button"
          className="flex align-middle px-4 py-2 rounded-lg border border-blue-600 text-blue-600"
          onClick={() => handleBtnDateClick("prev")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          วันก่อนหน้า
        </button>
        <p className="font-mono font-bold text-xl text-indigo-600">
          {moment(currTime).format("DD/MM/YYYY HH:mm:ss")}
        </p>
        <button
          type="button"
          className="flex align-middle px-4 py-2 rounded-lg border border-blue-600 text-blue-600"
          onClick={() => handleBtnDateClick("next")}
        >
          วันถัดไป
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="my-2">
        {itemList.map((item) => (
          <button
            key={item.item_id}
            className={`p-3 rounded-lg border ${
              selectedItem === item.item_id
                ? "bg-blue-700 font-bold"
                : "bg-blue-600"
            } text-white hover:bg-blue-700 shadow mx-1`}
            onClick={() => setselectedItem(item.item_id)}
          >
            {item.item}
          </button>
        ))}
      </div>

      <table className="table-fixed h-24">
        <thead className="text-center font-medium text-sm border-t border border-gray-600">
          <tr>
            <td className="table-cell">Batch No.</td>
            <td className="table-cell">Run No.</td>
            <td className="table-cell">เครื่อง</td>
            <td className="table-cell">เริ่มเดินงาน</td>
            <td className="table-cell">เวลาผสมเสร็จ</td>
            <td className="table-cell">ออกจากเอ็กทรูดเดอร์[Extruder]</td>
            <td className="table-cell">ออกจากพรีเพลส[Pre-Press]</td>
            <td className="table-cell">
              เริ่มอบที่ไพรมารี่ เพลส[Primary Press]
            </td>
            <td className="table-cell">ออกจากไพรมารี่ เพลส[Primary Press]</td>
            <td className="table-cell">กด สตีม อิน Steam in</td>
            <td className="table-cell">
              เริ่มอบที่ เซกันดารี่ เพลส[Secondary Press]
            </td>
            <td className="table-cell">
              เริ่มอบรอบที่ 2 เซกันดารี่ เพลส[Secondary Press]
            </td>
            <td className="table-cell">คูลลิ่ง[Cooling]</td>
            <td className="table-cell">
              จดอุณภูมิรอบที่ 1 เซกันดารี่ เพลส[Secondary Press]
            </td>
            <td className="table-cell">
              จดอุณภูมิรอบที่ 2 เซกันดารี่ เพลส[Secondary Press]
            </td>
            <td className="table-cell">
              ออกจาก เซกันดารี่ เพลส[Secondary Press]
            </td>
            {/* <td>หมายเหตุ</td> */}
          </tr>
        </thead>
        <tbody className="text-center">
          {timeDisplay.sort((a, b) => a.flag - b.flag).map((time, idx) => (
            <tr key={idx}>
              {/* render batch number */}
              {(idx + 1) % 2 === 1 ? (
                <td rowSpan={2} className="table-cell">
                  {time.batch_no}
                </td>
              ) : null}
              {/* render run number & machine number */}
              {time.block_qty === 0 && time.block_temp === 3 ? (
                <>
                  <td rowSpan={2} className="table-cell">
                    {time.run_no}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {time.mc_no}
                  </td>
                </>
              ) : time.block_qty === 3 && time.block_temp === 6 ? null : (
                <>
                  <td className="table-cell">{time.run_no}</td>
                  <td className="table-cell">{time.mc_no}</td>
                </>
              )}
              {/* render start, kneader, end_kneader */}
              {renderCell(moment(time.start_time).format("HH:mm"))}
              {renderCell(moment(time.kneader_time).format("HH:mm"))}
              {renderCell(moment(time.end_extruder_time).format("HH:mm"))}
              {time.block_qty === 0 && time.block_temp === 3 ? (
                <>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.end_prepress_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.start_prim_press_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.end_prim_press_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.steam_in_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.start_sec_press_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.start_sec_press2_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.cooling_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.record_sec_press_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.record_sec_press2_time).format("HH:mm")}
                  </td>
                  <td rowSpan={2} className="table-cell">
                    {moment(time.end_sec_press_time).format("HH:mm")}
                  </td>
                </>
              ) : (idx > 5 && time.block_qty === 3) || idx === 2 ? null : (
                <>
                  <td className="table-cell">
                    {moment(time.end_prepress_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.start_prim_press_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.end_prim_press_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.steam_in_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.start_sec_press_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.start_sec_press2_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.cooling_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.record_sec_press_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.record_sec_press2_time).format("HH:mm")}
                  </td>
                  <td className="table-cell">
                    {moment(time.end_sec_press_time).format("HH:mm")}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Time;
