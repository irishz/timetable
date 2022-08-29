import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  GridItem,
  HStack,
  Input,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { variables } from "../../../Variables";
import nameList from "../AdminFormula/FormulaNameList";

function FormulaCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      formula_no: 0,
      chem_weighing: "",
      hopper: "",
      kneader: "",
      primary: "",
      secondary: "",
    },
  });
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = (data) => {
    data.formula_no = parseInt(data.formula_no);
    console.log(data);
    axios.post(variables.API_URL + "formula", data).then((res) => {
      toast({
        title: res.data.msg,
        icons: <CheckCircleIcon />,
        description: "กำลังกลับไปยังหน้าหลัก",
        status: "success",
      });
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    });
  };

  return (
    <Box mt={5}>
      <Container maxWidth="container.md">
        <Box>
          <Box
            p={2}
            pl={6}
            display="flex"
            alignItems="center"
            gap={2}
            border="solid"
            borderColor="gray.300"
            borderWidth={1}
            borderTopRadius={7}
          >
            <Text fontSize={24} color="gray.600">
              เพิ่มสูตร
            </Text>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack
              p={3}
              borderLeftWidth={1}
              borderColor="gray.300"
              borderRightWidth={1}
              borderBottomWidth={1}
              borderBottomRadius={5}
            >
              <SimpleGrid mb={3} columns={2} columnGap={3} rowGap={2} w="full">
                {nameList.map((data) => (
                  <GridItem colSpan={1}>
                    <FormControl>
                      <FormLabel fontSize={14} pl={2}>{data.nameDisplay}</FormLabel>
                      {data.type === "number" ? (
                        <Input
                          {...register(data.name, { required: data.req_msg })}
                          type={data.type}
                          min={0}
                          placeholder="0"
                        />
                      ) : (
                        <Input
                          {...register(data.name, { required: data.req_msg })}
                          type={data.type}
                        />
                      )}
                    </FormControl>
                  </GridItem>
                ))}
              </SimpleGrid>
              <HStack justifyContent="center" w="full" gap={3}>
                <Button colorScheme="green" type="submit">
                  เพิ่มสูตร
                </Button>
                <Button colorScheme="red" onClick={() => navigate(-1)}>
                  ย้อนกลับ
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}

export default FormulaCreate;
