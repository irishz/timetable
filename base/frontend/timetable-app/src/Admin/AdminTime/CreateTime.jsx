import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { variables } from "../../Variables";

function CreateTime() {
  const [itemList, setitemList] = useState([]);
  const [previewList, setpreviewList] = useState([]);
  const [selectedItemId, setselectedItemId] = useState(null);
  const [selectedDateTime, setselectedDateTime] = useState(null);
  const [startTime, setstartTime] = useState(null);
  const [workDays, setworkDays] = useState(1);

  useEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      // console.log(res.data);
      setitemList(res.data);
    });
  }, []);

  function handleDateTimeChange(e) {
    setstartTime(e.target.value);
  }

  function handleSelectDateChange(type) {
    if (type === "prev") {
      setselectedDateTime(moment(selectedDateTime).add(-1, "day").format());
      return;
    }
    setselectedDateTime(moment(selectedDateTime).add(1, "day").format());
  }

  function handlePreviewClick() {
    setselectedDateTime(moment(startTime).format());

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
    let item_data = itemList.find((item) => (item.item_id = selectedItemId));
    let lastWorkDay;
    let countWorkDays = 0;
    // Loop work days
    let totalRow = 0;

    while (countWorkDays < workDays) {
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
      console.log("Start Time : " + tempStartTime);
      console.log("Last Time : " + lastWorkDay);

      let lastDateTime = tempStartTime;

      countWorkDays += 1;

      while (moment(lastDateTime).diff(moment(lastWorkDay), "hour") < 0) {
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
          console.log(count);
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
          console.log(
            `%c Case: i = 1 | ` + end_sec_press_time + " -> " + count,
            "color: red"
          );
        } else {
          switch (block_qty) {
            case 6:
              console.log("case Block Qty = 6 | " + count);
              start_time = moment(lotList[totalRow - 1].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress -
                    item_data.end_extruder -
                    item_data.kneader,
                  "minutes"
                )
                .format();
              kneader_time = moment(lotList[totalRow - 1].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress -
                    item_data.end_extruder,
                  "minutes"
                )
                .format();
              end_extruder_time = moment(
                lotList[totalRow - 1].end_prim_press_time
              )
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress,
                  "minutes"
                )
                .format();
              end_prepress_time = moment(
                lotList[totalRow - 1].end_prim_press_time
              )
                .add(item_data.extra1 - item_data.start_prim_press, "minutes")
                .format();
              start_prim_press_time = moment(
                lotList[totalRow - 1].end_prim_press_time
              )
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
              console.log(
                `%c Case: block_qty = 6 | ` + end_sec_press_time,
                "color: red"
              );
              break;
            case 3:
              console.log("case Block qty = 3 | " + count);
              start_time = moment(lotList[totalRow - 2].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress -
                    item_data.end_extruder -
                    item_data.kneader,
                  "minutes"
                )
                .format();
              kneader_time = moment(lotList[totalRow - 2].end_prim_press_time)
                .add(
                  item_data.extra1 -
                    item_data.start_prim_press -
                    item_data.end_prepress -
                    item_data.end_extruder,
                  "minutes"
                )
                .format();
              end_extruder_time = moment(
                lotList[totalRow - 2].end_prim_press_time
              )
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
              console.log(
                `%c Case: block_qty = 3 | ` + end_sec_press_time,
                "color: pink"
              );
              break;
            case 0:
              start_time = kneader_time = end_extruder_time = null;
              if (block_temp === 3) {
                console.log("case Block qty 0 Temp 3 | " + count);
                end_prepress_time = moment(
                  lotList[totalRow - 1].end_prim_press_time
                )
                  .add(item_data.extra1 - item_data.start_prim_press, "minutes")
                  .format();
                start_prim_press_time = moment(
                  lotList[totalRow - 1].end_prim_press_time
                )
                  .add(item_data.extra1, "minutes")
                  .format();
              } else if (block_temp === 6) {
                console.log("case Block qty 0 Temp 6 | " + count);
                end_prepress_time = moment(
                  lotList[totalRow - 2].end_prim_press_time
                )
                  .add(item_data.extra1 - item_data.start_prim_press, "minutes")
                  .format();
                start_prim_press_time = moment(
                  lotList[totalRow - 2].end_prim_press_time
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
              console.log(
                `%c Case: block_qty = 0 | ` + end_sec_press_time,
                "color: orange"
              );
              break;
          }
        }

        // Set lastDateTime
        if (!end_sec_press_time) {
          lastDateTime = end_extruder_time;
        } else {
          lastDateTime = end_sec_press_time;
        }
        console.log("lastDateTime: " + lastDateTime);

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
          workday: moment(lastWorkDay).format(),
          flag: totalRow,
        };
        lotList.push(lotObj);

        i++;
        count++;
        totalRow += 1;
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

  async function handleCreateLot() {
    let i = 0,
      tempdate = moment(startTime).format("DD/MM/YYYY");
    const res = await axios.get(variables.API_URL + "lot");

    while (i <= workDays) {
      tempdate = moment(startTime).add(i, "days").format("DD/MM/YYYY");
      let lotExist = res.data.some(
        (lot) => moment(lot.workday).format("DD/MM/YYYY") === tempdate
      );
      if (lotExist) {
        alert("Lot วันที่ :" + tempdate + "มีอยู่แล้ว!");
        return;
      }
      i++;
    }
    alert("ready to create")
        // previewList.map((lotObj) => {
        //   axios
        //     .post(variables.API_URL + "lot", lotObj, {
        //       onUploadProgress: (progressEvent) => {
        //         const progress = (progressEvent.loaded / progressEvent.total)
        //         console.log(progress)
        //       },
        //     })
        //     .then((res) => alert(res.data));
        // });
  }

  return (
    <div className="mx-5">
      {/* Input Form */}
      <div className="my-3 flex justify-around">
        <div>
          <select
            name="item"
            id="item"
            onChange={(e) => setselectedItemId(e.target.value)}
            className="border-2 rounded-md border-gray-600"
          >
            <option>เลือก item</option>
            {itemList.map((item) => (
              <option key={item.item_id} value={item.item_id}>
                {item.item}
              </option>
            ))}
          </select>
          <p>{selectedItemId}</p>
        </div>

        <div>
          <input
            type="datetime-local"
            className="border-2 rounded-md border-gray-600"
            onChange={(e) => handleDateTimeChange(e)}
          />
          <p>{moment(startTime).format("DD/MM/YYYY HH:mm")}</p>
        </div>

        <div>
          <input
            onChange={(e) => setworkDays(e.target.value)}
            type="number"
            className="border-2 rounded-md border-gray-600"
            min={1}
            max={6}
            value={workDays}
          />
          <p>{workDays}</p>
        </div>

        <button
          onClick={() => handlePreviewClick()}
          className="p-3 border rounded-lg border-blue-600 text-blue-500 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
        >
          ดูข้อมูล
        </button>

        <button
          onClick={() => handleCreateLot()}
          className="p-3 border rounded-lg border-yellow-600 text-yellow-500 hover:bg-yellow-500 hover:border-yellow-500 hover:text-white"
        >
          วางแผน
        </button>
      </div>

      {/* SelectedDate  */}
      <div className="my-1 flex justify-between">
        <button
          className="p-1 rounded-md bg-green-600 text-white"
          onClick={() => handleSelectDateChange("prev")}
        >
          วันก่อนหน้า
        </button>
        <p className="font-bold text-gray-600">
          {moment(selectedDateTime).format("DD/MM/YYYY")}
        </p>
        <button
          className="p-1 rounded-md bg-green-600 text-white"
          onClick={() => handleSelectDateChange("next")}
        >
          วันถัดไป
        </button>
      </div>

      {/* Preview Table */}
      {previewList.length > 0 ? (
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
            {previewList
              .sort((a, b) => a.flag - b.flag)
              .filter(
                (time) =>
                  moment(time.workday).format("DD/MM/YYYY") ===
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
      ) : null}
    </div>
  );
}

export default CreateTime;
