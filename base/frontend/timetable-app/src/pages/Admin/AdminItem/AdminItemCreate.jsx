import { ChevronLeftIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { variables } from "../../../Variables";

function AdminItemCreate() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      item: "",
      init: 0,
      kneader: 0,
      end_extruder: 0,
      end_prepress: 0,
      start_prim_press: 0,
      end_prim_press: 0,
      steam_in: 0,
      start_sec_press: 0,
      start_sec_press2: 0,
      cooling: 0,
      record_sec_press: 0,
      record_sec_press2: 0,
      end_sec_press: 0,
      extra1: 0,
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    axios
      .post(`${variables.API_URL}item`, data)
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: res.data.msg,
            description: "กำลังกลับไปยังหน้า item",
            status: "success",
            isClosable: true,
            duration: 3000,
            onCloseComplete: () => navigate(-1),
          });
          return;
        }
      })
      .catch((err) => {
        // console.log(err)
        if (err.request.status === 400) {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถเพิ่ม item",
            status: "error",
            duration: 4000,
          });
          return;
        }
      });
  };
  return (
    <Container my={5} maxWidth={"container.lg"} color={"gray.600"}>
      <Flex alignItems="center">
        <PlusSquareIcon fontSize={"4xl"} />
        <Heading> Add Item</Heading>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)} id="item-form">
        <Stack gap={2} my={5}>
          <FormControl>
            <FormLabel textTransform={"capitalize"}>item name</FormLabel>
            <Input
              {...register("item", { required: "กรุณาใส่ Item" })}
              type={"text"}
            />
            <FormHelperText color={"red"}>
              {errors.item?.message}
            </FormHelperText>
          </FormControl>
          <Flex gap={5}>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>initial time</FormLabel>
              <Input
                {...register("init", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.init?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>kneader</FormLabel>
              <Input
                {...register("kneader", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.kneader?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>extruder</FormLabel>
              <Input
                {...register("end_extruder", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.end_extruder?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>prepress</FormLabel>
              <Input
                {...register("end_prepress", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.end_prepress?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>primary press</FormLabel>
              <Input
                {...register("start_prim_press", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.start_prim_press?.message}
              </FormHelperText>
            </FormControl>
          </Flex>
          <Flex gap={5}>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                end primary press
              </FormLabel>
              <Input
                {...register("end_prim_press", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.end_prim_press?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>steam in</FormLabel>
              <Input
                {...register("steam_in", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.steam_in?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                secondary press
              </FormLabel>
              <Input
                {...register("start_sec_press", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.start_sec_press?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                secondary press #2
              </FormLabel>
              <Input
                {...register("start_sec_press2", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.start_sec_press2?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>cooling</FormLabel>
              <Input
                {...register("cooling", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.cooling?.message}
              </FormHelperText>
            </FormControl>
          </Flex>
          <Flex gap={5}>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                record secondary press #1
              </FormLabel>
              <Input
                {...register("record_sec_press", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.record_sec_press?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                record secondary press #2
              </FormLabel>
              <Input
                {...register("record_sec_press2", {
                  required: "จำเป็นต้องใส่",
                })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.record_sec_press2?.message}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                end secondary press
              </FormLabel>
              <Input
                {...register("end_sec_press", { required: "จำเป็นต้องใส่" })}
                type={"number"}
                defaultValue={0}
              />
              <FormHelperText color={"red"}>
                {errors.end_sec_press?.message}
              </FormHelperText>
            </FormControl>
          </Flex>
          <Flex gap={5}>
            <FormControl w={"25%"}>
              <FormLabel textTransform={"capitalize"}>extra time1</FormLabel>
              <Input {...register("extra1")} type={"number"} defaultValue={0} />
              <FormHelperText color={"red"}>
                {errors.extra1?.message}
              </FormHelperText>
            </FormControl>
          </Flex>
        </Stack>
      </form>
      <Flex gap={2}>
        <Button
          type="submit"
          leftIcon={<BsPlusCircle />}
          variant={"solid"}
          colorScheme="teal"
          form="item-form"
        >
          เพิ่ม Item
        </Button>
        <Button
          leftIcon={<ChevronLeftIcon />}
          variant={"solid"}
          colorScheme="red"
          onClick={() => navigate(-1)}
        >
          ยกเลิก
        </Button>
      </Flex>
    </Container>
  );
}

export default AdminItemCreate;
