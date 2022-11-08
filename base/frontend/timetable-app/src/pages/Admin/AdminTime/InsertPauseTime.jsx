import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { variables } from "../../../Variables";

function InsertPauseTime(props) {
  const [lotList, setlotList] = useState([]);
  const [lotFilteredList, setlotFilteredList] = useState([]);
  const [isUpdateBtnLoading, setisUpdateBtnLoading] = useState(false);
  const [timeDiffError, settimeDiffError] = useState("");
  const [time_h, settime_h] = useState(0);
  const [time_m, settime_m] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_time: "",
      end_time: "",
      pause_reason: "",
    },
  });
  const toast = useToast();

  useEffect(() => {
    axios.get(`${variables.API_URL}lot`).then((res) => setlotList(res.data));
  }, []);

  useEffect(() => {
    "get lot depends workday";
    let tempList;
    axios.get(`${variables.API_URL}lot`).then((res) => setlotList(res.data));
    tempList = lotList.filter(
      (time) =>
        moment(time.workday).format("LLL") ===
        moment(props.lotEditObj?.workday).format("LLL")
    );
    setlotFilteredList(tempList);

    return () => {
      setlotFilteredList([]);
    };
  }, [props.lotEditObj?.workday]);

  useEffect(() => {
    if (props.lotEditObj) {
      validateTime();
      return;
    }
  }, [watch("end_time")]);

  const onSubmit = async (data) => {
    setisUpdateBtnLoading(true);
    const { start_datetime, end_datetime, time_diff } = validateTime();
    if (time_diff === 0) {
      settimeDiffError("กรุณาระบุช่วงเวลาที่ต้องการหยุด!");
      return;
    }

    let updateRestLotTime = updateTimeLot(time_diff);
    if (!updateRestLotTime) {
      toast({
        title: "ไม่สามารถอัพเดทเวลาใน lot ที่เหลือ",
        description: "กรุณารีเฟรชและทำใหม่อีกครั้ง",
        status: "error",
        isClosable: true,
      });
      setisUpdateBtnLoading(false);
      return;
    }

    //Update pause time
    const updateObj = {
      pause_start_time: moment(start_datetime).format(),
      pause_end_time: moment(end_datetime).format(),
      pause_reason: data.pause_reason,
    };
    
    await axios
      .put(`${variables.API_URL}lot/${props.lotEditObj.lotId}`, updateObj)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: res.data.msg,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      })
      .catch((err) => {
        if ((err.response.status = 400)) {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถอัพเดทข้อมูล",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }
      });
    props.onClose();
    reset();
    settimeDiffError("");
    settime_h(0);
    settime_m(0);
    setisUpdateBtnLoading(false);
  };

  function updateTimeLot(time_diff) {
    let updateStatus = false;
    // Filter lot flag >= selected edit lot flag
    let startLotFlag = props.lotEditObj?.lotFlag + 1;

    lotFilteredList
      .filter(({ flag }) => flag >= startLotFlag)
      .map((lot) => {
        // Edit all time in lot
        let restLot = Object.fromEntries(
          Object.entries(lot).filter(
            (data) => data[0].includes("time") && !data[0].includes(null)
          ) //Filter object key contain "time" only
        );

        Object.keys(restLot).forEach(
          //update new time to each value in object
          (key) => {
            if (restLot[key]) {
              restLot[key] = moment(restLot[key])
                .add(time_diff, "minutes")
                .format();
              return;
            }
            restLot[key] = null;
          }
        );
        Object.assign(restLot, { item: lot.item, formula: lot.formula });
        // console.log({ flag: lot.flag, restLot: restLot });
        axios.put(variables.API_URL + `lot/${lot.id}`, restLot).catch((err) => {
          updateStatus = false;
        });
        updateStatus = true;
      });

    return updateStatus;
  }

  function validateTime() {
    const start_time_hour = watch("start_time").split(":")[0];
    const start_time_min = watch("start_time").split(":")[1];
    const end_time_hour = watch("end_time").split(":")[0];
    const end_time_min = watch("end_time").split(":")[1];
    const { workday } = props.lotEditObj;
    let start_datetime = moment(workday)
      .set("hours", start_time_hour)
      .set("minutes", start_time_min);
    let end_datetime = moment(workday)
      .set("hours", end_time_hour)
      .set("minutes", end_time_min);
    let time_diff = moment(end_datetime).diff(start_datetime, "minutes");
    if (time_diff < 0) {
      settimeDiffError("เวลาสิ้นสุดน้อยกว่าเวลาเริ่มต้น");
      return;
    }
    settimeDiffError("");
    settime_h(moment(end_datetime).diff(start_datetime, "hours"));
    settime_m(time_diff % 60);

    return {
      start_datetime,
      end_datetime,
      time_diff,
    };
  }

  function onModalClose() {
    props.onClose();
    reset();
    settimeDiffError("");
    settime_h(0);
    settime_m(0);
    setisUpdateBtnLoading(false)
  }

  return (
    <Modal isOpen={props.isOpen} onClose={onModalClose} size="xl">
      <ModalOverlay backdropFilter={"blur(3px)"} />
      <ModalContent>
        <ModalHeader>ระบุช่วงเวลาที่ต้องการ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form noValidate onSubmit={handleSubmit(onSubmit)} id="pause">
            <Stack gap={3}>
              <HStack>
                <FormControl borderColor={errors.start_time ? "red" : "none"}>
                  <FormLabel fontWeight={"semibold"}>เริ่มต้น</FormLabel>
                  <Input {...register("start_time")} type={"time"} />
                  <FormHelperText color={"red"}>
                    {errors.start_time?.message}
                  </FormHelperText>
                </FormControl>
                <FormControl borderColor={errors.end_time ? "red" : "none"}>
                  <FormLabel fontWeight={"semibold"}>สิ้นสุด</FormLabel>
                  <Input {...register("end_time")} type={"time"} />
                  <FormHelperText color={"red"}>
                    {errors.end_time?.message}
                  </FormHelperText>
                </FormControl>
              </HStack>
              {timeDiffError ? (
                <Text color={"red"}>{timeDiffError}</Text>
              ) : null}
              <Flex gap={2}>
                <Text fontWeight={"semibold"}>ระยะเวลา : </Text>
                <Text>{time_h} ชั่วโมง,</Text>
                <Text>{time_m} นาที</Text>
              </Flex>
              <FormControl>
                <FormLabel fontWeight={"semibold"}>หมายเหตุ</FormLabel>
                <Textarea
                  {...register("pause_reason", {
                    required: "กรุณาใส่หมายเหตุ",
                  })}
                  placeholder="ใส่หมายเหตุที่นี่..."
                />
                <FormHelperText color={"red"}>
                  {errors.pause_reason?.message}
                </FormHelperText>
              </FormControl>
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter>
          <HStack gap={3}>
            <Button
              variant={"solid"}
              colorScheme="teal"
              type="submit"
              form="pause"
              isLoading={isUpdateBtnLoading}
              loadingText="กำลังอัพเดท"
            >
              ตกลง
            </Button>
            <Button variant={"solid"} colorScheme="red" onClick={onModalClose}>
              ยกเลิก
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InsertPauseTime;
