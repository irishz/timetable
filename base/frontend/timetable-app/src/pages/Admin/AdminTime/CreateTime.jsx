import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Flex,
  Progress,
  Center,
  Input,
  Table,
  TableContainer,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import "moment/locale/th";
import React, { useEffect, useState } from "react";
import { variables } from "../../../Variables";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { BsCheck2Circle } from "react-icons/bs";
moment.locale("th");

function CreateTime() {
  const [itemList, setitemList] = useState([]);
  const [formulaList, setformulaList] = useState([]);
  const [previewList, setpreviewList] = useState([]);
  const [selectedItemId, setselectedItemId] = useState(null);
  const [selectedFormulaId, setselectedFormulaId] = useState(null);
  const [selectedDateTime, setselectedDateTime] = useState(null);
  const [startTime, setstartTime] = useState(null);
  const [workDays, setworkDays] = useState(1);
  const [progress, setprogress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      // console.table(res.data);
      setitemList(res.data);
    });

    axios.get(variables.API_URL + "formula").then((res) => {
      setformulaList(res.data);
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
    // ANCHOR Loop work days
    let totalRow = 0;

    while (countWorkDays < workDays) {
      let i = 1,
        count = 1,
        batch_no = 1,
        run_no = 0,
        mc_no = 0;
      let tempStartTime;
      if (countWorkDays === 0) {
        tempStartTime = moment(startTime).add(countWorkDays, "day").format();
      } else {
        tempStartTime = moment(startTime)
          .add(countWorkDays, "day")
          .set("hours", 8)
          .set("minutes", 15)
          .format();
      }
      lastWorkDay = moment(tempStartTime)
        .add(12, "hours")
        .add(45, "minutes")
        .format();
      // console.log("Start Time : " + tempStartTime);
      // console.log("Last Time : " + lastWorkDay);

      let lastDateTime = tempStartTime;

      countWorkDays += 1;

      //ANCHOR Loop data lot list
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
          // console.log(count);
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
          // console.log(
          //   `%c Case: i = 1 | ` + end_sec_press_time + " -> " + count,
          //   "color: red"
          // );
        } else {
          switch (block_qty) {
            case 6:
              // console.log("case Block Qty = 6 | " + count);
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
              // console.log(
              //   `%c Case: block_qty = 6 | ` + end_sec_press_time,
              //   "color: red"
              // );
              break;
            case 3:
              // console.log("case Block qty = 3 | " + count);
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
              // console.log(
              //   `%c Case: block_qty = 3 | ` + end_sec_press_time,
              //   "color: pink"
              // );
              break;
            case 0:
              start_time = kneader_time = end_extruder_time = null;
              if (block_temp === 3) {
                // console.log("case Block qty 0 Temp 3 | " + count);
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
                // console.log("case Block qty 0 Temp 6 | " + count);
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
              // console.log(
              //   `%c Case: block_qty = 0 | ` + end_sec_press_time,
              //   "color: orange"
              // );
              break;
          }
        }

        // ANCHOR Set lastDateTime
        if (!end_sec_press_time) {
          lastDateTime = end_extruder_time;
        } else {
          lastDateTime = end_sec_press_time;
        }
        // console.log("lastDateTime: " + lastDateTime);

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
          formula: selectedFormulaId,
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
      <Td
        bgColor={process === "Invalid date" ? "red.600" : null}
        textColor={process === "Invalid date" ? "red.600" : null}
      >
        {process === "Invalid date" ? "null" : process}
      </Td>
    );
  }

  async function handleCreateLot() {
    let i = 0,
      tempdate = moment(startTime).format("DD/MM/YYYY");
    const res = await axios.get(variables.API_URL + "lot");

    // Check work date is already existed in lot list
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

    let count = 0;
    previewList.map((lotObj) => {
      axios
        .post(variables.API_URL + "lot", lotObj, {
          onUploadProgress: (ProgressEvent) => {
            //TODO Create upload progress bar
            count++;
            const progressPercent = (count / previewList.length) * 100;
            setprogress(progressPercent);
          },
        })
        .then(() => {
          setTimeout(() => {
            onClose();
            //Set to initial value
            setselectedItemId(null);
            setselectedDateTime(null);
            setworkDays(1);
            setprogress(0);
          }, 3000);
        });
    });
  }

  return (
    <div className="mx-5">
      {/* ANCHOR Input Form */}
      <Box my={3} display="flex" justifyContent="space-around">
        <Box>
          <Select
            name="item"
            id="item"
            onChange={(e) => setselectedItemId(e.target.value)}
            color="teal"
            placeholder="เลือก Item"
          >
            {itemList.map((item) => (
              <option key={item.item_id} value={item.item_id}>
                {item.item}
              </option>
            ))}
          </Select>
        </Box>

        <Box>
          <Select
            name="formula"
            id="formula"
            onChange={(e) => setselectedFormulaId(e.target.value)}
            color="teal"
            placeholder="เลือกสูตรการผลิต"
          >
            {formulaList.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </Select>
        </Box>

        <Box>
          <Input
            type="datetime-local"
            onChange={(e) => handleDateTimeChange(e)}
            colorScheme="teal"
          />
        </Box>

        <Box>
          <NumberInput
            defaultValue={1}
            min={1}
            max={6}
            size="sm"
            marginX={3}
            allowMouseWheel
            value={workDays}
            onChange={(e) => setworkDays(e)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>

        <Button
          variant="solid"
          colorScheme="orange"
          onClick={() => handlePreviewClick()}
        >
          ดูข้อมูล
        </Button>

        <Button variant="solid" colorScheme="red" onClick={onOpen}>
          วางแผน
        </Button>
      </Box>

      {/* ANCHOR SelectedDate  */}
      <Flex marginY={1} justifyContent="space-between" alignItems={"baseline"}>
        <Button
          colorScheme="teal"
          onClick={() => handleSelectDateChange("prev")}
        >
          วันก่อนหน้า
        </Button>
        <Text
          color="teal"
          fontSize="18"
          fontWeight={"semibold"}
          bgColor={"teal.100"}
          p={1}
          rounded="lg"
        >
          {moment(selectedDateTime).format("DD/MM/YYYY")}
        </Text>
        <Button
          colorScheme="teal"
          onClick={() => handleSelectDateChange("next")}
        >
          วันถัดไป
        </Button>
      </Flex>

      {/* ANCHOR Modal Progress */}
      <div className="flex justify-center">
        {progress > 0 ? <p>{progress}%</p> : null}
      </div>

      {/* ANCHOR Preview Table */}
      {previewList.length > 0 ? (
        <TableContainer
          mt={3}
          border="solid"
          borderWidth={1}
          borderColor="gray.300"
          borderRadius={5}
        >
          <Table
            p={2}
            display="block"
            variant="simple"
            maxWidth="100%"
            whiteSpace="normal"
            size="sm"
          >
            <Thead>
              <Tr>
                <Th textAlign="center" p={1}>
                  Batch No.
                </Th>
                <Th textAlign="center" p={1}>
                  Run No.
                </Th>
                <Th textAlign="center" p={1}>
                  เครื่อง
                </Th>
                <Th textAlign="center" p={1}>
                  เริ่มเดินงาน
                </Th>
                <Th textAlign="center" p={1}>
                  เวลาผสมเสร็จ
                </Th>
                <Th textAlign="center" p={1}>
                  ออกจากเอ็กทรูดเดอร์[Extruder]
                </Th>
                <Th textAlign="center" p={1}>
                  ออกจากพรีเพลส[Pre-Press]
                </Th>
                <Th textAlign="center" p={1}>
                  เริ่มอบที่ไพรมารี่ เพลส[Primary Press]
                </Th>
                <Th textAlign="center" p={1}>
                  ออกจากไพรมารี่ เพลส[Primary Press]
                </Th>
                <Th textAlign="center" p={1}>
                  กด สตีม อิน Steam in
                </Th>
                <Th textAlign="center" p={1}>
                  เริ่มอบที่ เซกันดารี่ เพลส[Secondary Press]
                </Th>
                <Th textAlign="center" p={1}>
                  เริ่มอบรอบที่ 2 เซกันดารี่ เพลส[Secondary Press]
                </Th>
                <Th textAlign="center" p={1}>
                  คูลลิ่ง[Cooling]
                </Th>
                <Th textAlign="center" p={1}>
                  จดอุณภูมิรอบที่ 1 เซกันดารี่ เพลส[Secondary Press]
                </Th>
                <Th textAlign="center" p={1}>
                  จดอุณภูมิรอบที่ 2 เซกันดารี่ เพลส[Secondary Press]
                </Th>
                <Th textAlign="center" p={1}>
                  ออกจาก เซกันดารี่ เพลส[Secondary Press]
                </Th>
                {/* <td>หมายเหตุ</td> */}
              </Tr>
            </Thead>
            <Tbody className="text-center">
              {previewList
                .sort((a, b) => a.flag - b.flag)
                .filter(
                  (time) =>
                    moment(time.workday).format("DD/MM/YYYY") ===
                    moment(selectedDateTime).format("DD/MM/YYYY")
                )
                .map((time, idx) => (
                  <Tr key={time.flag}>
                    {/* render batch number */}
                    {(idx + 1) % 2 === 1 ? (
                      <Td rowSpan={2} className="table-cell">
                        {time.batch_no}
                      </Td>
                    ) : null}
                    {/* render run number & machine number */}
                    {time.block_qty === 0 && time.block_temp === 3 ? (
                      <>
                        <Td rowSpan={2} className="table-cell">
                          {time.run_no}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {time.mc_no}
                        </Td>
                      </>
                    ) : time.block_qty === 3 && time.block_temp === 6 ? null : (
                      <>
                        <Td className="table-cell">{time.run_no}</Td>
                        <Td className="table-cell">{time.mc_no}</Td>
                      </>
                    )}
                    {/* render start, kneader, end_kneader */}
                    {renderCell(moment(time.start_time).format("HH:mm"))}
                    {renderCell(moment(time.kneader_time).format("HH:mm"))}
                    {renderCell(moment(time.end_extruder_time).format("HH:mm"))}
                    {time.block_qty === 0 && time.block_temp === 3 ? (
                      <>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.end_prepress_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.start_prim_press_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.end_prim_press_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.steam_in_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.start_sec_press_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.start_sec_press2_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.cooling_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.record_sec_press_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.record_sec_press2_time).format("HH:mm")}
                        </Td>
                        <Td rowSpan={2} className="table-cell">
                          {moment(time.end_sec_press_time).format("HH:mm")}
                        </Td>
                      </>
                    ) : (idx > 5 && time.block_qty === 3) ||
                      idx === 2 ? null : (
                      <>
                        <Td className="table-cell">
                          {moment(time.end_prepress_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.start_prim_press_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.end_prim_press_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.steam_in_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.start_sec_press_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.start_sec_press2_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.cooling_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.record_sec_press_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.record_sec_press2_time).format("HH:mm")}
                        </Td>
                        <Td className="table-cell">
                          {moment(time.end_sec_press_time).format("HH:mm")}
                        </Td>
                      </>
                    )}
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}

      {/* ANCHOR Confirm Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ยืนยันการวางแผน</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {progress === 100 ? (
              <Center>
                <Flex direction="column" align="center">
                  <BsCheck2Circle size={36} color="green" />
                  <Text color="green">สร้างข้อมูลสำเร็จ</Text>
                </Flex>
              </Center>
            ) : progress > 0 ? (
              <Progress hasStripe value={progress} max={100} />
            ) : (
              <>
                <Text>
                  <strong>วันที่เริ่มต้น</strong> :{" "}
                  {moment(startTime).format("LLLL")}
                </Text>
                <Text>
                  <strong>วันที่สิ้นสุด</strong> :{" "}
                  {moment(startTime)
                    .add(workDays - 1, "days")
                    .add(12, "hours")
                    .add(45, "minutes")
                    .format("LLLL")}
                </Text>
              </>
            )}
          </ModalBody>
          {progress !== 0 ? null : (
            <ModalFooter>
              <Stack direction="row">
                <Button
                  colorScheme="teal"
                  onClick={() => handleCreateLot()}
                  leftIcon={<CheckIcon />}
                >
                  ตกลง
                </Button>
                <Button
                  colorScheme="red"
                  onClick={onClose}
                  leftIcon={<CloseIcon />}
                >
                  ยกเลิก
                </Button>
              </Stack>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CreateTime;
