import React from "react";
import {
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EditIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import axios from "axios";
import { variables } from "../../../Variables";

function AdminItemEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    item,
    item_id,
    init,
    kneader,
    end_extruder,
    end_prepress,
    start_prim_press,
    end_prim_press,
    steam_in,
    start_sec_press,
    start_sec_press2,
    cooling,
    record_sec_press,
    record_sec_press2,
    end_sec_press,
    extra1
  } = location.state;
  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      item,
      init,
      kneader,
      end_extruder,
      end_prepress,
      start_prim_press,
      end_prim_press,
      steam_in,
      start_sec_press,
      start_sec_press2,
      cooling,
      record_sec_press,
      record_sec_press2,
      end_sec_press,
      extra1
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    axios
      .put(`${variables.API_URL}item/${item_id}`, data)
      .then((res) => {
        if ((res.status = 200)) {
          toast({
            title: res.data.msg,
            description: "กำลังกลับไปยังหน้า item",
            status: "success",
            duration: 2000,
            onCloseComplete: () => navigate(-1),
          });
          return;
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            title: 'เกิดข้อผิดพลาด!',
            description: "ไม่สามารถอัพเดทข้อมูล",
            status: "error",
            duration: 3000,
          });
          return
        }
      });
  };

  return (
    <Container my={5} maxWidth={"container.lg"} color={"gray.600"}>
      <Flex alignItems="center">
        <EditIcon fontSize={"4xl"} />
        <Heading> Edit Item : {item}</Heading>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)} id="item-form">
        <Stack gap={2} my={5}>
          <Flex gap={5}>
            <FormControl>
              <FormLabel textTransform={"uppercase"}>id</FormLabel>
              <Input
                readOnly
                type={"text"}
                value={item_id}
                bgColor="gray.200"
                color={"gray.600"}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>item name</FormLabel>
              <Input
                readOnly
                type={"text"}
                value={item}
                bgColor="gray.200"
                color={"gray.600"}
              />
            </FormControl>
          </Flex>
          <Divider />
          <Flex gap={5}>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>initial time</FormLabel>
              <Input
                {...register("init")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>kneader</FormLabel>
              <Input
                {...register("kneader")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>extruder</FormLabel>
              <Input
                {...register("end_extruder")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>prepress</FormLabel>
              <Input
                {...register("end_prepress")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>primary press</FormLabel>
              <Input
                {...register("start_prim_press")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
          </Flex>
          <Flex gap={5}>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                end primary press
              </FormLabel>
              <Input
                {...register("end_prim_press")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>steam in</FormLabel>
              <Input
                {...register("steam_in")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                secondary press
              </FormLabel>
              <Input
                {...register("start_sec_press")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                secondary press #2
              </FormLabel>
              <Input
                {...register("start_sec_press2")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>cooling</FormLabel>
              <Input
                {...register("cooling")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
          </Flex>
          <Flex gap={5}>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                record secondary press #1
              </FormLabel>
              <Input
                {...register("record_sec_press")}
                type={"number"}
                defaultValue={0}
              />
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
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>
                end secondary press
              </FormLabel>
              <Input
                {...register("end_sec_press")}
                type={"number"}
                defaultValue={0}
              />
            </FormControl>
          </Flex>
          <Flex gap={5}>
            <FormControl w={"25%"}>
              <FormLabel textTransform={"capitalize"}>extra time1</FormLabel>
              <Input {...register("extra1")} type={"number"} defaultValue={0} />
            </FormControl>
          </Flex>
        </Stack>
      </form>
      <Flex gap={2}>
        <Button
          type="submit"
          leftIcon={<EditIcon />}
          variant={"solid"}
          colorScheme="teal"
          form="item-form"
        >
          แก้ไข
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

export default AdminItemEdit;
