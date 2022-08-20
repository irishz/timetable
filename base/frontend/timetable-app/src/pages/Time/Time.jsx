import React, { useEffect, useLayoutEffect, useState } from "react";
import moment from "moment";
import "moment/locale/th";
import axios from "axios";
import { variables } from "../../Variables";
import ItemFormular from "./ItemFormular";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  IconButton,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import EditTime from "../Admin/AdminTime/EditTime";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function Time() {
  const [timeDisplay, settimeDisplay] = useState([]);
  const [itemList, setitemList] = useState([]);
  const [currTime, setcurrTime] = useState(moment().format());
  const [selectedDate, setselectedDate] = useState(moment().format());
  const [selectedItem, setselectedItem] = useState(1);
  const [lotEditObj, setlotEditObj] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useLayoutEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      // console.log(res.data);
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
      return;
    }
    if (type === "next") {
      setselectedDate(moment(selectedDate).add(1, "day").format());
      return;
    }
    setselectedDate(moment().format());
  }

  useEffect(() => {
    axios.get(variables.API_URL + "lotitem/" + selectedItem).then((res) => {
      settimeDisplay(res.data);
    });
  }, [selectedItem]);

  function renderCell(
    process,
    lot_id,
    time_process,
    time_workday,
    process_name,
    process_name_eng,
  ) {
    return (
      <Td
        onClick={() => {
          if (process !== "Invalid date") {
            //Open Modal
            let lotObj = {
              lotId: lot_id,
              lotTime: time_process,
              workday: time_workday,
              process_name: process_name,
              process_name_eng: process_name_eng
            };
            setlotEditObj(lotObj);
            onOpen();
          }
        }}
        _hover={
          process === "Invalid date"
            ? null
            : { bgColor: "teal", color: "white" }
        }
        className={
          process === "Invalid date" ? "bg-red-600 text-red-600" : null
        }
      >
        {process === "Invalid date" ? "null" : process}
      </Td>
    );
  }

  function checkCurrTime(time) {
    let timeDiff = moment(currTime).diff(time, "minutes");
    if (timeDiff >= 0) {
      return true;
    }
    return false;
  }

  return (
    <Box margin={3}>
      <Container maxWidth="container.xl">
        <Box marginY={3}>
          <Text>เลือก Item</Text>
          <Select
            onChange={(e) => setselectedItem(e.target.value)}
            color="teal"
          >
            {itemList.map((item) => (
              <option value={item.item_id} key={item.item_id}>
                {item.item}
              </option>
            ))}
          </Select>
        </Box>
        <Flex gap={1} alignItems="center">
          <Text
            fontSize={18}
            color="teal"
            fontWeight="bold"
            borderRight="solid"
            pr={2}
            mr={1}
          >
            {moment(selectedDate).format("LLLL")}
          </Text>
          <IconButton
            icon={<ChevronLeftIcon />}
            variant="outline"
            colorScheme="teal"
            onClick={() => handleBtnDateClick("prev")}
          />
          <Flex justifyContent="center">
            <Button
              onClick={() => handleBtnDateClick("current")}
              colorScheme="teal"
              variant="outline"
            >
              วันนี้
            </Button>
            {/* <Text color="teal" fontWeight="bold" fontSize="18">
              {moment(selectedDate).format("LLLL")}
            </Text> */}
          </Flex>
          <IconButton
            icon={<ChevronRightIcon />}
            variant="outline"
            colorScheme="teal"
            onClick={() => handleBtnDateClick("next")}
          />
        </Flex>
      </Container>

      {/* Table Formular */}
      <Box>
        <ItemFormular
          itemData={itemList.find((item) => item.item_id === selectedItem)}
        />
      </Box>

      <TableContainer>
        <Table
          display="block"
          variant="simple"
          maxWidth="100%"
          whiteSpace="normal"
          size="sm"
        >
          {/* <TableCaption>This is Table Caption</TableCaption> */}
          <Thead>
            <Tr>
              <Th textAlign="center" p={1}>
                Batch No.
              </Th>
              <Th textAlign="center" p={1}>
                Run No.
              </Th>
              <Th>เครื่อง</Th>
              <Th>เริ่มเดินงาน</Th>
              <Th>เวลาผสมเสร็จ</Th>
              <Th>ออกจากเอ็กทรูดเดอร์ [Extruder]</Th>
              <Th>ออกจากพรีเพลส [Pre-Press]</Th>
              <Th>เริ่มอบที่ไพรมารี่ เพลส [Primary Press]</Th>
              <Th>ออกจากไพรมารี่ เพลส [Primary Press]</Th>
              <Th>กดสตีมอิน Steam in</Th>
              <Th>เริ่มอบที่ เซกันดารี่ เพลส[Secondary Press]</Th>
              <Th>เริ่มอบรอบที่ 2 เซกันดารี่ เพลส[Secondary Press]</Th>
              <Th>คูลลิ่ง[Cooling]</Th>
              <Th>จดอุณภูมิรอบที่ 1 เซกันดารี่ เพลส[Secondary Press]</Th>
              <Th>จดอุณภูมิรอบที่ 2 เซกันดารี่ เพลส[Secondary Press]</Th>
              <Th>ออกจาก เซกันดารี่ เพลส[Secondary Press]</Th>
              <Th>หมายเหตุ</Th>
            </Tr>
          </Thead>
          <Tbody>
            {timeDisplay
              .sort((a, b) => a.flag - b.flag)
              .filter(
                (time) =>
                  moment(time.workday).format("DD/MM/YYYY") ===
                  moment(selectedDate).format("DD/MM/YYYY")
              )
              .map((time, idx) => (
                <Tr key={idx}>
                  {/* render batch number */}
                  {(idx + 1) % 2 === 1 ? (
                    <Td rowSpan={2}>{time.batch_no}</Td>
                  ) : null}
                  {/* render run number & machine number */}
                  {time.block_qty === 0 && time.block_temp === 3 ? (
                    <>
                      <Td rowSpan={2}>{time.run_no}</Td>
                      <Td rowSpan={2}>{time.mc_no}</Td>
                    </>
                  ) : time.block_qty === 3 && time.block_temp === 6 ? null : (
                    <>
                      <Td>{time.run_no}</Td>
                      <Td>{time.mc_no}</Td>
                    </>
                  )}
                  {/* render start, kneader, end_kneader */}
                  {renderCell(
                    moment(time.start_time).format("HH:mm"),
                    time.id,
                    time.start_time,
                    time.workday,
                    "เริ่มเดินงาน",
                  )}
                  {renderCell(
                    moment(time.kneader_time).format("HH:mm"),
                    time.id,
                    time.kneader_time,
                    time.workday,
                    "ผสมเสร็จ"
                  )}
                  {renderCell(
                    moment(time.end_extruder_time).format("HH:mm"),
                    time.id,
                    time.end_extruder_time,
                    time.workday,
                    "ออกจากเอ็กทรูดเดอร์"
                  )}
                  {time.block_qty === 0 && time.block_temp === 3 ? (
                    <>
                      <Td
                        rowSpan={2}
                        // ${
                        // checkCurrTime(time.end_prepress_time)
                        //   ? "bg-green-600"
                        //   : null
                      >
                        {moment(time.end_prepress_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.start_prim_press_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.end_prim_press_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.steam_in_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.start_sec_press_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.start_sec_press2_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.cooling_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.record_sec_press_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.record_sec_press2_time).format("HH:mm")}
                      </Td>
                      <Td rowSpan={2}>
                        {moment(time.end_sec_press_time).format("HH:mm")}
                      </Td>
                    </>
                  ) : (idx > 5 && time.block_qty === 3) || idx === 2 ? null : (
                    <>
                      <Td>{moment(time.end_prepress_time).format("HH:mm")}</Td>
                      <Td>
                        {moment(time.start_prim_press_time).format("HH:mm")}
                      </Td>
                      <Td>
                        {moment(time.end_prim_press_time).format("HH:mm")}
                      </Td>
                      <Td>{moment(time.steam_in_time).format("HH:mm")}</Td>
                      <Td>
                        {moment(time.start_sec_press_time).format("HH:mm")}
                      </Td>
                      <Td>
                        {moment(time.start_sec_press2_time).format("HH:mm")}
                      </Td>
                      <Td>{moment(time.cooling_time).format("HH:mm")}</Td>
                      <Td>
                        {moment(time.record_sec_press_time).format("HH:mm")}
                      </Td>
                      <Td>
                        {moment(time.record_sec_press2_time).format("HH:mm")}
                      </Td>
                      <Td>{moment(time.end_sec_press_time).format("HH:mm")}</Td>
                    </>
                  )}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      <EditTime isOpen={isOpen} onClose={onClose} lotEditObj={lotEditObj} />
    </Box>
  );
}

export default Time;
