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
} from "@chakra-ui/react";
import moment from "moment";
import axios from "axios";
import { variables } from "../../../Variables";
import processList from "./ProcesssList";

function EditTime(props) {
  const [newTime, setnewTime] = useState("");
  const [lotList, setlotList] = useState([]);
  const [lotFilteredList, setlotFilteredList] = useState([]);

  useEffect(() => {
    let tempList;
    axios.get(variables.API_URL + "lot").then((res) => setlotList(res.data));
    tempList = lotList.filter(
      (time) =>
        moment(time.workday).format("LLL") ===
        moment(props.lotEditObj?.workday).format("LLL")
    );
    setlotFilteredList(tempList);
  }, [props.lotEditObj?.workday]);

  function handleChangeTimeClick() {
    let newDateTime, timeDiff;
    let splitStr = newTime.split(":");

    if (newTime) {
      newDateTime = moment(props.lotEditObj.workday)
        .set("hours", splitStr[0])
        .set("minutes", splitStr[1])
        .format();

      axios
        .get(variables.API_URL + "lot/" + props.lotEditObj.lotId)
        .then((res) => console.log(res.data));
    }

    props.onClose();

    timeDiff = moment(newDateTime).diff(props.lotEditObj.lotTime, "minutes");
    //log data retrive that retrive from Time.jsx
    console.log({
      "old date": props.lotEditObj.lotTime,
      "new date": newDateTime,
      diff: timeDiff,
    });

    lotFilteredList.map((lot) => {
      if (lot.id === props.lotEditObj.lotId) {
        console.log({ true: lot.id + "|" + props.lotEditObj.lotId });
        
        return;
      }
      // Edit all time in lot
      let editObj = {
        start_time: moment(lot.start_time).add(timeDiff, "minutes").format(),
        cooling_time: moment(lot.start_time).add(timeDiff, "minutes").format(),
      };
      console.log(editObj);
      // axios.put(variables.API_URL + 'lot/' + lot.id)
    });
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
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
