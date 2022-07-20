import React, { useEffect, useState } from "react";
import axios from "axios";
import { variables } from "../../Variables";

import moment from "moment";

function CreateTime() {
  const [itemList, setitemList] = useState([]);
  const [previewList, setpreviewList] = useState([]);
  const [selectedItemId, setselectedItemId] = useState(0);
  const [selectedDateTime, setselectedDateTime] = useState(null);
  const [startTime, setstartTime] = useState(
    moment().format("MM/DD/YYYY HH:mm")
  );
  const [currTime, setcurrTime] = useState(moment().format());
  const [workDays, setworkDays] = useState(1);
  const [alertItemNotSelected, setalertItemNotSelected] = useState(false);
  const [progress, setprogress] = useState(0);

  useEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      setitemList(res.data);
    });
  }, []);

  useEffect(() => {
    setInterval(() => {
      setcurrTime(moment().format());
    }, 1000);
  }, [currTime]);

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

  function handlePrevNextDateClick(type) {
    if (type === "prev") {
      setselectedDateTime(moment(selectedDateTime).add(-1, "day").format());
    } else {
      setselectedDateTime(moment(selectedDateTime).add(1, "day").format());
    }
  }

  function handleProcessClick() {
    // console.log(previewList.sort((a, b) => a.flag - b.flag));
    previewList
      .sort((a, b) => a.flag - b.flag)
      .map((list) => {
        axios.post(variables.API_URL + "lot", list, {
          onUploadProgress: (data) => {
            setprogress(Math.round((100 * data.loaded) / data.total));
          },
        });
      });
  }

  function handlePreviewClick() {
    setselectedDateTime(startTime);
    // checkItemselected
    if (selectedItemId < 1) {
      setalertItemNotSelected(true);
      setTimeout(() => {
        setalertItemNotSelected(false);
      }, 3000);
    }

    let block_qty,
      block_temp,
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
    let lastWorkDay = moment(startTime)
      .add(12, "hours")
      .add(45, "minutes")
      .format();

    let countWorkDays = 0;
    // Loop work days
    while (countWorkDays !== workDays) {
      let i = 1,
        count = 1,
        batch_no = 1,
        run_no = 0,
        mc_no = 0;
      let tempStartTime = moment(startTime)
        .add(countWorkDays, "day")
        .set("minutes", 15)
        .format();
      lastWorkDay = moment(tempStartTime)
        .add(12, "hours")
        .add(45, "minutes")
        .format();
      // console.log("Start Time : " + tempStartTime);
      // console.log("Last Time : " + lastWorkDay);
      countWorkDays += 1;

      let lastDateTime = moment(tempStartTime).format();

      // Loop time table content
      while (moment(lastDateTime).diff(moment(lastWorkDay), "hours") < 0) {
        console.log(
          i +
            " | LastTime : " +
            moment(lastDateTime).format("DD/MM/YYYY HH:mm") +
            " | " +
            moment(lastDateTime).diff(moment(lastWorkDay), "hours")
        );
        console.log(
          i +
            " | DateEnd : " +
            moment(lastWorkDay).format("DD/MM/YYYY HH:mm") +
            " | " +
            moment(lastDateTime).diff(moment(lastWorkDay), "hours")
        );
        // Batch Number
        if (i % 2 === 1) {
          batch_no = (i + 1) / 2;
        } else {
          batch_no = 0;
        }
        // Machine Number
        if (i > 5) {
          if (count > 5) {
            count = 1;
            mc_no = count;
          } else {
            mc_no = count - 1;
          }
          switch (count) {
            case 1:
              block_qty = 0;
              block_temp = 3;
              break;
            case 2:
              block_qty = 3;
              block_temp = 6;
              break;
            case 3:
              block_qty = 0;
              block_temp = 6;
              break;
            case 4:
              block_qty = 6;
              block_temp = 0;
              break;
            default:
              break;
          }
        } else {
          if (count === 4 || count === 5) {
            mc_no = count - 1;
          } else {
            mc_no = count;
          }
          // Block Quantity
          switch (count) {
            case 1:
            case 5:
              block_qty = 6;
              block_temp = 0;
              break;
            case 2:
              block_qty = 0;
              block_temp = 3;
              break;
            case 3:
              block_qty = 3;
              block_temp = 6;
              break;
            case 4:
              block_qty = 0;
              block_temp = 6;
              break;
            default:
              block_qty = 6;
              block_temp = 0;
              break;
          }
        }
        // Running Number
        if (i === 3 || count % 3 === 0) {
          run_no = run_no;
        } else {
          run_no += 1;
        }

        if (i === 1) {
          start_time = moment(tempStartTime).format();
          kneader_time = moment(start_time)
            .add(item_data.kneader, "minutes")
            .format();
          end_extruder_time = moment(kneader_time)
            .add(item_data.end_extruder, "minutes")
            .format();
          end_prepress_time = moment(end_extruder_time)
            .add(item_data.end_prepress, "minutes")
            .format();
          start_prim_press_time = moment(end_prepress_time)
            .add(item_data.start_prim_press, "minutes")
            .format();
          end_prim_press_time = moment(start_prim_press_time)
            .add(item_data.end_prim_press, "minutes")
            .format();
          start_sec_press_time = moment(end_prim_press_time)
            .add(item_data.start_sec_press, "minutes")
            .format();
          steam_in_time = moment(start_sec_press_time)
            .add(-item_data.steam_in, "minutes")
            .format();
          start_sec_press2_time = moment(start_sec_press_time)
            .add(item_data.start_sec_press2, "minutes")
            .format();
          end_sec_press_time = moment(start_sec_press_time)
            .add(item_data.end_sec_press, "minutes")
            .format();
          cooling_time = moment(end_sec_press_time)
            .add(-item_data.cooling, "minutes")
            .format();
          record_sec_press_time = moment(start_sec_press_time)
            .add(item_data.record_sec_press, "minutes")
            .format();
          record_sec_press2_time = moment(start_sec_press2_time)
            .add(item_data.record_sec_press2, "minutes")
            .format();
        } else {
          switch (block_qty) {
            case 6:
              start_time = moment(lotList[i - 2].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress -
                    item_data.end_extruder -
                    item_data.kneader,
                  "minutes"
                )
                .format();
              kneader_time = moment(lotList[i - 2].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress -
                    item_data.end_extruder,
                  "minutes"
                )
                .format();
              end_extruder_time = moment(lotList[i - 2].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress,
                  "minutes"
                )
                .format();
              end_prepress_time = moment(lotList[i - 2].end_prim_press_time)
                .add(item_data.extra1 - item_data.start_prim_press, "minutes")
                .format();
              start_prim_press_time = moment(lotList[i - 2].end_prim_press_time)
                .add(item_data.extra1, "minutes")
                .format();
              end_prim_press_time = moment(start_prim_press_time)
                .add(item_data.end_prim_press, "minutes")
                .format();
              start_sec_press_time = moment(end_prim_press_time)
                .add(item_data.start_sec_press, "minutes")
                .format();
              steam_in_time = moment(start_sec_press_time)
                .add(-item_data.steam_in, "minutes")
                .format();
              start_sec_press2_time = moment(start_sec_press_time)
                .add(item_data.start_sec_press2, "minutes")
                .format();
              end_sec_press_time = moment(start_sec_press_time)
                .add(item_data.end_sec_press, "minutes")
                .format();
              cooling_time = moment(end_sec_press_time)
                .add(-item_data.cooling, "minutes")
                .format();
              record_sec_press_time = moment(start_sec_press_time)
                .add(item_data.record_sec_press, "minutes")
                .format();
              record_sec_press2_time = moment(start_sec_press2_time)
                .add(item_data.record_sec_press2, "minutes")
                .format();
              break;
            case 3:
              start_time = moment(lotList[i - 3].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress -
                    item_data.end_extruder -
                    item_data.kneader,
                  "minutes"
                )
                .format();
              kneader_time = moment(lotList[i - 3].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress -
                    item_data.end_extruder,
                  "minutes"
                )
                .format();
              end_extruder_time = moment(lotList[i - 3].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress,
                  "minutes"
                )
                .format();
              end_prepress_time =
                start_prim_press_time =
                end_prim_press_time =
                steam_in_time =
                start_sec_press_time =
                start_sec_press2_time =
                cooling_time =
                record_sec_press_time =
                record_sec_press2_time =
                end_sec_press_time =
                  null;
              break;
            case 0:
              start_time = kneader_time = end_extruder_time = null;
              if (block_temp === 3) {
                end_prepress_time = moment(lotList[i - 2].end_prim_press_time)
                  .add(item_data.extra1 - item_data.start_prim_press, "minutes")
                  .format();
                start_prim_press_time = moment(
                  lotList[i - 2].end_prim_press_time
                )
                  .add(item_data.extra1, "minutes")
                  .format();
              } else if (block_temp === 6) {
                end_prepress_time = moment(lotList[i - 3].end_prim_press_time)
                  .add(item_data.extra1 - item_data.start_prim_press, "minutes")
                  .format();
                start_prim_press_time = moment(
                  lotList[i - 3].end_prim_press_time
                )
                  .add(item_data.extra1, "minutes")
                  .format();
              }
              end_prim_press_time = moment(start_prim_press_time)
                .add(item_data.end_prim_press, "minutes")
                .format();
              start_sec_press_time = moment(end_prim_press_time)
                .add(item_data.start_sec_press, "minutes")
                .format();
              steam_in_time = moment(start_sec_press_time)
                .add(-item_data.steam_in, "minutes")
                .format();
              start_sec_press2_time = moment(start_sec_press_time)
                .add(item_data.start_sec_press2, "minutes")
                .format();
              end_sec_press_time = moment(start_sec_press_time)
                .add(item_data.end_sec_press, "minutes")
                .format();
              cooling_time = moment(end_sec_press_time)
                .add(-item_data.cooling, "minutes")
                .format();
              record_sec_press_time = moment(start_sec_press_time)
                .add(item_data.record_sec_press, "minutes")
                .format();
              record_sec_press2_time = moment(start_sec_press2_time)
                .add(item_data.record_sec_press2, "minutes")
                .format();
              break;
          }
        }

        // Set lastDateTime
        if (end_sec_press_time === null) {
          console.log(lastDateTime);
        } else {
          lastDateTime = end_sec_press_time;
        }

        let lotObj = {
          item: selectedItemId,
          batch_no: batch_no,
          run_no: run_no,
          mc_no: mc_no,
          block_qty: block_qty,
          block_temp: block_temp,
          start_time: start_time,
          kneader_time: kneader_time,
          end_extruder_time: end_extruder_time,
          end_prepress_time: end_prepress_time,
          start_prim_press_time: start_prim_press_time,
          end_prim_press_time: end_prim_press_time,
          start_sec_press_time: start_sec_press_time,
          steam_in_time: steam_in_time,
          start_sec_press2_time: start_sec_press2_time,
          end_sec_press_time: end_sec_press_time,
          cooling_time: cooling_time,
          record_sec_press_time: record_sec_press_time,
          record_sec_press2_time: record_sec_press2_time,
          work_date: moment(lastWorkDay).format("DD/MM/YYYY"),
          flag: i,
        };
        lotList.push(lotObj);
        i++;
        count++;
      }
    }
    console.log(lotList);
    setpreviewList(lotList);
  }

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
    <div>
      <div className="container">
        <div className="m-7 flex flex-row justify-between">
          <select
            className="p-2.5 bg-indigo-200 border-2 border-indigo-700 rounded-lg font-bold"
            value={selectedItemId}
            onChange={(e) => handleSelectItemChange(e)}
          >
            <option value="0">เลือก Item</option>
            {itemList.map((item) => (
              <option key={item.item_id} value={item.item_id}>
                {item.item}
              </option>
            ))}
          </select>
          <input
            className="p-4 border rounded-md"
            type="datetime-local"
            value={startTime}
            onChange={(e) => handleDatetimeChange(e)}
            placeholder="วัน/เวลา เริ่มงาน"
          />
          <input
            className="pl-4 border rounded-md"
            type="number"
            min={1}
            max={6}
            value={workDays}
            onChange={(e) => handleWorkDayChange(e)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handlePreviewClick()}
          >
            ดูข้อมูล
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleProcessClick()}
          >
            วางแผน
          </button>
        </div>

        {selectedDateTime ? (
          <div className="m-4 flex flex-row justify-between items-center">
            <div>
              <button
                type="button"
                className="py-1 px-2 rounded-lg border border-blue-600 text-blue-500 hover:bg-blue-400 hover:text-white hover:border-blue-400"
                onClick={() => handlePrevNextDateClick("prev")}
              >
                วันก่อนหน้า
              </button>
            </div>
            <div className="text-lg text-gray-600 font-bold">
              {moment(selectedDateTime).format("DD/MM/YYYY")}
            </div>
            <div>
              <button
                type="button"
                className="py-1 px-2 rounded-lg border border-blue-600 text-blue-500 hover:bg-blue-400 hover:text-white hover:border-blue-400"
                onClick={() => handlePrevNextDateClick("next")}
              >
                วันถัดไป
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="px-2 mx-2">
        {previewList.length > 0 ? (
          <div className="">
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
                  <td className="table-cell">
                    ออกจากไพรมารี่ เพลส[Primary Press]
                  </td>
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
                {previewList
                  .filter(
                    (time) =>
                      time.work_date ===
                      moment(selectedDateTime).format("DD/MM/YYYY")
                  )
                  .map((time, idx) => (
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
                      ) : time.block_qty === 3 &&
                        time.block_temp === 6 ? null : (
                        <>
                          <td className="table-cell">{time.run_no}</td>
                          <td className="table-cell">{time.mc_no}</td>
                        </>
                      )}
                      {/* render start, kneader, end_kneader */}
                      {renderCell(moment(time.start_time).format("HH:mm"))}
                      {renderCell(moment(time.kneader_time).format("HH:mm"))}
                      {renderCell(
                        moment(time.end_extruder_time).format("HH:mm")
                      )}
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
                            {moment(time.record_sec_press2_time).format(
                              "HH:mm"
                            )}
                          </td>
                          <td rowSpan={2} className="table-cell">
                            {moment(time.end_sec_press_time).format("HH:mm")}
                          </td>
                        </>
                      ) : (idx > 5 && time.block_qty === 3) ||
                        idx === 2 ? null : (
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
                            {moment(time.record_sec_press2_time).format(
                              "HH:mm"
                            )}
                          </td>
                          <td
                            className="table-cell"
                            onClick={() => {
                              console.log(time.work_date);
                              console.log(selectedDateTime);
                            }}
                          >
                            {moment(time.end_sec_press_time).format("HH:mm")}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex w-full h-full justify-center align-middle">
            <p>
              คลิกปุ่ม <strong className="text-blue-600">"ดูข้อมูล"</strong>{" "}
              เพื่อแสดงตารางเวลา
            </p>
          </div>
        )}
      </div>

      {/* alert item not selected */}
      {alertItemNotSelected ? (
        <div className="flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-red-200 rounded-lg shadow">
          <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 bg-red-800 rounded-lg text-red-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 font-bold text-red-700">กรุณาเลือก Item!</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 text-gray-500 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-red-300 inline-flex h-8 w-8"
            data-dismiss-target="#toast-success"
            aria-label="Close"
            onClick={() => setalertItemNotSelected(false)}
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default CreateTime;
