import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import moment from "moment";
import "moment/locale/th";
import axios from "axios";
import { variables } from "../../Variables";
import ItemFormular from "./ItemFormula";
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
  useToast,
} from "@chakra-ui/react";
import EditTime from "../Admin/AdminTime/EditTime";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import AuthContext from "../../Context/AuthContext";
import jwtDecode from "jwt-decode";

function Time() {
  const authCtx = useContext(AuthContext);
  const [timeDisplay, settimeDisplay] = useState([]);
  const [itemList, setitemList] = useState([]);
  const [currTime, setcurrTime] = useState(moment().format());
  const [selectedDate, setselectedDate] = useState(moment().format());
  const [selectedItem, setselectedItem] = useState(1);
  const [lotEditObj, setlotEditObj] = useState(null);
  const [lotUpdated, setlotUpdated] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useLayoutEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      console.log(res.data);
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

  function handleTableDataClick(
    lot_id,
    time,
    workday,
    process_name,
    process_name_eng,
    flag
  ) {
    {
      let lotObj = {
        lotId: lot_id,
        lotTime: time,
        workday: workday,
        process_name: process_name,
        process_name_eng: process_name_eng,
        lotFlag: flag,
      };
      setlotEditObj(lotObj);

      const user_data = jwtDecode(authCtx.userToken);
      console.log(user_data.is_staff);
      if (user_data.is_staff) {
        onOpen();
      }
    }
  }

  useEffect(() => {
    axios.get(variables.API_URL + `lotitem/${selectedItem}`).then((res) => {
      settimeDisplay(res.data);
      setlotUpdated(false);
    });

    return () => {
      setlotUpdated(false);
      settimeDisplay([]);
    };
  }, [selectedItem, lotUpdated]);

  function renderCell(
    process,
    lot_id,
    time_process,
    time_workday,
    process_name,
    process_name_eng,
    flag
  ) {
    return (
      <Td
        onClick={() => {
          if (process !== "Invalid date") {
            //Open Modal
            handleTableDataClick(
              lot_id,
              time_process,
              time_workday,
              process_name,
              process_name_eng,
              flag
            );
          }
        }}
        _hover={process === "Invalid date" ? null : { bgColor: "orange" }}
        bgColor={
          checkCurrTime(time_process)
            ? "teal"
            : process === "Invalid date"
            ? "red.600"
            : null
        }
        textColor={process === "Invalid date" ? "red.600" : null}
      >
        {process === "Invalid date" ? "null" : process}
      </Td>
    );
  }

  function renderTableRowSpan(
    time,
    lot_id,
    workday,
    process_name,
    process_name_eng,
    flag
  ) {
    return (
      <Td
        rowSpan={2}
        bgColor={checkCurrTime(time) ? "teal" : null}
        _hover={{ bgColor: "orange" }}
        onClick={() =>
          handleTableDataClick(
            lot_id,
            time,
            workday,
            process_name,
            process_name_eng,
            flag
          )
        }
      >
        <Center>{moment(time).format("HH:mm")}</Center>
      </Td>
    );
  }

  function renderTableRow(
    time,
    lot_id,
    workday,
    process_name,
    process_name_eng,
    flag
  ) {
    return (
      <Td
        onClick={() =>
          handleTableDataClick(
            lot_id,
            time,
            workday,
            process_name,
            process_name_eng,
            flag
          )
        }
        bgColor={checkCurrTime(time) ? "teal" : null}
        _hover={{ bgColor: "orange" }}
      >
        <Center>{moment(time).format("HH:mm")}</Center>
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
            {moment(selectedDate).format("dddd, DD MMMM YYYY")}
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
          itemData={timeDisplay.find((lot) => lot.item === selectedItem)}
        />
      </Box>

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
          <TableCaption fontSize={20}>
            {timeDisplay.filter(
              (time) =>
                moment(time.workday).format("DD/MM/YYYY") ===
                moment(selectedDate).format("DD/MM/YYYY")
            ).length < 1
              ? "ไม่พบข้อมูล"
              : null}
          </TableCaption>
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
                ออกจากเอ็กทรูดเดอร์ [Extruder]
              </Th>
              <Th textAlign="center" p={1}>
                ออกจากพรีเพลส [Pre-Press]
              </Th>
              <Th textAlign="center" p={1}>
                เริ่มอบที่ไพรมารี่ เพลส [Primary Press]
              </Th>
              <Th textAlign="center" p={1}>
                ออกจากไพรมารี่ เพลส [Primary Press]
              </Th>
              <Th textAlign="center" p={1}>
                กดสตีมอิน Steam in
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
              <Th textAlign="center" p={1}>
                หมายเหตุ
              </Th>
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
                    "start_time",
                    time.flag
                  )}
                  {renderCell(
                    moment(time.kneader_time).format("HH:mm"),
                    time.id,
                    time.kneader_time,
                    time.workday,
                    "ผสมเสร็จ",
                    "kneader_time",
                    time.flag
                  )}
                  {renderCell(
                    moment(time.end_extruder_time).format("HH:mm"),
                    time.id,
                    time.end_extruder_time,
                    time.workday,
                    "ออกจากเอ็กทรูดเดอร์",
                    "end_extruder_time",
                    time.flag
                  )}
                  {time.block_qty === 0 && time.block_temp === 3 ? (
                    <>
                      {renderTableRowSpan(
                        time.end_prepress_time,
                        time.id,
                        time.workday,
                        "ออกจากพรีเพลส",
                        "end_prepress_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.start_prim_press_time,
                        time.id,
                        time.workday,
                        "เริ่มอบที่ไพรมารี่ เพลส",
                        "start_prim_press_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.end_prim_press_time,
                        time.id,
                        time.workday,
                        "ออกจากไพรมารี่ เพลส",
                        "end_prim_press_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.steam_in_time,
                        time.id,
                        time.workday,
                        "กดสตีมอิน",
                        "steam_in_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.start_sec_press_time,
                        time.id,
                        time.workday,
                        "เริ่มอบที่ เซกันดารี่ เพลส",
                        "start_sec_press_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.start_sec_press2_time,
                        time.id,
                        time.workday,
                        "เริ่มอบรอบที่ 2 เซกันดารี่",
                        "start_sec_press2_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.cooling_time,
                        time.id,
                        time.workday,
                        "คูลลิ่ง",
                        "cooling_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.record_sec_press_time,
                        time.id,
                        time.workday,
                        "จดอุณภูมิรอบที่ 1 เซกันดารี่",
                        "record_sec_press_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.record_sec_press2_time,
                        time.id,
                        time.workday,
                        "จดอุณภูมิรอบที่ 2 เซกันดารี่",
                        "record_sec_press2_time",
                        time.flag
                      )}
                      {renderTableRowSpan(
                        time.end_sec_press_time,
                        time.id,
                        time.workday,
                        "ออกจาก เซกันดารี่ เพลส",
                        "end_sec_press_time",
                        time.flag
                      )}
                    </>
                  ) : (idx > 5 && time.block_qty === 3) || idx === 2 ? null : (
                    <>
                      {renderTableRow(
                        time.end_prepress_time,
                        time.id,
                        time.workday,
                        "ออกจากพรีเพลส",
                        "end_prepress_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.start_prim_press_time,
                        time.id,
                        time.workday,
                        "เริ่มอบที่ไพรมารี่ เพลส",
                        "start_prim_press_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.end_prim_press_time,
                        time.id,
                        time.workday,
                        "ออกจากไพรมารี่ เพลส",
                        "end_prim_press_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.steam_in_time,
                        time.id,
                        time.workday,
                        "กดสตีมอิน",
                        "steam_in_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.start_sec_press_time,
                        time.id,
                        time.workday,
                        "เริ่มอบที่ เซกันดารี่ เพลส",
                        "start_sec_press_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.start_sec_press2_time,
                        time.id,
                        time.workday,
                        "เริ่มอบรอบที่ 2 เซกันดารี่",
                        "start_sec_press2_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.cooling_time,
                        time.id,
                        time.workday,
                        "คูลลิ่ง",
                        "cooling_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.record_sec_press_time,
                        time.id,
                        time.workday,
                        "จดอุณภูมิรอบที่ 1 เซกันดารี่ เพลส",
                        "record_sec_press_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.record_sec_press2_time,
                        time.id,
                        time.workday,
                        "จดอุณภูมิรอบที่ 2 เซกันดารี่ เพลส",
                        "record_sec_press2_time",
                        time.flag
                      )}
                      {renderTableRow(
                        time.end_sec_press_time,
                        time.id,
                        time.workday,
                        "ออกจาก เซกันดารี่ เพลส",
                        "end_sec_press_time",
                        time.flag
                      )}
                    </>
                  )}
                  <Td>{time.flag}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      <EditTime
        isOpen={isOpen}
        onClose={onClose}
        lotEditObj={lotEditObj}
        setlotUpdated={setlotUpdated}
      />
    </Box>
  );
}

export default Time;
