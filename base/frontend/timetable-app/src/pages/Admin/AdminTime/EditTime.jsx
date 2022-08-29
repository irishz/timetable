import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import axios from "axios";
import { variables } from "../../../Variables";
import processList from "./ProcesssList";
import { CheckCircleIcon } from "@chakra-ui/icons";

function EditTime(props) {
  const [newTime, setnewTime] = useState("");
  const [lotList, setlotList] = useState([]);
  const [lotFilteredList, setlotFilteredList] = useState([]);

  const toast = useToast();

  useEffect(() => {
    let tempList;
    axios.get(variables.API_URL + "lot").then((res) => setlotList(res.data));
    tempList = lotList.filter(
      (time) =>
        moment(time.workday).format("LLL") ===
        moment(props.lotEditObj?.workday).format("LLL")
    );
    setlotFilteredList(tempList);

    return () => {
      setlotFilteredList([]);
    };
  }, [props.lotEditObj?.workday, newTime]);

  function handleChangeTimeClick() {
    let newDateTime, timeDiff;
    let splitStr = newTime.split(":");

    if (newTime) {
      newDateTime = moment(props.lotEditObj.workday)
        .set("hours", splitStr[0])
        .set("minutes", splitStr[1])
        .format();

      // axios
      //   .get(variables.API_URL + "lot/" + props.lotEditObj.lotId)
      //   .then((res) => console.log(res.data));
    }

    timeDiff = moment(newDateTime).diff(props.lotEditObj.lotTime, "minutes");
    //log data retrive that retrive from Time.jsx
    console.log({
      "old date": props.lotEditObj.lotTime,
      "new date": newDateTime,
      diff: timeDiff,
    });

    // Filter lot flag >= selected edit lot flag
    let startLotFlag = props.lotEditObj?.lotFlag;
    if (startLotFlag % 2 === 0) {
      startLotFlag--;
    }
    lotFilteredList
      .filter((data) => data.flag >= startLotFlag)
      .map((lot) => {
        // Find process in first lot edit
        if (lot.id === props.lotEditObj.lotId) {
          const processId = processList.find(
            (data) => data.process === props.lotEditObj?.process_name_eng
          );
          const processListFiltered = processList.filter(
            (data) => data.id >= processId.id
          );

          let tmpArr = processListFiltered.map((data) => data.process);

          let updLotObj = Object.fromEntries(
            Object.entries(lot).filter(([data]) => tmpArr.includes(data))
          );

          Object.keys(updLotObj).forEach((key) => {
            if (updLotObj[key]) {
              updLotObj[key] = moment(updLotObj[key])
                .add(timeDiff, "minutes")
                .format();
              return;
            }
            updLotObj[key] = null;
          });
          Object.assign(updLotObj, {
            item: lot.item,
            formula: lot.formula,
          });

          console.log({ flag: lot.flag, timeData: updLotObj });
          axios.put(variables.API_URL + `lot/${lot.id}`, updLotObj, {
            onUploadProgress: () => {
              props.setlotUpdated(true);
            },
          });
          return;
        }

        // Edit all time in lot
        let restLot = Object.fromEntries(
          Object.entries(lot).filter(
            (data) => data[0].includes("time") && !data[0].includes(null)
          ) //Filter object key contain "time" only
        );

        Object.keys(restLot).forEach(
          //update new time to each value in object
          // (key) => moment(restLot[key]).add(timeDiff, "minutes").format() //update new time to each value in object
          (key) => {
            if (restLot[key]) {
              restLot[key] = moment(restLot[key])
                .add(timeDiff, "minutes")
                .format();
              return;
            }
            restLot[key] = null;
          }
        );
        Object.assign(restLot, { item: lot.item, formula: lot.formula });
        console.log({ flag: lot.flag, restLot: restLot });
        axios.put(variables.API_URL + `lot/${lot.id}`, restLot);
      });
    //Alert update
    toast({
      title: "อัพเดทข้อมูลสำเร็จ",
      status: "success",
      duration: 3000,
      isClosable: true,
      icon: <CheckCircleIcon alignSelf="center" />,
    });

    // Reset all value
    props.onClose();
    setnewTime("");
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>
          <Text>
            แก้ไขเวลา {props.lotEditObj?.process_name} วันที่{" "}
            {moment(props.lotEditObj?.workday).format("DD/MM/YYYY")}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" flexDirection="column" gap={4}>
            <Flex>
              <Text fontSize={20} w="50%">
                เวลาเดิม
              </Text>
              <Input
                variant="outline"
                type="time"
                readOnly
                value={moment(props.lotEditObj?.lotTime).format("HH:mm")}
              />
            </Flex>
            <Flex>
              <Text fontSize={20} w="50%">
                เวลาใหม่
              </Text>
              <Input
                variant="outline"
                type="time"
                defaultValue={moment(props.lotEditObj?.lotTime).format("HH:mm")}
                onChange={(e) => setnewTime(e.target.value)}
              />
            </Flex>
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button colorScheme="teal" onClick={handleChangeTimeClick}>
              ตกลง
            </Button>
            <Button colorScheme="red" onClick={props.onClose}>
              ยกเลิก
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditTime;
