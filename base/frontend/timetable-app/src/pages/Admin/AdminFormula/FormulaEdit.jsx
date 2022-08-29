import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import nameList from "../AdminFormula/FormulaNameList";
import { useForm } from "react-hook-form";
import axios from "axios";
import { variables } from "../../../Variables";
import { CheckCircleIcon } from "@chakra-ui/icons";

function FormulaEdit() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: state.name,
      formula_no: state.formula_no,
      chem_weighing: state.chem_weighing,
      hopper: state.hopper,
      kneader: state.kneader,
      extruder: state.extruder,
      primary: state.primary,
      secondary: state.secondary,
    },
  });
  const toast = useToast();

  const onSubmit = (data) => {
    console.log(data);
    console.log(state.id);
    axios
      .put(variables.API_URL + `formula/${state.id}`, data, {
        onUploadProgress: () => {},
      })
      .then((res) => {
        toast({
          title: res.data.msg,
          description: "กำลังกลับไปยังหน้าหลัก",
          status: "success",
          icon: <CheckCircleIcon alignSelf="center" />,
          duration: 3000,
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
                      <FormLabel>{data.nameDisplay}</FormLabel>
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
                  ตกลง
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

export default FormulaEdit;
