import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import moment from "moment";
import "moment/dist/locale/th";
import axios from "axios";
import { variables } from "../../Variables";
import ItemFormular from "./ItemFormula";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
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
  useInterval,
} from "@chakra-ui/react";
import EditTime from "../Admin/AdminTime/EditTime";
import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from "@chakra-ui/icons";
import AuthContext from "../../Context/AuthContext";
import jwtDecode from "jwt-decode";
import { MdMoreTime } from "react-icons/md";
import InsertPauseTime from "../Admin/AdminTime/InsertPauseTime";
function Time() {
  const authCtx = useContext(AuthContext);
  const [timeDisplay, settimeDisplay] = useState([]);
  const [itemList, setitemList] = useState([]);
  const [currTime, setcurrTime] = useState(moment().format());
  const [selectedDate, setselectedDate] = useState(moment().format());
  const [selectedItem, setselectedItem] = useState(null);
  const [lotEditObj, setlotEditObj] = useState(null);
  const [lotUpdated, setlotUpdated] = useState(false);

  const editModal = useDisclosure();
  const pauseModal = useDisclosure();

  useLayoutEffect(() => {
    axios.get(variables.API_URL + "item").then((res) => {
      setitemList(res.data);
      const tempList = res.data;
      const item = tempList.sort((a, b) => a - b)[0].item_id;
      setselectedItem(item);
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
    flag,
    type
  ) {
    let lotObj = {
      lotId: lot_id,
      lotTime: time,
      workday: workday,
      process_name,
      process_name_eng,
      lotFlag: flag,
    };
    setlotEditObj(lotObj);

    const user_data = jwtDecode(authCtx.userToken);
    // console.log(lotObj);
    if (user_data.is_staff) {
      if (type === "edit") {
        editModal.onOpen();
        return;
      }
      pauseModal.onOpen();
    }
  }

  useEffect(() => {
    if (selectedItem) {
      axios.get(variables.API_URL + `lotitem/${selectedItem}`).then((res) => {
        settimeDisplay(res.data);
        setlotUpdated(false);
      });
      return;
    }
    return () => {
      setlotUpdated(false);
      settimeDisplay([]);
    };
  }, [selectedItem, lotUpdated]);

  useInterval(() => {
    fetchData();
  }, 5000);

  function fetchData() {
    if (selectedItem) {
      axios.get(variables.API_URL + `lotitem/${selectedItem}`).then((res) => {
        settimeDisplay(res.data);
        setlotUpdated(false);
      });
      return;
    }
  }

  function renderCell(
    process,
    lot_id,
    time_process,
    time_workday,
    process_name,
    process_name_eng,
    flag
  ) {
    let prevRow = timeDisplay.find((time) => time.flag === flag - 1);
    if (prevRow?.pause_start_time) {
      return;
    }
    return (
      <Td
        p={0}
        cursor={
          process === "Invalid date" || !authCtx.userData.is_staff
            ? "default"
            : "pointer"
        }
        _hover={process !== "Invalid date" && { bgColor: "orange" }}
        bgColor={
          (checkCurrTime(time_process) && "teal") ||
          (process === "Invalid date" && "red.600")
        }
        textColor={process === "Invalid date" && "red.600"}
      >
        {authCtx.userData.is_staff ? (
          <Popover closeDelay={100}>
            <PopoverTrigger>
              <Box w={"full"} px={4} py={2}>
                <Center>
                  {(process !== "Invalid date" && process) || "invalid"}
                </Center>
              </Box>
            </PopoverTrigger>
            <Portal>
              <PopoverContent bgColor={"teal.200"}>
                <PopoverArrow bgColor={"teal.800"} />
                <PopoverHeader>
                  <Text fontWeight={"semibold"} color="teal.700">
                    Please choose options below
                  </Text>
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <HStack gap={3}>
                    <Button
                      variant={"solid"}
                      leftIcon={<EditIcon />}
                      colorScheme={"blue"}
                      onClick={() => {
                        if (process !== "Invalid date") {
                          //Open Modal
                          handleTableDataClick(
                            lot_id,
                            time_process,
                            time_workday,
                            process_name,
                            process_name_eng,
                            flag,
                            "edit"
                          );
                        }
                      }}
                    >
                      Edit Time
                    </Button>
                    <Button
                      variant={"solid"}
                      leftIcon={<MdMoreTime />}
                      colorScheme="yellow"
                      onClick={() =>
                        handleTableDataClick(
                          lot_id,
                          time_process,
                          time_workday,
                          process_name,
                          process_name_eng,
                          flag,
                          "pause"
                        )
                      }
                    >
                      Insert Pause Time
                    </Button>
                  </HStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        ) : (
          <Box w={"full"} px={4} py={2}>
            <Center>
              {(process !== "Invalid date" && process) || "invalid"}
            </Center>
          </Box>
        )}
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
        cursor={authCtx.userData.is_staff ? "pointer" : "default"}
        rowSpan={2}
        bgColor={checkCurrTime(time) ? "teal" : null}
        _hover={{ bgColor: "orange" }}
      >
        {authCtx.userData.is_staff ? (
          <Popover>
            <PopoverTrigger>
              <Center>{moment(time).format("HH:mm")}</Center>
            </PopoverTrigger>
            <Portal>
              <PopoverContent bgColor={"teal.200"}>
                <PopoverArrow bgColor={"teal.800"} />
                <PopoverHeader>
                  <Text fontWeight={"semibold"} color="teal.700">
                    Please choose options below
                  </Text>
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <HStack gap={3}>
                    <Button
                      variant={"solid"}
                      leftIcon={<EditIcon />}
                      colorScheme={"blue"}
                      onClick={() =>
                        handleTableDataClick(
                          lot_id,
                          time,
                          workday,
                          process_name,
                          process_name_eng,
                          flag,
                          "edit"
                        )
                      }
                    >
                      Edit Time
                    </Button>
                    <Button
                      variant={"solid"}
                      leftIcon={<MdMoreTime />}
                      colorScheme="yellow"
                      onClick={() =>
                        handleTableDataClick(
                          lot_id,
                          time,
                          workday,
                          process_name,
                          process_name_eng,
                          flag,
                          "pause"
                        )
                      }
                    >
                      Insert Pause Time
                    </Button>
                  </HStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        ) : (
          <Center>{moment(time).format("HH:mm")}</Center>
        )}
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
        cursor={authCtx.userData.is_staff ? "pointer" : "default"}
        bgColor={checkCurrTime(time) && "teal"}
        _hover={{ bgColor: "orange" }}
      >
        {authCtx.userData.is_staff ? (
          <Popover>
            <PopoverTrigger>
              <Center>{moment(time).format("HH:mm")}</Center>
            </PopoverTrigger>
            <Portal>
              <PopoverContent bgColor={"teal.200"}>
                <PopoverArrow bgColor={"teal.800"} />
                <PopoverHeader>
                  <Text fontWeight={"semibold"} color="teal.700">
                    Please choose options below
                  </Text>
                </PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <HStack gap={3}>
                    <Button
                      variant={"solid"}
                      leftIcon={<EditIcon />}
                      colorScheme={"blue"}
                      onClick={() =>
                        handleTableDataClick(
                          lot_id,
                          time,
                          workday,
                          process_name,
                          process_name_eng,
                          flag,
                          "edit"
                        )
                      }
                    >
                      Edit Time
                    </Button>
                    <Button
                      variant={"solid"}
                      leftIcon={<MdMoreTime />}
                      colorScheme="yellow"
                      onClick={() =>
                        handleTableDataClick(
                          lot_id,
                          time,
                          workday,
                          process_name,
                          process_name_eng,
                          flag,
                          "pause"
                        )
                      }
                    >
                      Insert Pause Time
                    </Button>
                  </HStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        ) : (
          <Center>{moment(time).format("HH:mm")}</Center>
        )}
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
            placeholder="เลือก Item"
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
            ).length < 1 && "ไม่พบข้อมูล"}
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
              {authCtx.userData.is_staff && (
                <Th textAlign="center" p={1}>
                  เริ่มอบรอบที่ 2 เซกันดารี่ เพลส[Secondary Press]
                </Th>
              )}
              {authCtx.userData.is_staff && (
                <Th textAlign="center" p={1}>
                  คูลลิ่ง[Cooling]
                </Th>
              )}
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
              .map((time, idx) =>
                time.pause_start_time ? (
                  <Tr key={time._id}>
                    <Td
                      cursor={authCtx.userData.is_staff ? "pointer" : "default"}
                      colSpan={17}
                      h={70}
                      bgColor="yellow.200"
                      fontSize={"lg"}
                      color={"blue.700"}
                    >
                      <Center display={"flex"} flexDirection="column" gap={2}>
                        <Text>{time.pause_reason}</Text>
                        <Text fontWeight={"semibold"}>
                          {time.pause_start_time?.pause_start_time}
                        </Text>
                        <Text fontWeight={"semibold"}>
                          {moment(time.pause_start_time).format("hh:mm")} -{" "}
                          {moment(time.pause_end_time).format("hh:mm")} (
                          {moment(time.pause_end_time).diff(
                            time.pause_start_time,
                            "hours"
                          )}
                          {" ชั่วโมง,"}
                          {moment(time.pause_end_time).diff(
                            time.pause_start_time,
                            "minutes"
                          ) % 60}
                          {" นาที"})
                        </Text>
                      </Center>
                    </Td>
                  </Tr>
                ) : (
                  <Tr key={idx}>
                    {/* render batch number */}
                    {(idx + 1) % 2 === 1 && (
                      <Td rowSpan={2}>{time.batch_no}</Td>
                    )}
                    {/* render run number & machine number */}
                    {time.block_qty === 0 && time.block_temp === 3 ? (
                      <>
                        <Td rowSpan={2}>{time.run_no}</Td>
                        <Td rowSpan={2}>{time.mc_no}</Td>
                      </>
                    ) : (
                      (time.block_qty === 3 && time.block_temp === 6) || (
                        <>
                          <Td>{time.run_no}</Td>
                          <Td>{time.mc_no}</Td>
                        </>
                      )
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
                        {authCtx.userData.is_staff &&
                          renderTableRowSpan(
                            time.start_sec_press2_time,
                            time.id,
                            time.workday,
                            "เริ่มอบรอบที่ 2 เซกันดารี่",
                            "start_sec_press2_time",
                            time.flag
                          )}
                        {authCtx.userData.is_staff &&
                          renderTableRowSpan(
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
                    ) : (idx > 5 && time.block_qty === 3) ||
                      idx === 2 ? null : (
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
                        {authCtx.userData.is_staff &&
                          renderTableRow(
                            time.start_sec_press2_time,
                            time.id,
                            time.workday,
                            "เริ่มอบรอบที่ 2 เซกันดารี่",
                            "start_sec_press2_time",
                            time.flag
                          )}
                        {authCtx.userData.is_staff &&
                          renderTableRow(
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
                  </Tr>
                )
              )}
          </Tbody>
        </Table>
      </TableContainer>

      <EditTime
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        lotEditObj={lotEditObj}
        setlotUpdated={setlotUpdated}
      />
      <InsertPauseTime
        item={itemList.find(({ item_id }) => item_id === selectedItem)}
        isOpen={pauseModal.isOpen}
        onClose={pauseModal.onClose}
        lotEditObj={lotEditObj}
      />
    </Box>
  );
}

export default Time;
